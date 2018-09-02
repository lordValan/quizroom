<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Avatar;
use App\Quiz;
use App\UserInfo;
use JWTAuth, Validator;

class UserController extends Controller
{
    private $user;

    public function __construct() {
        $this->user = JWTAuth::parseToken()->toUser();
    }

    public function user(Request $request) {
        return $this->user;
    }

    public function user_info(Request $request) {
        return $this->user->info;
    }  

    public function quizzes(Request $request) {
        if($this->user->is_admin()) {
            if($this->user->is_superadmin()) {
                return Quiz::all();
            } else {
                return $this->user->created_quizzes;
            }
        } else {
            return 'Accsess denied';
        }
    }  

    public function profile() {
        return array(
            'user_info' => $this->user->info,
            'avatars' => Avatar::avatarsByGender($this->user->info->gender_id)
        );
    }

    public function edit_profile(Request $request) {
        $credentials = $request->only('first_name', 'last_name', 'avatar_id');
        
        $rules = [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'avatar_id' => 'required'
        ];

        $validator = Validator::make($credentials, $rules);
        if($validator->fails()) {
            return response()->json(['success'=> false, 'error'=> 'Некорректные данные :(']);
        }

        DB::table('users_info')
            ->where('user_id', $this->user->id)
            ->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'avatar_id' => $request->avatar_id,
            ]);        

        return response()->json(['success'=> true, 'error'=> 'Сохранено']);
    }
}
