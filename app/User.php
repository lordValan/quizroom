<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use DateTime;
use App\UserResult;

use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'password', 'admin', 'superadmin'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'created_at', 'updated_at', 'remember_token'
    ];

    protected $guarded = ['id'];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function info(){
        return $this->hasOne('App\UserInfo');
    }

    public function created_quizzes(){
        return $this->hasMany('App\Quiz', 'author_id');
    }

    public function created_groups(){
        return $this->hasMany('App\Group', 'creator_id');
    }

    public function results(){
        return $this->hasMany('App\UserResult');
    }

    public function groups()
    {
        return $this->belongsToMany('App\Group', 'users_groups');
    }

    public function last_five_results() {
        return $this->results->sortByDesc('created_at')->take(5)->values();
    }

    public function is_admin() {
        return $this->admin ? true : false;
    }

    public function is_superadmin() {
        return $this->superadmin ? true : false;
    }

    public static function sorted_by_rating() {
        return User::all()->sortByDesc(function ($user, $key) {
            return $user->all_time_sum();
        });
    }

    public function all_time_sum() {
        $sum = 0;
        $results = $this->results;

        foreach($results as $result) {
            $sum += $result->score;
        }

        return $sum ? $sum : 0;
    }

    public function all_time_average() {
        $sum = $this->all_time_sum();

        return $sum ? round($sum / count($this->results), 2) : 0;
    }

    public function all_time_average_pass_time() {
        $sum = 0;
        $results = $this->results;

        foreach($results as $result) {
            $sum += $result->pass_time;
        }

        return $sum ? round($sum / count($results), 2) : 0;
    }

    public function table_position() {
        $users = User::sorted_by_rating();

        $place = 1;

        foreach($users as $user){
            if($user->id === $this->id){
                return $place;
            }

            $place++;
        }

        return -1;
    }

    public function passed_count_and_average_by_category() {
        $res_array = array();
        $results = $this->results;

        foreach($results as $result) {
            $cat = $result->quiz->category;

            if(!array_key_exists($cat->slug, $res_array)) {
                $res_array[$cat->slug] = array(
                    'label' => $cat->name,
                    'passed' => 1, 
                    'sum' => $result->score,
                    'average' => $result->score
                );
            } else {                
                $res_array[$cat->slug]['passed'] += 1; 
                $res_array[$cat->slug]['sum'] += $result->score; 
                $res_array[$cat->slug]['average'] = round($res_array[$cat->slug]['sum'] / $res_array[$cat->slug]['passed'], 2); 
            }
        }

        return collect($res_array)->values();
    }    

    private $months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 
                        'Ноябрь', 'Декабрь'];

    public function average_and_passed_by_last_five_months() {
        $curr_year = intval(date('Y'));
        $curr_month = intval(date('n'));
        $data = array();
        
        for($i = 0; $i < 5; $i++) {
            $this_month_date = $curr_year . '-' . ($curr_month < 10 ? '0' : '') . $curr_month . '-01';
            $next_month = $curr_month === 12 ? 1 : $curr_month + 1;
            $next_month_date = ($curr_month === 12 ? ($curr_year + 1) : $curr_year) .
                                '-' . ($next_month < 10 ? '0' : '') . 
                                $next_month . '-01';

            $sum = 0;
            $results = $this->results->where('pass_date', '>=', $this_month_date)->where('pass_date', '<', $next_month_date);
            $passed = count($results);

            foreach($results as $result) {
                $sum += $result->score;
            }

            array_push($data, array(
                    'label' => $this->months[$curr_month - 1],  
                    'passed' => $passed,
                    'average' => $sum ? round($sum / $passed, 2) : 0
                )
            );

            $curr_year = $curr_month === 1 ? $curr_year - 1 : $curr_year;
            $curr_month = $curr_month === 1 ? 12 : $curr_month - 1;
        }
        

        return array_reverse($data);
    }

    public function all_time_average_mark() {
        $all_time_average = intval($this->all_time_average());

        return Mark::getMarkName($all_time_average);
    }

    public function table_raiting() {
        $users = User::sorted_by_rating()->take(5);
        $pos = 1;
        $first_five = array();

        foreach($users as $user){
            array_push($first_five, $this->get_user_info_for_table($user, $pos++));
        };

        $cur_user_pos = $this->table_position();
        $cur_user = null;

        if($cur_user_pos > 5) {
            $cur_user = $this->get_user_info_for_table($this, $cur_user_pos);
        }

        return array(
            'first_five' => $first_five,
            'current_user' => $cur_user
        );
    }

    private function get_user_info_for_table($user, $pos) {
        $data = array();
            
        $data['pos'] = $pos;
        $data['name'] = $user->info->first_name . ' ' . $user->info->last_name;
        $data['passed'] = count($user->results);
        $data['aver_score_mark'] = intval($user->all_time_average()) . ' (' . $user->all_time_average_mark() . ')';
        $data['all_time_sum'] = $user->all_time_sum();
        $data['is_current_user'] = $this->id === $user->id;
        
        return $data;
    }

    public function registered_days($reg_date) {
        $reg = date_create($reg_date);
        $now = date_create(date('Y-m-d'));
        $interval = date_diff($reg, $now);
        return $interval->format('%a') > 0 ? $interval->format('%a') : 1;
    }

    public function toArray() {
        $data = parent::toArray();
        $all_time_average = intval($this->all_time_average());        

        if($this->info) {
            $data['info'] = $this->info;
            $data['groups'] = $this->groups;
            $data['last_five_results'] = $this->last_five_results();
            $data['all_time_average_score'] = $all_time_average;
            $data['all_time_sum'] = $this->all_time_sum();
            $data['all_time_average_mark'] = $this->all_time_average_mark();
            $data['passed_tests_count'] = count($this->results);
            $data['all_time_average_pass_time'] = UserResult::seconds_to_time($this->all_time_average_pass_time());
            
            $reg_date = new DateTime($this->created_at);
            $data['register_date'] = $reg_date->format('Y-m-d');
            $data['days_at_site'] = $this->registered_days($reg_date->format('Y-m-d'));
            $data['all_users_amount'] = count(User::all());            
            
            $data['passed_count_and_average_by_category'] = $this->passed_count_and_average_by_category();
            $data['average_and_passed_by_last_five_months'] = $this->average_and_passed_by_last_five_months();
            $data['table_position'] = $this->table_position();
            $data['table_raiting'] = $this->table_raiting();
            $data['status'] = $this->is_admin() ? ( $this->is_superadmin() ? 'Администратор' : 'Создатель') : 'Пользователь';
        }

        return $data;
    }
}
