import { Component } from '@angular/core';
import { MostrarService } from '../../Services/mostrar.service';

@Component({
  selector: 'app-eliminar',
  standalone: true,
  imports: [],
  templateUrl: './eliminar.component.html',
  styleUrl: './eliminar.component.scss'
})
export class EliminarComponent {
  constructor(private share:MostrarService){

  }
  cancel(){
    this.share.changeNav(0)
    this.share.changeMostrar(false)
  }

}
