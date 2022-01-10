import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrums',
  templateUrl: './breadcrums.component.html',
  styles: [
  ]
})
export class BreadcrumsComponent implements OnDestroy{

  title: string;
  titleSub$: Subscription;

  constructor( private router: Router) {

    this.titleSub$ = this.getNamePage().subscribe( ({ title }) => {
                                    this.title = title;
                                    document.title = `AdminPro - ${ title }`
                                  });

  }
  ngOnDestroy(): void {
    this.titleSub$.unsubscribe();
  }

  getNamePage(){
    return this.router.events
    .pipe(
      filter( event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd ) => event.snapshot.data)
    )
  }

}
