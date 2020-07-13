import { Injectable, Attribute } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Globals from './globals';
import Medico from './interfaces/Medico';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  public static readonly MEDICO_URL = Globals.BACKEND_URL + "/medicos/";
  constructor(private http: HttpClient) { }
  
  get(id: number): Observable<Medico>{
    return this.http.get<Medico>(MedicoService.MEDICO_URL + id);
  }
  getAll(): Observable<Medico[]>{
    return this.http.get<Medico[]>(MedicoService.MEDICO_URL);
  }
  search(query: {search?: string, especialidade?: number}): Observable<Medico[]> {
    let params = new HttpParams();
    console.log(query);
    if(query.search){
      params = params.set("search", query.search);
    }
    if(query.especialidade){
      params = params.set("especialidade", query.especialidade.toString());
    }
    console.log(params.toString());
    
    return this.http.get<Medico[]>(MedicoService.MEDICO_URL, {params});
  }
}
