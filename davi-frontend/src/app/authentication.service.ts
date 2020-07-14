import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { catchError, map, tap, combineAll } from "rxjs/operators";
import Globals from "./globals";
import { Observable, ObservableInput, of, Subject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService{
  public static readonly LS_USER_KEY = "user";
  private _token : string = "";
  private _username: string;
  
  public get username() : string {
    return this._username;
  }
  
  public get token() : string {
    return this._token;
  }
  
  constructor(private http: HttpClient) {
    console.log("auth constructor called");
    
    const user = JSON.parse(localStorage.getItem(AuthenticationService.LS_USER_KEY));
    if (user !== null){
      this._username = user.username;
      this._token = user.token;
    }
  }
  
  public authenticate(username: string, password: string, lembrarMe:boolean= false){
    const body = {
      username: username,
      password: password
    };
    const request = this.http.post(Globals.BACKEND_URL + '/api-token-auth/', body);
    request.subscribe((response) =>{
        var fromServer: any = response;
        console.log(fromServer.token)
        this._token = fromServer.token;
        this._username = username;
        console.log(`Successful: ${this._token}`);
        //save to localstorage.
        const userInfo = {
          username: username,
          token: this._token
        }
        if(lembrarMe){
          console.log("Usuario salvo no localStorage.");
          localStorage.setItem(AuthenticationService.LS_USER_KEY, JSON.stringify(userInfo));
        } else {
          console.log("Usuario não salvo no localStorage.")
        } 
    },
    (error) =>{
      if(error instanceof HttpErrorResponse){
        // a autenticação falhou.
        console.log('Erro de autenticação: ' + (error as HttpErrorResponse).error.non_field_errors[0]);
      }
    }
    ); 
    return request;
  }
  public logout(){
    localStorage.clear();
  }
  public isAuthenticated(): boolean {
    
    return !((this._token) === '');
  }  
}
