<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Fetch all categoriey names
     
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Show the form for creating a new category.
     */
    
    public function create()
    {
        return response()->json(["message" => "Form for creating a new category"]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {

        // //Validate the incoming request
        $request->validate([
            "name" => "required|string|max:255",
            "description" => "nullable|string",
            "slug" => "required|string|max:255|unique:categories,slug",
            "image" => 'required|string|max:255'
        ]);

        //Create the category

        $category = Category::create($request->all());

        return response()->json($category, 201);
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category)
    {
        return response()->json($category);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, Category $category)
    {
        //Validate the incoming req
        $request->validate([
            "name" => "required|string|max:255",
            "description" => "nullable|string",
            "slug" => "required|string|max:255|unique:categories,slug" . $category->id,
        ]);

        //Update the category
        $category->update($request->all());

        return response()->json($category);
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category)
    {

        //delete the category
        $category->delete();
        return response()->json(null, 200);
    }
}
