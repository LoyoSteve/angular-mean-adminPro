import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/user.interface';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  dbUrl: string = environment.db_url;

  public auth2: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
   }

  renewToken(): Observable<boolean>{
    const url = `${this.dbUrl}/login/renew`;

    const token = localStorage.getItem('token');

    return this.http.get(url, {
      headers: {
        'x-token': token
      }
    })
    .pipe(
      tap( (resp: any) => {
        this.saveTokenOnLocalStorage( resp.token );
      }),
      map( resp => true ),
      catchError( (error) => of(false))
    );
  }

  registerForm(user: Partial<IUser>){
    const url = `${this.dbUrl}/users`;
    return this.http.post(url, user)
          .pipe(
            tap( (resp: any) => {
              this.saveTokenOnLocalStorage( resp.token );
            })
          );
  }

  loginForm(user: Partial<IUser>){
    const url = `${this.dbUrl}/login`;
    return this.http.post(url, user)
            .pipe(
              tap( (resp: any) => {
                this.saveTokenOnLocalStorage( resp.token );
              })
            );
  }

  loginGoogle(token: string){
    const url = `${this.dbUrl}/login/google`;
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
}

