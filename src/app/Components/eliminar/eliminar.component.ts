import { Component, Input, inject,Output, EventEmitter } from '@angular/core';
import { MostrarService } from '../../Services/mostrar.service';
import { EmployeesListService } from '../../Services/employees-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eliminar',
  standalone: true,
  imports: [],
  templateUrl: './eliminar.component.html',
  styleUrl: './eliminar.component.scss'
})
export class EliminarComponent {
  private deleteService =  inject(EmployeesListService);
  private router = inject(Router);
  @Input() numEmployee:number = 0;
  constructor(private share:MostrarService){

  }
  cancel(){
    this.share.changeNav(0)
    this.share.changeMostrar(false)
  }
goDelete(){
   this.deleteService.eliminarCredencial(this.numEmployee).subscribe({
      next: (response) => {
        console.log('Credencial eliminada con éxito', response);
        // Aquí puedes redirigir o actualizar la vista según sea necesario
     

      },
      error: (error) =>{
       console.error('Error al eliminar la credencial', error)
       
      },
      complete:() =>{
        this.share.changeMostrar(false)
        this.share.changeNav(0)
        this.share.notificarEliminacion(true);
      }
    });
       

  }
}
