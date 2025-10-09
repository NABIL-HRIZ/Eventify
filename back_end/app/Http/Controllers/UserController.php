<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    
public function UserConnected(Request $request)
{
    $user = $request->user();

    return response()->json([
        'success' => true,
        'user' => $user,
        'roles' => $user->roles->pluck('name') 
    ]);
}


public function update(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'No user authenticated'
        ], 401);
    }

    $validatedData = $request->validate([
        'prenom' => 'sometimes|string|max:255',
        'nom'    => 'sometimes|string|max:255',
        'phone'  => 'sometimes|string|max:20',
        'email'  => 'sometimes|email|max:255|unique:users,email,' . $user->id,
    ]);

    $user->update($validatedData);

    return response()->json([
        'success' => true,
        'message' => 'Profil mis à jour avec succès.',
        'user'    => $user
    ]);
}

}
