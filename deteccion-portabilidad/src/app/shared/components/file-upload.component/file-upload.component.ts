import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/churn-api.service'; 
import { DashboardSummary, PredictionRow } from '../../../core/models/prediction.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Output() fileProcessed = new EventEmitter<{
    resumen: DashboardSummary;
    detalle: PredictionRow[];
  }>();

  loading = false;
  error: string | null = null;

  selectedFile: File | null = null;

  constructor(private dashboardService: DashboardService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }
    this.selectedFile = input.files[0];
  }

  upload() {
    if (!this.selectedFile) return;
    this.loading = true;
    this.error = null;

    this.dashboardService.uploadCsvForSummary(this.selectedFile).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.fileProcessed.emit({
          resumen: res.resumen,
          detalle: res.detalle,
        });
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error procesando el archivo.';
        this.loading = false;
      },
    });
  }
}
