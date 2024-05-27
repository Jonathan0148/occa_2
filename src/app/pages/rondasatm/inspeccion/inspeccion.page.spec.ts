import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InspeccionPage } from './inspeccion.page';

describe('InspeccionPage', () => {
  let component: InspeccionPage;
  let fixture: ComponentFixture<InspeccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InspeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
