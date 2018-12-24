import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent {
  @Input('favorited') favorited = false;
  @Input('isLoading') isLoading = false;
  @Output() favoritedToggle = new EventEmitter();

  onFavoriteClick($event): void {
    $event.preventDefault();
    if (this.isLoading) {
      return;
    }
    this.favoritedToggle.emit();
  }
}
