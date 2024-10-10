<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Post;
use Carbon\Carbon;
use App\Models\User;
use App\Models\UserPostLike;

class ViewsController extends Controller
{
    protected $user_id;
    protected $post_slug;
    public function incrementViews($slug)
    {
        $post = Post::where('slug', $slug)->first();

        if ($post) {
            $userId = $post->user_id;
            $post->increment('views');
            $views = $post->views;
            $createdAt = $post->created_at;
            $isPopular = true;
            $isSet = true;
            $likes = $post->likes;
            //This can also be modified

            $oneWeekAgo = Carbon::now()->subWeek();
            $today = Carbon::now()->addDay();

            $posts = Post::where('user_id', $userId)
            ->where('views', '<', 10)
            ->whereBetween('created_at', [$oneWeekAgo, $today])
            ->get();

            if ($posts->isNotEmpty()) {
                $isPopular = false;
            }
            else
            {
                $user = User::where('id', $userId)->first();
                $trending = $user->trending;
                if(!$trending)
                {
                    $isSet = false;
                    $user->trending = true;
                    $user->save();
                }
            }

            $isOneWeekOld = Carbon::parse($createdAt)->lessThanOrEqualTo($oneWeekAgo);
            //Can be changed based on preferences later
            $isHot = ($views > 10 && !$isOneWeekOld);
            return response()->json([
                'success' => true,
                'is_hot' => $isHot,
                'views' => $views,
                'isSet' => $isSet,
                'popular' => $isPopular,
                'likes' => $likes
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Post not found'], 404);
    }

    public function incrementCommentsCounter($slug)
    {
        $post = Post::where('slug', $slug)->first();

        if ($post) {
            $post->increment('commentsCounter');
            return response()->json(['success' => true, 'views' => $post->views]);
        }

        return response()->json(['success' => false, 'message' => 'Post not found'], 404);
    }

    public function incrementLike($slug, Request $request)
    {
        $post = Post::where('slug', $slug)->first();

        if ($post) {
            $post->increment('likes');
            return response()->json(['success' => true, 'views' => $post->views]);
        }

        return response()->json(['success' => false, 'message' => 'Post not found'], 404);
    }

    public function decrementLike($slug, Request $request)
    {
        $post = Post::where('slug', $slug)->first();
        if($post) {
            $post->decrement('likes');
            return response()->json(['success' => true, 'views' => $post->views]);
        }
        return response()->json(['success' => false, 'message' => 'Post not found'], 404);
    }
}
