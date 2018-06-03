<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    protected $table = 'users_info';

    protected $hidden = [
        'created_at', 'updated_at', 'user_id', 'gender_id', 'avatar_id'
    ];

    public function user(){
        return $this->belongsTo('App\User');
    }

    public function gender(){
        return $this->belongsTo('App\Gender');
    }

    public function avatar(){
        return $this->belongsTo('App\Avatar');
    }

    public function toArray() {
        $data = parent::toArray();

        $data['avatar'] = $this->avatar;
        $data['gender'] = $this->gender;

        return $data;
    }
}
