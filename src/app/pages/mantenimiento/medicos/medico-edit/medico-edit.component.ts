import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-edit',
  templateUrl: './medico-edit.component.html'
})
export class MedicoEditComponent implements OnInit {

  medicoForm: FormGroup;

  hospitales: Hospital[];

  selectedMedico: Medico;
  selectedHospital: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initMedico();
    this.initForm();
    this.getHospitales();
    this.onSelectedHospital();
  }

  initMedico(){
    this.activatedRoute.params.subscribe( ({ id }) => {

      if( id != 'nuevo'){
        this.medicoService.getMedicoById( id ).subscribe(
          ( medico:any ) => {

            if(!medico){
              return this.router.navigateByUrl(`dashboard/medicos`);
            }
            const {nombre, hospital: {_id}} = medico;
            this.selectedMedico = medico;
            this.medicoForm.setValue({
              nameCtrl: nombre,
              hospitalIdCtrl: _id
            })
          },

          ( error ) => {
            return this.router.navigateByUrl(`dashboard/medicos`);
          }
        );
      }

    });
  }

  initForm(){
    this.medicoForm = this.fb.group({
      nameCtrl: ['', [Validators.required]],
      hospitalIdCtrl: ['', Validators.required]
    });
  }

  getHospitales(){
    this.hospitalService.getHospitales().subscribe(
      (hospitales) => {
        this.hospitales = hospitales;
      },

      (error) => {
      }
    );
  }

  /**
   * Se quede viendo los  cambiso del hospital que se selecciona
   */
  onSelectedHospital(){
    this.medicoForm.get('hospitalIdCtrl').valueChanges.subscribe(
      ( hospitalID ) => {
        this.selectedHospital = this.hospitales.find( h => h._id === hospitalID );
      }
    )
  }

  saveMedico(){
    if(this.medicoForm.valid){
      const formValues = this.medicoForm.value;

      if( this.selectedMedico ){

        //actualizar
        const updateMedico: Medico = {
          _id: this.selectedMedico._id,
          nombre: formValues.nameCtrl,
          hospital: formValues.hospitalIdCtrl
        };

        this.medicoService.updateMedico( updateMedico ).subscribe(
          ( resp ) => {
            console.log(resp);
            Swal.fire('Actualizado', 'Se ha actualizado el medico', 'success');
          }
        )
      } else {

        //crear medico
        const newMedico: Medico = {
          nombre: formValues.nameCtrl,
          hospital: formValues.hospitalIdCtrl
        }

        this.medicoService.createMedico( newMedico ).subscribe(
          ( resp:any ) => {
            Swal.fire('Medico creado', 'Se ha creado el medico '+newMedico.nombre, 'success');
            this.router.navigateByUrl(`dashboard/medicos/${resp.medico._id}`)
          },

          ( error ) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error')
          }
        )

      }
    }
  }
}
