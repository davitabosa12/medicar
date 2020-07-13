import { Component, OnInit } from '@angular/core';
import Especialidade from '../interfaces/Especialidade';
import { EspecialidadeService } from '../especialidade.service';

@Component({
  selector: 'app-especialidade-view',
  templateUrl: './especialidade-view.component.html',
  styleUrls: ['./especialidade-view.component.css']
})
export class EspecialidadeViewComponent implements OnInit {
  especialidades: Especialidade[]
  constructor(private especialidadeService: EspecialidadeService) {
  }

  ngOnInit(): void {
    
  }
  getEspecialidades(){
    this.especialidadeService.getAll().subscribe(especialidadeList =>{
      this.especialidades = especialidadeList;
    });
  }
}
