import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {
  estaSobreDrop = false;

  archivos: FileItem [] = [];
  constructor(public is: CargaImagenesService) { }

  ngOnInit() {
  }

  cargarImagenes() {
    this.is.cargarImagenes( this.archivos );
  }

  limpiarArchivos() {
    this.archivos = [];
  }
}
