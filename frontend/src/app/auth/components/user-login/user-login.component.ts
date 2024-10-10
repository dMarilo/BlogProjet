import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NgClass, NgIf } from '@angular/common';
import { LoginReq, LoginRes } from 'src/app/models/auth.models';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {
  loginForm: FormGroup;
  emailError: string | null = null;
  passwordError: string | null = null;
  loading: boolean = false;
  showError = false; //...........

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const loginData: LoginReq = this.loginForm.value;
      this.authService.login(loginData).subscribe(
        (res: LoginRes) => {
          localStorage.setItem('token', res.token);
          this.loginForm.reset();
          this.emailError = null;
          this.passwordError = null;
          this.loading = false;
        },
        (error) => {
          console.log('Login failed', error);
          this.loading = false;
          if (error.status === 401 && error.error.message === 'User not verified') {
            this.router.navigate(['/login-no-verification']);
          }
          else
          {
            this.handleErrors(error.error);
          }
        }
      );
    }else{
      this.handleFormErrors();
    }
  }

  private handleErrors(error: any) {
    this.emailError = null;
    this.passwordError = null;
    const errors = error.errors;
    if (errors.email) {
      //Email not found
      this.emailError = 'Email does not exist';
    }
    else if (errors.password) {
      //Password is incorrect
      this.passwordError = 'Password is incorrect';
    }
  }

  private handleFormErrors() {
    const controls = this.loginForm.controls;

    if(controls['email'].errors?.['email']) {
      this.emailError = "Email is not valid"
    } else if(controls['password'].errors?.['required']){
      this.passwordError = "Missing password field"
    }
  }

  navigateToReset() {
    this.router.navigate(['/reset-password-request']);
  }

  navigateToRegistration() {
    this.router.navigate(['/register']);
  }
}
