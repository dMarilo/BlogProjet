<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Post;


class PostViews extends Model
{
    use HasFactory;

    protected $table = 'post_views';

    protected $dates = [
        "created_at",
        "updated_at"
    ];

    protected $fillable = [
        'post_id',
        'views',
        'user_id'
    ];

    public function post(){
        return $this->belongsTo(Post::class);
    }

}
