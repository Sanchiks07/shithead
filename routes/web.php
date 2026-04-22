<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ScoreController;

Route::get('/', function () {
    return view('home');
})->name('home')->middleware('auth');

// LOGIN
Route::get('/login', [LoginController::class, 'index'])->name('login')->middleware('guest');
Route::post('/login', [LoginController::class, 'store']);

// REGISTER
Route::get('/register', [RegisterController::class, 'index'])->name('register')->middleware('guest');
Route::post('/register', [RegisterController::class, 'store']);

// LOGOUT
Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// GAME
Route::get('/game', [GameController::class, 'index'])->name('game')->middleware('auth');

Route::middleware('auth')->group(function () {

    // PAGE
    Route::middleware('auth')->get('/leaderboard', function () {
        return view('leaderboard');
    })->name('leaderboard');

    // API
    Route::get('/leaderboard-data', [ScoreController::class, 'leaderboard']);
    Route::get('/score', [ScoreController::class, 'show']);
    Route::get('/my-rank', [ScoreController::class, 'myRank']);

    Route::post('/score/win', [ScoreController::class, 'win']);
    Route::post('/score/loss', [ScoreController::class, 'loss']);
});