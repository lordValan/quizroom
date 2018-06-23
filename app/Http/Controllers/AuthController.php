<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\User;
use App\Gender;
use App\UserInfo;
use App\Avatar;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Validator, Hash;
use Illuminate\Support\Facades\Password;
use DateTime;

class AuthController extends Controller
{
    /**
     * API Register
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $credentials = $request->only('email', 'password', 'gender', 'first_name', 'last_name', 'date_of_birth');
        
        $rules = [
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|max:32',
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'required'
        ];
        $validator = Validator::make($credentials, $rules);
        if($validator->fails()) {
            return response()->json(['success'=> false, 'error'=> 'Некорректные данные :(']);
        }
        
        $email = $request->email;
        $password = $request->password;
        $admin = 0;        
        
        $user = User::create(['email' => $email, 'password' => Hash::make($password), 'admin' => $admin]);

        $birth = new DateTime($request->date_of_birth);
        $gender_avatars = Avatar::where('gender_id', $request->gender)->get();
        $avatar_id = count($gender_avatars) > 0 ? $gender_avatars->first()->id : Avatar::all()->first()->id;
       
        $info_arr = array(
            'user_id' => $user->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'date_of_birth' => $birth->format('Y-m-d'),
            'avatar_id' => $avatar_id,
            'gender_id' => $request->gender,
        );
        
        UserInfo::create($info_arr);
        
        return $this->login($request);
    }

    /* API Login, on success return JWT Auth token
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        
        $rules = [
            'email' => 'required|email',
            'password' => 'required',
        ];
        $validator = Validator::make($credentials, $rules);
        if($validator->fails()) {
            return response()->json(['success'=> false, 'error'=> 'Некорректные данные :(']);
        }
        
        try {
            // attempt to verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['success' => false, 'error' => 'Пользователя с такими данными не существует :(']);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['success' => false, 'error' => 'Не удалось войти. Пожалуйста, попробуйте немногопозже :(']);
        }
        // all good so return the token
        return response()->json(['success' => true, 'data'=> [ 'token' => $token ]]);
    }
    /**
     * Log out
     * Invalidate the token, so user cannot use it anymore
     * They have to relogin to get a new token
     *
     * @param Request $request
     */
    public function logout(Request $request) {
        $this->validate($request, ['token' => 'required']);
        
        try {
            JWTAuth::invalidate($request->input('token'));
            return response()->json(['success' => true, 'message'=> "You have successfully logged out."]);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'error' => 'Failed to logout, please try again.'], 500);
        }
    }

    public function is_auth(Request $request) {
        $this->validate($request, ['token' => 'required']);

        try {
            $user = JWTAuth::parseToken()->toUser();
            $token = $request->input('token');

            if($this->should_token_refresh()) {
                JWTAuth::invalidate($token);
                $token = JWTAuth::fromUser($user);
            }

            return response()->json(['success' => true, 'message'=> "You are logged in.", 'token' => $token]);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'error' => 'Failed to auth.', 'reg_data' => array(
                'genders' => Gender::all()
            )]);
        }
    }

    private function should_token_refresh() {
        $exp_time = JWTAuth::parseToken()->payload()['exp'] * 1000;
        $curr_time = (new DateTime(date('c')))->getTimestamp() * 1000;
        $diff = $exp_time - $curr_time;
        $hours_last = 24 - (($diff / (1000*60*60)) % 24);
        
        return $hours_last > 5 ? true : false;        
    }
}
