import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FashionHomeComponent } from './fashion-home/fashion-home.component';
import { FashionDetailComponent } from './fashion-detail/fashion-detail.component';

const routes: Routes = [
  { path: '', component: FashionHomeComponent },            // trang chủ (?style=... để lọc)
  { path: 'fashion/:id', component: FashionDetailComponent }, // chi tiết
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
