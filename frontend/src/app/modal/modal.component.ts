import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() message: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {}

  isVisible: boolean = false;

  show(message: string): void {
    this.message = message;
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
    setTimeout(() => this.closeModal.emit(), 300);
  }

  register(event: Event) {
    event.preventDefault(); // Prevent default anchor behavior
    this.router.navigate(['/register']);
  }
}
