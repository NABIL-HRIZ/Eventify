<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscribe;

class SubscribeController extends Controller
{
    // store an email 

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:subscribers,email',
        ]);

        Subscribe::create([
            'email' => $request->email
        ]);

        return response()->json(['message' => 'Email enregistré !']);
    }


    // get all emails 

    public function getEmails()
    {
    $emails = Subscribe::pluck('email');
        return response()->json(['emails' => $emails]);
    }
}

