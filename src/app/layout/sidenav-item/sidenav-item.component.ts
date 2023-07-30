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

interface NavItemWithChildren {
  icon: string;
  name: string;
  children: NavItemWithLink[];
}

interface NavItemWithLink {
  icon?: string;
  name: string;
  link: string;
}

export type SidenavItem = NavItemWithChildren | NavItemWithLink;
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
export class SidenavItemComponent implements OnInit {
  @Input() item: SidenavItem;
  isOpen: boolean;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    if ('children' in this.item) this.isOpen = this.item.children.some(child => this.isActive(child.link));
    else this.isOpen = false;
  }

  private isActive(link?: string): boolean {
    if (!link) return false;
    return link.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
  }

  getFontSet(): string {
    return this.item.icon?.endsWith('_outlined') ? 'material-icons-outlined' : 'material-icons';
  }

  getClassList(): string {
    if ('children' in this.item) return this.isOpen ? 'expanded' : 'collapsed';
    return this.isActive(this.item.link) ? 'active' : '';
  }

  handleClick(): void {
    if ('children' in this.item) this.isOpen = !this.isOpen;
    else this.router.navigate([this.item.link]);
  }

  hasChildren(): boolean {
    return 'children' in this.item;
  }

  getChildren(): NavItemWithLink[] {
    return 'children' in this.item ? this.item.children : [];
  }
}
