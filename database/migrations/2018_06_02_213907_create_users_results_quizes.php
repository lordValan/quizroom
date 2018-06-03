<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersResultsQuizes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_results', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->index();
            $table->integer('quiz_id')->unsigned()->index();
            $table->integer('score');
            $table->date('pass_date');
            $table->integer('pass_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_results');
    }
}
