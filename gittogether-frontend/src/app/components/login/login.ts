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
  loginData = { identificador: '', password: '' }; 
  errorMessage = ''; 

  constructor(private apiUsuario: Usuario, private router: Router) { } 

  // Se ejecuta al enviar el formulario
  onLogin(event: Event) {
    event.preventDefault();
    
    // Ahora enviamos loginData que contiene { identificador, password }
    this.apiUsuario.login(this.loginData).subscribe({
      next: (res) => {
        console.log("Login exitoso", res);
        
        // IMPORTANTE: En el Backend devolvemos un LoginResponse que tiene { token, usuario }
        // Guardamos el objeto usuario que viene dentro de la respuesta
        if (res && res.usuario) {
            localStorage.setItem('usuarioLogueado', JSON.stringify(res.usuario));
        }
        
        // Navegamos hacia la página principal del foro
        this.router.navigate(['/foro']);
      },
      error: (err) => {
        console.error("Error en el login:", err);
        this.errorMessage = "Usuario o contraseña incorrectos";
      }
    });
  }
}