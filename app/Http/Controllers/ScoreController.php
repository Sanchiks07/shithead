<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Score;
use Illuminate\Support\Facades\Auth;

class ScoreController extends Controller
{
    // =====================
    // GET LEADERBOARD
    // =====================
    public function leaderboard()
    {
        $scores = Score::with('user')
            ->get()
            ->sortByDesc(function ($score) {
                // ranking logic: wins first, then win rate
                return $score->wins;
            })
            ->values();

        $ranked = $scores->map(function ($score, $index) {
            return [
                'rank' => $index + 1,
                'user' => $score->user->name,
                'games_played' => $score->games_played,
                'wins' => $score->wins,
                'losses' => $score->losses,
            ];
        });

        return response()->json($ranked);
    }

    // =====================
    // GET CURRENT USER RANK
    // =====================
    public function myRank()
    {
        $scores = Score::orderByDesc('wins')->get();

        $rank = $scores->search(function ($score) {
            return $score->user_id === Auth::id();
        });

        return response()->json([
            'rank' => $rank !== false ? $rank + 1 : null,
            'score' => Auth::user()->score
        ]);
    }

    // =====================
    // REGISTER WIN
    // =====================
    public function win()
    {
        $score = Auth::user()->score;

        if (!$score) {
            $score = Score::create([
                'user_id' => Auth::id(),
                'games_played' => 0,
                'wins' => 0,
                'losses' => 0
            ]);
        }

        $score->increment('games_played');
        $score->increment('wins');

        return response()->json($score);
    }

    // =====================
    // REGISTER LOSS
    // =====================
    public function loss()
    {
        $score = Auth::user()->score;

        if (!$score) {
            $score = Score::create([
                'user_id' => Auth::id(),
                'games_played' => 0,
                'wins' => 0,
                'losses' => 0
            ]);
        }

        $score->increment('games_played');
        $score->increment('losses');

        return response()->json($score);
    }

    // =====================
    // GET CURRENT USER SCORE
    // =====================
    public function show()
    {
        return response()->json(Auth::user()->score);
    }
}