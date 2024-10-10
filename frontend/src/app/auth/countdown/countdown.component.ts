import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  countdown: number = 5;
  intervalId: any;

  constructor(private router: Router) {}

  ngOnInit():void {
    this.startCountdown();
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if(this.countdown<= 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }

}
