import { Component, inject, OnInit } from '@angular/core';
import { UserSettingsService, UserProfile } from '../../services/user-settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private userSettingsService = inject(UserSettingsService);

  user: UserProfile | null = null;

  avatarColors: string[] = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#ef4444', '#22c55e'];

  ngOnInit() {
    this.user = this.userSettingsService.getCurrentUser();

    this.userSettingsService.currentUser$.subscribe(u => {
      this.user = u;
    });
  }

  get avatarInitials(): string {
    if (!this.user) return '?';
    const first = this.user.firstName ? this.user.firstName.charAt(0).toUpperCase() : '';
    const last = this.user.lastName ? this.user.lastName.charAt(0).toUpperCase() : '';
    return first + last || '?';
  }

  get avatarColor(): string {
    if (!this.user) return '#94a3b8';
    const index = this.user.firstName.length % this.avatarColors.length;
    return this.avatarColors[index];
  }
}
