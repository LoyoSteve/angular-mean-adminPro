import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customFuctionsInit();
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(
    private settingsService:SettingsService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    customFuctionsInit();
    this.sidebarService.loadMenu();
  }

}
