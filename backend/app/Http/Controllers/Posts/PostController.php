<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\SavedPosts;
use App\Http\Controllers\MessagesController;
use App\Models\UserPostInteractions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request)
    {
        $query = Post::query();

        $query->with(['users', 'categories'])
              ->withCount([
                  "interactions as likes_count" => function ($query) {
                      $query->where("liked", 1);
                  },
                  "interactions as favorite_count" => function ($query) {
                      $query->where("favorite", 1);
                  }
              ])
              ->withAvg("interactions", "rating");



        if ($request->has('slug')) {
            $query->where('slug', $request->input('slug'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->has('id')) {
            $query->where("id", $request->input("id"));
        }

        if ($request->has("search")) {
            $search = $request->input("search");
            $query->where(function ($q) use ($search) {
                $q->where("title", "like", "%$search%")
                  ->orWhere("content", "like", "%$search%");
            });
        }

        // Filter by a single category
        if ($request->has('category_id')) {
            $categoryId = $request->input('category_id');
            $query->whereRelation('categories', 'id', $categoryId);
        }

        // Filter by multiple categories
        if ($request->has('category_ids')) {
            $categoryIds = $request->input('category_ids');
            if (is_array($categoryIds)) {
                $query->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.id', $categoryIds);
                });
            }
        }


        if ($request->has('limit')) {
            $limit = $request->input('limit');
            $query->limit($limit);
        }

        $orderDirection = $request->input('sort_order', 'desc');
        if ($request->has("sort_by")) {
            $query->orderBy($request->input("sort_by"), $orderDirection);
        } else {
            $query->orderBy("id", $orderDirection);
        }

        $posts = $query->get();

        return response()->json($posts);
    }

    public function mostPopular(Request $request)
    {
        $query = Post::query();


        $query->withCount([
            'interactions as likes_count' => function ($query) {
                $query->where('liked', 1);
            },
        ]);

        $orderBy = $request->input('order_by', 'likes_count');
        $orderDirection = $request->input('sort_order', 'desc');

        $query->orderBy($orderBy, $orderDirection);

        $limit = $request->input('limit', 10);
        $posts = $query->limit($limit)->get();

        return response()->json($posts);
    }

    public function usersPosts(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $posts = Post::where('user_id', $userId)->get();
        if($posts->isNotEmpty())
        {
            return response()->json(["success" => true, "posts" => $posts]);
        }

        return response()->json(["success" => false]);
    }

    public function specificUsersPosts($id)
    {
        $posts = Post::where('user_id', $id)->get();
        return response()->json($posts);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(["message" => "Form for creating a new posts"]);
    }

    /**
     * Store a newly created posts in storage.
     */
    public function store(Request $request)
    {

        $user = $request->user();
        $userId = $user->id;


        $request->validate([
            "title" => "required|string|max:255",
            "shortDescription" => "required|string",
            "content" => "required|string",
            "slug" => "required|string",
            'image' => 'nullable|string', //
            'categoryIds' => 'array',
            'categoryIds.*' => 'exists:categories,id'
        ]);

        $data = $request->only(['title', 'shortDescription', 'content', 'slug', 'image']);

        $post = new Post($data);
        $post->user_id = $userId;
        $post->save();

        if ($request->has('categoryIds')) {
            $post->categories()->attach($request->input('categoryIds'));
        }
        return response()->json($post, 201);
    }

    public function uploadPostImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image'
        ]);

        if($request->hasFile('image')) {
            $path = $request->file('image')->store('post_images', 'public');
            return response()->json(['path' => $path], 200);
        }

        return response()->json(['message' => 'no image uploaded'], 400);

    }

    public function uploadImageUrl(Request $request)
    {
        $request->validate([
            'image' => 'required|string'
        ]);
    }


    /**
     * Display the specified posts.
     */
    public function show(Post $post)
    {
        return response()->json($post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return response()->json($post);
    }

    /**
     * Update the specified posts in storage.
     */
    public function update(Request $request, Post $post)
    {
    $request->validate([
        "title" => "required|string|max:255",
        "shortDescription" => "required|string",
        "content" => "required|string",
        "image" => "required|string",
        "user_id" => "required|exists:users,id",
    ]);

    // Update the post
    $post->update($request->all());
    return response()->json($post);
    }


    /**
     * Remove the specified posts from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(null, 204);
    }

    protected $user_id;
    protected $post_slug;
    protected $saved = false;
    public function savePost(Request $request, $slug)
    {
        $user = $request->user();
        $this->user_id = $user->id;
        $this->post_slug = $slug;
        SavedPosts::create([
            'user_id' => $this->user_id,
            'post_slug' => $this->post_slug
        ]);
        return response()->json([
            'success' => true,
            'id' => $this->user_id,
            'slug' => $this->post_slug,
        ]);
    }
    public function userUnsavePost(Request $request, $slug)
    {
        $user = $request->user();
        $this->user_id = $user->id;
        $this->post_slug = $slug;
        $saved = SavedPosts::where('user_id', $this->user_id)
            ->where('post_slug', $this->post_slug)
            ->first();
        if($saved)
        {
            $saved->delete();
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

    public function checkSaved(Request $request, $slug)
    {
        $user = $request->user();
        $this->user_id = $user->id;
        $this->post_slug = $slug;

        $posts = SavedPosts::where('user_id', $this->user_id)
        ->where('post_slug', $this->post_slug)
        ->get();

        if ($posts->isNotEmpty()) {
            $this->saved = true;
        }
        return response()->json([
            'success' => true,
            'saved' =>  $this->saved,
            'id' => $this->user_id,
            'slug' => $this->post_slug,
        ]);
    }

    public function getUsersSavedPosts(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $postSlugs = SavedPosts::where('user_id', $userId)->pluck('post_slug');
        $savedPosts = Post::whereIn('slug', $postSlugs)->get();
        $usersIDs = $savedPosts->pluck('user_id')->toArray();
        $uniqueUsers = array_unique($usersIDs);
        $users = User::whereIn('id', $uniqueUsers)->get();
        $userLookup = [];
        foreach ($users as $user) {
            $userLookup[$user->id] = $user;
        }

        foreach ($savedPosts as $post) {
            if (isset($userLookup[$post->user_id])) {
                $post->user = $userLookup[$post->user_id];
            } else {
                $post->user = null;
            }
        }

        return response()->json([
            'success' => true,
            'posts' => $savedPosts
        ]);
    }

}
