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
}
