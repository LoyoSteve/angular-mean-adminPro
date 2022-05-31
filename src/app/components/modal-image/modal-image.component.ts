import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent implements OnInit {

  imagenSubir: File;
  imageTemp: any = null;

  constructor(
    public modalImageService: ModalImageService,
    public fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.imageTemp = null;
    this.modalImageService.closeModal();
  }

  changeImage( file: File ){
    this.imagenSubir = file;

    if( !file ) {
      this.imageTemp = null;
      return
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imageTemp = reader.result;
    }
  }

  uploadImage(){
    const uid = this.modalImageService.uid;
    const type = this.modalImageService.type;

    this.fileUploadService.updatePhoto(this.imagenSubir, type, uid)
    .then( img => {
      Swal.fire('Actualizacion exitosa', 'Se actualizo la información correctamente', 'success');
      this.modalImageService.nuevaImg.emit( img );
      this.closeModal();
    })
    .catch(error => {
      Swal.fire('Error', 'No se pudo subir imagen', 'error');
    });
  }
}
