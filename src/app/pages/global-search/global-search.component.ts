import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { SearchesService } from 'src/app/services/searches.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styles: [
  ]
})
export class GlobalSearchComponent implements OnInit {

  users: Usuario[] = [];
  medicos: Medico[] = [];
  hospitals: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchesService: SearchesService
  ) { }

  ngOnInit(): void {
    this.getSearchTerm();
  }

  getSearchTerm(){
    this.activatedRoute.params.subscribe(
      ({searchTerm}) => {
        this.globalSearch( searchTerm );
      }
    )
  }

  globalSearch(searchTerm){
    this.searchesService.globalSearch(searchTerm).subscribe(
      ( resp: any ) => {
        this.users = resp.usuarios;
        this.medicos = resp.medicos;
        this.hospitals = resp.hospitales;
      },

      ( error ) => {

      }
    )
  }

}
