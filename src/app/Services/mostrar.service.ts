import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MostrarService {

  private mostrarSource = new BehaviorSubject<boolean>(false);
  currentMostrar = this.mostrarSource.asObservable();
  private activeNavbar = new BehaviorSubject<number>(0);
  currentAtive = this.activeNavbar.asObservable();
  constructor() { }

  changeMostrar(value: boolean) {
    this.mostrarSource.next(value);
  }
  changeNav(value: number){
    this.activeNavbar.next(value);
  }
}
