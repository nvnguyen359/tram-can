import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AutocompleteComponent } from 'src/app/Components/autocomplete/autocomplete.component';
import {MatMenuModule} from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { NumberRoundPipe } from 'src/app/Pipes/number-round.pipe';
import { DonutProductComponent } from 'src/app/Components/donut-product/donut-product.component';
import { ChartOrderComponent } from 'src/app/Charts/chart-order/chart-order.component';
import { StackedColumnsComponent } from 'src/app/Charts/stacked-columns/stacked-columns.component';
import { ChartjsComponent } from 'src/app/Charts/chartjs/chartjs.component';



@NgModule({
  declarations: [
    ReportsComponent,
    NumberRoundPipe,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatTableModule,
    MatTabsModule,
    AutocompleteComponent,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatRippleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatCardModule,
    DonutProductComponent,StackedColumnsComponent,ChartOrderComponent,ChartjsComponent
    
  ],schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
  providers:[]
})
export class ReportsModule { }
