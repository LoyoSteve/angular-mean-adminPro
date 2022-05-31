import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/user.interface';
import { Usuario } from '../models/usuario.model';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url: string = environment.api_url;

  public auth2: any;

  usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
   }

   get userToken(): string {
     return localStorage.getItem('token');
   }

   get userUid(): string{
     return this.usuario.uid || '';
   }

   get headers(){
     return {
       headers: {
         'x-token': this.userToken
       }
     }
   }

  renewToken(): Observable<boolean>{
    const url = `${this.api_url}/login/renew`;

    return this.http.get(url, {
      headers: {
        'x-token': this.userToken
      }
    })
    .pipe(
      map( (resp: any) => {
        const { nombre, email, role, google, img='', uid} = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        this.saveTokenOnLocalStorage( resp.token );
        return true;
      }),
      catchError( (error) => of(false))
    );
  }

  registerForm(user: Partial<IUser>){
    const url = `${this.api_url}/users`;
    return this.http.post(url, user)
          .pipe(
            tap( (resp: any) => {
              this.saveTokenOnLocalStorage( resp.token );
            })
          );
  }

  updateCurrentUser(user: Partial<IUser>){
    user.role = this.usuario.role;
    const url = `${this.api_url}/users/${this.userUid}`;
    return this.http.put(url, user, this.headers);
  }

  loginForm(user: Partial<IUser>){
    const url = `${this.api_url}/login`;
    return this.http.post(url, user)
            .pipe(
              tap( (resp: any) => {
                this.saveTokenOnLocalStorage( resp.token );
              })
            );
  }

  loginGoogle(token: string){
    const url = `${this.api_url}/login/google`;
    return this.http.post(url, { token })
            .pipe(
              tap( (resp: any) => {
                this.saveTokenOnLocalStorage( resp.token );
              })
            );
  }

  logOut(){
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });

    });
  }

  saveTokenOnLocalStorage(token: string){
    localStorage.setItem('token', token)
  }

  googleInit(){
    return new Promise( resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '903664332936-65d9p61spglukdf81d2dlaso93ko5uk8.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });

        resolve(this.auth2);
      });

    });
  }

  //CRUD USERS
  getUsers(desde: number = 0){
    const url = `${this.api_url}/users?desde=${desde}`
    return this.http.get<{total:number, usuarios:Usuario[]}>(url, this.headers)
          .pipe(
            map( resp => {
              const usuarios = resp.usuarios.map(
                user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
              );
              return {
                total: resp.total,
                usuarios: usuarios
              };
            })
          )
  }

  deleteUser(user: Usuario){
    console.log(user)
    const url = `${this.api_url}/users/${user.uid}`;
    return this.http.delete(url,  this.headers);
  }

  updateUser(user: Usuario){
    const url = `${this.api_url}/users/${user.uid}`;
    return this.http.put(url, user, this.headers);
  }

}

