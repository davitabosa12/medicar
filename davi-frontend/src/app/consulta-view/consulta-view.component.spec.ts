import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaViewComponent } from './consulta-view.component';
import { HttpClientModule } from '@angular/common/http';
import Consulta from '../interfaces/Consulta';

describe('ConsultaViewComponent', () => {
  let component: ConsultaViewComponent;
  let fixture: ComponentFixture<ConsultaViewComponent>;
  const mockConsulta: Consulta = {
    dia: "2020-12-03",
    data_agendamento: "timestamp",
    horario: {
      horario: "20:00",
      id: 1,
    },
    id: 1,
    medico: {
      crm: "123456",
      especialidade: {
        id: 1,
        nome: "CARDIOLOGIA",
      },
      id: 1,
      nome: "Dr. Roberto",
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ ConsultaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    
    fixture = TestBed.createComponent(ConsultaViewComponent);
    component = fixture.componentInstance;
    component.consulta = mockConsulta;
    fixture.detectChanges();
  });

  it('should create', () => {
    
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
