import { Component,ElementRef,
         ViewChild, AfterViewInit,Input, inject, 
         OnDestroy,OnInit,NgZone ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';
import { CredentialsWithFiles } from '../../model/CredentialsWithFiles';
import { CreateCrend } from '../../model/CreateCrend';
import { CrearCredentialsService } from '../../Services/crear-credentials.service';
import { base64imageBack } from '../../model/base64imageBack';
import { HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { WebSocketService } from '../../Services/web-socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MostrarService } from '../../Services/mostrar.service';
@Component({
  selector: 'app-canvas-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas-edit.component.html',
  styleUrl: './canvas-edit.component.scss'
})
export class CanvasEditComponent implements AfterViewInit,OnDestroy,OnInit{
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private crearCredentialsService = inject(CrearCredentialsService);
  private webSocketService = inject(WebSocketService);
  private changeDetectorRef =inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private share = inject(MostrarService)
  progress: number = 0; // Para almacenar y mostrar el progreso
  uploadSuccess: boolean = false;
  pdfButton:boolean = true;
  private progressSubscription?: Subscription;
 private canvas!:fabric.Canvas;
 private _credentials?: CredentialsWithFiles;
  ScalaFactor:number = 0;
  @Input() set credentials(value: CredentialsWithFiles | undefined) {
    this._credentials = value;
    if (this.canvas && this._credentials) {
      this.addCredentialsToCanvas();
    }
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
  }
  ngOnInit(): void {
    this.webSocketService.connect();
    this.progressSubscription = this.webSocketService.getMessages().subscribe({
      next: (message) => {
        this.ngZone.run(() => {
          try {
            // Asegúrate de que el mensaje es un objeto JSON válido y tiene la propiedad progress
            let parsedMessage = JSON.parse(message.body);
            if (parsedMessage.hasOwnProperty('progress')) {
              this.progress = parsedMessage.progress;
              
              this.changeDetectorRef.detectChanges(); // Forzar la detección de cambios
            } else {
              console.error('El mensaje no contiene la propiedad progress');
            }
          } catch (e) {
            console.error('Error al analizar el mensaje', e);
          }
        });
      },
      error: (error) => console.error(error),
      complete: () => console.log('Conexión WebSocket completada')
    });
  }
  
  
  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe(); // Limpieza
    }
  }
  private addCredentialsToCanvas() {
    if (!this._credentials) return;

    const positions = {
      id: { x: 54, y: 570 },
      categoria: { x: 194 , y: 460 },
      nombre: { x: 194 , y: 400 },
      foto: { x: 49 , y: 400 },
      firma: { x: 224 , y: 568  }
    };
    
    this.addTextToCanvas(this._credentials.nombre, positions.nombre.x, positions.nombre.y,180,18,false);
    this.addTextToCanvas(this._credentials.categoria,positions.categoria.x,positions.categoria.y,180,16,true);
    this.addTextToCanvas(this._credentials.id.toString(),positions.id.x,positions.id.y,120,26,false)
    this.loadImage(this._credentials.fotoBas64, positions.foto.x, positions.foto.y,129 ,148 );
    this.loadImage(this._credentials.firmaBas64, positions.firma.x, positions.firma.y,140);
  }

  private addTextToCanvas(text: string, x: number, y: number, boxWidth: number,fontS:number,bold:boolean) {
    const fontW = bold ? 'bold' : 'normal';
    let originalText = text; // Declara originalText fuera del manejador de eventos
    const fabricTextbox = new fabric.Textbox(text, {
      left: x,
      top: y,
      width: boxWidth, // Ancho del cuadro de texto
      fontSize: fontS,
      fontFamily: 'Helvetica',
      fontWeight:fontW,
      fill: '#0B0B60',
      textAlign: 'center',
      splitByGrapheme: true, // Para un mejor manejo del salto de línea
      // Otros atributos necesarios...
      objectCaching: false,
      editable: true 
    });
    
    fabricTextbox.on('text:changed', (e) => {
      if (e.target && e.target.type === 'textbox') {
        const textbox = e.target as fabric.Textbox;
        const currentText = textbox.text;
    
        if (currentText !== undefined && currentText.replace(originalText, '').trim().length > 0) {
          // Si se detectan cambios distintos de espacios, reestablecer el texto original
          textbox.set({ text: originalText });
        } else if (currentText !== undefined) {
          // Actualizar el texto original si solo se han añadido espacios
          originalText = currentText;
        }
      }
    });
        // Evento cuando el textbox es seleccionado
      fabricTextbox.on('selected', () => {
        this.canvasElement.nativeElement.style.cursor = 'text'; // Cambia el cursor a estilo de texto
      });

      // Evento cuando el textbox es deseleccionado
      fabricTextbox.on('deselected', () => {
        this.canvasElement.nativeElement.style.cursor = 'default'; // Restablece el cursor al estado predeterminado
      });


    this.canvas.add(fabricTextbox);
}

private loadImage(base64Image: string, x: number, y: number, newWidth?: number, newHeight?: number) {
  

    fabric.Image.fromURL(base64Image, (img) => {
      // Ajusta la imagen como antes
      if (newWidth !== undefined && newHeight !== undefined && img.width && img.height) {
        const scaleX = newWidth / img.width;
        const scaleY = newHeight / img.height;
        img.scaleX = scaleX;
        img.scaleY = scaleY;
      } else {
        if (newWidth !== undefined) img.scaleToWidth(newWidth);
        if (newHeight !== undefined) img.scaleToHeight(newHeight);
      }

      img.set({ left: x, top: y });
      this.canvas.add(img);
      this.canvas.renderAll();
    });
 
}

  private initializeCanvas(): void {
    const canvasWidth = 414 ;
    const canvasHeight = 650;


    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      backgroundColor: 'black',
      width: canvasWidth,
      height: canvasHeight
    });

    fabric.Image.fromURL(base64imageBack.image1, (img) => {
      this.setCanvasBackground(img, canvasWidth, canvasHeight);
    });
  }

  private setCanvasBackground(img: fabric.Image, canvasWidth: number, canvasHeight: number) {
    const imgAspectRatio = img.width! / img.height!;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    let newWidth = canvasWidth;
    let newHeight = canvasHeight;

    if (imgAspectRatio > canvasAspectRatio) {
      newHeight = newWidth / imgAspectRatio;
    } else {
      newWidth = newHeight * imgAspectRatio;
    }

    img.scaleToWidth(newWidth);
    img.scaleToHeight(newHeight);
    img.set({
      selectable: false, // No se puede seleccionar
        evented: false,    // No responde a eventos del mouse
        lockMovementX: true, // Bloquea el movimiento en X
        lockMovementY: true, // Bloquea el movimiento en Y
        lockRotation: true, // Bloquea la rotación
        lockScalingX: true, // Bloquea el escalado en X
        lockScalingY: true, // Bloquea el escalado en Y
        hasControls: false, // No muestra controles de redimensionado/rotación
        hasBorders: false,  // No muestra bordes
    });
    img.setCoords();
    this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
    this.addAdditionalElements();
  }
  private addAdditionalElements(): void {
    if (this._credentials) {
      this.addCredentialsToCanvas();
    }
    // Aquí puedes añadir cualquier otro elemento adicional
  }
  downloadCanvasSVG() {
    this.pdfButton = false;
    // Generar la representación SVG del canvas
    const svgData = this.canvas.toSVG({
      // Configuraciones adicionales si son necesarias
    });
  
    // Crear un Blob con los datos SVG
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const svgFileName = `${this._credentials?.id}_${this._credentials?.nombre.replace(/\s+/g, '')}_${this._credentials?.categoria}.svg`;
    const svgFile = new File([svgBlob], svgFileName, { type: 'image/svg+xml' });
    if (this._credentials) {
      const credentialsToUpload = new CreateCrend(
        this._credentials.id,
        this._credentials.nombre,
        this._credentials.foto,
        this._credentials.categoria,
        this._credentials.firma,
        svgFile // Este es el nuevo SVG como File
      );
    
      this.crearCredentialsService.uploadCredentials(credentialsToUpload).subscribe({
        next: (response: HttpResponse<string>) => {
          console.log('Response:', response);
          if (response.status === 200) {
            console.log('SVG and credentials uploaded successfully', response.body);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error uploading SVG and credentials', error);
        },
        complete: () => {
        console.log('Upload operation completed')
        this.showSuccessMessage();
      }
      });
      
      
    } else {
      console.error('Credentials data is not available.');
    }
    
    
  }
  showSuccessMessage() {
    this.uploadSuccess = true;
  // Forzar la detección de cambios para actualizar la UI inmediatamente
    this.changeDetectorRef.detectChanges();
    // Aquí podrías cambiar una variable de estado para mostrar un mensaje en la UI, por ejemplo:
    
    setTimeout(() =>{
    this.uploadSuccess = false;
    // Opcionalmente, resetear el progreso y otros estados si es necesario
    this.progress = 0;
    this.pdfButton = true; // Muestra nuevamente el botón si es el flujo deseado
    this.changeDetectorRef.detectChanges(); 
    this.credentials = undefined; // O establecer a un nuevo valor por defecto si es apropiado
    this.share.changeNav(0)
    this.router.navigate(['listar']);
  }, 3000); // Oculta el mensaje después de 3 segundos
  }
  
}
