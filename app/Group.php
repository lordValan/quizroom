<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Http\Request;
use JWTAuth;

class Group extends Model
{
    protected $table = 'groups';

    protected $hidden = [
        'updated_at', 'pivot'
    ];

    public function creator(){
        return $this->belongsTo('App\User');
    }

    public function users()
    {
        return $this->belongsToMany('App\User', 'users_groups');
    }

    public static function remove(Group $group) {        
        Group::removeGroupParts($group, true);
        $group->delete();
    }

    private static function removeGroupParts(Group $group, $quizzes) {
        DB::table('users_groups')->where('group_id', $group->id)->delete();

        if($quizzes === true) {
            DB::table('quizzes_groups')->where('group_id', $group->id)->delete();
        }
    }

    private static function addEditGroupNewParts($request, $group_id) {
        foreach($request['group']['users'] as $user) {
            DB::table('users_groups')->insert([
                'group_id' => $group_id,
                'user_id' => $user,               
                "created_at" =>  \Carbon\Carbon::now(), 
                "updated_at" => \Carbon\Carbon::now(),  
            ]);
        }
    }

    public static function addNewGroupFromRequest(Request $request) {         
        $valResult = Group::addEdiGroupValidateRequest($request);
        
        if($valResult['success'] == false) {
            return response()->json($valResult);
        }

        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin() == false) {
            return response()->json(['success' => false, 'error'=> 'Вам запрещен доступ']);
        }        

        /* insert group */

        $group_id = DB::table('groups')->insertGetId([
            'name' => $request->group['name'],
            'creator_id' => $user->id,
            "created_at" =>  \Carbon\Carbon::now(), 
            "updated_at" => \Carbon\Carbon::now(),  
        ]);     
        
        Group::addEditGroupNewParts($request, $group_id);

        /* end insert */
        return response()->json([
            'success' => true
        ]);
    }

    public static function editGroupFromRequest(Request $request) {
        $valResult = Group::addEdiGroupValidateRequest($request);

        if($valResult['success'] == false) {
            return response()->json($valResult);
        }

        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin() == false) {
            return response()->json(['success' => false, 'error'=> 'Вам запрещен доступ']);
        }

        $user_id = $user->id;  

        $group = Group::where('id', $request['group']['id'])->firstOrFail();

        $group->name = $request['group']['name'];

        $group->save();

        Group::removeGroupParts($group, false);        
        Group::addEditGroupNewParts($request, $group->id);

        /* end edit */
        return response()->json([            
            'success' => true
        ]);
    }

    private static function addEdiGroupValidateRequest(Request $request) {
        $validator = Validator::make($request->all(), [
            'group.name' => 'required|max:255',
            'group.users' => 'required'
        ]);

        if($validator->fails()) {
            return ['success' => false, 'error'=> $validator->messages()->first()];
        }

        $group_name = Group::where('name', $request['group']['name'])->get();

        if(count($group_name) > 0) {
            if(array_key_exists('id', $request['group'])) {
                $id = $request['group']['id'];

                if($group_name->first()->id !== $id) {
                    return ['success' => false, 'error'=> 'Группа с таким названием уже существует!'];
                }
            } else {
                return ['success' => false, 'error'=> 'Группа с таким названием уже существует!'];
            }
        }

        if(count($request['group']['users']) <= 0) {
            return ['success' => false, 'error'=> 'Не выбрано ни одного пользователя!'];
        } 

        return ['success' => true];
    }

    public function toArray() {
        $data = parent::toArray();

        $data['users'] = $this->users->map(function($user) {
            return $user->id;
        });

        $data['creator'] = $this->creator->info->first_name . ' ' . $this->creator->info->last_name;

        return $data;
    }
}
