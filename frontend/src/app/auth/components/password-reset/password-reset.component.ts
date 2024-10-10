import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ResetPasswordData, ResetPasswordDataRes } from 'src/app/models/auth.models';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  resetForm: FormGroup;
  passwordError: string | null = null;
  token!: string;
  email!: string;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '' ;
  }

  private passwordMatchValidator(frm: FormGroup) {
    return frm.get('password')?.value === frm.get('password_confirmation')?.value ? null : {mismatch: true}
  }

  onSubmit() {    
    this.resetForm.markAllAsTouched();
    this.passwordError = null;

    console.log(this.resetForm.controls); // Log form controls and their errors


    if (this.resetForm.valid) { 
      this.loading = true;
      const resetData: ResetPasswordData = {
        ...this.resetForm.value,
        token: this.token,
        email: this.email
      };
      

      this.authService.resetPassword(resetData).subscribe(
        (res: ResetPasswordDataRes) => {
          console.log(res.message);
          this.loading = false;
          this.handleSuccessfulReq();
        },
        (err) => {
          console.log(err);
          this.loading = false;
          this.handleErrors(err.error);
        }
      );
    } else {
      this.handleFormErrors();
    }
  }

  private handleErrors(err: any) {
    if (err.errors) {
      if(err.errors.password) {
        this.passwordError = 'Password reset failed';
      }
    }
  }

  private handleFormErrors() {
    const controls = this.resetForm.controls;
    if(controls['password'].errors?.['minlength']) {
      this.passwordError = 'Password must be at least 6 characters long';
    } else if(controls['password_confirmation'].errors?.['required']) {
      this.passwordError = 'Password confirmation is required';
    } else if(this.resetForm.errors?.['mismatch']) {
      this.passwordError = 'Passwords do not match';
    }
  }

  private handleSuccessfulReq() {
    setTimeout(() => {
      this.router.navigate(['/countdown']);
    },1000)
  }
}
