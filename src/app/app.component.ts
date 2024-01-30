import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavIt } from './navItems/NavItems';
import { MostrarService } from './Services/mostrar.service';
import { CanvasEditComponent } from './Components/canvas-edit/canvas-edit.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,CanvasEditComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private router = inject(Router)
  band:number  = 0
  NavItems:NavIt[] = [
    {name:"Listar",icon:"bi bi-list-check"},
    {name:"Crear",icon:"bi bi-database-fill-add"},
    {name:"Editar",icon:"bi bi-pen"},
    {name:"Eliminar",icon:"bi bi-trash3-fill"},
    {name:"PFD",icon:"bi bi-filetype-pdf"}
]
  title = 'Articles';
  ngOnInit(): void {
      
  }
  constructor(private data:MostrarService){
    this.data.currentAtive.subscribe(num =>{
      this.band = num
    })
  }
  
}
