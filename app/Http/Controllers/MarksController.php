<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mark;

class MarksController extends Controller
{
    public function marks(Request $request) {
        return Mark::all();
    }

    public function mark(Mark $mark) {
        return $mark;
    }
}
