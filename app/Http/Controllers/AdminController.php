<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;
use App\Group;

class AdminController extends Controller
{
    public function data() {
        return array(
            'categories' => Category::all(),
            'groups' => Group::all()
        );
    }
}
