
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationMenu } from '../../../models/navigation-menu.model';
import { NavigationMenuService } from '../../../core/services/navigation-menu.service';


@Component({
  selector: 'teacher-layout',
  standalone: false,
  templateUrl: './teacher-layout.html',
  styleUrls: ['./teacher-layout.css']
})
export class TeacherLayout implements OnInit {
  menus: NavigationMenu[] = [];
  loading = true;
  errorMessage = '';

  expandedMenus = new Set<number>();

  constructor(
    private navigationMenuService: NavigationMenuService,
    private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.loading = true;
    this.errorMessage = '';

    this.navigationMenuService.getMyMenu().subscribe({
      next: (menus: NavigationMenu[]) => {
        this.menus = menus;
        this.loading = false;
         this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Failed to load navigation menus:', error);
        this.errorMessage =
          'Unable to load navigation menus. Please try again.';
        this.loading = false;
         this.cdr.detectChanges();
      }
    });
  }

  toggleMenu(menuId: number): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isExpanded(menuId: number): boolean {
    return this.expandedMenus.has(menuId);
  }

  trackByMenuId(
    index: number,
    menu: NavigationMenu
  ): number {
    return menu.navigationMenuId;
  }

   logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('email');
    localStorage.removeItem('address');
    localStorage.removeItem('phone');
    localStorage.removeItem('userName');

    this.router.navigate(['/login']);

  }
}
