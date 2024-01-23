import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  @Input() componentFocused: boolean = false;
  activeButtonIndex: number = 0;
  leftPressSubscription: Subscription | null = null;
  rightPressSubscription: Subscription | null = null;
  enterPressSubscription: Subscription | null = null;
  backPressSubscription: Subscription | null = null;

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit() {
    this.leftPressSubscription =
      this.navigationService.leftNavigation.subscribe(() =>
        this.navigateLeft(),
      );
    this.rightPressSubscription =
      this.navigationService.rightNavigation.subscribe(() =>
        this.navigateRight(),
      );
    this.enterPressSubscription =
      this.navigationService.enterNavigation.subscribe(() => this.enterPress());
    this.backPressSubscription =
      this.navigationService.backNavigation.subscribe(() => this.backPress());
  }

  private navigateLeft() {
    if (this.activeButtonIndex > 0 && this.componentFocused) {
      this.activeButtonIndex--;
    }
  }

  private navigateRight() {
    if (this.activeButtonIndex < 1 && this.componentFocused) {
      this.activeButtonIndex++;
    }
  }

  private enterPress() {
    if (this.activeButtonIndex === 0 && this.componentFocused) {
      window.close();
    } else if (this.activeButtonIndex === 1 && this.componentFocused) {
      this.modalService.closeModal();
    }
  }

  private backPress() {
    if (this.componentFocused) {
      this.modalService.closeModal();
    }
  }

  ngOnDestroy() {
    this.leftPressSubscription?.unsubscribe();
    this.rightPressSubscription?.unsubscribe();
    this.enterPressSubscription?.unsubscribe();
    this.backPressSubscription?.unsubscribe();
  }
}
