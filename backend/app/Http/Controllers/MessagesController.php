<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;
use Carbon\Carbon;

class MessagesController extends Controller
{
    public function sendMessage(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;
        $name = $user->first_name;
        $message = $name . ' ' . "has just uploaded a new post! GO check it out!";
        $subscribers = Subscription::where('subscribed_to_id', $userId)
        ->pluck('subscriber_id');

        $zbir = 0;

        foreach($subscribers as $Subscriber)
        {
            $zbir += $Subscriber;

            Message::create([
            'user_id' => $Subscriber,
            'content' => $message
            ]);

        }

        return response()->json(['success' => true, "subscribers" => $subscribers, "message" => $message]);
    }

    public function getMessages(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;
        $messages = Message::where('user_id', $userId)->get();
        foreach ($messages as $message) {
            $message->time_passed = $this->calculateTimePassed($message->created_at);
        }

        return response()->json($messages);
    }

    public function calculateTimePassed($timestamp)
    {
        $now = Carbon::now();
        $past = Carbon::parse($timestamp);
        $difference = $past->diffInMinutes($now);

        if ($difference < 60) {
            return $difference . ' minutes ago';
        } elseif ($difference < 1440) {
            return round($difference / 60) . ' hours ago';
        } elseif ($difference < 10080) {
            return round($difference / 1440) . ' days ago';
        } else {
            return round($difference / 10080) . ' weeks ago';
        }
    }
}
