export class CreateCrend{
    numEmpleado: number;
    nombre: string;
    foto: File;
    categoria: string;
    firma: File;
    svg:File;
   
  
    constructor(numEmpleado: number,nombre: string,
         foto: File, categoria: string, firma: File,svg:File) {
      this.numEmpleado = numEmpleado;
      this.nombre = nombre;
      this.foto = foto;
      this.categoria = categoria;
      this.firma = firma;
      this.svg = svg;
    }
  }
  