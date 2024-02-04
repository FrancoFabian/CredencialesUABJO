export class CredentialsWithFiles {
    id: number;
    nombre: string;
    foto: File;
    categoria: string;
    firma: File;
    fotoBas64:string;
    firmaBas64:string;
  
    constructor(id: number,nombre: string,
       foto: File, categoria: string, firma: File,
       fotoBas64:string,firmaBas64:string
       
       ) {
      this.id = id;
      this.nombre = nombre;
      this.foto = foto;
      this.categoria = categoria;
      this.firma = firma;
      this.fotoBas64 = fotoBas64;
      this.firmaBas64 = firmaBas64;
    }
  }
  