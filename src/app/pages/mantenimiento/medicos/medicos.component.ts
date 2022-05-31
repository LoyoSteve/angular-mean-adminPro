import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchesService } from 'src/app/services/searches.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[];
  public spinner: boolean = true;
  public subImage: Subscription;
  desde:number = 0;

  constructor(
    private medicosServices: MedicoService,
    private modalImageService: ModalImageService,
    private searchService: SearchesService
  ) { }

  ngOnInit(): void {
    this.getMedicos();
    this.subImage = this.modalImageService.nuevaImg
    .pipe(
      delay(100)
    )
    .subscribe( img => this.getMedicos());
  }

  ngOnDestroy(): void {
    this.subImage.unsubscribe();
  }

  getMedicos(){
    this.spinner = true;
    this.medicosServices.getMedicos(this.desde).subscribe(
      ( medicos ) => {
        this.spinner = false;
        this.medicos = medicos;
      },

      (error) => {
      }
    );
  }

  deleteMedico(medico: Medico){
    Swal.fire({
      title: 'Estas seguro?',
      text: `Se eliminara el medico ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosServices.deleteMedico(medico).subscribe(
          ( resp ) => {
            Swal.fire('Borrado', 'Medico borrado', 'success');
            this.getMedicos();
          },
          (error) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
          }
        )
      }
    });
  }

  /**
   * Abre el modal para cambiar la imagen
   * @param hospital
   */
  openModal(medico: Medico){
    this.modalImageService.openModal('medicos', medico._id, medico.img);
  }

  search(term: string){
    if(term.length != 0){
      this.searchService.search('medicos', term).subscribe(
        ( resp ) => {
          this.medicos = resp;
        }
      );
    } else {
      this.desde = 0;
      this.getMedicos();
    }
  }

  // changePage( value:number ){
  //   this.desde += value;

  //   if(this.desde < 0){
  //     this.desde = 0;
  //   } else if(this.desde >= this.hospitales.length+1){
  //     this.desde -= value;
  //   }

  //   this.getMedicos();
  // }

}
