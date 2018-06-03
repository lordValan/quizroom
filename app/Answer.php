<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $table = 'answers';

    protected $hidden = [
        'is_right', 'created_at', 'updated_at', 'question_id', 'id'
    ];

    public function question(){
        return $this->belongsTo('App\Question');
    }
}
