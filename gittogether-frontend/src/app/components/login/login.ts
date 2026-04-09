import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../services/usuario';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData = { nombre: '', password: '' };
  errorMessage = '';

  // Metemos el router al constructor
  constructor(private apiUsuario: Usuario, private router: Router) { } 

  onLogin(event: Event) {
    event.preventDefault();
    
    this.apiUsuario.login(this.loginData).subscribe({
      next: (res) => {
        console.log("Login exitoso", res);
        // Guardamos al usuario para usar su ID o Nombre en el foro 
        localStorage.setItem('usuarioLogueado', JSON.stringify(res));
        
        // Redirigimos a /foro
        this.router.navigate(['/foro']);
      },
      error: (err) => {
        this.errorMessage = "Datos incorrectos";
      }
    });
  }
}