import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { EventColor } from 'calendar-utils';

export interface  CustomCalendarEvent extends CalendarEvent {
    detail?: {
        "matiere":string,
        "enseignant":string,
        "salle":string,
        "classe":string,
        "idSalle":number,
        "id":number
    };
}
