import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , throwError} from 'rxjs';
import { Employees } from '../model/Employees';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmployeesListService {

  private apiUrl = 'http://localhost:8008/api/Credenciales'; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  listarCredenciales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/listar`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
}

  eliminarCredencial(numEmpleado: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/eliminar/${numEmpleado}`, { responseType: 'text' });
}

}
