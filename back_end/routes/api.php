<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\UserController;


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

});


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
    

   