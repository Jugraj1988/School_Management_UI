import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { finalize } from 'rxjs';
import { User, UserService } from '../core/services/user-services';

@Component({
  selector: 'app-users',
  standalone: false,
  styleUrl: './users.css',
  templateUrl: './users.html'
})
export class Users implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  searchText = '';
  selectedStatus = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getUsers()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: users => {
          this.users = users ?? [];
          this.filterUsers();
        },
        error: error => {
          this.errorMessage =
            error?.error?.Message ||
            error?.error?.message ||
            error?.error?.title ||
            'Unable to load users. Please try again.';

          this.cdr.detectChanges();
        }
      });
  }

  filterUsers(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      const matchesSearch =
        !search ||
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phoneNumber?.toLowerCase().includes(search) ||
        user.address?.toLowerCase().includes(search);

      const matchesStatus =
        !this.selectedStatus ||
        String(user.isActive) === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.cdr.detectChanges();
  }

  toggleUserStatus(user: User): void {
    this.errorMessage = '';
    this.successMessage = '';

    const request$ = user.isActive
      ? this.userService.deactivateUser(user.userId)
      : this.userService.activateUser(user.userId);

    request$
      .pipe(
        finalize(() => this.cdr.detectChanges())
      )
      .subscribe({
        next: updatedUser => {
          const index = this.users.findIndex(
            item => item.userId === user.userId
          );

          if (index !== -1) {
            this.users[index] = updatedUser;
          }

          this.filterUsers();

          this.successMessage = updatedUser.isActive
            ? 'User activated successfully.'
            : 'User deactivated successfully.';

          this.cdr.detectChanges();
          this.loadUsers();
        },
        error: error => {
          this.errorMessage =
            error?.error?.Message ||
            error?.error?.message ||
            error?.error?.title ||
            'Unable to update user status.';

          this.cdr.detectChanges();
        }
      });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.filterUsers();
  }
}
