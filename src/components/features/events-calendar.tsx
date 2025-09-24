"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Locale } from 'date-fns';
import { add, format, getYear } from 'date-fns';
import { enUS, faIR } from 'date-fns/locale';
import { CardContent } from '@/components/ui/card';
import { DayPicker, DayContentProps, CaptionProps } from 'react-day-picker';
import { gregorianToJalali, jalaliToGregorian } from '@/lib/date-converter';
import { events as allEvents } from '@/lib/events';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { CalendarCheck, Info, Moon, Sun, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';


type CalendarSystem = 'shamsi' | 'gregorian';

function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = props;
  const isShamsi = props.locale?.code === 'fa-IR';

  const monthName = format(props.displayMonth, 'LLLL', { locale: props.locale });
  const year = format(props.displayMonth, 'yyyy', { locale: props.locale });

  return (
    <div className="flex items-center justify-between px-2 pb-2">
      <Button variant="outline" size="icon" className="h-8 w-8" disabled={!previousMonth} onClick={() => previousMonth && goToMonth(previousMonth)}>
        <ChevronRight className="w-5 h-5"/>
      </Button>
      <div className="text-lg font-semibold text-foreground">
        {monthName} {year}
      </div>
      <Button variant="outline" size="icon" className="h-8 w-8" disabled={!nextMonth} onClick={() => nextMonth && goToMonth(nextMonth)}>
        <ChevronLeft className="w-5 h-5"/>
      </Button>
    </div>
  );
}


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
      
      const referenceYear = date ? getYear(date) : getYear(new Date());
      
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
    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        calendar: 'persian'
    }).format(date);
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };
  
  const DayContentWithEvents = (props: DayContentProps) => {
      const isHoliday = eventDays.isHoliday.some(d => d.getTime() === props.date.getTime());
      const hasEvent = eventDays.hasEvent.some(d => d.getTime() === props.date.getTime());
      const numberFormatter = new Intl.NumberFormat(props.locale?.code, { useGrouping: false });
      
      const day = props.locale?.code === 'fa-IR' ? gregorianToJalali(props.date).jd : props.date.getDate();

      return (
          <div className='relative w-full h-full flex items-center justify-center'>
              <span>{numberFormatter.format(day)}</span>
              {hasEvent && <span className={cn(
                  "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                   isHoliday ? 'bg-red-500' : 'bg-primary'
              )}/>}
          </div>
      )
  }

  const formatWeekdayName = (day: Date, options?: { locale?: Locale }) => {
    return format(day, 'E', { locale: options?.locale }).charAt(0);
  };

  return (
    <CardContent className="flex flex-col md:flex-row gap-6 items-start justify-center">
        <div className="w-full md:w-auto flex flex-col items-center gap-4">
            <div className="flex items-center justify-center p-1 bg-muted rounded-lg w-full">
                <Button onClick={() => setCalendarSystem('shamsi')} variant={calendarSystem === 'shamsi' ? 'default' : 'ghost'} className="flex-1 gap-2"><Sun className="w-4 h-4"/> شمسی</Button>
                <Button onClick={() => setCalendarSystem('gregorian')} variant={calendarSystem === 'gregorian' ? 'default' : 'ghost'} className="flex-1 gap-2"><CalendarIcon className="w-4 h-4"/> میلادی</Button>
            </div>
            <DayPicker
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border glass-effect"
                dir={calendarSystem === 'shamsi' ? 'rtl' : 'ltr'}
                locale={calendarSystem === 'shamsi' ? faIR : enUS}
                modifiers={{
                    ...eventDays,
                    friday: { dayOfWeek: [5] }
                }}
                modifiersClassNames={{
                    isHoliday: 'day-holiday',
                    friday: 'day-holiday',
                }}
                components={{ 
                    Caption: CustomCaption,
                    DayContent: DayContentWithEvents
                }}
                formatters={{ formatWeekdayName }}
                classNames={{
                     head_cell: "w-9 text-muted-foreground font-normal text-[0.8rem]",
                     cell: "h-9 w-9 text-center text-sm p-0 relative",
                     day: cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                     ),
                     day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                }}
                showOutsideDays
            />
        </div>
      
      <div className="flex-grow w-full max-w-md">
        <h3 className="font-semibold text-lg mb-2 text-center md:text-right">{selectedDatePersian}</h3>
        <ScrollArea className="h-72 rounded-lg border bg-muted/30 p-4 shadow-inner">
            {eventsForSelectedDay.length > 0 ? (
                <ul className="space-y-3">
                    {eventsForSelectedDay.map((event, index) => (
                        <li key={index} className="flex items-start gap-3">
                           <div className={cn("w-2 h-2 mt-2 rounded-full", event.isHoliday ? 'bg-red-500' : 'bg-primary')} />
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
