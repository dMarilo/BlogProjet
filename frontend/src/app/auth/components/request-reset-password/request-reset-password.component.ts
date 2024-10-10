import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { PasswordResetReq, PasswordResetRes } from 'src/app/models/auth.models';

@Component({
  selector: 'app-request-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent {
  requestForm: FormGroup;
  userError: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  onSubmit() {
    if(this.requestForm.valid) {
      this.loading = true;
      const reqData: PasswordResetReq = this.requestForm.value;
      this.authService.requestPasswordReset(reqData).subscribe(
        (res: PasswordResetRes) => {
          this.loading = false;
          this.userError = null;
          this.handleSuccessfulReq();
        },
        (err) => {
          this.loading = false;
          this.handleErrors(err.error);
        }
      );
    } else {
      this.handleFormErrors();
    }
  }


  private handleErrors(error: any) {
    this.userError = null;

    //const errors = error.errors

    if (error.errors) {
      if (error.errors.email) {
        this.userError = "User does not exist.";
      } else {
        this.userError = 'An error occurred. Please try again.';
      }
    } else {
      this.userError = "An unknown error occurred.";
    }
  }

  private handleFormErrors() {
    const controls = this.requestForm.controls

    if(controls['email'].errors?.['email']) {
      this.userError = "Invalid email adress";
    } else if(controls['email'].errors?.['required']) {
      this.userError = "Email is required";
    }
  }

  private handleSuccessfulReq() {
    setTimeout(() => {
      this.router.navigate(['/confirmation']);
    }, 2000)
  }
 
  navigateToRegistration() {
    this.router.navigate(['/register']);
  }

}
