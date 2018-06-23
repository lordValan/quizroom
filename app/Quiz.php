<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\UserResult;
use App\Mark;
use App\Answer;
use App\Question;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use JWTAuth;

class Quiz extends Model
{
    protected $table = 'quizzes';

    protected $hidden = [
        'updated_at', 'category_id', 'author_id'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    } 

    public function category(){
        return $this->belongsTo('App\Category');
    }

    public function author(){
        return $this->belongsTo('App\User');
    }

    public function questions(){
        return $this->hasMany('App\Question');
    }

    public function results(){
        return $this->hasMany('App\UserResult');
    }

    public function groups(){
        return $this->hasMany('App\QuizGroup');
    }

    public function get_result($user_answers) {
        $count = 0;
        $right_answ_price = round(100 / count($this->questions), 2);

        foreach($user_answers as $answer) {
            $question = $this->questions->where('id', $answer['questionId'])->first();

            if($question->is_multiple()){                
                $right_answ_amount = $question->right_answers_amount();
                $curr_question_price = round($right_answ_price / $right_answ_amount, 2);

                foreach($answer['answer'] as $answ_val) {
                    $user_answer = $question->answers->where('id', intval($answ_val))->first();

                    $count = $user_answer->is_right() ? ($count + $curr_question_price) : ($count - $curr_question_price); 
                }
            }
            else{
                $user_answer = $question->answers->where('id', intval($answer['answer'][0]))->first();
                
                $count += $user_answer->is_right() ? $right_answ_price : 0; 
            }
        }

        $res = round($count);
        $res = $res < 0 ? 0 : $res;
        $res = $res > 100 ? 100 : $res;

        return $res;
    }

    public static function addNewQuizFromRequest(Request $request) { 
        $validator = Validator::make($request->all(), [
            'quiz.name' => 'required|max:255',
            'quiz.slug' => 'required|max:32',
            'quiz.description' => 'required|max:2048',
            'quiz.private' => 'required',
            'quiz.category_id' => 'required',
            'quiz.questions' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json(['success' => false, 'error'=> $validator->messages()->first()]);
        }

        if(count(Quiz::all()->where('slug', $request->quiz['slug'])) > 0) {
            return response()->json(['success' => false, 'error'=> 'Тест с таким идентификатором уже существует!']);
        }

        if(count($request->quiz['questions']) > 25) {
            return response()->json(['success' => false, 'error'=> 'Вопросов не может быть больше 25!']);
        } else if(count($request->quiz['questions']) < 5) {
            return response()->json(['success' => false, 'error'=> 'Вопросов не может быть меньше 5!']);
        }

        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin()) {
            $user_id = $user->id;            

            /* insert quiz */

            $quiz_id = DB::table('quizzes')->insertGetId([
                    'name' => $request->quiz['name'],
                    'slug' => $request->quiz['slug'],
                    'description' => $request->quiz['description'],
                    'private' => $request->quiz['private'],
                    'category_id' => $request->quiz['category_id'],
                    'author_id' => $user_id,
                    "created_at" =>  \Carbon\Carbon::now(), 
                    "updated_at" => \Carbon\Carbon::now(),  
            ]);

            foreach($request->quiz['questions'] as $question) {
                $question_id = DB::table('questions')->insertGetId([
                    'text' => $question['text'],
                    'extra_text' => '',
                    'quiz_id' => $quiz_id,                
                    "created_at" =>  \Carbon\Carbon::now(), 
                    "updated_at" => \Carbon\Carbon::now(),  
                ]);

                foreach($question['answers'] as $answer) {
                    DB::table('answers')->insert([
                        'text' => $answer['text'],
                        'question_id' => $question_id,  
                        'is_right' => $answer['is_right'],              
                        "created_at" =>  \Carbon\Carbon::now(), 
                        "updated_at" => \Carbon\Carbon::now(),  
                    ]);
                }
            }

            if($request->quiz['private']){
                foreach($request->quiz['groups'] as $group_id) {
                    DB::table('quizzes_groups')->insert([
                        'quiz_id' => $quiz_id,
                        'group_id' => $group_id,               
                        "created_at" =>  \Carbon\Carbon::now(), 
                        "updated_at" => \Carbon\Carbon::now(),  
                    ]);
                }
            }             

            /* end insert */

            return array(
                'slug' => $request->quiz['slug'],
                'success' => true
            );
        } else {
            return response()->json(['success' => false, 'error'=> 'Вам запрещен доступ']);
        }
    }

    public function average_results() {
        $sum_time = 0;
        $sum_score = 0;
        $results = $this->results;
        $res_count = count($results);

        foreach($results as $result) {
            $sum_time += $result->pass_time;
            $sum_score += $result->score;
        }

        $data = array(
            'aver_time' => $sum_time ? round($sum_time / $res_count) : 0,
            'aver_score' => $sum_score ? round($sum_score / $res_count) : 0
        );

        return $data;
    }

    public function has_access($user) {
        foreach($user->groups as $group) {
            if(count($this->groups->where('group_id', $group->id)) > 0){
                return true;
            }
        }

        return false;
    }

    public function remove() {
        foreach($this->questions as $question) {
            foreach($question->answers as $answer){
                $answer->delete();
            }

            $question->delete();
        }

        if($this->private) {
            foreach($this->groups as $group){
                $group->delete();
            }
        }

        $this->delete();
    }

    public function toArray() {
        $data = parent::toArray();
        $aver_data = $this->average_results();
        $time_to_pass = count($this->questions) * 60;

        $data['author'] = $this->author->info->first_name . ' ' . $this->author->info->last_name;
        $data['category'] = $this->category;
        $data['passed'] = count($this->results);
        $data['aver_time'] = $aver_data['aver_time'];
        $data['aver_score'] = $aver_data['aver_score'];
        $data['aver_mark'] = Mark::getMarkName($aver_data['aver_score']);
        $data['time_to_pass'] = $time_to_pass;

        if($this->private) {
            $data['groups'] = $this->groups;
        }

        $data['questions'] = $this->questions->shuffle();        

        return $data;
    }
}
