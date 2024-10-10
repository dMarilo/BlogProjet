<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Post;

class Comments extends Model
{
    use HasFactory;

    protected $table = 'comments';

    protected $dates = [
        "created_at",
        "updated_at"
    ];

    protected $fillable = [
        'post_id',
        'user_id',
        'content'
    ];

    public function post(){
        return $this->belongsTo(Post::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }


}
