import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FashionListComponent } from './fashion-list/fashion-list.component';
import { FashionDetailComponent } from './fashion-detail/fashion-detail.component';
import { FashionFormComponent } from './fashion-form/fashion-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'fashions', pathMatch: 'full' },
  { path: 'fashions', component: FashionListComponent },
  { path: 'fashions/new', component: FashionFormComponent },      // thêm mới
  { path: 'fashions/edit/:id', component: FashionFormComponent }, // sửa
  { path: 'fashions/:id', component: FashionDetailComponent },    // xem chi tiết
  { path: '**', redirectTo: 'fashions' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
