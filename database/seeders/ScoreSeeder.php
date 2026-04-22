<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Score;

class ScoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Score::create([
            'user_id' => '1',
            'games_played' => '26',
            'wins' => '15',
            'losses' => '11'
        ]);
        
        Score::create([
            'user_id' => '2',
            'games_played' => '3',
            'wins' => '1',
            'losses' => '2'
        ]);

        Score::create([
            'user_id' => '3',
            'games_played' => '13',
            'wins' => '7',
            'losses' => '6'
        ]);
    }
}