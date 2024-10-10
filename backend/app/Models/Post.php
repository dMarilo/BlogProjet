<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    public $table = "posts";

    protected $fillable = [
        "title",
        "shortDescription",
        "content",
        "slug",
        "image",
        "user_id",
        "views",
        "likes",
        "commentsCounter",
        "likes"

    ];

    protected $dates = [
        "created_at",
        "updated_at"
    ];



    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function categories() {

        return $this->belongsToMany(Category::class, "categories_pivot", "post_id", "category_id");
    }

    public function interactions()
    {
        return $this->hasMany(UserPostInteractions::class, "post_id");
    }

    public function Sluggable():array
    {
        return [
            'slug' =>[
                'source' => 'title'
            ]
        ];
    }

}
