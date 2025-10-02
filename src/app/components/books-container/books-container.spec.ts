import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksContainer } from './books-container';

describe('BooksContainer', () => {
  let component: BooksContainer;
  let fixture: ComponentFixture<BooksContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
