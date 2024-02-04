import { Component, inject } from '@angular/core';
import {ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MostrarService } from '../../Services/mostrar.service';
import { Router } from '@angular/router';
import { CredentialsWithFiles } from '../../model/CredentialsWithFiles';
import { CanvasEditComponent } from '../canvas-edit/canvas-edit.component';
@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [ReactiveFormsModule,CanvasEditComponent],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss'
})
export class CrearComponent {
  form:FormGroup;
  private route = inject(Router)
  active: boolean = false;
  activeFirma:boolean = false;
  activeFotoperson:boolean = false;
  imageSave :File | null = null; // Propiedad para almacenar el archivo de imagen
  imageSrc2 !: string;
  imageFirma:File | null = null;
  preFirma!:string;
  activeCredentialsEdit:boolean = false;
  credentialsA!:CredentialsWithFiles;
  constructor(private fb: FormBuilder,
    private share:MostrarService
    ) {
    this.form = this.fb.group({
      nomempleado:['',[Validators.required]],
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      
    });
  }
  
  onSubmit() {
    if(this.imageSave !== null && this.imageFirma !== null){
      const credentials = new CredentialsWithFiles(
        this.form.value.nomempleado,
        this.form.value.nombre,
        this.imageSave,
        this.form.value.categoria,
        this.imageFirma,
        this.imageSrc2,
        this.preFirma
      );
      this.credentialsA = credentials;
      this.activeCredentialsEdit = true
      
      console.log(credentials)
    }
    
    // Aquí puedes manejar la lógica de envío del formulario, como enviar los datos a un servidor
  }

  goEdit() {
    // Lógica para editar
  }
  toggleActive() {
    this.active = !this.active;
  }
  resetForm() {
    this.form.reset();
    this.active = false;
    this.imageFirma = null
    this.imageSave = null
    this.activeFirma = false
    this.activeFotoperson = false
    this.share.changeNav(0)
    this.route.navigate(['listar']);
  }
  onFileTWO(event:any){
    console.log('onFile called', event);
       const file = event.target.files[0];
       if(file){
        this.imageSave = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e:any)=>{
            this.imageSrc2 = e.target.result;
        };
        this.activeFotoperson = true
        reader.readAsDataURL(file);
 
       }
   }
   onFileFirma(event:any){
    console.log('onFile called', event);
       const file = event.target.files[0];
       if(file){
        this.imageFirma = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e:any)=>{
            this.preFirma = e.target.result;
        };
        this.activeFirma = true;
        reader.readAsDataURL(file);
       
       }
   }
   
}
