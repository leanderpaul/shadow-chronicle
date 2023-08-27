/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { type Observable } from 'rxjs';

/**
 * Importing user defined packages
 */
import { AuthService, type User } from '@app/shared/services';

import { type SidenavItem, SidenavItemComponent } from './sidenav-item';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const NAV_STATE_KEY = 'shadow:chronicle:side-nav';
const initialNavState = localStorage.getItem(NAV_STATE_KEY) !== 'collapsed';
const navItems: SidenavItem[] = [
  { name: 'Dashboard', link: '/', icon: 'home' },
  { name: 'Expenses', icon: 'attach_money', link: '/expenses', activeRegex: /^\/expenses((\/)[a-z/]*)?/ },
  { name: 'Sleep', icon: 'hotel', link: '/sleep' },
  { name: 'Exercise', icon: 'fitness_center', link: '/exercise' },
  { name: 'Food', icon: 'restaurant', link: '/food' },
  { name: 'Activity', icon: 'work', link: '/activity' },
  { name: 'Diary', icon: 'description', link: '/diary' },
  { name: 'Events', icon: 'event', link: '/events' },
];

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatMenuModule, MatDividerModule, SidenavItemComponent],
  standalone: true,
})
export class LayoutComponent {
  @ViewChild(MatSidenavContent) sidenav: MatSidenavContent;

  readonly user$: Observable<User>;

  logoutUrl: string;
  manageAccountUrl: string;
  isSidenavOpen = initialNavState;

  constructor(private readonly authService: AuthService) {
    const hostname = window.location.hostname;
    const topDomain = hostname.split('.').slice(1).join('.');
    const redirectUrl = encodeURIComponent(`https://${window.location.host}`);
    this.logoutUrl = `https://accounts.${topDomain}/auth/signout?redirectUrl=${redirectUrl}`;
    this.manageAccountUrl = `https://accounts.${topDomain}/home`;

    this.user$ = this.authService.getUser$();
  }

  getNavItems(): SidenavItem[] {
    return navItems;
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    const element = this.sidenav.getElementRef().nativeElement;
    element.style.marginLeft = this.isSidenavOpen ? '250px' : '60px';
    element.style.transition = 'margin-left 0.2s ease-in-out';
    localStorage.setItem(NAV_STATE_KEY, this.isSidenavOpen ? 'expanded' : 'collapsed');
  }
}
