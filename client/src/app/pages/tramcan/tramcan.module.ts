import { ChangeDetectionStrategy, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramcanRoutingModule } from './tramcan-routing.module';
import { TramcanComponent } from './tramcan.component';
import { MatIconModule } from '@angular/material/icon';
import { UpsertTramCanComponent } from './upsert-tram-can/upsert-tram-can.component';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ExpansionTableComponent } from 'src/app/components/expansion-table/expansion-table.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InputTextModule } from 'primeng/inputtext';
@NgModule({
  declarations: [TramcanComponent],
  imports: [
    CommonModule,
    TramcanRoutingModule,
    MatIconModule,
    UpsertTramCanComponent,
    MatRippleModule,
    MatMenuModule,
    MatButton,
    MatIconModule,
    ExpansionTableComponent,
    ReactiveFormsModule,MatIconModule,MatInputModule,MatButtonModule,InputTextModule
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class TramcanModule {}
