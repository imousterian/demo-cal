import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../components/calendar/calendar';

const routes: Routes = [
    { path: '', component: CalendarComponent },
    { path: '**', redirectTo: '/', pathMatch: 'full'}
]

export const routing = RouterModule.forRoot(routes);