import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // <-- Adicione esta linha
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router); // <-- Adicione esta linha
  // ... resto do código

  // Cria o formulário com validações
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('auth_user', JSON.stringify({
              id: response.id,
              name: response.name,
              email: response.email,
              role: response.role
            }));
          }
          // Redireciona o usuário para a vitrine automaticamente!
          this.router.navigate(['/dashboard']); 
        },
        error: (err) => {
          alert('E-mail ou senha incorretos.');
        }
      });
    } else {
      alert('Preencha os campos corretamente.');
    }
  }
}
