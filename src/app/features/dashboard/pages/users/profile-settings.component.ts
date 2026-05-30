import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSettingsService, UserProfile, UpdateUserRequest } from '../../services/user-settings.service';

export interface ToastState {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  private userSettingsService = inject(UserSettingsService);
  private cdr = inject(ChangeDetectorRef);

  areas: string[] = ['Software', 'Accounting', 'Management'];

  avatarColors: string[] = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#ef4444', '#22c55e'];

  user: UserProfile = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    area: '',
    role: ''
  };

  saving = false;

  toast: ToastState = { visible: false, type: 'success', message: '' };
  private toastTimeout: any;

  get avatarInitials(): string {
    const first = this.user.firstName ? this.user.firstName.charAt(0).toUpperCase() : '';
    const last = this.user.lastName ? this.user.lastName.charAt(0).toUpperCase() : '';
    return first + last || '?';
  }

  get avatarColor(): string {
    const index = this.user.firstName.length % this.avatarColors.length;
    return this.avatarColors[index];
  }

  ngOnInit() {
    const currentUser = this.userSettingsService.getCurrentUser();
    if (currentUser) {
      this.user = { ...currentUser };
    }
  }

  save() {
    if (!this.user.id) return;

    this.saving = true;
    this.cdr.detectChanges();

    const payload: UpdateUserRequest = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      area: this.user.area
    };

    this.userSettingsService.updateUser(this.user.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.showToast('success', 'Profile updated successfully.');
      },
      error: (err) => {
        this.saving = false;
        this.cdr.detectChanges();
        this.showToast('error', err.error?.message || err.message || 'An error occurred while updating the profile.');
      }
    });
  }

  private showToast(type: 'success' | 'error', message: string) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toast = { visible: true, type, message };
    this.cdr.detectChanges();
    this.toastTimeout = setTimeout(() => {
      this.toast.visible = false;
      this.cdr.detectChanges();
    }, 5000);
  }
}
