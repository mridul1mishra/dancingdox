import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-updatepassword',
  imports: [FormsModule],
  templateUrl: './updatepassword.component.html',
  styleUrl: './updatepassword.component.css'
})
export class UpdatepasswordComponent {
existingPassword = '';
email: string = '';
newPassword = '';
confirmPassword = '';
strengthPercent = 0;
strengthColor = '#d1d5db'; // gray
strengthText = 'Weak';
constructor(private authService: AuthService){}
@Output() close = new EventEmitter<void>();

onClose() {
  this.close.emit();
}
checkStrength() {
  const val = this.newPassword;

  let strength = 0;
  if (val.length > 5) strength += 20;
  if (/[A-Z]/.test(val)) strength += 20;
  if (/[0-9]/.test(val)) strength += 20;
  if (/[^A-Za-z0-9]/.test(val)) strength += 20;
  if (val.length > 10) strength += 20;

  this.strengthPercent = strength;

  if (strength >= 80) {
    this.strengthColor = 'green';
    this.strengthText = 'Secured';
  } else if (strength >= 40) {
    this.strengthColor = 'orange';
    this.strengthText = 'Moderate';
  } else {
    this.strengthColor = 'red';
    this.strengthText = 'Weak';
  }
}
setPassword(){
  const userDataRaw = localStorage.getItem('userData');
  this.email = userDataRaw ? JSON.parse(userDataRaw).email : null;
  const payload ={
     email: this.email, password: this.newPassword, existingPass: this.existingPassword
  }
this.authService.updatePassword(payload).subscribe({
    next: () => {alert('password updated'), this.onClose()},
    error: () => console.error('error while updating the password')
  }) 
}
}



