<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AgeGroup;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Post;
use App\Models\Country;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    //Gets all the users that have joined the site since the start of the month
    public function getMonthlyNewcommers()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $userCount = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        return response()->json([
            'success' => true,
            'count' => $userCount,
            'startOfMonth' => $startOfMonth->toDateString(),
            'endOfMonth' => $endOfMonth->toDateString(),
        ]);
    }

    //Gets the percentage of new users in compairison to last week, last month, last quarter and last year
    public function getUserGrowth()
    {
        $now = Carbon::now();
        $right = Carbon::now();
        $now0 = Carbon::now();
        $startOfWeek = $now0->startOfWeek();
        $startOfLastWeek = $startOfWeek->copy()->subWeek();
        $now1 = Carbon::now();
        $startOfMonth = $now1->startOfMonth();
        $startOfLastMonth = $startOfMonth->copy()->subMonth();
        $now2 = Carbon::now();
        $startOfQuarter = $now2->startOfQuarter();
        $startOfLastQuarter = $startOfQuarter->copy()->subQuarter();
        $startOfYear = $now->startOfYear();
        $startOfLastYear = $startOfYear->copy()->subYear();

        $countWeek = User::whereBetween('created_at', [$startOfWeek, $right])->count();
        $countLastWeek = User::whereBetween('created_at', [$startOfLastWeek, $startOfWeek])->count();

        $countMonth = User::whereBetween('created_at', [$startOfMonth, $right])->count();
        $countLastMonth = User::whereBetween('created_at', [$startOfLastMonth, $startOfMonth])->count();

        $countQuarter = User::whereBetween('created_at', [$startOfQuarter, $right])->count();
        $countLastQuarter = User::whereBetween('created_at', [$startOfLastQuarter, $startOfQuarter])->count();

        $countYear = User::whereBetween('created_at', [$startOfYear, $right])->count();
        $countLastYear = User::whereBetween('created_at', [$startOfLastYear, $startOfYear])->count();

        $growthWeek = $this->calculateGrowth($countWeek, $countLastWeek);
        $growthMonth = $this->calculateGrowth($countMonth, $countLastMonth);
        $growthQuarter = $this->calculateGrowth($countQuarter, $countLastQuarter);
        $growthYear = $this->calculateGrowth($countYear, $countLastYear);


        return response()->json([
            'success' => true,
            'growthWeek' => $growthWeek,
            'growthMonth' => $growthMonth,
            'growthQuarter' => $growthQuarter,
            'growthYear' => $growthYear,
        ]);
    }
    private function calculateGrowth($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $previous) / $previous) * 100, 2);
    }

    //Gets how many total views have there been last month  ::::::: Optional=> add a percentage of increse for the number of views
    public function getViewsThisMonth()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $totalViews = Post::where('created_at', '>=', $startOfMonth)->sum('views');

        return response()->json([
            'success' => true,
            'totalViews' => $totalViews
        ]);
    }

    //Gets the demographics of our registered users
    public function getDemographics()
    {
        $countries = Country::orderBy('users_from', 'desc')->get(['country', 'users_from']);

        $countriesArray = $countries->mapWithKeys(function ($item) {
            return [$item->country => $item->users_from];
        });

        return response()->json([
            'success' => true,
            'countries' => $countriesArray,
        ]);
    }

    //Gets the average reading time of any blog post across all the users
    public function getAvgReadingTime()
    {
        $averageReadingTime = User::avg('avg_reading_time');

        return response()->json([
            'success' => true,
            'average_reading_time' => $averageReadingTime,
        ]);
    }


    public function getAgeGroups()
    {
        $ageGroups = AgeGroup::orderBy('number_of', 'desc')->get(['age_group', 'number_of']);

        $ageGroupsArray = $ageGroups->mapWithKeys(function ($item) {
            return [$item->age_group => $item->number_of];
        });

        return response()->json([
            'success' => true,
            'ageGroups' => $ageGroupsArray,
        ]);
    }

    public function getUsersCountByMonth()
    {
        $startOfYear = Carbon::now()->startOfYear();
        $userCounts = [];

        for ($i = 0; $i < 12; $i++) {
            $startOfMonth = $startOfYear->copy()->addMonths($i)->startOfMonth();
            $endOfMonth = $startOfYear->copy()->addMonths($i)->endOfMonth();
            $count = DB::table('users')
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->count();
            $userCounts[$startOfMonth->format('F')] = $count;
        }

        return response()->json($userCounts);
    }

    public function getMostSubscribedUsers()
    {
        $mostFollowed = User::where('subscribers', '>', 0)
                    ->orderBy('subscribers', 'desc')
                    ->take(10)
                    ->select('id', 'first_name', 'last_name', 'subscribers')
                    ->get();

        return response()->json([
            'success' => true,
            'mostFollowed' => $mostFollowed,
        ]);

    }

}
