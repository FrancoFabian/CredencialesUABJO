import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { MostrarService } from '../../Services/mostrar.service';
import { CommonModule } from '@angular/common'
import { Employees } from '../../model/Employees';
import { EmployeesListService } from '../../Services/employees-list.service';
import { VarEnv } from '../../model/VarEnv';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    EliminarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent implements OnInit {
  private ServiceList = inject(EmployeesListService);
  empleados: Employees[] = [];
  empleadosFiltrados: Employees[] = [];
  imgUrl:string = VarEnv.apiUrl;
  paraEliminar:number = 0;
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
  dataEmpty:String = '';
  searchTerm: string = '';

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
   
    this.cargarEmpleados();
    this.deleteArt.notificarEliminacion$.subscribe(noty =>{
      if(noty === true){
           this.desactivarIndice()
           window.location.reload();

      }
    })
    this.prepararGradientesAleatorios();
  }
  cargarEmpleados() {
    this.ServiceList.listarCredenciales().subscribe({
      next: (response) => {
        if (response.message) {
          // Manejo cuando la respuesta contiene un mensaje (por ejemplo, un mensaje de error o informativo)
          this.dataEmpty = response.message;
          console.log(response.message);
        } else if (response.data) {
          // Manejo cuando la respuesta contiene una lista de empleados
          this.empleados = response.data;
          this.empleadosFiltrados = response.data;
        }
      },
      error: (error) => {
        console.error('Hubo un error al obtener las credenciales:', error);
      },
      complete: () => console.log('Operación de obtención de credenciales completada')
    });
  }
  
  
  goDelete(numEmployee:number){
    this.paraEliminar = numEmployee
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
  desactivarIndice(){
    this.indiceActivo = null; // Desactiva si el índice ya está activo
  }  
  
  goPrint(url: string) {
    // Abre el PDF en una nueva ventana
    let printWindow = window.open(this.imgUrl+url, '_blank');

    printWindow!.addEventListener('load', () => {
      // Espera a que el contenido cargue antes de imprimir
      try {
        // Intenta imprimir el contenido de la nueva ventana
        printWindow!.print();
      } catch (e) {
        console.error("No se pudo imprimir el PDF debido a: ", e);
      }
    }, { once: true });
  }

  filtrarEmpleados() {
    if (!this.searchTerm) {
      this.empleadosFiltrados = this.empleados; // Si no hay término de búsqueda, mostrar todos los empleados
    } else {
      this.empleadosFiltrados = this.empleados.filter(e => 
        e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        e.categoria.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        e.numEmpleado.toString().includes(this.searchTerm)
      );
    }
  }
}


