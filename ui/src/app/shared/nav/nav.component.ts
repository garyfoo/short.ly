import { CreateLinkModalComponent } from '../create-link-modal/create-link-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ShortLinkState } from 'src/app/core/store/links/links.state';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  @Select(ShortLinkState.isLoading) isLoading$: Observable<boolean>;

  ngOnInit(): void {}

  open(): void {
    const modalRef = this.modalService.open(CreateLinkModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Create Link';
  }
}
