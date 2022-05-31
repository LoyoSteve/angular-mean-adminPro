import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(){
    this.registerForm = this.fb.group({
      nameCtrl: ['angular', [Validators.required]],
      emailCtrl: ['angular@gmail.com', [Validators.required, Validators.email]],
      passwordCtrl: ['hola123', [Validators.required]],
      confirmPasswordCtrl: ['hola123', [Validators.required]],
      checkCtrl: [false, [Validators.requiredTrue]]

    },
    {
      validators: this.validPasswords()
    });
  }

  registerUser(){
    if(this.registerForm.valid){
      //si el formulario es valido
      //crear objeto de usuario
      const formValues = this.registerForm.value;
      const newUser: Partial<IUser> = {
        nombre: formValues.nameCtrl,
        password: formValues.passwordCtrl,
        email: formValues.emailCtrl
      };

      //registramos en el servidor
      this.userService.registerForm( newUser )
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

  fieldRequired(nameCtrl: string): boolean{
    return !this.registerForm.get(nameCtrl).valid && this.registerForm.get(nameCtrl).dirty;
  }

  validPasswords(){
    return (fg: FormGroup) => {
      const pwCtrl = fg.get('passwordCtrl');
      const pwConfirmCtrl = fg.get('confirmPasswordCtrl');

      //validamos que las contraseñas sean iguales
      pwConfirmCtrl.setErrors( (pwCtrl.value != pwConfirmCtrl.value) ? { passwordNotSame: true } : null );
    }
  }

}
