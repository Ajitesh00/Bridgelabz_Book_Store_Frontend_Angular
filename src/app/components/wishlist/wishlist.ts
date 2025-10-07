import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist/wishlist';
import { Header } from '../header/header';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinner,
    MatSnackBarModule,
    Header
  ],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss']
})
export class Wishlist implements OnInit {
  wishlistItems: any[] = [];
  loading = true;

  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.fetchWishlist();
  }

  fetchWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        this.wishlistItems = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to fetch wishlist items', 'Close', {
          duration: 6000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.loading = false;
      }
    });
  }

  handleRemove(wishlistItemId: string) {
    this.wishlistService.removeFromWishlist(wishlistItemId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.wishlistItemId !== wishlistItemId);
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to remove item from wishlist', 'Close', {
          duration: 6000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  handleClear() {
    this.wishlistService.clearWishlist().subscribe({
      next: () => {
        this.wishlistItems = [];
        this.snackBar.open('Wishlist cleared successfully', 'Close', {
          duration: 6000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to clear wishlist', 'Close', {
          duration: 6000,
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