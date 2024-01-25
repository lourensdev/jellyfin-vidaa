import {
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent implements AfterViewInit {
  @Input() componentFocused: boolean = false;
  @ContentChildren(CardComponent) cards: QueryList<CardComponent> | undefined;
  private cardsArray: CardComponent[] = [];
  private activeCardIndex: number = 0;
  leftPressSubscription: Subscription | null = null;
  rightPressSubscription: Subscription | null = null;

  constructor(private navigationService: NavigationService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['componentFocused']) {
      this.cardsArray.forEach(card => {
        card.setFocusable(this.componentFocused);
        card.isActive && card.setActive();
      });
      // If no cards are active set the 1st one as active
      if (this.cardsArray.filter(card => card.isActive).length === 0) {
        this.cardsArray[0]?.setActive();
      }
    }
  }

  ngOnInit() {
    this.leftPressSubscription =
      this.navigationService.leftNavigation.subscribe(() =>
        this.navigateLeft(),
      );
    this.rightPressSubscription =
      this.navigationService.rightNavigation.subscribe(() =>
        this.navigateRight(),
      );
  }

  private navigateLeft() {
    if (
      this.activeCardIndex > 0 &&
      this.componentFocused &&
      !this.navigationService.getOnExitModal()
    ) {
      this.cardsArray[this.activeCardIndex].isActive = false;
      this.cardsArray[--this.activeCardIndex].setActive();
    }
  }

  private navigateRight() {
    if (
      this.activeCardIndex < this.cardsArray.length - 1 &&
      this.componentFocused &&
      !this.navigationService.getOnExitModal()
    ) {
      this.cardsArray[this.activeCardIndex].isActive = false;
      this.cardsArray[++this.activeCardIndex].setActive();
    }
  }

  ngAfterViewInit() {
    if (this.cards) {
      this.cardsArray = this.cards.toArray();
      // Focus the first card
      Promise.resolve().then(() => {
        if (this.componentFocused) {
          this.cardsArray[this.activeCardIndex].setActive();
          this.cardsArray.forEach(card =>
            card.setFocusable(this.componentFocused),
          );
        } else {
          this.cardsArray.forEach(card => card.setInactive());
        }
      });
    }
  }

  ngOnDestroy() {
    this.leftPressSubscription?.unsubscribe();
    this.rightPressSubscription?.unsubscribe();
  }
}
