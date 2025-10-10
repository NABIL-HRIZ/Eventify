<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
 use Stripe\Webhook;
 use Stripe\Stripe;



class TicketController extends Controller
{
   
    public function userTickets($userId) {
        $tickets = Ticket::with('evenement')->where('user_id', $userId)->get();
        return response()->json($tickets);
    }

    
    public function store(Request $request) {
        $ticket = Ticket::create($request->all());
        return response()->json($ticket, 201);
    }


    public function create(Request $request) {
    Ticket::create([
        'user_id' => $request->user_id,
        'evenement_id' => $request->eventId,
        'quantity' => $request->count,
    ]);
}

    /// webhook 


public function handleWebhook(Request $request) {
    $payload = $request->getContent();
    $sig_header = $request->header('Stripe-Signature');
    $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

    try {
        $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }

    if ($event->type == 'checkout.session.completed') {
        $session = $event->data->object;
        $metadata = $session->metadata;

        Ticket::create([
            'user_id' => $metadata->userId,
            'evenement_id' => $metadata->eventId,
            'quantity' => $metadata->count,
            'amount' => $metadata->amount,
        ]);
    }

    return response()->json(['status' => 'success']);
}

}

