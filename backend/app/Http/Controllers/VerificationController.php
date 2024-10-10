<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class VerificationController extends Controller
{
    public function verify($userId, $token)
    {
        $user = DB::table('users')
        ->where('id', $userId)
        ->where('verification_token', $token)
        ->first();

        if ($user) {
            DB::table('users')
              ->where('id', $userId)
              ->update([
                  'email_verified_at' => now(),
                  'verification_token' => null,
              ]);

            return redirect('http://localhost:4200/login');
        } else {
            return redirect('http://localhost:4200/register');
        }
    }
}
