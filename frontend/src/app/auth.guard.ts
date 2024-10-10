// import { inject, Inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from './auth/auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if(authService.isAdmin()) {
//     return true;
//   } else {
//     router.navigate(['/']);
//     return false;
//   }
// };

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true; // Allow access if user is admin
    } else {
      this.router.navigate(['/']); // Redirect to home if not admin
      return false;
    }
  }

  canMatch(): boolean {
    if (this.authService.isBlogger()) {
      return true; // Allow access if user is admin
    } else {
      this.router.navigate(['/']); // Redirect to home if not admin
      return false;
    }
  }
}
