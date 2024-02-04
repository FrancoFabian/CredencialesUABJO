import { Component,ElementRef, ViewChild, AfterViewInit,Input, SimpleChanges, inject } from '@angular/core';
import { fabric } from 'fabric';
import { CredentialsWithFiles } from '../../model/CredentialsWithFiles';
import { CreateCrend } from '../../model/CreateCrend';
import { CrearCredentialsService } from '../../Services/crear-credentials.service';
import { base64imageBack } from '../../model/base64imageBack';
@Component({
  selector: 'app-canvas-edit',
  standalone: true,
  imports: [],
  templateUrl: './canvas-edit.component.html',
  styleUrl: './canvas-edit.component.scss'
})
export class CanvasEditComponent implements AfterViewInit{
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private crearCredentialsService = inject(CrearCredentialsService);
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
  private addCredentialsToCanvas() {
    if (!this._credentials) return;

    const positions = {
      id: { x: 54, y: 570 },
      categoria: { x: 194 , y: 460 },
      nombre: { x: 194 , y: 400 },
      foto: { x: 50 , y: 400 },
      firma: { x: 224 , y: 568  }
    };
    
    this.addTextToCanvas(this._credentials.nombre, positions.nombre.x, positions.nombre.y,180,18,false);
    this.addTextToCanvas(this._credentials.categoria,positions.categoria.x,positions.categoria.y,180,16,true);
    this.addTextToCanvas(this._credentials.id.toString(),positions.id.x,positions.id.y,120,26,false)
    this.loadImage(this._credentials.fotoBas64, positions.foto.x, positions.foto.y,127 ,146 );
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


  /*private loadImage(file: File, x: number, y: number, newWidth?: number, newHeight?: number) {
    const reader = new FileReader();
  reader.onload = (event) => {
    fabric.Image.fromURL(event.target!.result as string, (img) => {
      if (newWidth !== undefined && newHeight !== undefined && img.width && img.height) {
        // Escalar la imagen independientemente en X e Y para forzar las dimensiones
        const scaleX = newWidth / img.width;
        const scaleY = newHeight / img.height;
        img.scaleX = scaleX;
        img.scaleY = scaleY;
      } else {
        if (newWidth !== undefined) {
          img.scaleToWidth(newWidth);
        }
        if (newHeight !== undefined) {
          img.scaleToHeight(newHeight);
        }
      }

      img.set({ left: x, top: y });
      this.canvas.add(img);
      this.canvas.renderAll();
    });
  };
    reader.readAsDataURL(file);
  }*/
  
  

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
        next: (response: any) => {
          console.log('SVG and credentials uploaded successfully', response);
        },
        error: (error: any) => {
          console.error('Error uploading SVG and credentials', error);
        },
        complete: () => console.log('Upload operation completed')
      });
      
    } else {
      console.error('Credentials data is not available.');
    }
    
    /* Crear un enlace para descargar el SVG
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = `${this._credentials?.id}_${this._credentials?.nombre.replace(/\s+/g, '')}_${this._credentials?.categoria}.svg`; // Nombre del archivo a descargar
  
    // Disparar la descarga
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);*/
  }
  
}
