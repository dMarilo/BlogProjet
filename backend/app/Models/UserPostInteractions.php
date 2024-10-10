<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Post;

class UserPostInteractions extends Model
{
    use HasFactory;

    protected $table = 'user_post_interaction';

    
    protected $fillable = [
        'post_id',
        'user_id',
        'favorite',
        "rating",
        'liked'
    ];


    protected $dates = [
        "created_at",
        "updated_at"
    ];

    public function user() {
        return $this->belongsTo(User::class, "user_id");
    }

    public function posts(){
        return $this->belongsTo(Post::class, "post_id");
    }
}
