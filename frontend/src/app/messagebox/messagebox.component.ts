import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messagebox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.scss'
})
export class MessageboxComponent implements OnInit {
  messages: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/returnMessages').subscribe({
      next: (res) => {
        this.messages = res;
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
  }
}
