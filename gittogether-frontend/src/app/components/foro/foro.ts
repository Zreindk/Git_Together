import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForoService } from '../services/foro.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
// Importamos el componente de la barra de navegación para que se encargue de la cabecera de forma independiente
import { NavbarComponent } from '../navbar/navbar'; 

@Component({
  selector: 'app-foro',
  standalone: true,
  // Añadimos el NavbarComponent a los imports para poder usar su etiqueta en el HTML del foro
  imports: [CommonModule, FormsModule, NavbarComponent], 
  templateUrl: './foro.html',
  styleUrl: './foro.css'
})
export class Foro implements OnInit {
  temas: any[] = [];
  categorias: any[] = [];
  searchQuery: string = '';
  cargando: boolean = true;
  skeletonArray = Array(5).fill(0); 
  skeletonCats = Array(6).fill(0);

  // Inyectamos el servicio del foro para gestionar las peticiones de datos y el router para la navegación
  constructor(private foroService: ForoService, private router: Router) { }

  ngOnInit(): void {
    // Al iniciar el componente del foro, lanzamos la carga de las categorías y los temas
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.cargando = true;
    // Ejecutamos las peticiones de categorías y temas simultáneamente para optimizar la carga
    forkJoin({
      categorias: this.foroService.getCategorias(),
      temas: this.foroService.getTemas()
    }).subscribe({
      next: (res) => {
        this.categorias = res.categorias;
        this.temas = res.temas;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error cargando el foro", err);
        this.cargando = false;
      }
    });
  }

  // Definimos este filtro para actualizar la lista de temas que se muestran según lo que escriba el usuario
  get temasFiltrados() {
    if (!this.searchQuery) return this.temas;
    return this.temas.filter(t =>
      t.titulo.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}