<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_post_interaction', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger("post_id");
            $table->unsignedBigInteger("user_id");

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');

            $table->tinyInteger('favorite')->nullable()->default(0);
            $table->tinyInteger('liked')->nullable()->default(0);
            $table->decimal('rating')->nullable()->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_post_interaction');
    }
};
