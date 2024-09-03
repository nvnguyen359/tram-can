import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class MenuComponent implements OnInit {
  public items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Navigate',
        items: [
          {
            label: 'Router Link',
            icon: 'pi pi-palette',
            route: '/guides/csslayer',
          },
          {
            label: 'Programmatic',
            icon: 'pi pi-link',
            command: () => {
              this.router.navigate(['/installation']);
            },
          },
          {
            label: 'External',
            icon: 'pi pi-home',
            url: 'https://angular.io//',
          },
        ],
      },
    ];
    console.log(this.items);
  }
}
