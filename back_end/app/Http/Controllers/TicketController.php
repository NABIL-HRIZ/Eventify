<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendTicketMail;
use Stripe\Stripe;
use Stripe\Webhook;

class TicketController extends Controller
{
    public function userTickets($userId)
    {
        $tickets = Ticket::with('evenement')->where('user_id', $userId)->orderBy('created_at','desc')->get();
        return response()->json($tickets);
    }

    public function create(Request $request)
    {
        $ticket = Ticket::create([
            'user_id' => $request->input('user_id') ?? $request->input('userId'),
            'event_id' => $request->input('event_id') ?? $request->input('eventId'),
            'quantity' => $request->input('quantity') ?? $request->input('count') ?? 1,
            'amount' => $request->input('amount') ?? 0,
        ]);

        // Send email immediately
        Mail::to($ticket->user->email)->send(new SendTicketMail($ticket));

        return response()->json($ticket, 201);
    }

    // Stripe Webhook
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\Exception $e) {
            \Log::error('Stripe Webhook Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;

            $meta = $session->metadata;
            $user_id = $meta->userId ?? $meta->user_id ?? null;
            $event_id = $meta->eventId ?? $meta->event_id ?? null;
            $count = $meta->count ?? 1;
            $amount = $meta->amount ?? ($session->amount_total / 100);

            if ($user_id && $event_id) {
                // Create ticket
                $ticket = Ticket::create([
                    'user_id' => $user_id,
                    'event_id' => $event_id,
                    'quantity' => $count,
                    'amount' => $amount,
                ]);

                
                try {
                    Mail::to($ticket->user->email)->send(new SendTicketMail($ticket));
                } catch (\Exception $e) {
                    \Log::error('Failed to send ticket email: ' . $e->getMessage());
                }
            }
        }

        return response()->json(['status' => 'success']);
    }

    
}
