<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        //does user exist?
        $user = DB::table('users')->where('email', $request->input('email'))->first();
        if (!$user) {
            return response()->json([
                'errors' => [
                    'email' => 'User does not exist.'
                    ]
                ],400);
        }

        $status = Password::broker()->sendResetLink($request->only('email'));


        if ($status == Password::RESET_LINK_SENT) {
            return response()->json(['status' => __($status)]);
        }
        
    }

}