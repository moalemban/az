"use client";

import { useState, useMemo, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { gregorianToJalali, jalaliToGregorian } from '@/lib/date-converter';
import { events as allEvents } from '@/lib/events';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { CalendarCheck, Info, Moon, Sun, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

type CalendarSystem = 'shamsi' | 'gregorian' | 'hijri';

export default function EventsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarSystem, setCalendarSystem] = useState<CalendarSystem>('shamsi');
  
  useEffect(() => {
    setDate(new Date());
  }, []);

  const selectedJalali = useMemo(() => {
    if (!date) return null;
    return gregorianToJalali(date);
  }, [date]);

  const eventsForSelectedDay = useMemo(() => {
    if (!selectedJalali) return [];
    return allEvents.filter(event => 
        event.month === selectedJalali.jm && 
        event.day === selectedJalali.jd
    );
  }, [selectedJalali]);

  const eventDays = useMemo(() => {
      const modifiers: Record<string, Date[]> = {
          hasEvent: [],
          isHoliday: [],
      };
      
      const referenceYear = date?.getFullYear() || new Date().getFullYear();
      
      // Show events for a 3-year window (+/- 1 year) to ensure visibility when navigating months
      [-1, 0, 1].forEach(yearOffset => {
          const yearToProcess = referenceYear + yearOffset;
           allEvents.forEach(event => {
              try {
                  const { gy, gm, gd } = jalaliToGregorian(yearToProcess, event.month, event.day);
                  const eventDate = new Date(Date.UTC(gy, gm - 1, gd));
                  modifiers.hasEvent.push(eventDate);
                  if (event.isHoliday) {
                      modifiers.isHoliday.push(eventDate);
                  }
              } catch (e) {
                // Ignore invalid dates that might be out of range for the current year
              }
          });
      })
      
      return modifiers;
  }, [date]);
  
  const selectedDatePersian = useMemo(() => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(date);
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const DayContent: React.FC<React.ComponentProps<typeof Calendar>['components']['DayContent']> = (props) => {
      const isHoliday = eventDays.isHoliday.some(d => d.getTime() === props.date.getTime());
      const hasEvent = eventDays.hasEvent.some(d => d.getTime() === props.date.getTime());
      const numberFormatter = new Intl.NumberFormat(calendarSystem === 'shamsi' ? 'fa-IR' : 'en-US');

      return (
          <div className='relative'>
              {numberFormatter.format(props.date.getDate())}
              {hasEvent && <span className={`absolute bottom-0 right-1/2 translate-x-1/2 w-1.5 h-1.5 rounded-full ${isHoliday ? 'bg-red-500' : 'bg-primary'}`}/>}
          </div>
      )
  }

  return (
    <CardContent className="flex flex-col md:flex-row gap-6 items-start justify-center">
        <div className="w-full md:w-auto flex flex-col items-center gap-4">
            <div className="flex items-center justify-center p-1 bg-muted rounded-lg w-full">
                <Button onClick={() => setCalendarSystem('shamsi')} variant={calendarSystem === 'shamsi' ? 'default' : 'ghost'} className="flex-1 gap-2"><Sun className="w-4 h-4"/> شمسی</Button>
                <Button onClick={() => setCalendarSystem('gregorian')} variant={calendarSystem === 'gregorian' ? 'default' : 'ghost'} className="flex-1 gap-2"><CalendarIcon className="w-4 h-4"/> میلادی</Button>
                <Button variant='ghost' className="flex-1 gap-2 text-muted-foreground/50" disabled><Moon className="w-4 h-4"/> قمری</Button>
            </div>
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border glass-effect"
                dir={calendarSystem === 'shamsi' ? 'rtl' : 'ltr'}
                locale={calendarSystem === 'shamsi' ? require('date-fns/locale/fa-IR') : require('date-fns/locale/en-US')}
                modifiers={eventDays}
                modifiersClassNames={{
                    isHoliday: 'text-red-500',
                }}
                components={{ DayContent }}
                captionLayout="dropdown-buttons"
                fromYear={1970}
                toYear={new Date().getFullYear() + 2}
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
