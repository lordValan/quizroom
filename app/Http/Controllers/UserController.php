<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;

class UserController extends Controller
{
    public function user(Request $request) {
        $user = JWTAuth::parseToken()->toUser();

        return $user;
    }
}
