import { RouterTestingModule } from '@angular/router/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@Component({ selector: 'app-home', template: '' })
class HomeStubComponent {}

@Component({ selector: 'app-nav', template: '' })
class NavStubComponent {}

@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent {}

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent & TestModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent, HomeStubComponent, NavStubComponent],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppComponent);
          comp = fixture.componentInstance;
        });
    })
  );
  tests();
});

function tests() {
  beforeEach(() => {
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('can instantiate the component', () => {
    expect(comp).not.toBeNull();
  });
}
