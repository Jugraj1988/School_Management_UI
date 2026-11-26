import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../core/services/user-services';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  profile: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getMyProfile().subscribe({
      next: (response: any) => {
        console.log('Profile response:', response);

        this.profile = response.data;
        this.loading = false;

        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Profile error:', error);

        this.errorMessage =
          error.error?.message ||
          error.error?.Message ||
          'Unable to load profile.';

        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
}