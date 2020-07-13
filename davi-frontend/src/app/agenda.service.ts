import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Agenda from './interfaces/Agenda';
import { Observable } from 'rxjs';
import Globals from './globals';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  public static readonly AGENDA_URL = Globals.BACKEND_URL + '/agendas/';
  constructor(private http: HttpClient) { }

  get(id: number): Observable<Agenda>{
    return this.http.get<Agenda>(AgendaService.AGENDA_URL + id);
  }
  getAll(): Observable<Agenda[]>{
    return this.http.get<Agenda[]>(AgendaService.AGENDA_URL);
  }

  search(query: {medico?: number, especialidade?: number, data_inicio?: string, data_final?: string}): Observable<Agenda[]>{
    let params = new HttpParams();
    for (const term in query) {
      if(term){
        params = params.set(term, query[term]);
      }
    }
    return this.http.get<Agenda[]>(AgendaService.AGENDA_URL, {params});
  }
}
