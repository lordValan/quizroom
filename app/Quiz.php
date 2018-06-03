<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $table = 'quizzes';

    protected $hidden = [
        'created_at', 'updated_at', 'category_id'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    } 

    public function category(){
        return $this->belongsTo('App\Category');
    }

    public function questions(){
        return $this->hasMany('App\Question');
    }

    public function toArray() {
        $data = parent::toArray();

        $data['category'] = $this->category;

        return $data;
    }
}
