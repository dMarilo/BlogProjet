<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class UpgradeRequestController extends Controller
{
    public function sendUpgradeRequest(Request $request)
    {
        $user = $request->user();
        $status  = $user->user_type;
        if($status == "Reader")
        {
            $user->user_type = "pending";+
            $user->save();
            return response()->json(['success' => true]);
        }
        else
        {
            $message = "You are already a Blogger";
            return response()->json(['success' => false, 'message' => $message]);
        }
        return response()->json(['success' => false, 'message' => "Unexpected"]);
    }

    public function upgradeUser($id) {
        $user = User::where('id', $id)->first();
        if($user)
        {
            $user->user_type = "Blogger";
        }
        $user->save();
        return response()->json(['success' => true]);
    }
}
