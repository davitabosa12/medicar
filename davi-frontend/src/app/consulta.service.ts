import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Globals from './globals';
import { catchError } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import Consulta from './interfaces/Consulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  public static readonly CONSULTA_URL = Globals.BACKEND_URL + "/consultas/";
  constructor(private http: HttpClient) { }

  public marcarConsulta(agenda_id: number, horario:string) {
    //TODO: Validar as entradas da função.
    const body = {
      agenda_id: agenda_id,
      horario: horario
    }
    console.log("Marcando consulta...");
    console.table(body);
    return this.http.post(ConsultaService.CONSULTA_URL, body);
  }
  public desmarcarConsulta(id: number){
    const url = `${ConsultaService.CONSULTA_URL + id}/`;
    return this.http.delete(url);
  }

  public getConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(ConsultaService.CONSULTA_URL);
  }
}
