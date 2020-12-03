import { Component, OnInit } from '@angular/core';

import { Subscription, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ShortLink } from 'src/app/core/model/ShortLink';
import { GetAll } from 'src/app/core/store/links/links.action';
import { ShortLinkState } from 'src/app/core/store/links/links.state';
import { ClipboardService } from 'ngx-clipboard';
import { Router } from '@angular/router';
import { CreateLinkModalComponent } from 'src/app/shared/create-link-modal/create-link-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shortlink-list',
  templateUrl: './shortlink-list.component.html',
  styleUrls: ['./shortlink-list.component.scss'],
})
export class ShortlinkListComponent implements OnInit {
  links: ShortLink[] = [];

  constructor(
    private store: Store,
    private router: Router,
    private modalService: NgbModal
  ) {}

  @Select(ShortLinkState.getLinks) shortLinks$: Observable<ShortLink[]>;
  @Select(ShortLinkState.isLoading) isLoading$: Observable<boolean>;

  ngOnInit(): void {
    this.store.dispatch(new GetAll());
    this.subscribeToShortLinks$();
  }

  open(): void {
    const modalRef = this.modalService.open(CreateLinkModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Create Link';
  }

  subscribeToShortLinks$(): void {
    this.shortLinks$.subscribe((links) => {
      this.links = links;
      if (links.length > 0) {
        this.router.navigate([`/${links[0].id}`]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
