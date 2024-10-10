<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Categories\CategoryController;
use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\PostViewsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPostInteractionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Types\Relations\Role;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\LikesController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\Posts\SuggestionController;
use App\Http\Controllers\Posts\TimeController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\UpgradeRequestController;
use App\Http\Controllers\ViewsController;
use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user/{id}', [UserController::class, 'getUserById']);
Route::get('/user/{id}/unLogged', [UserController::class, 'getUserByIdUnlogged']);

Route::get('/users', [UserController::class, 'getUsers']);

Route::post('/register', [UserController::class, "register"]);

Route::middleware('auth:sanctum')->post('/update-info', [UserController::class, "updateInfo"]); //

Route::middleware('auth:sanctum')->post('/delete', [UserController::class, "deleteUser"]);

Route::middleware('auth:sanctum')->post('/subscribe', [UserController::class, "subscribe"]);
Route::middleware('auth:sanctum')->post('/unsubscribe', [UserController::class, "unsubscribe"]);
Route::middleware('auth:sanctum')->post('/check-subscription', [UserController::class, "checkSubscription"]);


Route::get('/bloggers', [UserController::class, 'getBloggers']);

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/isLoggedIn', [UserController::class, 'isLogedIn']);

Route::get('/getAll', [UserController::class, 'getUsers']);

// // Forgot Password
 Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email.api');

// //Reset Password
 Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name('password.reset.api');


Route::apiResource('categories', CategoryController::class);

// Comment
Route::get('/comments', [CommentsController::class, 'getComment']);
Route::get('/comments/{id}', [CommentsController::class, 'getCommentById']);

//...................
Route::middleware('auth:sanctum')->post('/add_comment', [CommentsController::class, 'addComment']);
Route::get('/update_comment/{id}', [CommentsController::class, 'updateComment']);
Route::middleware('auth:sanctum')->post('/delete_comment/{id}', [CommentsController::class, 'deleteComment']);
Route::middleware('auth:sanctum')->post('/like_comment/{id}', [CommentsController::class, 'likeComment']);
Route::middleware('auth:sanctum')->post('/unlike_comment/{id}', [CommentsController::class, 'unlikeComment']);

// Get comments by post ID and order by date
Route::middleware('auth:sanctum')->get('/comments_by_post/{slug}', [CommentsController::class, 'getCommentsByPost']);
Route::get('/comments_by_post', [CommentsController::class, 'getCommentsByPostUnloged']);

// Post Views

//API route posts
Route::middleware('auth:sanctum')->apiResource('posts', PostController::class);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/popular', [PostController::class, 'mostPopular']);


Route::middleware('auth:sanctum')->get('/usersPosts', [PostController::class, 'usersPosts']);
Route::middleware('auth:sanctum')->get('/usersSavedPosts', [PostController::class, 'getUsersSavedPosts']);
Route::get('/specificUsersPosts/{id}', [PostController::class, 'specificUsersPosts']);

Route::get('/posts/{slug}', [PostController::class, 'show']);
Route::middleware('auth:sanctum')->post('/upload-post-image', [PostController::class, 'uploadPostImage']);
Route::middleware('auth:sanctum')->get('/userSugestedPosts', [SuggestionController::class, 'getSuggestedPoastsBasedOnSubscription']);
Route::middleware('auth:sanctum')->get('/userSugestedPostsSaved', [SuggestionController::class, 'master']);

//Post Views
Route::get('/post_views', [PostViewsController::class, 'getPostViews']);
Route::get('/post_views/{id}', [PostViewsController::class, 'getPostViewsBtId']);
Route::post('/add_post_views', [PostViewsController::class, 'addPostViews']);
Route::put('/update_post_views/{id}', [PostViewsController::class, 'updatePostViews']);
Route::delete('/delete_post_views/{id}', [PostViewsController::class, 'deletePostViews']);

Route::put('/posts/{slug}/increment-views', [ViewsController::class, 'incrementViews']);
Route::put('/posts/{slug}/increment-comments', [ViewsController::class, 'incrementCommentsCounter']);
Route::put('/posts/{slug}/likes', [ViewsController::class, 'incrementLike']);
Route::put('/posts/{slug}/unlike', [ViewsController::class, 'decrementLike']);


Route::middleware('auth:sanctum')->post('/posts/{slug}/likesLock', [LikesController::class, 'userLiked']);
Route::middleware('auth:sanctum')->post('/posts/{slug}/likesUnLock', [LikesController::class, 'userUnLiked']);
Route::middleware('auth:sanctum')->get('/posts/{slug}/likesCheck', [LikesController::class, 'checkeLiked']);

Route::middleware('auth:sanctum')->post('/posts/{slug}/save', [PostController::class, 'savePost']);
Route::middleware('auth:sanctum')->post('/posts/{slug}/unsave', [PostController::class, 'userUnsavePost']);
Route::middleware('auth:sanctum')->get('/posts/{slug}/checksave', [PostController::class, 'checkSaved']);

// Sort post views
Route::get('/sorted_post_views', [PostViewsController::class, 'getSortedPostViews']);
// Get post views by post ID
Route::get('/post_views_by_post/{postId}', [PostViewsController::class, 'getPostViewsByPostId']);
// Get post views by user ID
Route::get('/post_views_by_user/{userId}', [PostViewsController::class, 'getPostViewsByUserId']);
// Get top 10 posts
Route::get('/top_posts', [PostViewsController::class, 'getTopPosts']);

// UserPostInteraction
Route::get('/user_post_interaction', [UserPostInteractionsController::class, 'getUserPostInteraction']);
Route::get('/user_post_interaction/{id}', [UserPostInteractionsController::class, 'getUserPostInteractionById']);
Route::post('/add_user_post_interaction', [UserPostInteractionsController::class, 'addUserPostInteraction']);
Route::put('/update_user_post_interaction/{id}', [UserPostInteractionsController::class, 'updateUserPostInteraction']);
Route::delete('/delete_user_post_interaction/{id}', [UserPostInteractionsController::class, 'deleteUserPostInteraction']);

Route::get('/posts/{slug}', [PostController::class, 'show']);

//User Reader to Blogger verification
Route::middleware('auth:sanctum')->put('/user/upgradeRequest', [UpgradeRequestController::class, 'sendUpgradeRequest']);
Route::put('/user/upgradeConfirmation/{id}', [UpgradeRequestController::class, 'upgradeUser']);

//Statistics
Route::get('/statistics/newcommers', [StatisticsController::class, 'getMonthlyNewcommers']);
Route::get('/statistics/userGrowth', [StatisticsController::class, 'getUserGrowth']);
Route::get('/statistics/viewsMonth', [StatisticsController::class, 'getViewsThisMonth']);
Route::get('/statistics/demographics', [StatisticsController::class, 'getDemographics']);
Route::get('/statistics/readingTime', [StatisticsController::class, 'getAvgReadingTime']);
Route::get('/statistics/ageGroups', [StatisticsController::class, 'getAgeGroups']);
Route::get('/statistics/mostfollowed', [StatisticsController::class, 'getMostSubscribedUsers']);

Route::get('/statistics/users-count-by-month', [StatisticsController::class, 'getUsersCountByMonth']);
//PostTime
Route::middleware('auth:sanctum')->put('/post/recordedTime', [TimeController::class, 'storeReadingTime']);

Route::get('/posts/{slug}/comments-counter', [PostController::class, 'getCommentsCounter']);

Route::middleware('auth:sanctum')->post('/message', [MessagesController::class, 'sendMessage']);
Route::middleware('auth:sanctum')->get('/returnMessages', [MessagesController::class, 'getMessages']);
