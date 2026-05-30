import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';
  rememberPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    const payload = {
      email: this.email,
      password: this.password
    };

    this.authService
      .login(payload)
      .subscribe({
        next: (response) => {
          console.log('LOGIN SUCCESS', response);
          this.router.navigate(['/dashboard/home']);
        },
        error: (error) => {
          console.error('LOGIN ERROR', error);
        }
      });
  }

}
