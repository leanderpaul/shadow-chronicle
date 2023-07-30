/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

/**
 * Importing user defined packages
 */
import { AuthService, type User } from '@app/services';

import { type SidenavItem, SidenavItemComponent } from './sidenav-item';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

const navItems: SidenavItem[] = [
  { name: 'Dashboard', link: '/', icon: 'home' },
  {
    name: 'Expenses',
    icon: 'attach_money',
    children: [
      { name: 'List Expenses', link: '/expenses' },
      { name: 'Add Expense', link: '/expenses/add' },
    ],
  },
  {
    name: 'Memoir',
    icon: 'archive_outlined',
    children: [
      { name: 'Insight', link: '/memoir' },
      { name: 'Sleep', link: '/memoir/sleep' },
      { name: 'Exercise', link: '/memoir/exercise' },
      { name: 'Food', link: '/memoir/food' },
      { name: 'Activity', link: '/memoir/activity' },
      { name: 'Diary', link: '/memoir/diary' },
      { name: 'Events', link: '/memoir/events' },
    ],
  },
];

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatMenuModule, MatDividerModule, SidenavItemComponent],
  standalone: true,
})
export class LayoutComponent implements OnInit {
  user: User;
  logoutUrl: string;
  manageAccountUrl: string;

  constructor(private readonly authService: AuthService) {
    const hostname = window.location.hostname;
    const topDomain = hostname.split('.').slice(1).join('.');
    const redirectUrl = encodeURIComponent(`https://${window.location.host}`);
    this.logoutUrl = `https://accounts.${topDomain}/auth/signout?redirectUrl=${redirectUrl}`;
    this.manageAccountUrl = `https://accounts.${topDomain}/home`;
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => (this.user = user));
  }

  getNavItems(): SidenavItem[] {
    return navItems;
  }
}
