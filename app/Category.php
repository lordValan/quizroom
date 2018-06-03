<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    } 
    
    public function quizzes(){
        return $this->hasMany('App\Quiz');
    }
}
