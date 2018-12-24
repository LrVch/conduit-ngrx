import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent {
  @Input('followed') followed = false;
  @Input('isLoading') isLoading = false;
  @Output() followedToggle = new EventEmitter();

  onFavoriteClick($event): void {
    $event.preventDefault();
    if (this.isLoading) {
      return;
    }

    this.followedToggle.emit();
  }
}
