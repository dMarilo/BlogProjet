<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

//Route to handle password reset
Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name('password.reset.submit');

//Route to handle sending the reset link
Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');


Auth::routes(['verify' => true]);

Route::get('storage/{filename}', function ($filename) {
    $path = storage_path('app/public/profile_pic/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

Route::get('/verify-email/{userId}/{token}', [VerificationController::class, 'verify'])->name('verify.email');
