import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnDestroy{

  public intervalSub: Subscription;

  constructor() {


    // this.retornaObservable()
    // .pipe(
    //   retry(1)
    // )
    // .subscribe(
    //   valor => {console.log('sub: ',valor)},
    //   error => {console.log('error jefe ',error)},
    //   () => {console.log('se completo nn')},
    // );
    this.intervalSub = this.retornaIntervalo().subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }

  retornaIntervalo(): Observable<number>{
    return interval(100)
    .pipe(
      //take(10),
      map(valor => valor + 1),
      filter(valor => (valor % 2 === 0) ? true : false),
    )
  }

  retornaObservable(): Observable<number>{
    return new Observable<number>( observer => {

      let i = -1;

      const intervalor = setInterval( () => {

        if( i === 4){
          clearInterval( intervalor );
          observer.complete();
        }
        if( i === 6){
          clearInterval( intervalor );
          observer.error('gg n');
        }

        i++;
        observer.next(i);

      }, 1000)
    });
  }
}
