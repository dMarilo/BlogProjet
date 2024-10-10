<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');
            return $frontendUrl . '/reset-password?token='. $token . '&email=' . urlencode($user->email) ;
        });
    }
}
