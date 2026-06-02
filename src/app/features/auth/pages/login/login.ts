import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  rememberPassword = false;
  errorMessage = '';
  loading = false;

  login(): void {

    this.errorMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const payload = {
      email: this.email.trim(),
      password: this.password
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard/home']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Invalid credentials. Please check your email and password.';
        this.cdr.detectChanges();
      }
    });
  }

}
