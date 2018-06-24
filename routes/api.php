<?php

use Illuminate\Http\Request;
use App\Http\Middleware\HttpsProtocol;

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
Route::get('genders', 'GenderController@genders');

Route::group(['middleware' => ['jwt.auth']], function() {
    Route::get('logout', 'AuthController@logout');
    Route::get('auth', 'AuthController@is_auth');

    /* Avatars */

    Route::get('avatars', 'AvatarController@avatars');

    /* Users */

    Route::get('user', 'UserController@user');
    Route::get('user/info', 'UserController@user_info');
    Route::get('user/invitations', 'QuizController@user_invitations');
    Route::get('user/profile', 'UserController@profile');
    Route::post('user/profile', 'UserController@edit_profile');

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

    /* Results */

    Route::post('results', 'ResultsController@results');

    /* Admin */

    Route::get('admin/data', 'AdminController@data');
    Route::get('admin/quizzes', 'QuizController@all_quizzes');
    Route::post('admin/quizzes', 'QuizController@add_quiz');
    Route::delete('admin/quizzes', 'QuizController@remove_quiz');
});
