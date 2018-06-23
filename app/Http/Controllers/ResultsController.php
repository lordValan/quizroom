<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quiz;
use App\Mark;
use App\UserResult;
use Validator;
use JWTAuth;

class ResultsController extends Controller
{
    public function results(Request $request) {
        $data = $request->only('quizId', 'answers', 'pass_time');
        
        $rules = [
            'quizId' => 'required|integer',
            'answers' => 'required',
            'pass_time' => 'required'
        ];

        $validator = Validator::make($data, $rules);

        if($validator->fails()) {
            return response()->json(['error' => $validator->messages()]);
        }

        /* ------------------ */

        $currQuiz = Quiz::find($request->quizId);
        $res = $currQuiz->get_result($request->answers);

        $mark = Mark::getMarkName($res);
        $user = JWTAuth::parseToken()->toUser();

        $info_arr = array(
            'user_id' => $user->id,
            'quiz_id' => $request->quizId,
            'score' => $res,
            'pass_date' => date('Y-m-d'),
            'pass_time' => $request->pass_time
        );
/* 
        return $info_arr; */

        try{
            UserResult::create($info_arr);
        } 
        catch(\Exception $e){
            return $e->message;
        }

        

        return array(
            'mark' => $mark,
            'result' => $res,
            'pass_time' => $request->pass_time
        );
    }
}
