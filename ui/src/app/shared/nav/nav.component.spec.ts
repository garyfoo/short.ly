import { ShortLinkState } from './../../core/store/links/links.state';
import { CreateLinkModalComponent } from 'src/app/shared/create-link-modal/create-link-modal.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavComponent } from './nav.component';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock class for NgbModalRef
export class MockNgbModalRef {
  componentInstance = {
    title: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let modalService: NgbModal;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [
        NgbModule,
        NgxsModule.forRoot([ShortLinkState]),
        HttpClientTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.open();
    expect(modalService.open).toHaveBeenCalledWith(CreateLinkModalComponent, {
      centered: true,
    });
    expect(mockModalRef.componentInstance.title).toBe('Create Link');
  });
});
