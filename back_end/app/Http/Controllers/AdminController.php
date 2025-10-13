<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
    use App\Models\Evenement;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    //  Get all users
  public function getAllUsers()
{
    $users = User::with('roles')->get();

    $userss = $users->map(function ($user) {
        return [
            'id' => $user->id,
            'prenom' => $user->prenom,
            'nom' => $user->nom,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->roles->pluck('name')->join(', ') 
        ];
    });

    return response()->json($userss, 200);
}

    //  Create a new user
    public function storeUser(Request $request)
    {
        $request->validate([
            'prenom'   => 'required|string|max:255',
            'nom'      => 'required|string|max:255',
            'phone'    => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'prenom'   => $request->prenom,
            'nom'      => $request->nom,
            'phone'    => $request->phone,
            'email'    => $request->email,
            'password' => Hash::make($request->password), 
        ]);

           
        $userRole = Role::where('name', 'user')->first();
        if ($userRole) {
            $user->addRole($userRole);
        }


       return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'user'    => $user,
            'role'    => $userRole ? $userRole->name : null
        ], 201);
    }


    //  Update user
    public function updateUser(Request $request, $id)
    {
        $request->validate([
            'prenom' => 'sometimes|string|max:255',
            'nom'    => 'sometimes|string|max:255',
            'phone'  => 'sometimes|string|max:255',
            'email'  => 'sometimes|string|email|max:255|unique:users,email,'.$id,
            'password' => 'sometimes|string|min:6',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update([
            'prenom'   => $request->prenom ?? $user->prenom,
            'nom'      => $request->nom ?? $user->nom,
            'phone'    => $request->phone ?? $user->phone,
            'email'    => $request->email ?? $user->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        return response()->json([
            'message' => "Successfully updated",
            'user'    => $user->refresh()
        ], 200);
    }

    //  Delete user
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    //  Get user detail
    public function getUserDetail($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }



    // get tickets 



public function getTicketsStats()
{
    $stats = DB::table('tickets')
        ->join('evenements', 'tickets.event_id', '=', 'evenements.id')
        ->select(
            'evenements.categorie',
            DB::raw('SUM(tickets.quantity) as totalTickets'),
            DB::raw('SUM(tickets.amount * tickets.quantity) as totalRevenue')
        )
        ->groupBy('evenements.categorie')
        ->get();

    $categories = ['sport', 'cinema', 'billetterie'];
    $data = collect($categories)->map(function ($cat) use ($stats) {
        $match = $stats->firstWhere('categorie', $cat);
        return [
            'categorie' => ucfirst($cat),
            'tickets' => $match->totalTickets ?? 0,
            'revenue' => $match->totalRevenue ?? 0,
        ];
    });

    return response()->json([
        'success' => true,
        'data' => $data
    ]);
}




}
