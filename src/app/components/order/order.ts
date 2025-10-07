import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order implements OnInit {
  constructor(private router: Router){}

  ngOnInit() {
      setTimeout(() => {
          this.router.navigate(['/dashboard']);
      }, 4000);
  }
}
