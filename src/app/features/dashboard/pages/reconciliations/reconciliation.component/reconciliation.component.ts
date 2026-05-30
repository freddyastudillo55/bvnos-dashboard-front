import { Component, ViewChild, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReconciliationService } from '../../../services/reconciliation.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';

export interface ReconciliationFilters {
  page: number;
  size: number;
  customerId: string;
  service: string;
  status: string;
  date: string;
  active: string;
}

export interface ReconciliationRecord {
  id: string;
  customerId: string;
  service: string;
  status: 'RECONCILED' | 'MISMATCH';
  finalAmount?: number;
  createdAt: string;
  reconciledAt?: string;
  active?: boolean;
  sourceA?: {
    originalAmount: number;
  };
  sourceB?: {
    originalAmount: number;
  };
}

export interface ReconciliationResponse {
  content?: ReconciliationRecord[];
  totalItems?: number;
  totalPages: number;
}

export interface MonthlyParams {
  year: number;
  month: number;
}

export interface ProcessResponse {
  id: string;
  name: string;
  status: string;
  totalRecords: number;
  matchedRecords: number;
  mismatchedRecords: number;
  createdAt: string;
}

export interface ToastState {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-reconciliation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.css']
})
export class ReconciliationComponent implements OnInit, OnDestroy {
  private reconService = inject(ReconciliationService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('chart', { static: true }) chart!: any;

  currentDate: Date = new Date();
  selectedYear: number = this.currentDate.getFullYear();
  selectedMonth: number = this.currentDate.getMonth() + 1;

  results: ReconciliationRecord[] = [];
  totalItems: number = 0;
  totalPages: number = 0;

  filters: ReconciliationFilters = {
    page: 0,
    size: 10,
    customerId: '',
    service: '',
    status: '',
    date: '',
    active: ''
  };

  activeFilter: string = '';

  loading = false;
  showUploadModal = false;
  showAdjustModal = false;
  showEditModal = false;
  showDeleteModal = false;
  recordToDelete: string | null = null;
  uploading = false;
  uploadError = '';

  toast: ToastState = { visible: false, type: 'success', message: '' };
  private toastTimeout: any;

  newProcessName = 'ReconciliationProcess_' + new Date().toLocaleDateString();
  fileVesta: File | null = null;
  fileAax: File | null = null;
  selectedRecord: ReconciliationRecord | null = null;
  vestaAmountAdjust = 0;
  aaxAmountAdjust = 0;
  finalAmountEdit = 0;

  private filterSubject = new Subject<ReconciliationFilters>();
  private filterSubscription!: Subscription;

  monthLabels: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  ngOnInit() {
    this.filterSubscription = this.filterSubject.pipe(
      debounceTime(300),
      switchMap(currentFilters => {
        this.loading = true;
        return this.reconService.getMonthlyResults(this.selectedYear, this.selectedMonth, currentFilters);
      })
    ).subscribe({
      next: (res: ReconciliationResponse) => {
        this.results = res.content || [];
        this.totalItems = res.totalItems ?? 0;
        this.totalPages = res.totalPages || 0;
        this.loading = false;

        this.cdr.detectChanges();

        if (this.chart) {
          this.chart.updateOptions({
            series: [{
              data: this.results.map(item => item.finalAmount || 0)
            }]
          });
        }
      },
      error: () => {
        this.loading = false;
        this.results = [];
        this.totalItems = 0;
        this.totalPages = 0;
      }
    });

    this.loadResults();
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  loadResults() {
    this.filterSubject.next({ ...this.filters });
  }

  applyFilters() {
    this.filters.page = 0;
    this.loadResults();
  }

  onActiveFilterChange(): void {
    this.filters.page = 0;
    this.filters.active = this.activeFilter;
    this.loadResults();
  }

  resetFilters() {
    this.filters = {
      page: 0,
      size: 10,
      customerId: '',
      service: '',
      status: '',
      date: '',
      active: ''
    };
    this.activeFilter = '';
    this.loadResults();
  }

  changePage(direction: number) {
    const newPage = this.filters.page + direction;
    if (newPage >= 0 && newPage < this.totalPages) {
      this.filters.page = newPage;
      this.loadResults();
    }
  }

  onMonthChange() {
    this.filters.page = 0;
    this.loadResults();
  }

  onFileChange(event: any, type: 'VESTA' | 'AAX') {
    const file = event.target.files[0];
    if (type === 'VESTA') this.fileVesta = file;
    else this.fileAax = file;
  }

  startNewProcess() {
    if (!this.fileVesta || !this.fileAax) return;
    this.uploading = true;
    this.uploadError = '';
    this.reconService.processReconciliation(this.newProcessName, this.fileVesta, this.fileAax).subscribe({
      next: (res: ProcessResponse) => {
        this.showUploadModal = false;
        this.uploading = false;
        this.uploadError = '';
        this.fileVesta = null;
        this.fileAax = null;
        this.newProcessName = 'ReconciliationProcess_' + new Date().toLocaleDateString();

        this.showToast(
          'success',
          `Reconciliation completed successfully. ${res.matchedRecords} reconciled, ${res.mismatchedRecords} mismatched out of ${res.totalRecords} total records.`
        );

        this.loadResults();
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = err.error?.message || err.message || 'An unexpected error occurred while processing the files. Please verify the file format and try again.';
        this.cdr.detectChanges();
      }
    });
  }

  private showToast(type: 'success' | 'error', message: string) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toast = { visible: true, type, message };
    this.toastTimeout = setTimeout(() => {
      this.toast.visible = false;
      this.cdr.detectChanges();
    }, 6000);
    this.cdr.detectChanges();
  }

  openActionModal(record: ReconciliationRecord) {
    this.selectedRecord = record;
    if (record.status === 'MISMATCH') {
      this.vestaAmountAdjust = record.sourceA?.originalAmount || 0;
      this.aaxAmountAdjust = record.sourceB?.originalAmount || 0;
      this.showAdjustModal = true;
    } else {
      this.finalAmountEdit = record.finalAmount || 0;
      this.showEditModal = true;
    }

    this.cdr.detectChanges();
  }

  submitAdjustment() {
    if (!this.selectedRecord) return;

    if (this.vestaAmountAdjust !== this.aaxAmountAdjust) {
      this.showToast('error', 'The amounts do not match. Both values must be identical to reconcile.');
      return;
    }

    const payload = {
      vestaAdjustedAmount: this.vestaAmountAdjust,
      aaxAdjustedAmount: this.aaxAmountAdjust,
      reason: 'Manual Front-end adjustment reconciliation',
      adjustedBy: 'System UI Admin'
    };

    this.reconService.applyAdjustment(this.selectedRecord.id, payload).subscribe({
      next: () => {
        this.showAdjustModal = false;
        this.showToast('success', 'Payment reconciled successfully. The record has been updated.');
        this.loadResults();
      },
      error: (err) => {
        this.showToast('error', err.error?.message || err.message || 'An error occurred while reconciling the payment.');
      }
    });
  }

  submitEdition() {
    if (!this.selectedRecord) return;

    const payload = {
      finalAmount: this.finalAmountEdit,
      reconciledAt: new Date().toISOString()
    };

    this.reconService.updateResult(this.selectedRecord.id, payload).subscribe({
      next: () => {
        this.showEditModal = false;
        this.showToast('success', 'Record updated successfully. The changes have been saved.');
        this.loadResults();
      },
      error: (err) => {
        this.showToast('error', err.error?.message || err.message || 'An error occurred while updating the record.');
      }
    });
  }

  confirmDelete(id: string): void {
    this.recordToDelete = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.recordToDelete = null;
  }

  executeDelete(): void {
    if (!this.recordToDelete) return;
    this.reconService.deleteResult(this.recordToDelete).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.recordToDelete = null;
        this.loadResults();
        this.showToast('success', 'Record deleted successfully.');
      },
      error: () => {
        this.showDeleteModal = false;
        this.recordToDelete = null;
        this.showToast('error', 'An error occurred while deleting the record.');
      }
    });
  }
}