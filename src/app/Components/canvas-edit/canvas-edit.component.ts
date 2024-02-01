import { Component,ElementRef, ViewChild, AfterViewInit,Input, SimpleChanges } from '@angular/core';
import { fabric } from 'fabric';
import { CredentialsWithFiles } from '../../model/CredentialsWithFiles';


@Component({
  selector: 'app-canvas-edit',
  standalone: true,
  imports: [],
  templateUrl: './canvas-edit.component.html',
  styleUrl: './canvas-edit.component.scss'
})
export class CanvasEditComponent implements AfterViewInit{
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
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
      id: { x: 30, y: 570 },
      categoria: { x: 170 , y: 450 },
      nombre: { x: 170 , y: 400 },
      foto: { x: 42 , y: 396 },
      firma: { x: 224 , y: 538  }
    };
    
    this.addTextToCanvas(this._credentials.nombre, positions.nombre.x, positions.nombre.y,180,16,false);
    this.addTextToCanvas(this._credentials.categoria,positions.categoria.x,positions.categoria.y,180,12,true);
    this.addTextToCanvas(this._credentials.id.toString(),positions.id.x,positions.id.y,120,26,false)
    this.loadImage(this._credentials.foto, positions.foto.x, positions.foto.y,126 ,144 );
    this.loadImage(this._credentials.firma, positions.firma.x, positions.firma.y,80);
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



  private loadImage(file: File, x: number, y: number, newWidth?: number, newHeight?: number) {
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
  }
  
  

  private initializeCanvas(): void {
    const canvasWidth = 366 ;
    const canvasHeight = 650;


    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      backgroundColor: 'black',
      width: canvasWidth,
      height: canvasHeight
    });

    fabric.Image.fromURL('../../../assets/1.png', (img) => {
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
  sendEditsToServer() {
    const canvasData = this.canvas.toJSON();
    fetch('http://localhost:8008/api/Credenciales/api/save-canvas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ canvas: canvasData })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  printCanvasJSON() {
    const canvasData = this.canvas.toJSON();
    const canvasDataString = JSON.stringify(canvasData, null, 2); // Convertir a cadena JSON formateada
    const blob = new Blob([canvasDataString], { type: 'text/plain' }); // Crear un Blob con los datos

    const link = document.createElement('a');
    link.download = 'canvasData.txt'; // Nombre del archivo
    link.href = window.URL.createObjectURL(blob);
    link.click(); // Iniciar la descarga
    link.remove(); // Limpiar después de la descarga
}


  
  downloadCanvasImage() {
    // Convertir el lienzo en una data URL (formato PNG por defecto)
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1 // Calidad máxima para PNG
    });

    // Crear un elemento de enlace para la descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'canvas-image.png'; // Nombre del archivo a descargar

    // Disparar la descarga
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  downloadCanvasSVG() {
    // Generar la representación SVG del canvas
    const svgData = this.canvas.toSVG({
      // Configuraciones adicionales si son necesarias
    });
  
    // Crear un Blob con los datos SVG
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
  
    // Crear un enlace para descargar el SVG
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'canvas-image.svg'; // Nombre del archivo a descargar
  
    // Disparar la descarga
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  
}
