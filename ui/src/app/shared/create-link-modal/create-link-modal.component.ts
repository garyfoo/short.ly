import { ApiError } from './../../core/model/ApiError';
import { ShortLinkState } from 'src/app/core/store/links/links.state';
import { Input, isDevMode } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { Add, Update, Delete } from 'src/app/core/store/links/links.action';
import { combineLatest, Observable } from 'rxjs';
import { ShortLink } from 'src/app/core/model/ShortLink';
import { Router } from '@angular/router';
import { invalidUrlValidator } from '../directive/invalid-url.directive';

@Component({
  selector: 'app-create-link-modal',
  templateUrl: './create-link-modal.component.html',
  styleUrls: ['./create-link-modal.component.scss'],
})
export class CreateLinkModalComponent implements OnInit {
  constructor(
    public modal: NgbActiveModal,
    private store: Store,
    private fb: FormBuilder,
    private router: Router
  ) {}
  @Input() title: string;
  @Input() isEdit = false;
  @Input() link: ShortLink;
  isSubmit = false;
  isRemove = false;
  errors: ApiError[] = [];

  @Select(ShortLinkState.isUpdating) isUpdating$: Observable<boolean>;
  @Select(ShortLinkState.errors) errors$: Observable<boolean>;

  isDevMode = isDevMode();

  createLinkForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    long_url: [
      '',
      [Validators.required, Validators.maxLength(500), invalidUrlValidator()],
    ],
  });

  ngOnInit(): void {
    if (this.isEdit) {
      this.createLinkForm.get('title').patchValue(this.link.title);
      this.createLinkForm.get('long_url').patchValue(this.link.long_url);
    }
    this.subscribeIsUpdating();
  }

  subscribeIsUpdating(): void {
    combineLatest([this.isUpdating$, this.errors$]).subscribe(
      ([isUpdating, errors]: any) => {
        if (!isUpdating && (this.isSubmit || this.isRemove)) {
          const links: ShortLink[] = this.store.selectSnapshot(
            ShortLinkState.getLinks
          );
          if (errors.length > 0) {
            this.errors = errors;
          } else {
            const lastLink: ShortLink = links[links.length - 1];
            this.router.navigate([`/${lastLink.id}`]);
            this.modal.close();
            if (this.isRemove) {
              if (links.length > 0) {
                this.router.navigate([`/${links[0].id}`]);
              } else {
                this.router.navigate(['/']);
              }
            }
          }
        }
      }
    );
  }

  submit(): void {
    this.isSubmit = true;
    if (this.isEdit) {
      this.store.dispatch(new Update(this.link.id, this.createLinkForm.value));
    } else {
      this.store.dispatch(new Add(this.createLinkForm.value));
    }
  }

  get controls() {
    return this.createLinkForm.controls;
  }

  remove(): void {
    this.isRemove = true;
    this.store.dispatch(new Delete(this.link.id));
  }

  noOfCharsLeft(): number {
    const formControl: FormControl = this.createLinkForm.get(
      'long_url'
    ) as FormControl;

    return 500 - (formControl.value ? formControl.value.length : 0);
  }
}
