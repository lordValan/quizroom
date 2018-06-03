<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    protected $table = 'genders';

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
