<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;
use App\Group;
use App\User;
use JWTAuth;

class AdminController extends Controller
{
    private $page_limit = 10;

    public function data() {
        return array(
            'categories' => Category::all(),
            'groups' => Group::all()
        );
    }

    public function all_groups(Request $request) {
        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin()) {
            if($user->is_superadmin()) {
                return array(
                    'access' => true,
                    'groupsData' => $this->getFilteredGroups($request->s, $request->activePage, Group::all())
                );
            } else {
                return array(
                    'access' => true,
                    'groupsData' => $this->getFilteredGroups($request->s, $request->activePage, $user->created_groups)
                );
            }
        } else {
            return array(
                'access' => false,
                'message' => 'Вы не имеете доступ к этой странице'
            );
        }        
    }

    public function group(Group $group) {
        $user = JWTAuth::parseToken()->toUser();

        if($user->is_admin()) {            
            return array(
                'access' => true,
                'group' => $group
            );
        } else {
            return array(
                'access' => false,
                'message' => 'Вы не имеете доступ к этой странице'
            );
        }        
    }

    public function remove_group(Request $request) {
        $user = JWTAuth::parseToken()->toUser();

        if(!$user->is_admin()) {
            return array(
                'access' => false,
                'message' => 'Вы не имеете доступ к этой странице'
            );
        }

        $group = Group::findOrFail($request->group_id);
        $name = $group->name;
        Group::remove($group);

        return array(
            'access' => true,
            'success' => true,
            'groupsData' => $this->getFilteredGroups($request->s, $request->activePage, Group::all()),
            'message' => 'Группа "' . $name . '" была успешно удалена!'
        );
    }

    public function users(Request $request) {
        $user = JWTAuth::parseToken()->toUser();

        if(!$user->is_admin()) {
            return array(
                'access' => false,
                'message' => 'Вы не имеете доступ к этой странице'
            );
        }

        $page = $request->page ? $request->page : 1;
        $data = User::all()->map(function($user) {
            return array(
                'id' => $user->id,
                'name' => $user->info->first_name . ' ' . $user->info->last_name,
                'email' => $user->email
            );
        });

        $totalUsersCount = count($data);
        $s = $request->s;

        if($s) {
            $data = $data->filter(function($user) use ($s) {
                return mb_stripos($user['name'], $s) !== false;
            });
        }

        $totalCount = count($data);
        $data = $data->forPage($page, $this->page_limit)->values();

        return array(
            'access' => true,
            'users' => $data,
            'totalUsers' => $totalCount,
            'page_limit' => $this->page_limit,
            'totalAllUsers' => $totalUsersCount,
        );
    }

    public function getFilteredGroups($s, $curr_page, $data) {
        $page = $curr_page ? $curr_page : 1;
        $totalCount = count($data);

        if($s) {
            $data = $data->filter(function($group) use ($s) {
                return mb_stripos($group->name, $s) !== false;
            });
        }

        $totalCount = count($data);
        
        $data = $data->forPage($page, $this->page_limit)->values();

        return array(
            'groups' => $data,
            'totalGroups' => $totalCount,
            'page_limit' => $this->page_limit
        );
    }

    public function edit_group(Request $request) {
        return Group::editGroupFromRequest($request);
    }

    public function add_group(Request $request) {
        return Group::addNewGroupFromRequest($request);
    }
}
