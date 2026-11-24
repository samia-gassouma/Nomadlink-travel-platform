import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationControllerService } from "../../../services/gestionUser/services/authentication-controller.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  passwordForm: FormGroup;
  emailForm: FormGroup;
  code: string = '';

  step: 'email' | 'code' | 'success' = 'email';
  errorMsg: Array<string> = [];
  loading = false;
  passwordVisible = false;

  // Password strength tracking properties (similar to register component)
  passwordStrengthValid = {
    upperCase: false,
    lowerCase: false,
    numeric: false,
    specialChar: false,
    minLength: false
  };

  constructor(
      private router: Router,
      private authService: AuthenticationControllerService,
      private fb: FormBuilder
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.createPasswordStrengthValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    // Check password requirements on value changes
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(
        (value) => this.updatePasswordStrength(value)
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Password requirements validator
  createPasswordStrengthValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return !passwordValid ? { passwordStrength: true } : null;
    }
  }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // Update password strength indicators
  updatePasswordStrength(password: string): void {
    if (!password) {
      Object.keys(this.passwordStrengthValid).forEach(key => {
        this.passwordStrengthValid[key as keyof typeof this.passwordStrengthValid] = false;
      });
      return;
    }

    this.passwordStrengthValid.upperCase = /[A-Z]/.test(password);
    this.passwordStrengthValid.lowerCase = /[a-z]/.test(password);
    this.passwordStrengthValid.numeric = /[0-9]/.test(password);
    this.passwordStrengthValid.specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    this.passwordStrengthValid.minLength = password.length >= 8;
  }

  // Check if password strength criteria is met
  isPasswordStrengthValid(): boolean {
    return Object.values(this.passwordStrengthValid).every(value => value === true);
  }

  // Used to check individual password strength criteria
  hasPasswordStrengthError(criteria: keyof typeof this.passwordStrengthValid): boolean {
    return !this.passwordStrengthValid[criteria];
  }

  requestReset() {
    this.errorMsg = [];

    if (this.emailForm.invalid) {
      if (this.emailForm.get('email')?.hasError('required')) {
        this.errorMsg.push('Email is required');
      }
      if (this.emailForm.get('email')?.hasError('email')) {
        this.errorMsg.push('Please enter a valid email');
      }
      return;
    }

    this.loading = true;

    this.authService.requestPasswordReset({
      body: {
        email: this.emailForm.get('email')?.value
      }
    }).subscribe({
      next: () => {
        this.loading = false;
        this.step = 'code';
      },
      error: (err) => {
        this.loading = false;

        if (err.error && err.error.errorMsg) {
          this.errorMsg.push(err.error.errorMsg);
        } else {
          this.errorMsg.push('An error occurred while sending the reset code');
        }
      }
    });
  }

  confirmReset() {
    this.errorMsg = [];

    if (!this.code || !this.code.trim()) {
      this.errorMsg.push('Reset code is required');
      return;
    }

    if (this.passwordForm.invalid) {
      if (this.passwordForm.get('newPassword')?.hasError('required')) {
        this.errorMsg.push('New password is required');
      }
      if (this.passwordForm.get('newPassword')?.hasError('minLength')) {
        this.errorMsg.push('Password must be at least 8 characters');
      }
      if (this.passwordForm.get('newPassword')?.hasError('passwordStrength')) {
        this.errorMsg.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      }
      if (this.passwordForm.hasError('passwordMismatch')) {
        this.errorMsg.push('Passwords do not match');
      }
      return;
    }

    this.loading = true;

    this.authService.confirmPasswordReset({
      body: {
        email: this.emailForm.get('email')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value,
        resetCode: this.code
      }
    }).subscribe({
      next: () => {
        this.loading = false;
        this.step = 'success';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;

        if (err.error && err.error.errorMsg) {
          this.errorMsg.push(err.error.errorMsg);
        } else {
          this.errorMsg.push('An error occurred during password reset');
        }
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  // Getter for easy access to form fields
  get emailControl() { return this.emailForm.get('email'); }
  get newPasswordControl() { return this.passwordForm.get('newPassword'); }
  get confirmPasswordControl() { return this.passwordForm.get('confirmPassword'); }
}