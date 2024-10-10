<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedPosts extends Model
{
    use HasFactory;
    protected $table = 'saved_posts';

    // Specify the fillable attributes
    protected $fillable = ['user_id', 'post_slug'];
}
