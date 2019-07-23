import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {
  private CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore) { }

  cargarImagenes( imagenes: FileItem[]) {
    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      item.estasubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }

      const uploadTask: firebase.storage.UploadTask = storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`).put(item.archivo);

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ( snapshot: firebase.storage.UploadTaskSnapshot ) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        ( error ) => console.log('Error al subir ', error),
        () => {
          console.log('imagen cargada correctamente');
          uploadTask.then((snapshot) => {
            item.estasubiendo = false;
            snapshot.ref.getDownloadURL().then((url) => {
              this.guardarImagen({
                nombre: item.nombreArchivo,
                url
              });
            });
          });
        });

    }
  }

  private guardarImagen( imagen: { nombre: string, url: string } ) {

    this.db.collection(`/${ this.CARPETA_IMAGENES }`)
      .add( imagen );

  }

}
