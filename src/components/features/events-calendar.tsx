"use client";

import { useState, useMemo, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { gregorianToJalali, jalaliToGregorian } from '@/lib/date-converter';
import { events as allEvents, type Event } from '@/lib/events';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { CalendarCheck, Info } from 'lucide-react';

export default function EventsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Use useEffect to set initial date on client to avoid hydration mismatch
  useEffect(() => {
    setDate(new Date());
  }, []);

  const selectedJalali = useMemo(() => {
    if (!date) return null;
    const { jy, jm, jd } = gregorianToJalali(date);
    return { year: jy, month: jm, day: jd };
  }, [date]);

  const eventsForSelectedDay = useMemo(() => {
    if (!selectedJalali) return [];
    return allEvents.filter(event => 
        event.month === selectedJalali.month && 
        event.day === selectedJalali.day
    );
  }, [selectedJalali]);

  const eventDays = useMemo(() => {
      const modifiers: Record<string, Date[]> = {
          hasEvent: [],
          isHoliday: [],
      };
      allEvents.forEach(event => {
          try {
              const { gy, gm, gd } = jalaliToGregorian(selectedJalali?.year || new Date().getFullYear(), event.month, event.day);
              const eventDate = new Date(gy, gm - 1, gd);
              modifiers.hasEvent.push(eventDate);
              if (event.isHoliday) {
                  modifiers.isHoliday.push(eventDate);
              }
          } catch (e) {
            // Ignore invalid dates that might be out of range for the current year
          }
      });
      return modifiers;
  }, [selectedJalali?.year]);
  
  const selectedDatePersian = useMemo(() => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(date);
  }, [date]);

  return (
    <CardContent className="flex flex-col md:flex-row gap-6 items-start justify-center">
      <div className="w-full md:w-auto flex justify-center">
         <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border glass-effect"
          dir="rtl"
          modifiers={eventDays}
          modifiersClassNames={{
              hasEvent: 'relative',
              isHoliday: 'text-red-500',
          }}
          components={{
              DayContent: (props) => {
                  const isHoliday = eventDays.isHoliday.some(d => d.getTime() === props.date.getTime());
                  const hasEvent = eventDays.hasEvent.some(d => d.getTime() === props.date.getTime());
                  return (
                      <div className='relative'>
                          {props.date.getDate().toLocaleString('fa-IR')}
                          {hasEvent && <span className={`absolute bottom-0 right-1/2 translate-x-1/2 w-1.5 h-1.5 rounded-full ${isHoliday ? 'bg-red-500' : 'bg-primary'}`}/>}
                      </div>
                  )
              }
          }}
        />
      </div>
      
      <div className="flex-grow w-full max-w-md">
        <h3 className="font-semibold text-lg mb-2 text-center md:text-right">{selectedDatePersian}</h3>
        <ScrollArea className="h-72 rounded-lg border bg-muted/30 p-4 shadow-inner">
            {eventsForSelectedDay.length > 0 ? (
                <ul className="space-y-3">
                    {eventsForSelectedDay.map((event, index) => (
                        <li key={index} className="flex items-start gap-3">
                           <div className={`w-2 h-2 mt-2 rounded-full ${event.isHoliday ? 'bg-red-500' : 'bg-primary'}`} />
                           <div className="flex-grow">
                             <p className="font-semibold text-foreground">{event.title}</p>
                             {event.isHoliday && <Badge variant="destructive" className="mt-1">تعطیل رسمی</Badge>}
                           </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <CalendarCheck className="w-12 h-12 mb-4" />
                    <p className='font-semibold'>مناسبتی برای این روز ثبت نشده است.</p>
                </div>
            )}
        </ScrollArea>
        <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/20 mt-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>
               تقویم بر اساس سال جاری است. برای مشاهده مناسبت سال‌های دیگر، به آن سال بروید.
            </span>
        </div>
      </div>
    </CardContent>
  );
}
