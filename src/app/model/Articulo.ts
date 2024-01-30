export class Articulo {
    constructor(
        public id: number,
        public nombre: string,
        public unidadMedida: string,
        public clave: string,
        public precio: number
    ) { }
}