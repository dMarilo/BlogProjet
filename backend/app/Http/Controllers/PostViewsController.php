<?php

namespace App\Http\Controllers;

use App\Models\PostViews;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostViewsController extends Controller
{
    public function getPostViews(){
        return response()->json(PostViews::all(), 200);
    }

    public function getPostViewsBtId($id){
        $post_views = PostViews::find($id);
        if(is_null($post_views)){
            return  response()->json(['message' => "Post View Not Found"], 404);
        }

        return response()->json($post_views::find($id), 200);
    }

    public function addPostViews(Request $request){
        $post_views = PostViews::create($request->all());
        return response($post_views, 201);
    }

    public function updatePostViews(Request $request, $id){
        $post_views = PostViews::find($id);
        if(is_null($post_views)){
            return response()-> json(['message'=> 'Comment Not Found'], 404);
        }
        $post_views->update($request->all());
        return response($post_views, 200);
    }

    public function deletePostViews(Request $request, $id){
        $post_views = PostViews::find($id);
        if(is_null($post_views)){
            return response()-> json(['message'=> 'Comment Not Found'], 404);
        }
        $post_views->delete();
        return response()->json(null, 204);
    }

    public function getSortedPostViews(Request $request){
        $orderBy = $request->query('order_by', 'created_at'); 
        $post_views = PostViews::orderByDesc($orderBy)->get();
        return response()->json($post_views, 200);
    }

    public function getPostViewsByPostId($postId){
        $post_views = PostViews::where('post_id', $postId)->get();
        
        if ($post_views->isEmpty()) {
            return response()->json(['message' => "No Post Views Found for Post ID $postId"], 404);
        }
    
        return response()->json($post_views, 200);
    }

    public function getPostViewsByUserId($userId){
        $post_views = PostViews::where('user_id', $userId)->get();

        if ($post_views->isEmpty()) {
            return response()->json(['message' => "No Post Views Found for User ID $userId"], 404);
        }

        return response()->json($post_views, 200);
    }

    public function getTopPosts(){
        $topPosts = PostViews::with('post')->orderByDesc('views')
                              ->take(10)
                              ->get();

        return response()->json($topPosts, 200);
    }
    
}
