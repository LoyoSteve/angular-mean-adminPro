import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  menuItems: any[];
  userProfile: Usuario;

  constructor(
    private sidebarService:SidebarService,
    private userService: UserService
  ) {
    this.menuItems = sidebarService.menu;
    this.userProfile = userService.usuario;
   }

}
