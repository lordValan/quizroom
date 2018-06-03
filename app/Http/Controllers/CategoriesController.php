<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;
use App\Quiz;

class CategoriesController extends Controller
{
    public function categories(Request $request) {
        return Category::all();
    }

    public function category(Category $category) {
        return $category;
    }

    public function category_quizzes(Category $category) {
        return $category->quizzes;
    }

    public function category_quiz(Category $category, Quiz $quiz) {
        $data = $quiz;

        $data['questions'] = $quiz->questions;

        return $data;
    }
}
