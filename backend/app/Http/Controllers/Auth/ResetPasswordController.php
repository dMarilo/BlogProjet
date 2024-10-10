<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Support\Facades\Log;

class ResetPasswordController extends Controller
{   
    use ResetsPasswords;
    protected $redirectTo = '/';

    public function reset(Request $request) 
    {
        
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password'=> 'required|min:6|confirmed',
            'password_confirmation' => 'required'
        ]);

        Log::info('Password reset request:', $request->all());

   
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                Log::info('Resetting password for user:', ['user_id' => $user->id]);
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();
            }
        );
        return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => "Password reset successfully"]) 
        : response()->json(['error' => "Password reset failed"]);
        
    }
    
}

// $user->forceFill([
//     'password' => Hash::make($password),
//     'remember_token' => Str::random(60),
// ])->save();