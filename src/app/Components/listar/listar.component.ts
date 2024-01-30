import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { MostrarService } from '../../Services/mostrar.service';
@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    EliminarComponent
  ],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent {
  deleteA:boolean = false
  private route = inject(Router)
  goCreate(){
    this.route.navigate(['crear'])
    this.deleteArt.changeNav(1)
  }
  goEdit(){
    this.deleteArt.changeNav(2)
    this.route.navigate(['editar'])
  }
  constructor(private deleteArt:MostrarService){
    this.deleteArt.currentMostrar.subscribe(mostrar => {
      this.deleteA = mostrar;
    });
  }
  goDelete(){
    this.deleteArt.changeNav(3)
    this.deleteArt.changeMostrar(true)
  }
}
