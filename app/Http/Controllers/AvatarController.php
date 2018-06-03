<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Avatar;
use JWTAuth;

class AvatarController extends Controller
{
    public function avatars(Request $request) {
        if($request->all){
            return Avatar::all();
        } else {
            $gender = JWTAuth::parseToken()->toUser()->info->gender->id;

            return Avatar::all()->where('gender_id', $gender);;
        }        
    }
}
