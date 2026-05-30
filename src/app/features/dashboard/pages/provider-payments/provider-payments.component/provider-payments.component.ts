import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProviderPaymentService, ProviderPaymentResponseDTO } from '../../../services/provider-payment.service';
import { ProviderService, ProviderDashboardResponseDTO } from '../../../services/provider.service';

export interface ToastState {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-provider-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-payments.component.html',
  styleUrl: './provider-payments.component.css'
})
export class ProviderPaymentsComponent implements OnInit {
  private paymentService = inject(ProviderPaymentService);
  private providerService = inject(ProviderService);
  private cdr = inject(ChangeDetectorRef);

  payments: ProviderPaymentResponseDTO[] = [];
  filteredPayments: ProviderPaymentResponseDTO[] = [];
  providersList: ProviderDashboardResponseDTO[] = [];

  searchProvider: string = '';
  searchDate: string = '';
  searchDescription: string = '';
  statusFilter: string = 'active';

  isModalOpen = false;
  currentPayment: Partial<ProviderPaymentResponseDTO> = {};
  saving = false;

  showDeleteModal = false;
  paymentToDelete: string | null = null;

  toast: ToastState = { visible: false, type: 'success', message: '' };
  private toastTimeout: any;

  ngOnInit(): void {
    this.loadPayments();
    this.loadProviders();
  }

  loadPayments(): void {
    const request = this.statusFilter === 'active'
      ? this.paymentService.getAllActivePayments()
      : this.paymentService.getAllPayments();

    request.subscribe({
      next: (data) => {
        this.payments = data;
        this.filterPayments();
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('error', 'An error occurred while loading payments.');
      }
    });
  }

  loadProviders(): void {
    this.providerService.getAllActiveProviders().subscribe({
      next: (data) => {
        this.providersList = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('error', 'An error occurred while loading providers.');
      }
    });
  }

  filterPayments(): void {
    this.filteredPayments = this.payments.filter(p => {
      const matchProvider = !this.searchProvider.trim() ||
        p.providerName.toLowerCase().includes(this.searchProvider.toLowerCase());

      const matchDate = !this.searchDate ||
        p.paymentDate === this.searchDate;

      const matchDescription = !this.searchDescription.trim() ||
        p.description.toLowerCase().includes(this.searchDescription.toLowerCase());

      return matchProvider && matchDate && matchDescription;
    });
  }

  onProviderSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedProvider = this.providersList.find(p => p.id === selectedId);
    if (selectedProvider) {
      this.currentPayment.providerId = selectedProvider.id;
      this.currentPayment.providerName = selectedProvider.name;
    }
  }

  openModal(payment?: ProviderPaymentResponseDTO): void {
    if (payment) {
      this.currentPayment = { ...payment };
    } else {
      this.currentPayment = {
        providerId: '',
        providerName: '',
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        description: ''
      };
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentPayment = {};
    this.saving = false;
  }

  onSubmit(): void {
    if (!this.currentPayment.providerId || !this.currentPayment.amount || !this.currentPayment.paymentDate || !this.currentPayment.status || this.saving) return;

    this.saving = true;
    this.cdr.detectChanges();

    const payload: any = {
      providerId: this.currentPayment.providerId,
      providerName: this.currentPayment.providerName,
      amount: this.currentPayment.amount,
      paymentDate: this.currentPayment.paymentDate,
      status: this.currentPayment.status,
      description: this.currentPayment.description || ''
    };

    if (this.currentPayment.id) {
      this.paymentService.updatePayment(this.currentPayment.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.loadPayments();
          this.closeModal();
          this.showToast('success', 'Payment updated successfully.');
        },
        error: () => {
          this.saving = false;
          this.cdr.detectChanges();
          this.showToast('error', 'An error occurred while updating the payment.');
        }
      });
    } else {
      this.paymentService.savePayment(payload).subscribe({
        next: () => {
          this.saving = false;
          this.loadPayments();
          this.closeModal();
          this.showToast('success', 'Payment created successfully.');
        },
        error: () => {
          this.saving = false;
          this.cdr.detectChanges();
          this.showToast('error', 'An error occurred while creating the payment.');
        }
      });
    }
  }

  confirmDelete(id: string): void {
    this.paymentToDelete = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.paymentToDelete = null;
  }

  executeDelete(): void {
    if (!this.paymentToDelete) return;
    this.paymentService.deletePayment(this.paymentToDelete).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.paymentToDelete = null;
        this.loadPayments();
        this.showToast('success', 'Payment deactivated successfully.');
      },
      error: () => {
        this.showDeleteModal = false;
        this.paymentToDelete = null;
        this.showToast('error', 'An error occurred while deactivating the payment.');
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