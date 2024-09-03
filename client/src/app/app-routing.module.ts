import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseApiUrl } from "./general";

const routes: Routes = [
  { path: '',   redirectTo: `/${BaseApiUrl.TrangChu}`, pathMatch: 'full' },
  
  { path: BaseApiUrl.KhachHang, loadChildren: () => import('./pages/khachhang/khachhang.module').then(m => m.KhachhangModule) },
  { path: BaseApiUrl.TramCan, loadChildren: () => import('./pages/weigh-station/weigh-station.module').then(m => m.WeighStationModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
