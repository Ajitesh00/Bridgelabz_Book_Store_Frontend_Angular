import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BookCardComponent } from '../book-card/book-card';
import { Book } from '../../services/books/book';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-books-container',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatPaginatorModule, BookCardComponent],
  templateUrl: './books-container.html',
  styleUrl: './books-container.scss'
})
export class BooksContainer implements OnInit {
  books: any[] = [];
  totalBooks = 0;
  page = 1;
  limit = 24;
  sortBy = 'relevance';
  search = '';

  constructor(private bookService: Book, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = +params['page'] || 1;  // Unary plus operator to convert string to number
      this.limit = +params['limit'] || 24; // Unary plus operator to convert string to number
      this.sortBy = params['sortBy'] || 'relevance';
      this.search = params['search'] || '';
      this.getBooks();
    });
  }

  getBooks() {
    this.bookService.fetchBooks(this.page, this.limit, this.sortBy, this.search).subscribe(data => {
      this.books = data.books || [];
      this.totalBooks = data.totalRecords || 0;
    });
  }

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.updateUrl();
  }

  handleSortChange(sortBy: string) {
    this.sortBy = sortBy;
    this.page = 1;
    this.updateUrl();
  }

  handleLimitChange(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.updateUrl();
  }

  updateUrl() {
    const queryParams: any = {
      page: this.page,
      limit: this.limit,
      sortBy: this.sortBy
    };
    if (this.search) queryParams.search = this.search;
    this.router.navigate(['/dashboard'], { queryParams });
  }
}