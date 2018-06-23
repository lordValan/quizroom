<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';

    protected $hidden = [
        'created_at', 'updated_at', 'quiz_id'
    ];

    public function quiz(){
        return $this->belongsTo('App\Quiz');
    }

    public function answers(){
        return $this->hasMany('App\Answer');
    }

    public function right_answers_amount() {
        return count($this->answers->where('is_right', true));
    }

    public function is_multiple() {
        $cnt = $this->right_answers_amount();

        return $cnt > 1;
    }

    public function toArray() {
        $data = parent::toArray();
        
        $data['is_multiple'] = $this->is_multiple();
        $data['answers'] = $this->answers->shuffle();

        return $data;
    }
}
