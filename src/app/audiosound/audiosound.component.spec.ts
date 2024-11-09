import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiosoundComponent } from './audiosound.component';

describe('AudiosoundComponent', () => {
  let component: AudiosoundComponent;
  let fixture: ComponentFixture<AudiosoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiosoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudiosoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
