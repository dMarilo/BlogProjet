<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\UserPostLike;

class LikesController extends Controller
{
    protected $user_id;
    protected $post_slug;
    protected $liked = false;
    public function userLiked(Request $request, $slug)
    {
        $user = $request->user();
        $this->user_id = $user->id;
        $this->post_slug = $slug;
        UserPostLike::create([
            'user_id' => $this->user_id,
            'post_slug' => $this->post_slug
        ]);
        return response()->json([
            'success' => true,
            'id' => $this->user_id,
            'slug' => $this->post_slug,
        ]);
    }
    public function userUnLiked(Request $request, $slug)
    {
        $user = $request->user();
        $this->user_id = $user->id;
        $this->post_slug = $slug;
        $like = UserPostLike::where('user_id', $this->user_id)
            ->where('post_slug', $this->post_slug)
            ->first();
        if($like)
        {
            $like->delete();
            return response()->json([
                'success' => true,
                'id' => $this->user_id,
                'slug' => $this->post_slug,
            ]);
        }
        return response()->json([
            'success' => false,
            'id' => $this->user_id,
            'slug' => $this->post_slug,
        ]);
    }

    public function checkeLiked(Request $request, $slug)
    {
        $user = $request->user();
        $this->user_id = $user->id;
        $this->post_slug = $slug;

        $posts = UserPostLike::where('user_id', $this->user_id)
        ->where('post_slug', $this->post_slug)
        ->get();

        if ($posts->isNotEmpty()) {
            $this->liked = true;
        }
        return response()->json([
            'success' => true,
            'liked' =>  $this->liked,
            'id' => $this->user_id,
            'slug' => $this->post_slug,
        ]);
    }
}
