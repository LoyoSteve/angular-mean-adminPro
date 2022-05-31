import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchesService } from 'src/app/services/searches.service';
import { UserService } from 'src/app/services/user.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  totalUsers: number;
  users: Usuario[] = [];
  desde:number = 0;
  spinner: boolean = true;

  subImage: Subscription;

  constructor(
    private userService: UserService,
    private searchService: SearchesService,
    private modalImageService: ModalImageService
  ) { }

  ngOnDestroy(): void {
    this.subImage.unsubscribe();
  }

  ngOnInit(): void {
    this.getUsers();
    this.subImage = this.modalImageService.nuevaImg
    .pipe(
      delay(100)
    )
    .subscribe( img => this.getUsers());
  }

  getUsers(){
    this.spinner = true;
    this.userService.getUsers(this.desde).subscribe(
      ( {total, usuarios} ) => {
        this.spinner = false;
        this.totalUsers = total;
        this.users = usuarios;
      }
    )
  }

  changePage( value:number ){
    this.desde += value;

    if(this.desde < 0){
      this.desde = 0;
    } else if(this.desde >= this.totalUsers){
      this.desde -= value;
    }

    this.getUsers();
  }

  search(term: string){
    if(term.length != 0){
      this.searchService.search('usuarios', term).subscribe(
        ( resultados: Usuario[] ) => {
          this.users = resultados;
        }
      );
    } else {
      this.desde = 0;
      this.getUsers();
    }
  }

  deleteUser(user: Usuario){

    if ( user.uid === this.userService.userUid){
      return swal.fire(
        'Error',
        'No puedes borrarte a ti mismo xd',
        'error'
      )
    }

    swal.fire({
      title: 'Estas seguro?',
      text: `Se eliminara el usuario ${user.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {

        //borrar de base
        this.userService.deleteUser( user ).subscribe(
          (response ) => {
            //msg
            swal.fire(
              'Usuario Borrado!',
              'El usuario ha sido borrado',
              'success'
            );

            //cargar de nuevo
            this.getUsers();
          },
          ( error ) => {
            swal.fire(
              'Error',
              'Algo salio mal',
              'error'
            )
          }
        );

      }
    });
  }

  changeRole(user: Usuario){
    this.userService.updateUser(user).subscribe(
      ( response ) => {
        console.log(response)
      },

      ( error ) => {
        swal.fire(
          'Error',
          error,
          'error'
        )
      }
    )
  }

  openModal(user: Usuario){
    this.modalImageService.openModal('usuarios', user.uid, user.img);
  }
}
