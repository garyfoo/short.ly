import { ShortlinkListComponent } from './shared/shortlink-list/shortlink-list.component';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortlinkDetailComponent } from './shared/shortlink-detail/shortlink-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ShortlinkListComponent,
        children: [
          {
            path: ':id',
            component: ShortlinkDetailComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
