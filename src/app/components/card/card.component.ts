import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  host: {
    class: 'first:ps-overscan last:pe-overscan p-1',
  },
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() isActive: boolean | undefined;
  @Input() isFocused: boolean | undefined;
  @Input() isLandscape: boolean | undefined;
  @Input() isLarge: boolean | undefined;
  @Input() hideTitle: boolean | undefined;

  constructor(private elementRef: ElementRef) {}

  setFocusable(state: boolean) {
    this.isFocused = state;
  }

  setActive() {
    this.isActive = true;
    this.elementRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }

  setInactive() {
    this.isActive = false;
  }
}
