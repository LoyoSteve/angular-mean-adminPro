import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalImageService {

  private _ocultarModal: boolean = true;
  public type: 'usuarios' | 'medicos' | 'hospitales';
  public uid: string;
  public currentImg: string;
  api_url: string = environment.api_url;

  public nuevaImg: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  public get ocultarModal(){
    return this._ocultarModal;
  }

  openModal( type: 'usuarios' | 'medicos' | 'hospitales', uid: string, currentImg: string = '404.png'){
    this.type = type;
    this.uid = uid;
    this.currentImg = currentImg;

    this._ocultarModal = false;

    if( currentImg.includes('http') ){
      this.currentImg = currentImg;
    } else {
      this.currentImg = `${this.api_url}/uploads/${type}/${this.currentImg}`;
    }
  }

  closeModal(){
    this._ocultarModal = true;
  }
}
