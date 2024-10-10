<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Models\UserCommentLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{

    public function getComment(){
        $comments = Comment::with('user')->get();
        return response()->json($comments, 200);
    }

    public function getCommentById($id){
        $comment = Comment::with('user')->find($id);
        if (is_null($comment)) {
            return response()->json(['message' => "Comment Not Found"], 404);
        }
        return response()->json($comment, 200);
    }

    public function addComment(Request $request, User $user){
        $user = $request->user();
        $userId = $user->id;

        $postSlug = $request->input('post_slug');
        $post = Post::where('slug', $postSlug)->first();
        if (!$post) {
            return response()->json(['message' => 'Post Not Found'], 404);
        }

        $comment = new Comment();
        $comment->content = $request->input('content');
        $comment->post_id = $post->id;
        $comment->user_id = $userId;

        $comment->save();

        return response()->json(['message' => 'Commented successfully']);
    }

    public function updateComment(Request $request, $id){
        $comment = Comments::find($id);
        if(is_null($comment)){
            return response()-> json(['message'=> 'Comment Not Found'], 404);
        }
        $comment->update($request->all());
        return response($comment, 200);
    }

    public function deleteComment(Request $request, $id){
        $comment = Comment::find($id);

        if (is_null($comment)) {
            return response()->json(['message' => 'Comment Not Found'], 404);
        }

        $post = Post::find($comment->post_id);
        if ($post) {
            $post->commentsCounter = max(0, $post->commentsCounter - 1);
            $post->save();
        }

        $comment->delete();
        return response()->json(['success' => true], 200);
    }

    public function getCommentsByPost(Request $request, $slug) //:::::::::::::::::::::::::
    {
        $user = $request->user();
        $userId = $user->id;
        /*
        $orderBy = $request->query('prder_by', 'created_at');

        if(is_null($postSlug)){
            return response()->json(['message'=> 'Post slug required'], 400);
        }

        $post = Post::where('slug', $postSlug)->first();
        if (!$post) {
            return response()->json(['message' => 'Post Not Found'], 404);
        }
*/      $post = Post::where('slug', $slug)->first();
        $comments = Comment::with('user')
                            ->where('post_id', $post->id)
                            ->get();

        $commentsIds = $comments->pluck('id');

        $likedCommentIds = UserCommentLike::where('user_id', $userId)
                            ->whereIn('comment_id', $commentsIds)
                            ->pluck('comment_id');


        $comments->each(function ($comment) use ($likedCommentIds) {
        $comment->liked = $likedCommentIds->contains($comment->id);
        });


        return response()->json($comments, 200);
    }

    public function getCommentsByPostUnloged(Request $request)
    {
        $postSlug = $request->query('post_slug');
        $orderBy = $request->query('prder_by', 'created_at');

        if(is_null($postSlug)){
            return response()->json(['message'=> 'Post slug required'], 400);
        }

        $post = Post::where('slug', $postSlug)->first();
        if (!$post) {
            return response()->json(['message' => 'Post Not Found'], 404);
        }

        $comments = Comment::with('user')
                            ->where('post_id', $post->id)
                            ->orderByDesc($orderBy)
                            ->get();

        return response()->json($comments, 200);
    }

    public function getCommentsCounter($slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        return response()->json($post->commentsCounter);
    }

    public function likeComment(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $userCommentLikes = UserCommentLike::where('user_id', $userId)->where('comment_id', $id)->get();

        if($userCommentLikes->isNotEmpty())
        {
            return response()->json(['success' => true, 'liked' => true, 'message' => "Comment is already liked!"], 200);
        }

        UserCommentLike::create([
            "user_id" => $userId,
            "comment_id" => $id
        ]);

        $comment = Comment::find($id);
        if ($comment) {
            $comment->likes = max(0, $comment->likes + 1);
            $comment->save();
        }

        return response()->json(['success' => true], 200);
    }

    public function unlikeComment(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $likedComment = UserCommentLike::where('user_id', $userId)->where('comment_id', $id)->first();
        $likedComment->delete();
        return response()->json(['success' => true], 200);
    }



}
