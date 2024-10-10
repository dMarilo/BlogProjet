<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCommentLike extends Model
{
    use HasFactory;

    protected $table = 'user_comment_like';

    protected $fillable = ['user_id', 'comment_id'];
}
