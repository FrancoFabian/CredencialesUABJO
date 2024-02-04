import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { MostrarService } from '../../Services/mostrar.service';
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    EliminarComponent,
    CommonModule
  ],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent implements OnInit {
  gradientes:string[] = [
    'linear-gradient(90deg, rgba(230,64,10,1) 43%, rgba(212,170,0,1) 100%)',
    'linear-gradient(90deg, rgba(140,230,10,1) 43%, rgba(7,179,63,1) 100%)',
    'linear-gradient(90deg, rgba(10,230,190,1) 43%, rgba(9,129,168,1) 100%)',
    'linear-gradient(90deg, rgba(153,59,255,1) 43%, rgba(9,165,168,1) 100%)',
    'linear-gradient(90deg, rgba(255,246,119,1) 43%, rgba(38,247,171,1) 100%)',
    'linear-gradient(90deg, rgba(255,0,0,1) 43%, rgba(49,100,250,1) 100%)',
    'linear-gradient(90deg, rgba(241,255,0,1) 43%, rgba(255,162,0,1) 100%)',
    'linear-gradient(90deg, rgba(223,180,232,1) 43%, rgba(148,159,244,1) 100%)',
    'linear-gradient(90deg, rgba(72,166,240,1) 43%, rgba(119,112,249,1) 100%)'
  ];
  gradientesAleatorios: string[] = [];
  ultimoGradiente = '';
  indiceActivo: number | null = null;
  elementos = Array(112).fill(null)
  deleteA:boolean = false
  visualData:boolean = false
  private route = inject(Router)
  goCreate(){
    this.route.navigate(['crear'])
    this.deleteArt.changeNav(1)
  }
  goEdit(){
    this.deleteArt.changeNav(2)
    this.route.navigate(['editar'])
  }
  constructor(private deleteArt:MostrarService,
   
    ){
    this.deleteArt.currentMostrar.subscribe(mostrar => {
      this.deleteA = mostrar;
    });
  }
  ngOnInit(): void {
    this.prepararGradientesAleatorios();
  }
  goDelete(){
    this.deleteArt.changeNav(3)
    this.deleteArt.changeMostrar(true)
  }
  prepararGradientesAleatorios(): void {
    this.elementos.forEach((_, index) => {
      let nuevoGradiente;
      do {
        nuevoGradiente = this.gradientes[Math.floor(Math.random() * this.gradientes.length)];
      } while (this.gradientesAleatorios[index - 1] === nuevoGradiente); // Asegurarse de que no sea igual al anterior
      this.gradientesAleatorios.push(nuevoGradiente);
    });
  }

  getGradiente(indice: number): string {
    return this.gradientesAleatorios[indice];
  }

  activarIndice(indice: number) {
      this.indiceActivo = indice; // Activa el nuevo índice
  }
  desactivarIndice(indice:number){
    this.indiceActivo = null; // Desactiva si el índice ya está activo
  }  
}
