
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavigationMenu } from '../../models/navigation-menu.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationMenuService {
  private readonly apiUrl =
    'https://localhost:7148/api/NavigationMenu';

  constructor(private http: HttpClient) {}

  getMyMenu(): Observable<NavigationMenu[]> {
    return this.http.get<NavigationMenu[]>(
      `${this.apiUrl}/my-menu`
    );
  }
}
