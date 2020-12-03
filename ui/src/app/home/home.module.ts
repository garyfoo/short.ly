import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ShortlinkListComponent } from './shared/shortlink-list/shortlink-list.component';
import { ShortlinkDetailComponent } from './shared/shortlink-detail/shortlink-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ShortlinkListComponent, ShortlinkDetailComponent],
  imports: [CommonModule, HomeRoutingModule, NgbModule],
})
export class HomeModule {}
