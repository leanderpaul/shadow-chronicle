/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

export interface SidenavItem {
  icon: string;
  name: string;
  link: string;
  activeRegex?: RegExp;
}

/**
 * Declaring the constants
 */

@Component({
  selector: 'app-sidenav-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
})
export class SidenavItemComponent {
  @Input() item: SidenavItem;
  @Input() collapsed: boolean;

  getFontSet(): string {
    return this.item.icon?.endsWith('_outlined') ? 'material-icons-outlined' : 'material-icons';
  }

  getClassList(): string {
    const classList = [];
    const itemLink = this.item.link.replace(/\/$/, '');
    const pathname = window.location.pathname.replace(/\/$/, '');
    const isActive = itemLink === pathname || (this.item.activeRegex && this.item.activeRegex.test(pathname));
    if (isActive) classList.push('active');
    if (this.collapsed) classList.push('collapsed');
    return classList.join(' ');
  }
}
