<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Avatar extends Model
{
    protected $table = 'avatars';

    protected $hidden = [
        'created_at', 'updated_at', 'gender_id'
    ];

    public function gender(){
        return $this->belongsTo('App\Gender');
    }

    public static function avatarsByGender($gender_id) {
        return Avatar::all()->where('gender_id', $gender_id)->values();
    }

    public function toArray() {
        $data = parent::toArray();

        $data['gender'] = $this->gender->name;

        return $data;
    }
}
