import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { ShortLinkState } from 'src/app/core/store/links/links.state';

import { ShortlinkListComponent } from './shortlink-list.component';

describe('ShortlinkListComponent', () => {
  let component: ShortlinkListComponent;
  let fixture: ComponentFixture<ShortlinkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShortlinkListComponent],
      imports: [
        NgxsModule.forRoot([ShortLinkState]),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
