import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseApiUrl } from "./general";

const routes: Routes = [
  { path: '',   redirectTo: `/${BaseApiUrl.TrangChu}`, pathMatch: 'full' },
  { path: BaseApiUrl.TramCan, loadChildren: () => import('./pages/tramcan/tramcan.module').then(m => m.TramcanModule) }, // redirect to ,
  { path: BaseApiUrl.KhachHang, loadChildren: () => import('./pages/khachhang/khachhang.module').then(m => m.KhachhangModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
