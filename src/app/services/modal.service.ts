import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openCloseModal = false;

  constructor() { }

  toggleModal() {
    this.openCloseModal = !this.openCloseModal;
  }

  getModalState() {
    return this.openCloseModal;
  }
}
