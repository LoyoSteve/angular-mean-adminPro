import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  getHospitales(desde: number = 0){
    const url = `${this.api_url}/hospitales?desde=${desde}`
    return this.http.get(url, this.headers)
      .pipe(
        map( (resp: {ok: boolean, hospitales: Hospital[]}) => resp.hospitales)
      );
  }

  createHospital( nameHospital: string){
    const url = `${this.api_url}/hospitales`;
    return this.http.post(url, {nombre: nameHospital}, this.headers);
  }

  updateHospital(hospital: Hospital){
    const url = `${this.api_url}/hospitales/${hospital._id}`;
    return this.http.put(url, hospital, this.headers);
  }

  deleteHospital(hospital: Hospital){
    const url = `${this.api_url}/hospitales/${hospital._id}`;
    return this.http.delete(url, this.headers);
  }
}
