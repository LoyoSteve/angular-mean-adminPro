import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchesService } from 'src/app/services/searches.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[];
  public spinner: boolean = true;
  public subImage: Subscription;
  desde:number = 0;

  constructor(
    private hospitalService: HospitalService,
    private modalImageService: ModalImageService,
    private searchService: SearchesService
  ) { }

  ngOnInit(): void {
    this.getHospitals();
    this.subImage = this.modalImageService.nuevaImg
    .pipe(
      delay(100)
    )
    .subscribe( img => this.getHospitals());
  }

  ngOnDestroy(): void {
    this.subImage.unsubscribe();
  }

  getHospitals(){
    this.spinner = true;
    this.hospitalService.getHospitales(this.desde).subscribe(
      (hospitales) => {
        this.spinner = false;
        this.hospitales = hospitales;
      },

      (error) => {
      }
    );
  }

  async createHospital(){
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del hospital'
    });

    if(value.length > 0){
      this.hospitalService.createHospital( value ).subscribe(
        ( resp ) => {
          Swal.fire('Actualizado', 'Hospital creado', 'success');
          this.getHospitals();
        },

        ( error ) => {
          console.log(error)
          Swal.fire('Error', 'Ha ocurrido un error', 'error');
        }
      )
    }
  }

  updateHospital( hospital: Hospital){
    this.hospitalService.updateHospital(hospital).subscribe(
      ( resp ) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
        this.getHospitals();
      },
      (error) => {
        Swal.fire('Error', 'Ha ocurrido un error', 'error');
      }
    )
  }

  deleteHospital(hospital: Hospital){
    Swal.fire({
      title: 'Estas seguro?',
      text: `Se eliminara el medico ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {

      this.hospitalService.deleteHospital(hospital).subscribe(
        ( resp ) => {
          Swal.fire('Borrado', hospital.nombre, 'success');
          this.getHospitals();
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
  openModal(hospital: Hospital){
    this.modalImageService.openModal('hospitales', hospital._id, hospital.img);
  }

  search(term: string){
    if(term.length != 0){
      this.searchService.search('hospitales', term).subscribe(
        ( resp ) => {
          this.hospitales = resp;
        }
      );
    } else {
      this.desde = 0;
      this.getHospitals();
    }
  }

  changePage( value:number ){
    this.desde += value;

    if(this.desde < 0){
      this.desde = 0;
    } else if(this.desde >= this.hospitales.length+1){
      this.desde -= value;
    }

    this.getHospitals();
  }
}
