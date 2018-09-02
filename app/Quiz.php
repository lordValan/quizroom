<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\UserResult;
use App\Mark;
use App\Answer;
use App\Category;
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
        $valResult = Quiz::addEditQuizValidateRequest($request);

        if($valResult['success'] == false) {
            return response()->json($valResult);
        }

        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin() == false) {
            return response()->json(['success' => false, 'error'=> 'Вам запрещен доступ']);
        }        

        $user_id = $user->id;
        
        if(count(Category::where('id', $request->cat_obj['id'])->get()) === 0) {
            $cat_id = DB::table('categories')->insertGetId([
                'name' => $request->cat_obj['name'],
                'slug' => $request->cat_obj['slug'],
                "created_at" =>  \Carbon\Carbon::now(), 
                "updated_at" => \Carbon\Carbon::now()
            ]);
        } else {
            $cat_id = $request->quiz['category_id'];
        }

        if(!$cat_id) {
            return response()->json(['success' => false, 'error'=> 'Ошибка присваивания категории']);
        }

        /* insert quiz */

        $quiz_id = DB::table('quizzes')->insertGetId([
            'name' => $request->quiz['name'],
            'slug' => $request->quiz['slug'],
            'description' => $request->quiz['description'],
            'private' => $request->quiz['private'],
            'category_id' => $cat_id,
            'author_id' => $user_id,
            "created_at" =>  \Carbon\Carbon::now(), 
            "updated_at" => \Carbon\Carbon::now(),  
        ]);     
        
        Quiz::addEditQuizInsertNewParts($request, $quiz_id);

        /* end insert */
        return response()->json([
            'slug' => $request->quiz['slug'],
            'success' => true
        ]);
    }

    public static function editNewQuizFromRequest(Request $request) {
        $valResult = Quiz::addEditQuizValidateRequest($request);

        if($valResult['success'] == false) {
            return response()->json($valResult);
        }

        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin() == false) {
            return response()->json(['success' => false, 'error'=> 'Вам запрещен доступ']);
        }

        if(count(Category::where('id', $request->cat_obj['id'])->get()) === 0) {
            $cat_id = DB::table('categories')->insertGetId([
                'name' => $request->cat_obj['name'],
                'slug' => $request->cat_obj['slug'],
                "created_at" =>  \Carbon\Carbon::now(), 
                "updated_at" => \Carbon\Carbon::now()
            ]);
        } else {
            $cat_id = $request->quiz['category_id'];
        }

        if(!$cat_id) {
            return response()->json(['success' => false, 'error'=> 'Ошибка присваивания категории']);
        }

        $user_id = $user->id;  

        $quiz = Quiz::where('id', $request['quiz']['id'])->firstOrFail();

        $quiz->name = $request['quiz']['name'];
        $quiz->slug = $request['quiz']['slug'];
        $quiz->description = $request['quiz']['description'];
        $quiz->private = $request['quiz']['private'];
        $quiz->category_id = $cat_id;

        $quiz->save();

        Quiz::removeQuizParts($quiz);
        Quiz::addEditQuizInsertNewParts($request, $quiz->id);


        /* end edit */
        return response()->json([
            'slug' => $request->quiz['slug'],
            'success' => true
        ]);
    }

    private static function addEditQuizValidateRequest(Request $request) {
        $validator = Validator::make($request->all(), [
            'quiz.name' => 'required|max:255',
            'quiz.slug' => 'required|max:32',
            'quiz.description' => 'required|max:2048',
            'quiz.private' => 'required',
            'quiz.category_id' => 'required',
            'quiz.questions' => 'required',
            'cat_obj' => 'required'
        ]);

        if($validator->fails()) {
            return ['success' => false, 'error'=> $validator->messages()->first()];
        }

        $quiz_slug = Quiz::where('slug', $request->quiz['slug'])->get();

        if(count($quiz_slug) > 0) {
            $id = $request['quiz']['id'];

            if($id) {
                if($quiz_slug->first()->id !== $id) {
                    return ['success' => false, 'error'=> 'Тест с таким идентификатором уже существует!'];
                }
            } else {
                return ['success' => false, 'error'=> 'Тест с таким идентификатором уже существует!'];
            }
        }

        if(count($request->quiz['questions']) > 25) {
            return ['success' => false, 'error'=> 'Вопросов не может быть больше 25!'];
        } else if(count($request->quiz['questions']) < 5) {
            return ['success' => false, 'error'=> 'Вопросов не может быть меньше 5!'];
        }

        return ['success' => true];
    }

    private static function addEditQuizInsertNewParts(Request $request, $quiz_id) {
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

    public static function remove(Quiz $quiz) {        
        Quiz::removeQuizParts($quiz);
        $quiz->delete();
    }

    private static function removeQuizParts(Quiz $quiz) {
        foreach($quiz->questions as $question) {
            foreach($question->answers as $answer){
                $answer->delete();
            }

            $question->delete();
        }

        if($quiz->private) {
            foreach($quiz->groups as $group){
                $group->delete();
            }
        }
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
