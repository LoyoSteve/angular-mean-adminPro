import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.renderLoginGoogleButton();
  }

  /**
   * inicializa el formulario
   */
  initForm(){
    this.loginForm = this.fb.group({
      emailCtrl: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      passwordCtrl: ['', [Validators.required]],
      rememberCtrl: [true]
    });
  }

  /**
   * logea al usuario con el formulario de la pantalla
   */
  loginUser(){
    if( this.loginForm.valid ){
      //si el formulario es valido
      const formValues = this.loginForm.value;

      //el usuario quiere que lo recordemos
      if( formValues.rememberCtrl ){
        localStorage.setItem('email', formValues.emailCtrl);
      } else{
        localStorage.removeItem('email');
      }

      //creamos usuario
      const newUser: Partial<IUser> = {
        email: formValues.emailCtrl,
        password: formValues.passwordCtrl
      };

      this.userService.loginForm( newUser )
      .subscribe(
        (response) => {
          this.router.navigateByUrl('/dashboard');
        },

        (error) => {
          //console.log(error.error.msg);
          //si hay un error
          swal.fire('Error', error.error.msg, 'error');
        }
      );
    }
  }

  /**
   * Logea al usuario con el google signing
   * @param token token de google
   */
  loginUserGoogle( token: string){
    this.userService.loginGoogle( token )
    .subscribe(
      (response) => {
        this.router.navigateByUrl('/dashboard');
      },

      (error) => {
        //console.log(error.error.msg);
        //si hay un error
        swal.fire('Error', error.error.msg, 'error');
      }
    );
  }

  /**
   * Valida los campos requeridos
   * @param nameCtrl nombre del formControl
   * @returns regresa true si es valido y false si no es valido
   */
  fieldRequired(nameCtrl: string): boolean{
    return !this.loginForm.get(nameCtrl).valid && this.loginForm.get(nameCtrl).dirty;
  }

  /**
   * Renderiza el boton de google
   */
  renderLoginGoogleButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.initGoogleLoginButton();
  }

  /**
   * Inicia el boton para hacer el logeo mediante google
   */
  async initGoogleLoginButton () {

    const auth2: any = await this.userService.googleInit();

    //Vincula el boton de google del html con el evento onsignin
    const element = document.getElementById('my-signin2');

    auth2.attachClickHandler(element, {},
      (googleUser) => {
        var id_token = googleUser.getAuthResponse().id_token;

        //guardar token
        this.loginUserGoogle( id_token );

        this.ngZone.run( () => {
          //navegar a dasboard
          this.router.navigateByUrl('/dashboard');
        });
      },

      (error) => {
        swal.fire('Error', error, 'error');
      }
    );

  }
}
