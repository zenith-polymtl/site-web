import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashCountdownComponent } from './crash-countdown.component';

describe('CrashCountdownComponent', () => {
  let component: CrashCountdownComponent;
  let fixture: ComponentFixture<CrashCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrashCountdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrashCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
