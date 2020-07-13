import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { UserService } from "../user.service";
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  username: FormControl;
  email: FormControl;
  password: FormControl;
  passwordRepeat: FormControl;
  cadastroForm: FormGroup
  passwordsMatch: ValidatorFn;
  constructor(private location: Location, private userService: UserService) { }

  ngOnInit(): void {
    this.username = new FormControl('', Validators.required);
    this.email = new FormControl('', Validators.email);
    this.password = new FormControl('', Validators.required);
    this.passwordRepeat = new FormControl('', [Validators.required, ]);
    this.cadastroForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password,
      passwordRepeat: this.passwordRepeat,
    }, [this.mustMatchValidator(this.password, this.passwordRepeat)])
  }

  onSubmit(){
    if(this.cadastroForm.valid){
      console.log("Cadastrando novo usuario...");
      console.table(this.cadastroForm.value);
      const values = this.cadastroForm.value;
      this.cadastrar(values.username, values.password, values.email);
    } else {
      if(this.cadastroForm.errors.mustMatch){
        this.passwordRepeat.setErrors({mustMatch: true});
      }
    }
  }

  back(){
    this.location.back();
  }
  cadastrar(username: string, password: string, email:string){
    this.userService.novoUsuario(username, password, email)
    .subscribe(resp =>{
      if(resp instanceof HttpErrorResponse){
        // tratar erro
        console.error(resp);
      }
      else {
        // usuario cadastrado com sucesso
        console.log("cadastrado com sucesso!");
        console.log(resp);
      }
    })
  }

  mustMatchValidator(field1, field2): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      console.log(control);
      
      return field1.value !== field2.value ? {'mustMatch': true} : null;
    };
  }
}
