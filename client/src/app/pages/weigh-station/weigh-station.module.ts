import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { WeighStationRoutingModule } from './weigh-station-routing.module';
import { WeighStationComponent } from './weigh-station.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WeighStationComponent],
  imports: [CommonModule, WeighStationRoutingModule,FloatLabelModule,FormsModule ],
})
export class WeighStationModule {}
