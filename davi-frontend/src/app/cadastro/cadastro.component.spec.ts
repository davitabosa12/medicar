import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroComponent } from './cadastro.component';
import { HttpClientModule } from '@angular/common/http';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ CadastroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not validate different passwords', () =>{
    component.cadastroForm.controls.username.setValue('foo');
    component.cadastroForm.controls.email.setValue('bar@bar.com');
    component.cadastroForm.controls.password.setValue('123');
    component.cadastroForm.controls.passwordRepeat.setValue('456');
    expect(component.cadastroForm.valid).toBeFalse();
  });
  it('should not validate empty username', () =>{
    component.cadastroForm.controls.username.setValue('');
    component.cadastroForm.controls.email.setValue('bar@bar.com');
    component.cadastroForm.controls.password.setValue('123');
    component.cadastroForm.controls.passwordRepeat.setValue('123');
    expect(component.cadastroForm.valid).toBeFalse();
  });
  it('should not validate empty email', () =>{
    component.cadastroForm.controls.username.setValue('foo');
    component.cadastroForm.controls.email.setValue('');
    component.cadastroForm.controls.password.setValue('123');
    component.cadastroForm.controls.passwordRepeat.setValue('123');
    expect(component.cadastroForm.valid).toBeFalse();
  });
});
