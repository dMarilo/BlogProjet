import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './auth/components/login/login.component';
import { UserLoginComponent } from './auth/components/user-login/user-login.component';
import { UserRegistrationComponent } from './auth/components/user-registration/user-registration.component';
import { RequestResetPasswordComponent } from './auth/components/request-reset-password/request-reset-password.component';
import { PasswordResetComponent } from './auth/components/password-reset/password-reset.component';
import { EmailConfirmationComponent } from './auth/components/email-confirmation/email-confirmation.component';
import { CountdownComponent } from './auth/countdown/countdown.component';
import { NewPostComponent } from './post/components/new-post/new-post.component';
import { RegistrationSuccessComponent } from './auth/components/registration-success/registration-success.component';
import { LoginNoVerificationComponent } from './auth/components/login-no-verification/login-no-verification.component';
import { ProfileUpdateComponent } from './auth/components/user-profile/profile-update/profile-update.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminBlogsComponent } from './admin/admin-blogs/admin-blogs.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { UserProfileComponent } from './auth/components/user-profile/user-profile.component';
import { ProfileInfoComponent } from './auth/components/user-profile/profile-info/profile-info.component';
import { PostPreviewComponent } from './shared/components/post-preview/post-preview.component';
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { DemgraphyComponent } from './admin/statistics/demgraphy/demgraphy.component';
import { AuthGuard } from './auth.guard';
import { AgeGroupsComponent } from './admin/statistics/age-groups/age-groups.component';
import { UsersChartComponent } from './admin/statistics/users-chart/users-chart.component';
import { GrowthDataComponent } from './admin/statistics/growth-data/growth-data.component';
import { ProfileViewComponent } from './auth/components/profile-view/profile-view.component';
import { MessageboxComponent } from './messagebox/messagebox.component';
import { LeaderboardFollowersComponent } from './admin/statistics/leaderboard-followers/leaderboard-followers.component';
import { SavedPostsComponent } from './auth/components/user-profile/saved-posts/saved-posts.component';
import { BlogsComponent } from './blogs/blogs.component';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';



const routes: Routes = [
  {
    path: 'post-preview/:slug', component: PostPreviewComponent
  },
  {
    path:"new-post", component: NewPostComponent, canMatch: [AuthGuard]
  },
  {
    path:"", component: HomePageComponent
  },
  {
    path:'',
    component:LoginComponent,
    children: [
      {path: "login", component: UserLoginComponent},
      {path: "register", component: UserRegistrationComponent},
      {path: "reset-password-request", component: RequestResetPasswordComponent},
      {path: "reset-password", component: PasswordResetComponent},
    ]
  },
  {
    path: "confirmation",
    component: EmailConfirmationComponent
  },
  {

    path: "profile",
    component: UserProfileComponent,
    children: [
     {path: '', component: ProfileInfoComponent},
     {path: 'edit', component: ProfileUpdateComponent},
     {path: 'saved', component: SavedPostsComponent},
     {path: 'messages', component:MessageboxComponent},
    ]
  },
  {
    path: "registration-success", component: RegistrationSuccessComponent
  },
  { path: 'login-no-verification', component: LoginNoVerificationComponent },
  { path: 'profile-view/:id', component:ProfileViewComponent},
  {
    path: "countdown",
    component: CountdownComponent
  },
  { path: 'deletingAccount', component: DeleteProfileComponent},
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: AdminDashboardComponent},
      {path: 'blogs', component: AdminBlogsComponent },
      {path: 'users', component: AdminUsersComponent },
      {path: 'categories', component: AdminCategoriesComponent },
      {path: 'settings', component: AdminSettingsComponent },
      {path: 'statistics', component: StatisticsComponent},
      {path: 'demography', component: DemgraphyComponent},
      {path: 'ageGroups', component: AgeGroupsComponent},
      {path: 'chebang', component: UsersChartComponent},
      {path: 'datagrowth', component: GrowthDataComponent},
      {path: 'followLeaderBoard', component: LeaderboardFollowersComponent}

    ]
  },
  {
    path: "blogs",
    component: BlogsComponent
  },
  {
    path: '**', redirectTo: ""
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
