import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'image'
})
export class ImgPipe implements PipeTransform {

  api_url = environment.api_url;

  transform(img:string, tipo: 'usuarios' | 'hospitales' | 'medicos') {

    if( !img ){
      return `${this.api_url}/uploads/${tipo}/404.png`;

    } else if(img.includes('https')){
      return img;

    } else if(img){
      return `${this.api_url}/uploads/${tipo}/${img}`

    } else {
      return `${this.api_url}/uploads/${tipo}/404.png`
    }
  }

}
