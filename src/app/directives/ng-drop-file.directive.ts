import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFile]'
})
export class NgDropFileDirective {

  @Input() archivos: FileItem [] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter;

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    this.mouseSobre.emit( true );
    this._prevenirDetener( event );
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    this.mouseSobre.emit( false );
    this._prevenirDetener( event );
  }

  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {
    const transferencia = this._getTransferencia( event );
    if ( !transferencia ) {
      return;
    }

    this._extraerArchivos( transferencia.files );
    this._prevenirDetener( event );
    this.mouseSobre.emit( false );
  }

  private _getTransferencia( event: any ) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }
  private _extraerArchivos( archivosList: FileList ) {
    // console.log(archivosList);
    for (const propiedad of Object.getOwnPropertyNames( archivosList )) {
      const archivoTemp = archivosList[propiedad];

      if ( this._archivoPuedeSerCargado( archivoTemp ) ) {
        const nuevoArchivo = new FileItem( archivoTemp );
        this.archivos.push( nuevoArchivo );
      }
    }
  }

// Validaciones

  private _archivoPuedeSerCargado( archivo: File ): boolean {
    if ( !this._archivoYaFueDropeado( archivo.name ) && this.esImagen( archivo.type )) {
      return true;
    } else {
      return false;
    }
  }
  private _prevenirDetener( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDropeado( nombreArchivo: string): boolean {

    for ( const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('el archivo ' + nombreArchivo + ' Ya exixte');
        return true;
      }
      return false;
    }

  }

  private esImagen( tipoArchivo: string ): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }

}
