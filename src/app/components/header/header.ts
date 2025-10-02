import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatBadgeModule,
    ReactiveFormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  searchQuery = new FormControl('');

  constructor(private router: Router, private route: ActivatedRoute) {}

  logoUrl: string = 'logo.png';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery.setValue(params['search'] || '');
    });
    this.setLogo(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setLogo(event.target.innerWidth);
  }

  setLogo(width: number) {
    if (width <= 768) {
      this.logoUrl = 'logo3.png'; // small screen logo
    } else {
      this.logoUrl = 'logo.png'; // default logo
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  handleSearch() {
    const trimmed = this.searchQuery.value?.trim() || '';
    this.router.navigate(['/dashboard'], {
      queryParams: { search: trimmed || undefined, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  handleCartClick() {
    this.router.navigate(['/cart']);
  }

  handleWishlistClick() {
    this.router.navigate(['/wishlist']);
  }

  handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/auth']);
  }
}