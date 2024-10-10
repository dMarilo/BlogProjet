<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Post;
use App\Models\SavedPosts;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SuggestionController extends Controller
{
    public function getSuggestedPoastsBasedOnSubscription(Request $request){
        $user = $request->user();
        $userId = $user->id;

        $subscribedTo = Subscription::where('subscriber_id', $userId)->pluck('subscribed_to_id');

        $oneWeekAgo = Carbon::now()->subWeek();
        $postsOfFollowedUsers = Post::whereIn('user_id', $subscribedTo)->where('created_at', '>=', $oneWeekAgo)->get();

        $usersIDs = $postsOfFollowedUsers->pluck('user_id')->toArray();
        $uniqueUsers = array_unique($usersIDs);
        $users = User::whereIn('id', $uniqueUsers)->get();
        $userLookup = [];
        foreach ($users as $user) {
            $userLookup[$user->id] = $user;
        }
        foreach ($postsOfFollowedUsers as $post) {
            if (isset($userLookup[$post->user_id])) {
                $post->user = $userLookup[$post->user_id];
            } else {
                $post->user = null;
            }
        }
        return response()->json($postsOfFollowedUsers);
    }

    public function getSuggestedPoastsBasedOnSaved(Request $request){
        $user = $request->user();
        $userId = $user->id;

        $postSlugs = SavedPosts::where('user_id', $userId)->pluck('post_slug');

        $usersIDs = Post::whereIn('slug', $postSlugs)->pluck('user_id')->toArray();
        $oneWeekAgo = Carbon::now()->subWeek();
        $allPosts = Post::whereIn('user_id', $usersIDs)->whereNotIn('slug', $postSlugs)->where('created_at', '>=', $oneWeekAgo)->get();

        $uniqueUsers = array_unique($usersIDs);
        $users = User::whereIn('id', $uniqueUsers)->get();
        $userLookup = [];
        foreach ($users as $user) {
            $userLookup[$user->id] = $user;
        }

        foreach ($allPosts as $post) {
            if (isset($userLookup[$post->user_id])) {
                $post->user = $userLookup[$post->user_id];
            } else {
                $post->user = null;
            }
        }

        return response()->json([
            'success' => true,
            'posts' => $allPosts
        ]);
    }

    public function master(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;
        $oneWeekAgo = Carbon::now()->subWeek();

        $subscribedTo = Subscription::where('subscriber_id', $userId)->pluck('subscribed_to_id');

        $postSlugs = SavedPosts::where('user_id', $userId)->pluck('post_slug');
        $usersIDs2 = Post::whereIn('slug', $postSlugs)->pluck('user_id')->toArray();

        $postsOfFollowedUsers = Post::whereIn('user_id', $subscribedTo)->where('created_at', '>=', $oneWeekAgo)->get();
        $allPosts = Post::whereIn('user_id', $usersIDs2)->whereNotIn('slug', $postSlugs)->where('created_at', '>=', $oneWeekAgo)->get();

        $combinedPosts = $postsOfFollowedUsers->merge($allPosts);
        $uniquePosts = $combinedPosts->unique('id');

        $usersIDs1 = $postsOfFollowedUsers->pluck('user_id')->toArray();

        $uniqueUsers1 = array_unique($usersIDs1);
        $uniqueUsers2 = array_unique($usersIDs2);
        $users1 = User::whereIn('id', $uniqueUsers1)->get();
        $users2 = User::whereIn('id', $uniqueUsers2)->get();
        $users = $users1->merge($users2);

        $userLookup = [];
        foreach ($users as $user) {
            $userLookup[$user->id] = $user;
        }

        foreach ($uniquePosts as $post) {
            if (isset($userLookup[$post->user_id])) {
                $post->user = $userLookup[$post->user_id];
            } else {
                $post->user = null;
            }
        }

        return response()->json([
            'success' => true,
            'posts' => $uniquePosts
        ]);
    }
}
