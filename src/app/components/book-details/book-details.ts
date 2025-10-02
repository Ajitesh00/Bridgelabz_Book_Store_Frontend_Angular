import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../services/books/book';
import { CartService } from '../../services/cart/cart';
import { WishlistService } from '../../services/wishlist/wishlist';
import { Header } from '../header/header';

@Component({
  selector: 'app-book-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSnackBarModule,
    Header
  ],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss'
})
export class BookDetails implements OnInit {
  book: any = null;
  isAddedToBag: boolean =false;
  isAddedToWishlist: boolean = false;
  loading = true;

  constructor(private bookService: Book, private cartService: CartService, private wishlistService: WishlistService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.fetchData(bookId);
    }
    else {
      console.error('No bookId found in route parameters');
      this.loading = false;
      this.router.navigate(['/dashboard']);
    }
  }

  fetchData(bookId: string) {
    this.bookService.fetchBookById(bookId).subscribe({
      next: (bookData) => {
        this.book = bookData;
        this.loading = false;
        // Placeholder for cart and wishlist checks (implement services later)
        this.checkCartAndWishlist(bookId);
      },
      error: (err:any) => {
        console.error('Error fetching book:', err);
        this.loading = false;
        this.snackBar.open('Failed to fetch book details', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  checkCartAndWishlist(bookId: string) {
    this.cartService.getCart().subscribe({
      next: (cartItems) => {
        this.isAddedToBag = cartItems.some((item: any) => item.bookId === bookId);
      },
      error: (err) => {
        console.error('Error checking cart:', err);
        this.snackBar.open('Failed to check cart status', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });

    this.wishlistService.getWishlist().subscribe({
      next: (wishlistItems) => {
        this.isAddedToWishlist = wishlistItems.some((item: any) => item.bookId === bookId);
      },
      error: (err) => {
        console.error('Error checking wishlist:', err);
        this.snackBar.open('Failed to check wishlist status', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  handleAddToBag() {
    if (this.isAddedToBag || !this.book) return;
    this.cartService.addToCart(this.book.id).subscribe({
      next: () => {
        console.log('Added to cart:', this.book.id);
        this.isAddedToBag = true;
        this.snackBar.open('Book added to cart', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.snackBar.open(err.message || 'Failed to add to cart', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  handleAddToWishlist() {
    if (this.isAddedToWishlist || !this.book) return;
    this.wishlistService.addToWishlist(this.book.id).subscribe({
      next: () => {
        console.log('Added to wishlist:', this.book.id);
        this.isAddedToWishlist = true;
        this.snackBar.open('Book added to wishlist', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        console.error('Error adding to wishlist:', err);
        this.snackBar.open(err.message || 'Failed to add to wishlist', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }
}
