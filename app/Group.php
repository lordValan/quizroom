<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $table = 'groups';

    protected $hidden = [
        'created_at', 'updated_at', 'pivot'
    ];

    public function users()
    {
        return $this->belongsToMany('App\User', 'users_groups');
    }
}
