import { ClipboardService } from 'ngx-clipboard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { ShortLinkState } from 'src/app/core/store/links/links.state';
import { CreateLinkModalComponent } from 'src/app/shared/create-link-modal/create-link-modal.component';
import { ShortlinkDetailComponent } from './shortlink-detail.component';

// Mock class for NgbModalRef
export class MockNgbModalRef {
  componentInstance = {
    title: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('ShortlinkDetailComponent', () => {
  let component: ShortlinkDetailComponent;
  let fixture: ComponentFixture<ShortlinkDetailComponent>;
  let modalService: NgbModal;
  let clipboardService: ClipboardService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShortlinkDetailComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([ShortLinkState]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlinkDetailComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    clipboardService = TestBed.inject(ClipboardService);
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
    expect(mockModalRef.componentInstance.title).toBe('Edit Link');
  });

  it('should copy to clipboard', () => {
    spyOn(clipboardService, 'copy');
    component.copy('test text');
    expect(clipboardService.copy).toHaveBeenCalledWith('test text');
  });
});
