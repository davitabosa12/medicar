import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import Especialidade from '../interfaces/Especialidade';
import Medico from '../interfaces/Medico';
import Agenda from '../interfaces/Agenda';
import { EspecialidadeService } from '../especialidade.service';
import { MedicoService } from "../medico.service";
import { AgendaService } from "../agenda.service";
import { ConsultaService } from '../consulta.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
@Component({
  selector: 'app-consulta-create',
  templateUrl: './consulta-create.component.html',
  styleUrls: ['./consulta-create.component.css']
})
export class ConsultaCreateComponent implements OnInit {
  especialidades: Especialidade[];
  medicos: Medico[];
  agendas: Agenda[];
  horarios: string[];
  selectedAgenda: Agenda;
  success: string;
  error: string;
  consultaForm = new FormGroup(
    {
      especialidade: new FormControl('', Validators.required),
      medico: new FormControl('', Validators.required),
      data: new FormControl('', Validators.required),
      hora: new FormControl('', Validators.required),
    }
  )
  constructor(
    private especialidadeService: EspecialidadeService,
    private medicoService: MedicoService,
    private agendaService: AgendaService,
    private consultaService: ConsultaService,
    private location: Location
    ) { }

  ngOnInit(): void {
    this.especialidadeService.getAll().subscribe(especialidadeList => {
      this.especialidades = especialidadeList;
      console.log("Especialidades retrieved. " + this.especialidades.length);
    });
    this.consultaForm.valueChanges.subscribe(this.onFormChanges)
  }
  onFormChanges(formData){
    console.log(formData);
  }
  especialidadeChange(especialidade){
    console.log("Especialidade changed");
    console.table(especialidade)
    this.medicos = null;
    this.agendas = null;
    this.horarios = null;
    this.consultaForm.controls.medico.setValue('');
    this.consultaForm.controls.data.setValue('');
    this.consultaForm.controls.hora.setValue('');
    this.medicoService.search({especialidade}).subscribe(medicoList => {
      this.medicos = medicoList;
      console.log("Medicos retrieved. " + this.medicos.length);
    })
  }
  medicoChange(med){
    console.log("Medico changed");
    console.log(med);
    this.agendas = null;
    this.horarios = null;
    this.consultaForm.controls.data.setValue('');
    this.consultaForm.controls.hora.setValue('');
    const query = {
      medico: this.consultaForm.value.medico as number,
    }
    this.agendaService.search(query).subscribe(agendaList =>{
      this.agendas = agendaList;
      console.log("Agendas retrieved. " + this.agendas.length);
    });
  }
  agendaChange(agendaId){
    console.log('Agenda changed');
    console.log(agendaId);
    console.log('Searching agendas...');
    this.horarios = null;
    this.consultaForm.controls.hora.setValue('');
    this.selectedAgenda = this.agendas.find(agenda => {
      return agenda.id == agendaId
    });
    this.horarios = this.selectedAgenda.horarios;
  }

  marcarConsulta(){
    this.error = "";
    this.success = "";
    const agendaId = this.selectedAgenda.id;
    this.consultaService.marcarConsulta(agendaId, this.consultaForm.value.hora)
    .subscribe(
      result => {
        this.success = "Consulta marcada com sucesso!";
        setTimeout(() => {
          this.back();
        }, 1000);
    },
      (error: HttpErrorResponse) => {
        const fromApi = error.error.non_field_errors[0];
        console.log("Erro: " + fromApi);
        console.error(fromApi);
        this.error = fromApi;
      }
    );
  }
  back(){
    this.location.back();
  }
}
