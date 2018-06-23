<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    protected $table = 'users_info';

    protected $hidden = [
        'created_at', 'updated_at', 'user_id', 'gender_id', 'avatar_id'
    ];

    protected $guarded = [];

    public function user(){
        return $this->belongsTo('App\User');
    }

    public function gender(){
        return $this->belongsTo('App\Gender');
    }

    public function avatar(){
        return $this->belongsTo('App\Avatar');
    }

    public function age($date_of_birth) {
        $birth = date_create($date_of_birth);
        $now = date_create(date('Y-m-d'));
        $interval = date_diff($birth, $now);
        return $interval->format('%y');
    }

    public function toArray() {
        $data = parent::toArray();

        $data['avatar'] = $this->avatar;
        $data['gender'] = $this->gender;
        $data['age'] = $this->age($this->date_of_birth);
        $data['date_of_birth'] = $this->date_of_birth;

        return $data;
    }
}
