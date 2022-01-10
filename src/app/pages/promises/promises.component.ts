import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: []
})
export class PromisesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.getUsuarios().then( usuarios => {
      console.log( usuarios )
    });
    // const promesa = new Promise( ( resolve, reject ) => {

    //   if( false ){
    //     resolve('hola nn');
    //   }else{
    //     reject('algo salio mal');
    //   }
    // });

    // promesa.then( () => {
    //   console.log('acabo')
    // })
    // .catch( error => console.log('falsas promesas ', error))

    // console.log('fin init');
  }

  getUsuarios(){
    return new Promise( resolve => {
      fetch('https://reqres.in/api/users')
        .then( resp => resp.json())
        .then( body => resolve(body.data))
    })
  }

}
