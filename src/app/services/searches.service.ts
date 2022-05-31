import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SearchesService {

  api_url: string = environment.api_url;

  constructor(
    private http: HttpClient
  ) { }

  get userToken(): string {
    return localStorage.getItem('token');
  }

  get headers(){
    return {
      headers: {
        'x-token': this.userToken
      }
    }
  }

  private toUsuariosClass( resultados: any[] ): Usuario[]{
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  search( tipo: 'usuarios' | 'medicos' | 'hospitales', term: string){
    const url = `${this.api_url}/todo/coleccion/${tipo}/${term}`
    return this.http.get<any[]>(url, this.headers)
          .pipe(
            map( (resp: any) => {
              switch (tipo) {
                case 'usuarios':
                  return this.toUsuariosClass( resp.resultados );
                  break;

                default:
                  return []
                  break;
              }
            })
          )
  }
}