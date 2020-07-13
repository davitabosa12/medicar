import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCreateComponent } from './consulta-create.component';

describe('ConsultaCreateComponent', () => {
  let component: ConsultaCreateComponent;
  let fixture: ComponentFixture<ConsultaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
