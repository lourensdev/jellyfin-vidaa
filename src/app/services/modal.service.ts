import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openCloseModal = false;

  constructor(private navigationService: NavigationService) {}

  toggleModal() {
    this.openCloseModal = !this.openCloseModal;
    this.navigationService.setOnExitModal(!this.openCloseModal);
  }

  openModal() {
    this.openCloseModal = true;
    this.navigationService.setOnExitModal(true);
  }

  closeModal() {
    this.openCloseModal = false;
    this.navigationService.setOnExitModal(false);
  }

  getModalState() {
    return this.openCloseModal;
  }
}
