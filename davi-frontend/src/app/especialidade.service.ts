import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Globals from './globals';
import { AuthenticationService } from './authentication.service';
import Especialidade from './interfaces/Especialidade'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {
  private static readonly URL = Globals.BACKEND_URL + "/especialidades/";
  constructor(private http: HttpClient, private authentication: AuthenticationService) { }

  public getAll(): Observable<Especialidade[]> {
    console.log(this.authentication.token);
    if(!this.authentication.isAuthenticated())
      throw new Error("Not authenticated.");
    return this.http.get<Especialidade[]>(EspecialidadeService.URL);
  }

  public get(id: number):Observable<Especialidade>{
    if(!this.authentication.isAuthenticated())
      throw new Error("Not authenticated.");
    return this.http.get<Especialidade>(EspecialidadeService.URL + id);
  }

  public search(query: string): Observable<Especialidade[]>{
    if(!this.authentication.isAuthenticated())
      throw new Error("Not authenticated.");
    const params = {
      search: ''
    };
    params.search = query;
    return this.http.get<Especialidade[]>(EspecialidadeService.URL);
  }
}
