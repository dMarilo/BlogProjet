<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Path to the JSON file
        $jsonFile = Storage::path('users.json');

        // Read and decode the JSON file
        $data = json_decode(file_get_contents($jsonFile), true);

        // Iterate over each user record and insert it into the database
        foreach ($data as $user) {
            DB::table('users')->insert([
                'id' => null,
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'email_verified_at' => '2024-08-22 09:26:49',
                'password' => '$2y$12$I08Pb7vpPwTwtnOCWaReVupy5ZXWblS7zNgbd9JHn.XGXh7izo5lu',
                'verification_token' => null,
                'about' => null,
                'profile_pic' => null,
                'user_type' => 'Reader',
                'birth' => $user['birth'],
                'gender' => $user['gender'],
                'remember_token' => null,
                'created_at' => $user['created_at'],
                'updated_at' => $user['updated_at'],
                'deleted_at' => null,
                'country' => null,
                'trending' => '0',
                'avg_reading_time' => $user['avg_reading_time'],
            ]);
        }
    }
}
