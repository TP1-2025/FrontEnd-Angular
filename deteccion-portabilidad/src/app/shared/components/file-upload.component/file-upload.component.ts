// src/app/shared/components/file-upload/file-upload.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { ChurnApiService } from '../../../core/services/churn-api.service';
import { FilePredictResponse } from '../../../core/models/prediction.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() fileProcessed = new EventEmitter<FilePredictResponse>();

  selectedFile: File | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(private api: ChurnApiService) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file || null;
    this.errorMessage = null;
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Seleccione un archivo CSV primero.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.api.uploadPostFileWithSummary(this.selectedFile).subscribe({
      next: (resp) => {
        this.fileProcessed.emit(resp);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error subiendo archivo: ' + (err?.error?.detail || '');
        this.loading = false;
      }
    });
  }
}
