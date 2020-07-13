import { Component, OnInit, Input } from '@angular/core';
import Consulta from '../interfaces/Consulta';
import { ConsultaService } from '../consulta.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: '[app-consulta-view]',
  templateUrl: './consulta-view.component.html',
  styleUrls: ['./consulta-view.component.css']
})
export class ConsultaViewComponent implements OnInit {
  @Input()
  consulta: Consulta;
  @Input()
  dashboardComponent: DashboardComponent;
  
  constructor(private consultaService: ConsultaService) { }

  ngOnInit(): void {

  }

  desmarcar(): void {
    console.log("Desmarcando consulta...");
    console.table(this.consulta);
    this.consultaService.desmarcarConsulta(this.consulta.id).subscribe(
      resp =>{
        if(resp instanceof HttpErrorResponse){
          console.error("Erro ao desmarcar consulta: ");
          console.error(resp);
        }
        else {
          console.log("Consulta desmarcada com sucesso!");
          this.dashboardComponent.updateConsultas()
        }
      }
    );
  }

}
