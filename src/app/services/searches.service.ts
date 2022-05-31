import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
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

  private toHospitalsClass( resultados: any[] ): Hospital[]{
    return resultados;
  }

  private toMedicosClass( resultados: any[] ): Medico[]{
    return resultados;
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

                case 'hospitales':
                  return this.toHospitalsClass(resp.resultados);
                  break;

                case 'medicos':
                  return this.toMedicosClass(resp.resultados);
                  break;
              }
            })
          )
  }

  globalSearch( searchTerm: string ){
    const url = `${this.api_url}/todo/${searchTerm}`
    return this.http.get(url, this.headers);
  }
}
