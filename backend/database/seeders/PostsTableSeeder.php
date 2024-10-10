<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\UserPostInteractions;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $user = User::create([
            'firstName' => 'zarko',
            'lastName' => 'zarkovic',
            'email' => 'zarko@example.com',
            'password' => bcrypt('password'), // Use a hashed password
        ]);

        $post = Post::create([
            'title' => 'Singulartiy Company Blog',
            'shortDescription' => 'This is a short description.',
            'content' => 'This is the content of the post.',
            'slug' => 'sample-post-blog-post-zarko',
            'image' => 'image-url',
            "user_id" => $user->id,
        ]);

        UserPostInteractions::create([
            "post_id" => $post->id,
            "user_id" => $user->id,
            "rating" => 1, 
            "liked" => 5,
            "favorite" => 2
        ]);
    }
}
