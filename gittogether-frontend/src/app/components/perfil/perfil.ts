import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { Usuario } from '../services/usuario';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  usuarioLogueado: any = null;
  stats: any = { temasCreados: 0, mensajes: 0 };

  constructor(
    private usuarioService: Usuario, 
    private cdr: ChangeDetectorRef,
    private modalService: ModalService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.getUsuarioLogueado();
    
    // Obtenemos el ID de forma segura por si se guardó como 'id' en lugar de 'identificador'
    const userId = this.usuarioLogueado?.identificador || this.usuarioLogueado?.id;
    
    console.log('ID del usuario actual:', userId);

    if (userId !== undefined && userId !== null) {
      this.usuarioService.getStats(userId).subscribe({
        next: (data) => {
          console.log('Datos recibidos del servidor:', data);
          if (data) {
            this.stats = data;
            // Forzamos a Angular a actualizar la vista por si falla la detección de cambios
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error al obtener estadísticas del servidor:', err);
        }
      });
    } else {
      console.warn('No se ha encontrado el ID del usuario en la sesión.');
    }
  }

  async editarPerfil() {
    const data = await this.modalService.prompt("Editar Perfil", [
      { 
        name: 'descripcion', 
        label: 'Sobre mí', 
        type: 'textarea', 
        value: this.usuarioLogueado?.descripcion || '' 
      }
    ]);

    if (data && data.descripcion !== undefined) {
      const userId = this.usuarioLogueado?.identificador || this.usuarioLogueado?.id;
      this.usuarioService.updatePerfil(userId, { descripcion: data.descripcion }).subscribe({
        next: (usuarioActualizado) => {
          this.usuarioLogueado = usuarioActualizado;
          this.toastService.success("Perfil actualizado correctamente");
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error al actualizar el perfil", err);
          this.toastService.error("No se pudo actualizar el perfil.");
        }
      });
    }
  }
}
