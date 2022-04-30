import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public isLinksPage = false;
  title = 'nc2zarr-frontend';

  @ViewChild('tooltip', {static: false}) tooltip: ElementRef;

  constructor(private router: Router) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLinksPage = event.url === '/links';
      }
    });
  }

  ngAfterViewInit() {

    [].forEach.call(document.querySelectorAll('img[data-src]'), img => {
      img.setAttribute('src', img.getAttribute('data-src'));
      img.onload = () => {
        img.removeAttribute('data-src');
      };
    });
  }

  onActivate($event: any) {
    window.scroll(0, 0);
  }
}
