<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';

    protected $hidden = [
        'created_at', 'updated_at', 'quiz_id', 'id'
    ];

    public function quiz(){
        return $this->belongsTo('App\Quiz');
    }

    public function answers(){
        return $this->hasMany('App\Answer');
    }

    public function toArray() {
        $data = parent::toArray();

        $data['answers'] = $this->answers;

        return $data;
    }
}
