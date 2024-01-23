import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openCloseModal = false;

  constructor() {}

  toggleModal() {
    this.openCloseModal = !this.openCloseModal;
  }

  openModal() {
    this.openCloseModal = true;
  }

  closeModal() {
    this.openCloseModal = false;
  }

  getModalState() {
    return this.openCloseModal;
  }
}
