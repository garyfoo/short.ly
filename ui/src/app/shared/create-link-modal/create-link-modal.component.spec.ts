import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { ShortLinkState } from 'src/app/core/store/links/links.state';

import { CreateLinkModalComponent } from './create-link-modal.component';

describe('CreateLinkModalComponent', () => {
  let component: CreateLinkModalComponent;
  let fixture: ComponentFixture<CreateLinkModalComponent>;
  let form: FormGroup;
  let title: FormControl;
  let long_url: FormControl;
  let submitBtn;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLinkModalComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([ShortLinkState]),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = component.createLinkForm;
    title = form.controls.title as FormControl;
    long_url = form.controls.long_url as FormControl;
    submitBtn = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.createLinkForm.valid).toBeFalsy();
  });

  it('title invalid when empty', () => {
    expect(title.valid).toBeFalsy();
  });

  it('title required when empty', () => {
    title.setValue('');
    expect(title.hasError('required')).toBeTruthy();
  });

  it('title invalid when exceed 100 characters', () => {
    title.setValue(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e'
    );
    expect(title.hasError('maxlength')).toBeTruthy();
  });

  it('long URL invalid when empty', () => {
    expect(long_url.valid).toBeFalsy();
  });

  it('long URL required when empty', () => {
    long_url.setValue('');
    expect(long_url.hasError('required')).toBeTruthy();
  });

  it('long URL invalid when exceed 500 characters', () => {
    long_url.setValue(
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
    );
    expect(long_url.hasError('maxlength')).toBeTruthy();
  });

  it('form valid with correct input values', () => {
    title.setValue('Test Title');
    long_url.setValue('https://youtube.com');
    expect(component.createLinkForm.valid).toBeTruthy();
  });
});
