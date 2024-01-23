import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  // Directions
  private upNavigationEvent = new Subject<void>();
  private rightNavigationEvent = new Subject<void>();
  private downNavigationEvent = new Subject<void>();
  private leftNavigationEvent = new Subject<void>();
  // Actions
  private enterNavigationEvent = new Subject<void>();
  private backNavigationEvent = new Subject<void>();

  // Directions
  upNavigation = this.upNavigationEvent.asObservable();
  rightNavigation = this.rightNavigationEvent.asObservable();
  downNavigation = this.downNavigationEvent.asObservable();
  leftNavigation = this.leftNavigationEvent.asObservable();
  // Actions
  enterNavigation = this.enterNavigationEvent.asObservable();
  backNavigation = this.backNavigationEvent.asObservable();

  pressUp(): void {
    this.upNavigationEvent.next();
  }

  pressRight(): void {
    this.rightNavigationEvent.next();
  }

  pressDown(): void {
    this.downNavigationEvent.next();
  }

  pressLeft(): void {
    this.leftNavigationEvent.next();
  }

  pressEnter(): void {
    this.enterNavigationEvent.next();
  }

  pressBack(): void {
    this.backNavigationEvent.next();
  }
}
