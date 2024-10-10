<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\AgeGroup;
use App\Models\User;
use App\Models\Country;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserController extends Controller
{
    public function register(Request $request)
    {

        Log::info('Register method called', $request->all());

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        Log::info('Validated data', $validated);

        $user = User::create([
            "first_name" => $validated['first_name'],
            "last_name" => $validated['last_name'],
            "email" => $validated['email'],
            "password" => Hash::make($validated['password']),
        ]);
        $user->verification_token = Str::random(60);
        $user->save();

        Mail::to($user->email)->send(new WelcomeEmail($user));

        return response()->json(["message" => "User registered successfully", 'user' => $user], 201);
    }


    public function updateInfo(Request $request, User $user)
    {
        $user = $request->user();

        $request->validate([
            'about' => 'nullable|string|max:255',
            'gender' => 'nullable|string',
            'user_type' => 'nullable|string',
            'birth' => 'nullable|date',
            'country' => 'nullable|string'
        ]);

        $user->about = $request->input('about', $user->about);
        $user->gender = $request->input('gender', $user->gender);
        $user->user_type = $request->input('user_type', $user->user_type);
        $birth = $request->input('birth', $user->birth);
        $user->birth = $birth;
        $country = $request->input('country', $user->country);
        $user->country = $country;
        $countryEntry = Country::where('country', $country)->first();

        if ($countryEntry) {
            $countryEntry->increment('users_from');
        } else {
            Country::create([
                'country' => $country,
                'users_from' => 1,
            ]);
        }

        $age = $this->calculateAge($birth);
        $ageGroup = $this->determineAgeGroup($age);
        $this->updateAgeGroupEntry($ageGroup);

        if ($request->hasFile('profile_pic')) {
            $request->validate([
                'profile_pic' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
            ]);
            if ($user->profile_pic && Storage::exists('public/' . $user->profile_pic)) {
                Storage::delete('public/' . $user->profile_pic);
            }

            $file = $request->file('profile_pic');
            $user->profile_pic = $file->store('profile_pic', 'public');
        }

        $user->save();

        return response()->json(['message' => 'User Infromation updated successfully']);
    }

    private function calculateAge($birthdate)
    {
        $birthDate = Carbon::createFromFormat('Y-m-d', $birthdate);
        return $birthDate->age;
    }

    private function determineAgeGroup($age)
    {
        switch (true) {
            case ($age < 18):
                return 'Under 18';
            case ($age >= 18 && $age < 25):
                return '18-24';
            case ($age >= 25 && $age < 35):
                return '25-34';
            case ($age >= 35 && $age < 45):
                return '35-44';
            case ($age >= 45 && $age < 55):
                return '45-54';
            case ($age >= 55 && $age < 65):
                return '55-64';
            case ($age >= 65):
                return 'Over 65';
            default:
                return 'Over 65';
        }
    }

    private function updateAgeGroupEntry($ageGroup)
    {
        $ageGroupEntry = AgeGroup::where('age_group', $ageGroup)->first();
        if ($ageGroupEntry) {
            $ageGroupEntry->increment('number_of');
        } else {
            AgeGroup::create([
                'age_group' => $ageGroup,
                'number_of' => 1,
            ]);
        }
    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Email is incorrect.'],
            ]);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'password' => ['Password is incorrect.'],
            ]);
        }

        if (is_null($user->email_verified_at)) {
            Auth::logout();
            return response()->json([
                'message' => 'User not verified'
            ], 401);
        }

        $user = $request->user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user, 'user_type' => $user->user_type]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logget Out Successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function getUserById(Request $request, $id)
    {
        $user = User::find($id);
        $user2 = $request->user();
        $subscriberId = $user2->id;
        $subscribedToId = $id;
        $subscribed = false;

        $subscriptions = Subscription::where('subscriber_id', $subscriberId)
        ->where('subscribed_to_id', $subscribedToId)
        ->get();

        if($subscriptions->isNotEmpty()) {
            $subscribed = true;
        }

        if($user && $user->birth)
        {
            $birthdate = Carbon::parse($user->birth);
            $age = $birthdate->age;
        }

        if ($user) {
            return response()->json(['user' => $user, "user2" => $user2, 'subscribed' => $subscribed, 'age' => $age, 'subscribers' => $user->subscribers]);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function getUserByIdUnlogged($id)
    {
        $user = User::find($id);
        $subscribed = false;

        if($user && $user->birth)
        {
            $birthdate = Carbon::parse($user->birth);
            $age = $birthdate->age;
        }

        if ($user) {
            return response()->json(['user' => $user, 'subscribed' => $subscribed, 'age' => $age, 'subscribers' => $user->subscribers]);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function getUsers()
    {
        return response()->json(User::all(), 200);
    }

    public function deleteUser(Request $request)
    {
        $user = $request->user();
        $user->delete();
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Deleted Successfully']);
    }

    public function subscribe(Request $request)
    {
        $user = $request->user();
        $subscriberId = $user->id;
        $subscribedToId = $request->input('id', $user->id);

        $subscriptions = Subscription::where('subscriber_id', $subscriberId)
        ->where('subscribed_to_id', $subscribedToId)
        ->get();
        if($subscriptions->isNotEmpty()) {
            return response()->json(['success' => true, "subscriber" => $subscriberId, "subscribedTo" => $subscribedToId, "subscribed" => true]);
        }

        Subscription::create([
            "subscriber_id" => $subscriberId,
            "subscribed_to_id" => $subscribedToId
        ]);

        $user2 = User::find($subscribedToId);
        $user2->increment('subscribers');
        $user2->save();

        return response()->json(['success' => true, "subscriber" => $subscriberId, "subscribedTo" => $subscribedToId, "subscribed" => false]);
    }

    public function unsubscribe(Request $request)
    {
        $user = $request->user();
        $subscriberId = $user->id;
        $subscribedToId = $request->input('id', $user->id);

        $subscription = Subscription::where('subscriber_id', $subscriberId)
            ->where('subscribed_to_id', $subscribedToId)
            ->first();

        if ($subscription) {
            $subscription->delete();

            $user2 = User::find($subscribedToId);
            $user2->decrement('subscribers');
            $user2->save();

            return response()->json(['success' => true, 'subscribed' => false]);
        }

        return response()->json(['success' => false]);
    }

    public function checkSubscription(Request $request)
    {
        $user = $request->user();
        $subscriberId = $user->id;
        $subscribedToId = $request->input('id', $user->id);

        $subscriptionExists = Subscription::where('subscriber_id', $subscriberId)
            ->where('subscribed_to_id', $subscribedToId)
            ->exists();

        return response()->json([
            'success' => true,
            'subscribed' => $subscriptionExists
        ]);
    }


    public function getBloggers() {
        $bloggers = User::where('user_type', 'Blogger')
        ->where('trending', true)
        ->get();
        return response()->json($bloggers, 200);
    }

    public function isLogedIn(Request $request)
    {
        $user = $request->user();
        if($user)
        {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false]);
    }
}
