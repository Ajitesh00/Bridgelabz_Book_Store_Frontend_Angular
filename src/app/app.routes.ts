import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth';
import { Dashboard } from './components/dashboard/dashboard';
import { BookDetails } from './components/book-details/book-details'

export const routes: Routes = [
    { path: 'auth', component: AuthComponent },
    { path: '', component: Dashboard },
    { path: 'book/:id', component: BookDetails },
    { path: '**', redirectTo: '' }
];