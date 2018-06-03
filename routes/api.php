<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', 'AuthController@register');
Route::post('login', 'AuthController@login');

Route::group(['middleware' => ['jwt.auth']], function() {
    Route::get('logout', 'AuthController@logout');

    /* Avatars */

    Route::get('avatars', 'AvatarController@avatars');

    /* Users */

    Route::get('user', 'UserController@user');

    /* Categories */

    Route::get('categories', 'CategoriesController@categories');
    Route::get('categories/{category}', 'CategoriesController@category');
    Route::get('categories/{category}/quizzes', 'CategoriesController@category_quizzes');
    Route::get('categories/{category}/quizzes/{quiz}', 'CategoriesController@category_quiz');

    /* Quizzes */

    Route::get('quizzes', 'QuizController@quizzes');
    Route::get('quizzes/{quiz}', 'QuizController@quiz');

    /* Marks */

    Route::get('marks', 'MarksController@marks');
    Route::get('marks/{mark}', 'MarksController@mark');
});
