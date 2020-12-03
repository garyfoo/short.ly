import { API_CONFIG } from './../../../../environments/environment';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ShortLink } from '../../model/ShortLink';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  const dummyLinks: ShortLink[] = [
    {
      id: 2,
      title: 'Dyson Shopee',
      link: 'https://shortly-295413.ts.r.appspot.com/guv9NX',
      fragment: 'guv9NX',
      created_at: new Date(),
      modified_at: new Date(),
      long_url:
        'https://shopee.sg/Dyson-Supersonic-Hair-Dryer-HD03--Iron-Fuchsia--i.21108609.508962823?gclid=Cj0KCQiAqo3-BRDoARIsAE5vnaLysGmxYzUUKwAlOjNdzWurW4koYm9ojM50pKyklotAAoI-0fjkvX0aAgyIEALw_wcB',
    },
    {
      id: 3,
      title: 'Dyson Amazon',
      link: 'https://shortly-295413.ts.r.appspot.com/ImN3Qw',
      fragment: 'ImN3Qw',
      created_at: new Date(),
      modified_at: new Date(),
      long_url:
        'https://www.amazon.sg/s?k=dyson+hairdryer&adgrpid=95470778573&gclid=Cj0KCQiAqo3-BRDoARIsAE5vnaLDsHSoJDjtr8JAyfxnYD1mbSOA4TXiOMz4BJsiYq9-M_XHk2HRfYEaAsqFEALw_wcB&hvadid=419841433160&hvdev=c&hvlocphy=9062519&hvnetw=g&hvqmt=b&hvrand=9602811667126987983&hvtargid=kwd-19624172700&hydadcr=7540_53663&tag=googlepcstdsg-22&ref=pd_sl_828rrgkec1_b',
    },
    {
      id: 1,
      title: 'Kydra Instagram',
      link: 'https://shortly-295413.ts.r.appspot.com/Qtj3jf',
      fragment: 'Qtj3jf',
      created_at: new Date(),
      modified_at: new Date(),
      long_url: 'https://www.instagram.com/kydraofficial/',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAllLinks', () => {
    it('be able to retrieve links from the API via GET', () => {
      service.getAll().subscribe((links) => {
        expect(links.length).toBe(3);
        expect(links).toEqual(dummyLinks);
      });
      const request = httpTestingController.expectOne(API_CONFIG.getAll);
      expect(request.request.method).toBe('GET');
      request.flush(dummyLinks);
    });

    it('can test multiple requests', () => {
      // Make three requests in a row
      service
        .getAll()
        .subscribe((d) => expect(d.length).toEqual(0, 'should have no data'));

      service
        .getAll()
        .subscribe((d) =>
          expect(d).toEqual([dummyLinks[0]], 'should be one element array')
        );

      service
        .getAll()
        .subscribe((d) =>
          expect(d).toEqual(dummyLinks, 'should be expected data')
        );

      // get all pending requests that match the given URL
      const requests = httpTestingController.match(API_CONFIG.getAll);
      expect(requests.length).toEqual(3);

      // Respond to each request with different results
      requests[0].flush([]);
      requests[1].flush([dummyLinks[0]]);
      requests[2].flush(dummyLinks);
    });

    it('should be OK returning no links via GET', () => {
      service
        .getAll()
        .subscribe(
          (links) =>
            expect(links.length).toEqual(0, 'should have empty link array'),
          fail
        );

      const req = httpTestingController.expectOne(API_CONFIG.getAll);
      req.flush([]); // Respond with no heroes
    });
  });

  describe('#addLink', () => {
    it('should add an short link and return it', () => {
      const newLink: ShortLink = {
        id: 9,
        title: 'youtube',
        link: 'https://shortly-295413.ts.r.appspot.com/FJV2SX',
        fragment: 'FJV2SX',
        created_at: new Date('2020-12-01T15:42:12.918694Z'),
        modified_at: new Date('2020-12-01T15:42:12.918694Z'),
        long_url: 'https://www.youtube.com/',
      };

      service
        .add(newLink)
        .subscribe(
          (data) => expect(data).toEqual(newLink, 'should return link'),
          fail
        );

      // addEmploye should have made one request to POST employee
      const req = httpTestingController.expectOne(API_CONFIG.add);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(newLink);

      // Expect server to return the employee after POST
      const expectedResponse = new HttpResponse({ status: 200, body: newLink });
      req.event(expectedResponse);
    });
  });

  describe('#getLinkById', () => {
    it('should get a link via id and return it', () => {
      const link: ShortLink = {
        id: 9,
        title: 'youtube',
        link: 'https://shortly-295413.ts.r.appspot.com/FJV2SX',
        fragment: 'FJV2SX',
        created_at: new Date('2020-12-01T15:42:12.918694Z'),
        modified_at: new Date('2020-12-01T15:42:12.918694Z'),
        long_url: 'https://www.youtube.com/',
      };

      service
        .getById(9)
        .subscribe(
          (data) => expect(data).toEqual(link, 'should return the link'),
          fail
        );

      // Service should have made one request to GET link
      const mockPath = API_CONFIG.getById.replace(service.linkIdRegex, '9');
      const req = httpTestingController.expectOne(mockPath);
      expect(req.request.method).toEqual('GET');

      req.flush(link);
    });

    it('throws 404 error', () => {
      const emsg = 'deliberate 404 error';

      service.getById(99).subscribe(
        (data) => fail('Should have failed with 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(emsg, 'message');
        }
      );

      const mockPath = API_CONFIG.getById.replace(service.linkIdRegex, '99');
      const req = httpTestingController.expectOne(mockPath);

      // Respond with mock error
      req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#updateLink', () => {
    const updateLink: ShortLink = {
      id: 9,
      title: 'youtube',
      link: 'https://shortly-295413.ts.r.appspot.com/FJV2SX',
      fragment: 'FJV2SX',
      created_at: new Date('2020-12-01T15:42:12.918694Z'),
      modified_at: new Date('2020-12-01T15:42:12.918694Z'),
      long_url: 'https://www.youtube.com/',
    };
    it('should update a link and return it', () => {
      service
        .update(9, updateLink)
        .subscribe(
          (data) => expect(data).toEqual(updateLink, 'should return the link'),
          fail
        );

      const mockPath = API_CONFIG.getById.replace(service.linkIdRegex, '9');
      const req = httpTestingController.expectOne(mockPath);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateLink);

      // Expect server to return the hero after PUT
      const expectedResponse = new HttpResponse({
        status: 200,
        statusText: 'OK',
        body: updateLink,
      });
      req.event(expectedResponse);
    });

    it('throws 404 error', () => {
      const emsg = 'deliberate 404 error';

      service.update(99, updateLink).subscribe(
        (data) => fail('Should have failed with 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(emsg, 'message');
        }
      );

      const mockPath = API_CONFIG.update.replace(service.linkIdRegex, '99');
      const req = httpTestingController.expectOne(mockPath);

      // Respond with mock error
      req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#deleteLink', () => {
    it('should delete a link', () => {
      service.delete(9).subscribe((data) => expect(data).toEqual(null));

      const mockPath = API_CONFIG.delete.replace(service.linkIdRegex, '9');
      const req = httpTestingController.expectOne(mockPath);
      console.log('req', req);
      expect(req.request.method).toEqual('DELETE');
      // Expect server to return the hero after PUT
      const expectedResponse = new HttpResponse({
        status: 200,
        statusText: 'OK',
      });
      req.event(expectedResponse);
    });
  });
});
