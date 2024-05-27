import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RdetallePage } from './rdetalle.page';

describe('RdetallePage', () => {
  let component: RdetallePage;
  let fixture: ComponentFixture<RdetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdetallePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RdetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
