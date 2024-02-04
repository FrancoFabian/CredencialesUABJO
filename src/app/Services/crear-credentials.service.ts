import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateCrend } from '../model/CreateCrend';

@Injectable({
  providedIn: 'root'
})
export class CrearCredentialsService {
  private apiUrl = 'http://localhost:8008/api/Credenciales/subirDatosCredenciales'; // Ajusta la URL según sea necesario
  constructor(private http: HttpClient) {}
  uploadCredentials(credentials: CreateCrend): Observable<any> {
    const formData = new FormData();
    formData.append('numEmpleado', credentials.numEmpleado.toString());
    formData.append('nombre', credentials.nombre);
    formData.append('foto', credentials.foto);
    formData.append('categoria', credentials.categoria);
    formData.append('firma', credentials.firma);
    formData.append('svg', credentials.svg);

    return this.http.post(this.apiUrl, formData);
  }
}
