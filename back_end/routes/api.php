<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubscribeController;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Checkout\Session;
use App\Http\Controllers\TicketController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'UserConnected']);
Route::middleware('auth:sanctum')->put('/user/profile', [UserController::class, 'update']);


// Admin controller 

Route::middleware(['auth:sanctum','role:admin'])->group(function() {
    Route::get('/show-users', [AdminController::class,'getAllUsers']);
    Route::post('/add-user', [AdminController::class,'storeUser']);
    Route::put('/user/{id}', [AdminController::class,'updateUser']);
    Route::delete('/user/{id}', [AdminController::class,'deleteUser']);
    Route::get('/user-details/{id}', [AdminController::class,'getUserDetail']);

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
    Route::delete('/evenement/{id}', [EvenementControllerr::class,'destroy']);
    Route::get('/evenement-personnels', [EvenementController::class,'getOwnEvents']);
    
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
    ]);

    return response()->json(['url' => $session->url]);
});



// TICKETS

Route::get('/user/{userId}/tickets', [TicketController::class, 'userTickets']);
Route::post('/tickets', [TicketController::class, 'create']);

// WEBHOOKS

Route::post('/stripe/webhook', [TicketController::class, 'handleWebhook']);



    

   