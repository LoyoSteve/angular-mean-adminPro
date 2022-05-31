import { environment } from "src/environments/environment";

const api_url: string = environment.api_url;

export class Usuario{

  constructor(
    public nombre: string,
    public email: string,
    public password: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string,
  ){
  }

  get userImgUrl(){

    if( !this.img ){
      return `${api_url}/uploads/usuarios/404.png`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${api_url}/uploads/usuarios/${this.img}`
    } else {
      return `${api_url}/uploads/usuarios/404.png`
    }
  }
}
