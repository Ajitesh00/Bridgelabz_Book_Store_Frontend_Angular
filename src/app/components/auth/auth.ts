import { Component, OnInit } from '@angular/core'; // Add OnInit
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class AuthComponent implements OnInit { // Implement OnInit
  isLogin = true;
  role: 'user' | 'admin' = 'user';
  authForm: FormGroup;
  showPassword = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      fullName: [''],
      mobile: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.updateValidators(); // Call on initialization
  }

  toggleView(view: 'login' | 'signup') {
    this.isLogin = view === 'login';
    this.authForm.reset();
    this.updateValidators();
  }

  updateValidators() {
    const fullNameControl = this.authForm.get('fullName');
    const mobileControl = this.authForm.get('mobile');
    const emailControl = this.authForm.get('email');
    const passwordControl = this.authForm.get('password');

    if (this.isLogin) {
      fullNameControl?.setValidators(null);
      mobileControl?.setValidators(null);
      emailControl?.setValidators([Validators.required, Validators.email]);
      passwordControl?.setValidators([Validators.required]);
    } else {
      fullNameControl?.setValidators([Validators.required]);
      mobileControl?.setValidators([Validators.required]);
      emailControl?.setValidators([Validators.required, Validators.email]);
      passwordControl?.setValidators([Validators.required]);
    }

    fullNameControl?.updateValueAndValidity();
    mobileControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
  }

  onSubmit() {
    this.authForm.markAllAsTouched();

    if (!this.authForm.valid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 4000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['custom-snackbar']
      });
      return;
    }

    const { email, password, fullName } = this.authForm.value;

    if (this.isLogin) {
      this.authService.loginUser(this.role, { email, password }).subscribe({
        next: (res) => {
          if (res?.code >= 200 && res?.code < 300) {
            localStorage.setItem('token', res?.data?.token);
            this.snackBar.open(res?.message || 'Login Successful', 'Close', {
              duration: 4000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['custom-snackbar']
            });
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1000);
          } else {
            this.snackBar.open(res?.message || 'Login Failed', 'Close', {
              duration: 4000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['custom-snackbar']
            });
          }
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Something went wrong!', 'Close', {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['custom-snackbar']
          });
        }
      });
    } else {
      this.authService.registerUser(this.role, {
        firstName: fullName?.split(' ')[0] || '',
        lastName: fullName?.split(' ')[1] || '',
        email,
        password
      }).subscribe({
        next: (res) => {
          this.snackBar.open(res?.message || 'Signup Successful', 'Close', {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['custom-snackbar']
          });
          this.toggleView('login'); // Switch to login after signup
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Something went wrong!', 'Close', {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['custom-snackbar']
          });
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}