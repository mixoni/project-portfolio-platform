import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  standalone: true, 
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.error = null;
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: (err:any) => {
        this.error = err?.error?.message || 'Login failed';
      },
    });
  }
}
