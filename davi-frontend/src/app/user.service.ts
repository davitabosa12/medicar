import { Injectable } from '@angular/core';
import Globals from './globals';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public static readonly USER_URL = Globals.BACKEND_URL + "/users/";
  public static readonly REGISTER_URL = Globals.BACKEND_URL + "/register/";
  constructor(private http: HttpClient) { }

  get(id: number){
    return this.http.get(UserService.USER_URL + id);
  }

  getAll(){
    return this.http.get(UserService.USER_URL);
  }

  novoUsuario(username: string, password: string, email: string){
    const body = {
      username: username,
      password: password,
      email: email,
    }
    return this.http.post(UserService.REGISTER_URL, body);
  }
}
