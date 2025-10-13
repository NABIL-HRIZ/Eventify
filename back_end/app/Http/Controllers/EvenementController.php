<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendNewEventEmailJob;
use App\Models\Ticket;

class EvenementController extends Controller
{
    // Liste des événements
 
public function index(Request $request)
{
    $query = Evenement::with(['organisateur:id,nom,email']);

    if ($request->filled('categorie')) {
        $query->whereRaw('LOWER(categorie) = ?', [strtolower($request->categorie)]);
    }

    if ($request->boolean('paginate')) { 
        $evenements = $query->paginate(10); 
        return response()->json($evenements);
    }

    $evenements = $query->get();
    return response()->json([
        'success' => true,
        'evenements' => $evenements
    ]);
}





    // Liste des événements personnels d'un organisateur 
    


public function getOwnEvents()
{
    $user = Auth::user();


    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Non authentifié'
        ], 401);
    }

    $evenements = Evenement::with('organisateur')
        ->where('organisateur_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'success' => true,
        'evenements' => $evenements
    ]);



}



    //  Créer un événement
    public function store(Request $request)
    {
        $request->validate([
            'image' => ['nullable', 'file', 'image', 'max:2048'],
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut'  => 'required|date',
            'date_fin'    => 'required|date|after_or_equal:date_debut',
            'lieu'        => 'required|string|max:255',
            'prix'        => 'required|numeric|min:0',
            'categorie'   => 'required|in:billetterie,sport,cinema',
             'views' => 'sometimes|integer',
        ]);

         $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('evenements', 'public');
        }

        $evenement = Evenement::create([
             'image'          => $path,
            'title'          => $request->title,
            'description'    => $request->description,
            'date_debut'     => $request->date_debut,
            'date_fin'       => $request->date_fin,
            'lieu'           => $request->lieu,
            'prix'           => $request->prix,
            'categorie'      => $request->categorie,
            'organisateur_id'=> auth()->id(), 
             'views' => $request->input('views', 0),

        ]);

        Cache::forget('top_evenements');

         SendNewEventEmailJob::dispatch($evenement);

        return response()->json([
            'success'   => true,
            'evenement' => $evenement,
        ], 201);
    }

    // Afficher un événement
    public function show($id)
    {
        $evenement = Evenement::with('organisateur')->findOrFail($id);

        // increment views so i can know what the most clcicked at 
         $evenement->increment('views');

         // clear cache so top events will refresh next call
       Cache::forget('top_evenements');

        return response()->json($evenement);
    }



public function update(Request $request, $id)
{
    $evenement = Evenement::findOrFail($id);

    $request->validate([
        'image'       => ['nullable', 'file', 'image', 'max:2048'],
        'title'       => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'date_debut'  => 'sometimes|date',
        'date_fin'    => 'sometimes|date|after_or_equal:date_debut',
        'lieu'        => 'sometimes|string|max:255',
        'prix'        => 'sometimes|numeric|min:0',
        'categorie'   => 'sometimes|in:billetterie,sport,cinema',
    ]);

    // Update image if provided
    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('evenements', 'public');
        $evenement->image = $path;
    }

    // Update other fields if they exist in request
    $fields = ['title', 'description', 'date_debut', 'date_fin', 'lieu', 'prix', 'categorie'];
    foreach ($fields as $field) {
        if ($request->has($field)) { // <-- changed from filled() to has()
            $evenement->$field = $request->input($field);
        }
    }

    $evenement->save();

    // Clear cache if needed
    Cache::forget('top_evenements');

    return response()->json([
        'success' => true,
        'message' => 'Événement mis à jour avec succès',
        'evenement' => $evenement,
    ]);
}




    // Supprimer un événement
    public function destroy($id)
    {
        $evenement = Evenement::findOrFail($id);
        $evenement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Événement supprimé avec succès'
        ]);
    }

  public function getTopEvenement()
{
    $evenements = Cache::remember('top_evenements', 60, function () {
        return Evenement::orderBy('views', 'desc')
            ->take(10)
            ->get();
    });

    return response()->json([
        'success' => true,
        'evenements' => $evenements
    ], 200);
}


public function search(Request $request)
{
    $query = Evenement::with(['organisateur:id,prenom,nom,email']);

    if ($request->filled('title') || $request->filled('lieu')) {
        $query->where(function($q) use ($request) {
            if ($request->filled('title')) {
                $q->where('title', 'like', '%' . $request->title . '%');
            }
            if ($request->filled('lieu')) {
                $q->orWhere('lieu', 'like', '%' . $request->lieu . '%');
            }
        });
    }

    $evenements = $query->orderBy('date_debut', 'asc')->paginate(10);

    $evenements->getCollection()->transform(function($event) {
        $event->image = $event->image ? asset('storage/' . $event->image) : null;
        return $event;
    });

    return response()->json([
        'success' => true,
        'evenements' => $evenements
    ]);
}




 // add categories so i can add it in front end FiltrageSection 

 public function categories()
{
    $categories =Evenement::select('categorie')
        ->distinct()
        ->pluck('categorie');

    return response()->json([
        'success' => true,
        'categories' => $categories
    ]);
}


public function ticketsSold(Request $request)
{
    $organisateurId = $request->user()->id;

    $eventIds = Evenement::where('organisateur_id', $organisateurId)->pluck('id');

    $tickets = Ticket::whereIn('event_id', $eventIds)->get();

    $totalTickets = $tickets->sum('quantity');

    $totalRevenue = $tickets->sum(function ($ticket) {
        return $ticket->amount * $ticket->quantity;
    });

    return response()->json([
        'success' => true,
        'totalTickets' => $totalTickets,
        'totalRevenue' => $totalRevenue,
        'tickets' => $tickets,
    ]);
}




}