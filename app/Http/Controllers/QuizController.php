<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quiz;
use JWTAuth;
use App\User;

class QuizController extends Controller
{
    private $page_limit = 5;

    public function quizzes(Request $request) {
        return $this->getFilteredQuizzes($request->filterCats, $request->sortItem, $request->page, $request->s, $this->publicQuizzes());
    }

    public function all_quizzes(Request $request) {
        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin()){
            if($user->is_superadmin()) {
                return array(
                    'access' => true,
                    'data' => $this->getFilteredQuizzes($request->filterCats, $request->sortItem, $request->page, $request->s, Quiz::all())
                );
            } else {
                return array(
                    'access' => true,
                    'data' => $this->getFilteredQuizzes($request->filterCats, $request->sortItem, $request->page, $request->s, $user->created_quizzes)
                );
            }
            
        } else {
            return array(
                'access' => false
            );
        }
    }

    public function user_invitations(Request $request){
        $user = JWTAuth::parseToken()->toUser();
        $data = array();

        foreach($this->privateQuizzes() as $quiz) {
            foreach($user->groups as $user_group) {
                if(count($quiz->groups->where('group_id', $user_group->id)) > 0) {
                    array_push($data, $quiz);
                    break;
                }
            }
        }

        return $this->getFilteredQuizzes($request->filterCats, $request->sortItem, $request->page, $request->s, collect($data));
    }

    public function remove_quiz(Request $request) {
        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin()) {
            $quiz = Quiz::find($request->quiz_id);

            if(count($quiz->results) === 0) {
                $name = $quiz->name;
                Quiz::remove($quiz);

                return array(
                    'access' => true,
                    'success' => true,
                    'data' => $this->getFilteredQuizzes($request->filterCats, $request->sortItem, $request->page, $request->s, Quiz::all()),
                    'message' => 'Тест "' . $name . '" успешно удален!'
                );
            } else {
                return array(
                    'access' => true,
                    'success' => false,
                    'message' => 'Нельзя удалить тест, который уже был пройден пользователями'
                );
            }            
        } else {
            return array(
                'access' => false,
                'message' => 'Вы не имеете доступ к этому тесту'
            );
        }
    }

    public function quiz(Quiz $quiz) {
        if($quiz->private){
            $user = JWTAuth::parseToken()->toUser();

            if($quiz->has_access($user) || $user->is_admin()) {
                return array(
                    'access' => true,
                    'quiz' => $quiz
                );               
            } else {
                return array(
                    'access' => false,
                    'message' => 'Вы не имеете доступ к этому тесту'
                );
            }            
        }

        return array(
            'access' => true,
            'quiz' => $quiz
        ); 
    }    

    public function quiz_results(Request $request, Quiz $quiz) {
        $page = $request->curr_page ? $request->curr_page : 1;
        $per_page = 10;
        $user = JWTAuth::parseToken()->toUser();
        $data = $quiz->results->sortByDesc('pass_date');

        if($user->is_admin()){
            return array(
                'access' => true,
                'quiz_results' => $data->forPage($page, $per_page)->values(),
                'quiz_name' => $quiz->name,
                'page_limit' => $per_page,
                'totalResults' => count($data)
            );             
        } 

        return array(
            'access' => false,
            'message' => 'Вы не имеете доступ к этому тесту'
        ); 
    }   

    public function add_quiz(Request $request) {
        return Quiz::addNewQuizFromRequest($request);
    }

    public function edit_quiz(Request $request) {
        return Quiz::editNewQuizFromRequest($request);
    }

    private function publicQuizzes() {
        return Quiz::where('private', '0')->get();
    }

    private function privateQuizzes() {
        return Quiz::where('private', '1')->get();
    }

    private function getFilteredQuizzes($categories, $sortBy, $curr_page, $name_like, $data) {
        $page = $curr_page ? $curr_page : 1;

        $totalCount = count($data);

        switch($sortBy){
            case 'popular_desc':
                $data = $data->sortByDesc(function($quiz) {
                    return count($quiz->results);
                })->values();
                break;
            case 'popular_asc':
                $data = $data->sortBy(function($quiz) {
                    return count($quiz->results);
                })->values();
                break;
            case 'date_desc':
                $data = $data->sortByDesc('created_at')->values();
                break;
            case 'date_asc':
                $data = $data->sortBy('created_at')->values();
                break;
            default: 
                break;
        }

        /* filter by category if array of categories is set */
        if($categories) {
            $data = $data->whereIn('category_id', $categories);            
        }

        if($name_like) {
            $data = $data->filter(function($quiz) use ($name_like) {
                return mb_stripos($quiz->name, $name_like) !== false;
            });
        }

        $totalCount = count($data);
        $data = $data->forPage($page, $this->page_limit)->values();

        return array(
            'quizzes' => $data,
            'totalQuizzes' => $totalCount,
            'page_limit' => $this->page_limit
        );
    }
}
