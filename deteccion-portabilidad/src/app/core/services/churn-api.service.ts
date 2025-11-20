// src/app/core/services/churn-api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  DashboardSummary,
  HistoricalScoresResponse,
  FilePredictResponse,
  PredictionRecord
} from '../models/prediction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChurnApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }

  getHistoricalScores(limitDetalle: number = 1000): Observable<HistoricalScoresResponse> {
    return this.http.get<HistoricalScoresResponse>(
      `${this.baseUrl}/historical_scores`,
      { params: { limit_detalle: limitDetalle } }
    );
  }

  uploadPostFileWithSummary(file: File): Observable<FilePredictResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<FilePredictResponse>(
      `${this.baseUrl}/predict_file_with_summary`,
      formData
    );
  }

  // solo detalle
  uploadPostFile(file: File): Observable<PredictionRecord[]> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PredictionRecord[]>(
      `${this.baseUrl}/predict_file`,
      formData
    );
  }
}
