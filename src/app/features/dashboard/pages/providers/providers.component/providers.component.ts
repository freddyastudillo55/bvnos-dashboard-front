import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProviderService, ProviderDashboardResponseDTO } from '../../../services/provider.service';

export interface ToastState {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css'
})
export class ProvidersComponent implements OnInit {
  private providersService = inject(ProviderService);
  private cdr = inject(ChangeDetectorRef);

  providers: ProviderDashboardResponseDTO[] = [];
  filteredProviders: ProviderDashboardResponseDTO[] = [];

  searchTerm: string = '';
  statusFilter: string = 'active';

  isModalOpen = false;
  currentProvider: Partial<ProviderDashboardResponseDTO> = {};
  saving = false;

  showDeleteModal = false;
  providerToDelete: string | null = null;

  toast: ToastState = { visible: false, type: 'success', message: '' };
  private toastTimeout: any;

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    const request = this.statusFilter === 'active'
      ? this.providersService.getAllActiveProviders()
      : this.providersService.getAllProviders();

    request.subscribe({
      next: (data) => {
        this.providers = data;
        this.filterProviders();
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('error', 'An error occurred while loading providers.');
      }
    });
  }

  filterProviders(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProviders = [...this.providers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProviders = this.providers.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }
  }

  openModal(provider?: ProviderDashboardResponseDTO): void {
    if (provider) {
      this.currentProvider = { ...provider };
    } else {
      this.currentProvider = { name: '' };
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentProvider = {};
    this.saving = false;
  }

  onSubmit(): void {
    if (!this.currentProvider.name || this.saving) return;

    this.saving = true;
    this.cdr.detectChanges();

    if (this.currentProvider.id) {
      this.providersService.updateProvider(this.currentProvider.id, this.currentProvider as any).subscribe({
        next: () => {
          this.saving = false;
          this.loadProviders();
          this.closeModal();
          this.showToast('success', 'Provider updated successfully.');
        },
        error: () => {
          this.saving = false;
          this.cdr.detectChanges();
          this.showToast('error', 'Cannot update provider name because it has associated payments in the system.');
        }
      });
    } else {
      this.providersService.saveProvider(this.currentProvider as any).subscribe({
        next: () => {
          this.saving = false;
          this.loadProviders();
          this.closeModal();
          this.showToast('success', 'Provider created successfully.');
        },
        error: () => {
          this.saving = false;
          this.cdr.detectChanges();
          this.showToast('error', 'An error occurred while creating the provider.');
        }
      });
    }
  }

  confirmDelete(id: string): void {
    const provider = this.providers.find(p => p.id === id);
    if (provider && provider.totalInPayments > 0) {
      const formattedAmount = `$${provider.totalInPayments.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      this.showToast('error', `Cannot deactivate "${provider.name}" because it has associated payments (${formattedAmount}) in the system. Please remove or deactivate the associated payments first.`);
      return;
    }
    this.providerToDelete = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
        this.showDeleteModal = false;
        this.providerToDelete = null;
  }

  executeDelete(): void {
    if (!this.providerToDelete) return;
    this.providersService.deleteProvider(this.providerToDelete).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.providerToDelete = null;
        this.loadProviders();
        this.showToast('success', 'Provider deactivated successfully.');
      },
      error: () => {
        this.showDeleteModal = false;
        this.providerToDelete = null;
        this.showToast('error', 'An error occurred while deactivating the provider.');
      }
    });
  }

  private showToast(type: 'success' | 'error', message: string) {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast = { visible: true, type, message };
    this.cdr.detectChanges();
    this.toastTimeout = setTimeout(() => {
      this.toast.visible = false;
      this.cdr.detectChanges();
    }, 5000);
  }
}