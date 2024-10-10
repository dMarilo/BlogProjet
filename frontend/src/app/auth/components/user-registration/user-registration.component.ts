import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NgIf, NgClass } from '@angular/common';
import { RegisterReq } from 'src/app/models/auth.models';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})

export class UserRegistrationComponent {

  registrationForm: FormGroup;
  emailError: string | null = null;
  passwordError: string | null = null;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registrationForm = this.fb.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      password_confirmation: ["", Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, {validator: this.passwordMatchValidator});
  }

  private passwordMatchValidator(frm: FormGroup) {
    return frm.get("password")?.value === frm.get("password_confirmation")?.value ? null : {mismatch: true};
  }

  onSubmit() {
    this.registrationForm.markAllAsTouched();
    this.emailError = null;
    this.passwordError = null;

    if (this.registrationForm.valid) {
      this.loading = true;
      const registerData: RegisterReq = this.registrationForm.value;
       this.authService.register(registerData).subscribe(res => {
         console.log("Registration successful", res); // Debug log
         this.handleSuccessfulReq();
       }, error => {
         console.log("Registration failed", error);
         this.loading = false;
         this.handleErrors(error.error)
        });
     } else {
      console.log(this.registrationForm);
      this.handleFormErrors();
     }
  }

  private handleErrors(error: any) {
    this.emailError = null;
    this.passwordError = null;

    const errors = error.errors

    if(errors.email) {
     this.emailError = "Email already in use";
    } else if(errors.password) {
      this.passwordError = "Password do not match";
    }
  }

  private handleFormErrors() {
    if (this.registrationForm.controls?.['email'].errors?.['email']) {
      this.emailError = "Email is not valid";
    } else if (this.registrationForm.controls?.['email'].errors?.['required']) {
      this.emailError = "Email is not valid";
    }
    if(this.registrationForm.controls?.['password'].errors?.['minlength']) {
      this.passwordError = "Password must be at least 6 characters long";
    } else if (this.registrationForm.controls?.['password'].errors?.['required'] ) {
      this.passwordError = "Password is required";
    }
  }

  private handleSuccessfulReq() {
    this.router.navigate(['/registration-success']).then(() => {
      this.registrationForm.reset();
      this.loading = false;
      this.emailError = null;
      this.passwordError = null;
    })
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
