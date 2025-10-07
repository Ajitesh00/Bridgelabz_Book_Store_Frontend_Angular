import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroupDirective, NgForm, FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart';
import { CustomerService } from '../../services/customer/customer';
import { OrderService } from '../../services/order/order';
import { Header } from '../header/header';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    Header
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  customerAddresses: any[] = [];
  selectedAddress: string = '';
  customerForm: FormGroup;
  loading = true;
  isCustomerCollapsed = true;
  isOrderCollapsed = true;
  matcher = new MyErrorStateMatcher();

  constructor(
    private cartService: CartService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.customerForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      addressType: ['home', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchCart();
  }

  fetchCart() {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to fetch cart items', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.loading = false;
      }
    });
  }

  handleIncrement(cartItemId: string, currentQuantity: number, bookId: string, availableQuantity: number) {
    if (currentQuantity >= availableQuantity) {
      this.snackBar.open(`Only ${availableQuantity} books available`, 'Close', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      return;
    }
    const newQuantity = currentQuantity + 1;
    this.cartService.updateCart(cartItemId, { quantity: newQuantity }).subscribe({
      next: (updatedItem) => {
        this.cartItems = this.cartItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity, total: updatedItem.total } : item
        );
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to update quantity', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  handleDecrement(cartItemId: string, currentQuantity: number) {
    if (currentQuantity <= 1) {
      this.snackBar.open('Quantity cannot be less than 1', 'Close', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      return;
    }
    const newQuantity = currentQuantity - 1;
    this.cartService.updateCart(cartItemId, { quantity: newQuantity }).subscribe({
      next: (updatedItem) => {
        this.cartItems = this.cartItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity, total: updatedItem.total } : item
        );
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to update quantity', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  handleRemove(cartItemId: string) {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.cartItemId !== cartItemId);
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to remove item from cart', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  handleCustomerCollapseToggle() {
    this.isCustomerCollapsed = !this.isCustomerCollapsed;
  }

  handleOrderCollapseToggle() {
    this.isOrderCollapsed = !this.isOrderCollapsed;
  }

  handlePlaceOrder() {
    this.orderService.placeOrder().subscribe({
      next: (response) => {
        this.cartItems = [];
        this.customerAddresses = [];
        this.selectedAddress = '';
        this.customerForm.reset({ addressType: 'home' });
        this.isCustomerCollapsed = true; // Hide customer form after placing order
        this.isOrderCollapsed = true; // Hide order summary after placing order
        // this.snackBar.open(`Order placed successfully! Order ID: ${response.orderId}`, 'Close', {
        this.snackBar.open(`Order placed successfully!`, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        setTimeout(() => {
          this.router.navigate(['/order']);
        }, 1500);
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to place order', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  handleSaveCustomer() {
    if (this.customerForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      this.customerForm.markAllAsTouched();
      return;
    }

    const customerData = {
      full_name: this.customerForm.get('fullName')?.value,
      mobile_number: this.customerForm.get('mobileNumber')?.value,
      address: this.customerForm.get('address')?.value,
      city: this.customerForm.get('city')?.value,
      state: this.customerForm.get('state')?.value,
      address_type: this.customerForm.get('addressType')?.value
    };

    this.customerService.addCustomer(customerData).subscribe({
      next: (newCustomer) => {
        this.customerAddresses = [newCustomer];
        this.selectedAddress = newCustomer.id;
        this.snackBar.open('Customer details saved successfully', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.handleOrderCollapseToggle(); // Show order summary without resetting form
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to save customer details', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  get grandTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.total, 0);
  }
}