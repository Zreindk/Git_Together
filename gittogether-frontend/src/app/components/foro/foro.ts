import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForoService } from '../services/foro.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foro.html',
  styleUrl: './foro.css'
})
export class Foro implements OnInit {
  temas: any[] = [];
  categorias: any[] = [];
  usuarioLogueado: any = null;
  searchQuery: string = '';
  cargando: boolean = true;
  skeletonArray = Array(5).fill(0); // For skeleton loaders
  skeletonCats = Array(6).fill(0);

  constructor(private foroService: ForoService, private router: Router) { }

  ngOnInit(): void {
    // Recuperar usuario del localStorage
    const userJson = localStorage.getItem('usuarioLogueado');
    if (userJson) {
      this.usuarioLogueado = JSON.parse(userJson);
    }

    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.cargando = true;

    // Ejecutamos ambas peticiones al mismo tiempo
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

  get temasFiltrados() {
    if (!this.searchQuery) return this.temas;
    return this.temas.filter(t =>
      t.titulo.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}