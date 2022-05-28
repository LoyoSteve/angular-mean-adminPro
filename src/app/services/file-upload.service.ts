import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  api_url = environment.api_url;

  constructor() { }

  async updatePhoto( file: File, type: 'usuarios' | 'medicos' | 'hospitales', id: string){
    try {
      const url = `${this.api_url}/uploads/${type}/${id}`;
      const formData = new FormData();

      formData.append('imagen', file);

      //nos permite hacer peticiones http
      const response = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await response.json();

      if(data.ok){
        return data.nombreFile
      } else{
        console.log(data.msg);
        return false;
      }
      console.log( data );

      return 'nombre de la imagen';

    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
