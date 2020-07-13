import { Component, OnInit } from '@angular/core';
import Consulta from '../interfaces/Consulta';
import { ConsultaService } from '../consulta.service';
import { EmitterVisitorContext } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  consultas: Consulta[];
  constructor(private consultaService: ConsultaService) { }

  ngOnInit(): void {
    this.consultaService.getConsultas().subscribe(consultaArray => this.consultas = consultaArray);
    
  }

  updateConsultas(){
    this.consultaService.getConsultas().subscribe(consultaArray => this.consultas = consultaArray);
  }

}
