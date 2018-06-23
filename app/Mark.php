<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    protected $table = 'marks';

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public function getRouteKeyName()
    {
        return 'name';
    }   

    public static function getMarkName($score) {
        return Mark::where('min_score', '<=', $score)
                    ->where('max_score', '>=', $score)
                    ->first()->name;
    }
}
