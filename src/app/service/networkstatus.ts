import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);
  onlineStatus$ = this.onlineStatus.asObservable();

  constructor(private ngZone: NgZone) {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(isOnline: boolean) {
    this.ngZone.run(() => {
      this.onlineStatus.next(isOnline);
    });
  }
}
