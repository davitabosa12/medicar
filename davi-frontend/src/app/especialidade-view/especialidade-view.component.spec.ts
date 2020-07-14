import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialidadeViewComponent } from './especialidade-view.component';
import { HttpClientModule } from '@angular/common/http';

describe('EspecialidadeViewComponent', () => {
  let component: EspecialidadeViewComponent;
  let fixture: ComponentFixture<EspecialidadeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspecialidadeViewComponent ],
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialidadeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
