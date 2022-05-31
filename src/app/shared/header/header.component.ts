import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user.interface';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  userProfile: Usuario;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.userProfile = userService.usuario;
   }

  ngOnInit(): void {
  }

  logOut(){
    this.userService.logOut();
  }

  globalSearch(searchTerm: string){
    if( searchTerm.length === 0){
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${ searchTerm }`);
  }

}
