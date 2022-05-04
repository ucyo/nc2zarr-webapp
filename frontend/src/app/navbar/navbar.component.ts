import {ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {NavigationEntry} from '../shared/navigation-entry';
import {NavigationStart, Router} from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    @ViewChildren('navbarlink', {read: ElementRef}) navbarLinks: QueryList<ElementRef>;

    navigationEntries: NavigationEntry[] = NavigationEntry.getAllNavigationEntries();
    currentNavigationLink: string;

    constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef) {
        router.events.subscribe((event) => this.onRouteChange(event));
    }

    private onRouteChange(event) {
        if (event instanceof NavigationStart) {
            this.currentNavigationLink = event.url;
            this.changeDetectorRef.detectChanges();
        }
    }
}
