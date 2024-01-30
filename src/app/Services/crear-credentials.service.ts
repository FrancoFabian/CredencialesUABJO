import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsWithFiles } from '../model/CredentialsWithFiles';

@Injectable({
  providedIn: 'root'
})
export class CrearCredentialsService {
  private apiUrl = 'http://localhost:8080/api/subirDatosCredenciales'; // Ajusta la URL según sea necesario
  constructor(private http: HttpClient) {}
  uploadCredentials(credentials: CredentialsWithFiles): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', credentials.nombre);
    formData.append('foto', credentials.foto);
    formData.append('categoria', credentials.categoria);
    formData.append('firma', credentials.firma);

    return this.http.post<any>(this.apiUrl, formData);
  }
}
