<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TimeController extends Controller
{
    public function storeReadingTime(Request $request)
    {
        $user = $request->user();
        $timeSpent = $request->input('timeSpent');
        $prevTimeSpent = $user->avg_reading_time;
        if($prevTimeSpent == 0)
        {
            $user->avg_reading_time = $timeSpent;
            $user->save();
        }
        else
        {
            $helper = ($prevTimeSpent + $timeSpent) / 2;
            $user->avg_reading_time = $helper;
            $user->save();
        }
        return response()->json(['message' => true, 'time' => $timeSpent]);
    }
}
