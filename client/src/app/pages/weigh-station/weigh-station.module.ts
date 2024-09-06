import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { WeighStationRoutingModule } from './weigh-station-routing.module';
import { WeighStationComponent } from './weigh-station.component';
import { ImportsModule } from 'src/app/imports';
@NgModule({
  declarations: [WeighStationComponent],
  imports: [
    WeighStationRoutingModule,
   ImportsModule
  ],
 
  providers: [],
schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class WeighStationModule {}
