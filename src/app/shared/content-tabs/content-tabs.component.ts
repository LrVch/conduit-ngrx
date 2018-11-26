import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface Tab {
  title: string;
  value: string;
}

@Component({
  selector: 'app-content-tabs',
  templateUrl: './content-tabs.component.html',
  styleUrls: ['./content-tabs.component.scss']
})
export class ContentTabsComponent {
  @Input('type') type: string;
  @Output() selectedType = new EventEmitter<string>();
  @Input('tabs') tabs: Tab[];

  onTabClick(tab: string, type: string): void {
    if (tab === type) {
      return;
    }

    this.selectedType.emit(tab);
  }
}
