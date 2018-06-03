<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Quiz;

class QuizController extends Controller
{
    public function quizzes(Request $request) {
        return Quizzes::all();
    }

    public function quiz(Quiz $quiz) {
        $data = $quiz;

        $data['questions'] = $quiz->questions;

        return $data;
    }
}
