import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { NgxStripeModule } from 'ngx-stripe';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), // Ensure HttpClientModule is provided
    importProvidersFrom(
      NgxStripeModule.forRoot('pk_test_51RaR9BKYuZ7BRQhfrDqhzOxPM81NTYgolMgtehBcdeIHskW5BNa97Sw8EHXn869jeAiXlnArvfGXiTwklPJ2YSYh00ScyvyGsU') // ✅ correct usage
    ),
    provideHttpClient(withInterceptors([authInterceptor])) 
  ],
};
