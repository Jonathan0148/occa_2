import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RondasatmPage } from './rondasatm.page';

describe('RondasatmPage', () => {
  let component: RondasatmPage;
  let fixture: ComponentFixture<RondasatmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RondasatmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RondasatmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
