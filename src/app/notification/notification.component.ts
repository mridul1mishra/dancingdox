import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../service/data.service';
import { AppNotification } from '../service/project.interface.service';

export interface Notification1 {
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
  appNotification: AppNotification[]  | undefined;
  constructor(private dataService: DataService){}
ngOnInit() {
    const email = localStorage.getItem('userID');
    if(email)
    this.dataService.getNotifications(email).subscribe({
       next: (data) => (this.appNotification = data),
      error: (err) => console.error('Error fetching notifications:', err),
  });
    
  }
  notifications: Notification1[] = [
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
   toggleRead(notification: AppNotification) {
    notification.is_read = !notification.is_read;
  }
}
