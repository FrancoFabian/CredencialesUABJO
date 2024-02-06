import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSubject = new Subject<any>();

  constructor() {}

  public connect() {
    const url = 'http://localhost:8008/ws';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/progress', (message: any) => {
        // Emite el mensaje recibido a través del Subject
        this.messageSubject.next(message);
      });
    }, this.errorCallBack);
  }

  // Retorna el Subject como Observable para ser consumido por componentes
  public getMessages() {
    return this.messageSubject.asObservable();
  }

  private errorCallBack(error: string) {
    console.log('errorCallBack -> ' + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  public disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }
}
