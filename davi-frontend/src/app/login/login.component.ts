import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from "../authentication.service";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Globals from '../globals';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl('', Validators.nullValidator),
  })
  constructor(
    private authenticator: AuthenticationService,
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit(formData): void {
    console.warn("Sending to server:");
    console.table(formData);
    this.authenticator.authenticate(formData.username, formData.password, formData.lembrarMe).subscribe(result =>{
      if(result){
        console.log("Logado com sucesso.")
        this.router.navigate(['/dashboard']);
      } else {
        console.log("Erro no login");
      }
    });
  }

}
