import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/interfaces/user.interface';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';

import swal from 'sweetalert2';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  userProfile: Usuario;
  imagenSubir: File;

  imageTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private fileUploadService:FileUploadService
  ) {
    this.userProfile = userService.usuario;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.profileForm = this.fb.group({
      nameCtrl: [this.userProfile.nombre, [Validators.required]],
      emailCtrl: [this.userProfile.email, [Validators.email]]
    });
  }

  updateProfile(){
    const formValues = this.profileForm.value;
    if(this.profileForm.valid){
      //crear objeto
      const updatedUser: Partial<IUser> = {
        nombre: formValues.nameCtrl,
        email: formValues.emailCtrl
      }
      //guardar en api
      this.userService.updateCurrentUser( updatedUser ).subscribe(
        (resp: any) => {
          const { nombre, email } = resp.usuario;
          this.userProfile.nombre = nombre;
          this.userProfile.email = email;

          swal.fire('Actualizacion exitosa', 'Se actualizo la información correctamente', 'success');
        },

        ( error ) => {
          console.log(error);
          swal.fire('Error', error.error.msg, 'error');
        }
      )
    }
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
    this.fileUploadService.updatePhoto(this.imagenSubir, 'usuarios', this.userProfile.uid)
    .then( img => {
      this.userProfile.img = img;
      swal.fire('Actualizacion exitosa', 'Se actualizo la información correctamente', 'success');
    })
    .catch(error => {
      swal.fire('Error', 'No se pudo subir imagen', 'error');
    });
  }
}
