/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

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
    const isActive = this.item.link.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
    if (isActive) classList.push('active');
    if (this.collapsed) classList.push('collapsed');
    return classList.join(' ');
  }
}
