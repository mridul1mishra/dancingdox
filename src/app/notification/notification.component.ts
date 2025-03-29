import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification {
  id: number;
  message: string;
  dateTime: Date;
  read: boolean;
}
@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})


export class NotificationComponent {
  selectedTab: string = 'all';

  notifications: Notification[] = [
    {
      id: 1,
      message: 'Puneet has approved the document photo for a project Test_1.28.Personal.PrivateProject',
      dateTime: new Date('12 JAN 2025, 09:41 PM'),
      read: false
    },
    {
      id: 2,
      message: 'Faisal Ahmed has submitted the document photo for a project Test_1.28.Personal.PrivateProject',
      dateTime: new Date('12 JAN 2025, 09:41 PM'),
      read: false
    }
    
  ];
  setTab(tab: string) {
    this.selectedTab = tab;
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach((notification) => {
      notification.read = true;
    });
  }
   // Toggle read state of a single notification
   toggleRead(notification: Notification) {
    notification.read = !notification.read;
  }
}
