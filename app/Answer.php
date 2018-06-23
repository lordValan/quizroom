<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $table = 'answers';

    protected $hidden = [
        /* 'is_right', */ 'created_at', 'updated_at', 'question_id'
    ];

    public function question(){
        return $this->belongsTo('App\Question');
    }

    public function is_right() {
        return $this->is_right;
    }
}
