// src/app/shared/components/risk-table/risk-table.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { PredictionRecord } from '../../../core/models/prediction.model';

@Component({
  selector: 'app-risk-table',
  imports: [CommonModule, NgClass],
  templateUrl: './risk-table.component.html',
  styleUrls: ['./risk-table.component.scss'],
})
export class RiskTableComponent {
  @Input() records: PredictionRecord[] = [];
}
