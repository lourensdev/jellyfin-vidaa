import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { SliderComponent } from './components/slider/slider.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './services/modal.service';
import {
  VK_LEFT,
  VK_RIGHT,
  VK_UP,
  VK_DOWN,
  VK_ENTER,
  VK_BACK_SPACE,
} from './utilities/constants';
import {
  FocusDirection,
  NavigationService,
} from './services/navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, CardComponent, SliderComponent, ModalComponent],
})
export class AppComponent implements OnInit {
  title = 'jellyfin-vidaa';
  upPressSubscription: Subscription | null = null;
  downPressSubscription: Subscription | null = null;
  backPressSubscription: Subscription | null = null;

  constructor(
    public modalService: ModalService,
    public navigationService: NavigationService,
  ) {}

  ngOnInit() {
    this.backPressSubscription =
      this.navigationService.backNavigation.subscribe(() =>
        this.modalService.openModal(),
      );
    this.upPressSubscription = this.navigationService.upNavigation.subscribe(
      () => this.pressUp(),
    );
    this.downPressSubscription =
      this.navigationService.downNavigation.subscribe(() => this.pressDown());

    document.addEventListener(
      'keydown',
      ev => {
        switch (ev.keyCode) {
          case VK_LEFT:
            // Handle mandatory key ←
            this.navigationService.pressLeft();
            break;
          case VK_RIGHT:
            // Handle mandatory key →
            this.navigationService.pressRight();
            break;
          case VK_UP:
            // Handle mandatory key ↑
            this.navigationService.pressUp();
            break;
          case VK_DOWN:
            // Handle mandatory key ↓
            this.navigationService.pressDown();
            break;
          case VK_ENTER:
            // Handle mandatory key Confirm / Select / OK
            this.navigationService.pressEnter();
            break;
          case VK_BACK_SPACE:
            // Handle mandatory key Back / Return
            this.navigationService.pressBack();
            break;
        }
        // Block the browser from handling the keydown event.
        ev.preventDefault();
      },
      false,
    );
  }

  pressUp(): void {
    this.navigationService.moveFocusRow(FocusDirection.UP);
  }

  pressDown(): void {
    this.navigationService.moveFocusRow(FocusDirection.DOWN);
  }

  ngOnDestroy() {
    this.upPressSubscription?.unsubscribe();
    this.downPressSubscription?.unsubscribe();
    this.backPressSubscription?.unsubscribe();
  }
}
