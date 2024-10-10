<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class UserPostLike extends Model
{
    use HasFactory;

    protected $table = 'user_post_likes';

    protected $fillable = ['user_id', 'post_slug'];
}
