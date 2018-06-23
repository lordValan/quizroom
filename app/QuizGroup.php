<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuizGroup extends Model
{
    protected $table = 'quizzes_groups';

    protected $hidden = [
        'created_at', 'updated_at', 'id', 'quiz_id', 'group_id'
    ];

    public function group(){
        return $this->belongsTo('App\Group');
    }

    public function quiz(){
        return $this->belongsTo('App\Quiz');
    }

    public function toArray() {
        $data = $this->group;

        return $data;
    }
}
