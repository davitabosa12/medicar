import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCreateComponent } from './consulta-create.component';
import { HttpClientModule } from '@angular/common/http';

describe('ConsultaCreateComponent', () => {
  let component: ConsultaCreateComponent;
  let fixture: ComponentFixture<ConsultaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaCreateComponent ],
      imports: [HttpClientModule],
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
