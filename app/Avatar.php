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

    public function toArray() {
        $data = parent::toArray();

        $data['gender'] = $this->gender->name;

        return $data;
    }
}
