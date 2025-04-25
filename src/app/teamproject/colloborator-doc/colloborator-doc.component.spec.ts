import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColloboratorDocComponent } from './colloborator-doc.component';

describe('ColloboratorDocComponent', () => {
  let component: ColloboratorDocComponent;
  let fixture: ComponentFixture<ColloboratorDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColloboratorDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColloboratorDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
