import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  getMedicos(desde: number = 0){
    const url = `${this.api_url}/medicos?desde=${desde}`
    return this.http.get(url, this.headers)
      .pipe(
        map( (resp: {ok: boolean, medicos: Medico[]}) => resp.medicos)
      );
  }

  getMedicoById(id: string){
    const url = `${this.api_url}/medicos/${id}`
    return this.http.get(url, this.headers)
      .pipe(
        map( (resp: {ok: boolean, medico: Medico}) => resp.medico)
      );
  }

  createMedico( medico: Medico){
    const url = `${this.api_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  updateMedico(medico: Medico){
    const url = `${this.api_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  deleteMedico(medico: Medico){
    const url = `${this.api_url}/medicos/${medico._id}`;
    return this.http.delete(url, this.headers);
  }
}
