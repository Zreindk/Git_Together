import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../services/usuario';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  // Creamos esta variable para almacenar los datos del usuario que recuperamos de la sesión
  usuarioLogueado: any = null;

  // Inyectamos el servicio de usuario solo al navbar para que controle el estado de la sesión
  constructor(private apiUsuario: Usuario, private router: Router) {}

  ngOnInit(): void {
    // Recuperamos la información del usuario desde el almacenamiento local al cargar la barra de navegación
    const userJson = localStorage.getItem('usuarioLogueado');
    if (userJson) {
      this.usuarioLogueado = JSON.parse(userJson);
    }
  }

  // Definimos la lógica de salida para limpiar los datos de sesión y redirigir al login
  onLogout() {
    // Invocamos el método logout del servicio para eliminar los tokens guardados
    this.apiUsuario.logout();
    // Redirigimos al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
  }
}