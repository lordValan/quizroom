<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Quiz;

class UserResult extends Model
{
    protected $table = 'users_results';

    protected $hidden = [
        'created_at', 'updated_at', 'user_id', 'quiz_id', 'pass_time'
    ];

    protected $guarded = [];

    public function user(){
        return $this->belongsTo('App\User');
    }

    public function quiz(){
        return $this->belongsTo('App\Quiz');
    }

    private function reduced_user(User $user) {
        $data = array(
            'id' => $user->id,
            'email' => $user->email
        );

        return $data;
    }

    private function reduced_quiz(Quiz $quiz) {
        $data = array(
            'id' => $quiz->id,
            'name' => $quiz->name,
            'slug' => $quiz->slug,
            'category' => $quiz->category
        );

        return $data;
    }

    public static function seconds_to_time($secs) {
        $scs = intval($secs);

        $hrs = number_format($scs / 3600);
        $scs = $scs % 3600;

        $mnts = number_format($scs / 60);
        $scs %= 60;

        return ($hrs < 10 ? '0' : '') . $hrs . ':' .
                ($mnts < 10 ? '0' : '') . $mnts . ':' .
                ($scs < 10 ? '0' : '') . $scs;
    }


    public function toArray() {
        $data = parent::toArray();
        $mark = Mark::where('min_score', '<=', $this->score)->where('max_score', '>=', $this->score)->first();

        $data['mark'] = $mark->name;
        $data['user'] = $this->reduced_user($this->user);
        $data['quiz'] = $this->reduced_quiz($this->quiz);
        $data['time_to_pass'] = $this->pass_time;

        return $data;
    }
}
