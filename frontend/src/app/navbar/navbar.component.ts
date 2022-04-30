import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {NavigationEntry} from '../shared/navigation-entry';
import {NavigationStart, Router} from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @ViewChildren('navbarlink', {read: ElementRef}) navbarLinks: QueryList<ElementRef>;

  navigationEntries: NavigationEntry[] = NavigationEntry.getAllNavigationEntries();

  constructor(private router: Router) {
    router.events.subscribe((event) => this.onRouteChange(event));
  }


  private onRouteChange(event) {

    if (event instanceof NavigationStart) {
      this.highlightCurrentNavigationLink(event.url);
    }
  }

  private highlightCurrentNavigationLink(url: string) {

    this.navbarLinks.forEach((elementRef: ElementRef) => {

      const isCurrentNavbarLink = elementRef.nativeElement.href.endsWith(url);

      if (isCurrentNavbarLink) {
        $(elementRef.nativeElement).addClass('selected-nav-item');
      } else {
        $(elementRef.nativeElement).removeClass('selected-nav-item');
      }
    });
  }
}
