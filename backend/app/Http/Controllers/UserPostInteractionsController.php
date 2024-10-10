<?php

namespace App\Http\Controllers;

use App\Models\UserPostInteractions;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserPostInteractionsController extends Controller
{

    

    public function getUserPostInteraction(Request $request)
    {

       $query = UserPostInteractions::query();

       //filters

       if($request->has("most_liked")) {
        $query->orderBy("liked", "desc");
       }
       if($request->has("most_ratings")) {
        $query->orderBy("rating", "desc");
       }
       if($request->has("favorite")){
        $query->select("post_id", DB::raw("COUNT(*) as favorite_count"))->where("favorite", 1)->groupBy("post_id")->orderBy("favorite_count", "desc")->join("posts", "user_post_interactions.post_id", "=", "post.id");
       }
       
        $userPostInteractions = $query->get();
        return response()->json($userPostInteractions, 200);

    }

    public function getUserPostInteractionById($id){

        $post_view_interaction = UserPostInteractions::find($id);
        if(is_null($post_view_interaction)){
            return  response()->json(['message' => "Post View Not Found"], 404);
        }

        return response()->json($post_view_interaction, 200);

    }

    public function addUserPostInteraction(Request $request){
        $post_view_interaction = UserPostInteractions::create($request->all());

        return response($post_view_interaction, 201);

    }


    public function updateUserPostInteraction(Request $request, $id){

        $post_view_interaction = UserPostInteractions::find($id);
        if(is_null($post_view_interaction)){
            return response()->json(['message' => 'Interaction Not Found'], 404);
        }
        $post_view_interaction -> update($request->all());

        return response($post_view_interaction, 200);

    }

    public function deleteUserPostInteraction($id){

        $post_view_interaction = UserPostInteractions::find($id);
        if(is_null($post_view_interaction)){
            return response()->json(['message'=>'Interaction Not Found', 404]);
        }

        $post_view_interaction -> delete();
        return response()->json(null, 204);

    }
}
