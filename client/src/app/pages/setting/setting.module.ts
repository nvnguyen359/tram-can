import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { PrintersComponent } from 'src/app/Components/printers/printers.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutocompleteComponent } from 'src/app/Components/autocomplete/autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    SettingComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MatCardModule,
    PrintersComponent,
    MatFormFieldModule, MatInputModule, MatSelectModule,AutocompleteComponent,
    NgFor,
    FormsModule,ReactiveFormsModule,MatIconModule,MatButtonModule
  ]
})
export class SettingModule { }
