import { ShortLink } from './../../../core/model/ShortLink';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { CreateLinkModalComponent } from 'src/app/shared/create-link-modal/create-link-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, Select } from '@ngxs/store';
import { GetLinkById } from 'src/app/core/store/links/links.action';
import { Subscription, Observable } from 'rxjs';
import { ShortLinkState } from 'src/app/core/store/links/links.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shortlink-detail',
  templateUrl: './shortlink-detail.component.html',
  styleUrls: ['./shortlink-detail.component.scss'],
})
export class ShortlinkDetailComponent implements OnInit, OnDestroy {
  shortLink: ShortLink;
  subs: Subscription[] = [];
  link$: Observable<ShortLink>;
  linkSub: Subscription = new Subscription();
  isVisible = false;

  constructor(
    private route: ActivatedRoute,
    private clipboardService: ClipboardService,
    private modalService: NgbModal,
    private store: Store
  ) {}

  open(): void {
    const modalRef = this.modalService.open(CreateLinkModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Edit Link';
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.link = this.shortLink;
  }

  ngOnInit(): void {
    this.subscribeToLinkDetailAndRoute();
  }

  subscribeToLinkDetailAndRoute(): void {
    this.route.params.subscribe((params) => {
      this.linkSub.unsubscribe();
      this.link$ = this.store.select(
        ShortLinkState.getShortLinkById(Number(params.id))
      );
      this.linkSub = this.link$.subscribe((link) => {
        this.shortLink = link;
      });
    });
    this.subs.push(this.linkSub);
  }

  showAlert(): void {
    if (this.isVisible) {
      // if the alert is visible return
      return;
    }
    this.isVisible = true;
    setTimeout(() => (this.isVisible = false), 3000); // hide the alert after 2.5s
  }

  copy(text: string): void {
    this.clipboardService.copy(text);
    this.showAlert();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
