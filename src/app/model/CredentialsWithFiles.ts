export class CredentialsWithFiles {
    id: number;
    nombre: string;
    foto: File;
    categoria: string;
    firma: File;
   
  
    constructor(id: number,nombre: string, foto: File, categoria: string, firma: File) {
      this.id = id;
      this.nombre = nombre;
      this.foto = foto;
      this.categoria = categoria;
      this.firma = firma;
    }
  }
  