<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubscribeController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Checkout\Session;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ContactController;

use App\Models\Ticket;
use App\Jobs\SendTicketMailJob;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'destroy']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::get('/reset-password/{token}', [NewPasswordController::class, 'create']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);




Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'UserConnected']);
Route::middleware('auth:sanctum')->put('/user/profile', [UserController::class, 'update']);


// Admin controller 

Route::middleware(['auth:sanctum','role:admin'])->group(function() {
    Route::get('/show-users', [AdminController::class,'getAllUsers']);
    Route::post('/add-user', [AdminController::class,'storeUser']);
    Route::put('/user/{id}', [AdminController::class,'updateUser']);
    Route::delete('/user/{id}', [AdminController::class,'deleteUser']);
    Route::get('/user-details/{id}', [AdminController::class,'getUserDetail']);
    Route::get('/tickets-stats', [AdminController::class, 'getTicketsStats']);


    // subscribe controller

    Route::get('/show-emails', [SubscribeController::class,'getEmails']);


});
    Route::post('/add-email', [SubscribeController::class,'store']);


// evenement conroller


Route::get('/evenements',[EvenementController::class,'index']);
Route::get('/search-evenements',[EvenementController::class,'search']);

Route::get('/evenement/{id}',[EvenementController::class,'show']);
Route::get('/top-evenements',[EvenementController::class,'getTopEvenement']);


Route::get('/evenements/categories', [EvenementController::class, 'categories']);



Route::middleware(['auth:sanctum','role:admin|organisateur'])->group(function() {
    Route::post('/create-evenement', [EvenementController::class,'store']);
    Route::put('/evenement/{id}', [EvenementController::class,'update']);
    Route::delete('/evenement/{id}', [EvenementController::class,'destroy']);
    Route::get('/evenement-personnels', [EvenementController::class,'getOwnEvents']);
    Route::get('/organisateur/tickets-sold', [EvenementController::class, 'ticketsSold']);

    
});



// stripe 

Route::post('/create-checkout-session', function (Request $request) {
    Stripe::setApiKey(env('STRIPE_SECRET'));

    $session = Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'mad',
                'unit_amount' => $request->amount * 100,
                'product_data' => [
                    'name' => $request->title,
                ],
            ],
            'quantity' => $request->count,
        ]],
        'mode' => 'payment',
        'success_url' => 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => 'http://localhost:5173/cancel',
        'metadata' => [
            'userId' => $request->user_id,
            'eventId' => $request->eventId,
            'count'  => $request->count,
            'amount' => $request->amount,
        ],
    ]);

    return response()->json(['url' => $session->url]);
});




// TICKETS

Route::middleware('auth:sanctum')->get('/user/{userId}/tickets', [TicketController::class, 'userTickets']);
Route::post('/tickets', [TicketController::class, 'create']);

// WEBHOOKS

Route::post('/stripe/webhook', [TicketController::class, 'handleWebhook']);


// create data after success payement 


Route::post('/stripe/success', function (Request $request) {
    \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

    try {
        if (!$request->session_id) {
            return response()->json(['error' => 'Missing session_id'], 400);
        }

        $session = \Stripe\Checkout\Session::retrieve($request->session_id);

        $userId = $session->metadata->userId ?? null;
        $eventId = $session->metadata->eventId ?? null;
        $count = $session->metadata->count ?? 1;
        $amount = $session->metadata->amount ?? ($session->amount_total / 100);

        if (!$userId || !$eventId) {
            return response()->json(['error' => 'Missing user or event ID in metadata'], 400);
        }

        $ticket = \App\Models\Ticket::create([
            'user_id' => $userId,
            'event_id' => $eventId, 
            'quantity' => $count,
            'amount' => $amount,
        ]);
 
        // mail JOB 

        SendTicketMailJob::dispatch($ticket);

        
        return response()->json([
            'message' => '🎟️ Ticket successfully saved',
            'ticket' => $ticket,
        ]);
    } catch (\Exception $e) {
        \Log::error('Stripe success error: '.$e->getMessage());
        return response()->json(['error' => 'Server error: '.$e->getMessage()], 500);
    }
});



Route::get('/stripe/success', [StripeController::class, 'success']);





// send pdf and download it 




Route::get('/verify-ticket/{ticket}', function (Ticket $ticket) {
    if (auth()->check() && auth()->id() !== $ticket->user_id) {
        abort(403, 'Unauthorized');
    }

    $qrContent = route('verify-ticket', ['ticket' => $ticket->id]); 

    $pdf = Pdf::loadView('emails.pdfs.ticket', [
        'ticket' => $ticket,
        'qrContent' => $qrContent,
    ]);

    return $pdf->download('ticket-' . $ticket->id . '.pdf');
})->name('verify-ticket');




// contact 

Route::get('/contacts', [ContactController::class, 'index']); 
Route::post('/contacts', [ContactController::class, 'store']); 
    

   