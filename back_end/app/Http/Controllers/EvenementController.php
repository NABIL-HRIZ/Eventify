<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;


class EvenementController extends Controller
{
    // Liste des événements
    public function index()
    {
        return response()->json(Evenement::with('organisateur')->get());
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

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('evenements', 'public');
        $evenement->image = $path;
    }

    $fields = ['title', 'description', 'date_debut', 'date_fin', 'lieu', 'prix', 'categorie'];
    foreach ($fields as $field) {
        if ($request->filled($field)) {
            $evenement->$field = $request->$field;
        }
    }

    $evenement->save();

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
    $evenements = Cache::remember('top_evenements', 60*60, function () {
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
    $query = Evenement::with(['organisateur:id,prenom,nom,email']) 
        ->select('id', 'title', 'categorie', 'lieu', 'date_debut', 'date_fin', 'organisateur_id');

    if ($request->filled('title')) {
        $query->where('title', 'like', '%' . $request->title . '%');
    }

    if ($request->filled('categorie')) {
        $query->where('categorie', $request->categorie);
    }

    if ($request->filled('lieu')) {
        $query->where('lieu', 'like', '%' . $request->lieu . '%');
    }

    if ($request->filled('date_debut')) {
        $query->whereDate('date_debut', '>=', $request->date_debut);
    }

    if ($request->filled('date_fin')) {
        $query->whereDate('date_fin', '<=', $request->date_fin);
    }

    $evenements = $query->orderBy('date_debut', 'asc')
                        ->paginate(10);

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


}