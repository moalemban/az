
"use client";

import { useState, useEffect, useRef } from 'react';
import type { Locale } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Gift } from 'lucide-react';
import { format, differenceInYears, differenceInMonths, differenceInDays, subYears, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { jalaliToGregorian, gregorianToJalali } from '@/lib/date-converter';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { numToWords } from '@/lib/utils';

type InputMode = 'shamsi' | 'gregorian';
type ShamsiField = 'day' | 'month' | 'year';

export default function AgeCalculator() {
  const [inputMode, setInputMode] = useState<InputMode>('shamsi');
  
  const [gregorianDate, setGregorianDate] = useState<Date | undefined>();
  const [gregorianPopoverOpen, setGregorianPopoverOpen] = useState(false);
  
  const [shamsiYear, setShamsiYear] = useState<string>('');
  const [shamsiMonth, setShamsiMonth] = useState<string>('');
  const [shamsiDay, setShamsiDay] = useState<string>('');

  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
  const [ageInWords, setAgeInWords] = useState<string | null>(null);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const calculateAge = (birthDate: Date) => {
    const now = new Date();
    if (birthDate > now) {
      setAge(null);
      setAgeInWords(null);
      return;
    }

    const years = differenceInYears(now, birthDate);
    const pastYearDate = subYears(now, years);
    const months = differenceInMonths(pastYearDate, birthDate);
    const pastMonthDate = subMonths(pastYearDate, months);
    const days = differenceInDays(pastMonthDate, birthDate);
    
    setAge({ years, months, days });

    let words = '';
    if (years > 0) words += `${numToWords(String(years))} سال`;
    if (months > 0) words += `${words ? ' و ' : ''}${numToWords(String(months))} ماه`;
    if (days > 0) words += `${words ? ' و ' : ''}${numToWords(String(days))} روز`;
    setAgeInWords(words || 'امروز به دنیا آمده‌اید');
  };

  useEffect(() => {
    let birthDateToCalculate: Date | null = null;
    if (inputMode === 'gregorian' && gregorianDate) {
      birthDateToCalculate = gregorianDate;
    } else if (inputMode === 'shamsi') {
      const y = Number(shamsiYear);
      const m = Number(shamsiMonth);
      const d = Number(shamsiDay);
      if (y > 1000 && m > 0 && m <= 12 && d > 0 && d <= 31) {
        try {
          const { gy, gm, gd } = jalaliToGregorian(y, m, d);
          birthDateToCalculate = new Date(gy, gm - 1, gd);
        } catch (e) {
          birthDateToCalculate = null;
        }
      }
    }
    
    if (birthDateToCalculate) {
      calculateAge(birthDateToCalculate);
    } else {
      setAge(null);
      setAgeInWords(null);
    }
  }, [gregorianDate, shamsiYear, shamsiMonth, shamsiDay, inputMode]);

  const handleGregorianSelect = (date: Date | undefined) => {
    if (date) {
      setGregorianDate(date);
      setGregorianPopoverOpen(false);
    }
  };
  
  const handleShamsiChange = (field: ShamsiField, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');

    switch (field) {
        case 'day':
            setShamsiDay(numericValue);
            if (numericValue.length >= 2 && monthRef.current) {
                monthRef.current.focus();
            }
            break;
        case 'month':
            setShamsiMonth(numericValue);
            if (numericValue.length >= 2 && yearRef.current) {
                yearRef.current.focus();
            }
            break;
        case 'year':
            setShamsiYear(numericValue);
            break;
    }
  };

  return (
    <CardContent className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1 bg-muted rounded-lg">
        {['shamsi', 'gregorian'].map((mode) => (
          <Button 
            key={mode}
            onClick={() => setInputMode(mode as InputMode)} 
            variant={inputMode === mode ? 'default' : 'ghost'}
            className={`w-full ${inputMode === mode ? '' : 'text-muted-foreground'}`}
          >
            {mode === 'shamsi' ? 'شمسی' : 'میلادی'}
          </Button>
        ))}
      </div>

      {inputMode === 'shamsi' ? (
          <div className="flex flex-row-reverse gap-2">
            <div className="flex-1 space-y-1">
                <Label htmlFor="shamsi-day" className="text-xs text-muted-foreground">روز</Label>
                <Input id="shamsi-day" ref={dayRef} type="number" placeholder="۲" value={shamsiDay} onChange={e => handleShamsiChange('day', e.target.value)} className="h-12 text-center" max={31} min={1} maxLength={2}/>
            </div>
            <div className="flex-1 space-y-1">
                <Label htmlFor="shamsi-month" className="text-xs text-muted-foreground">ماه</Label>
                <Input id="shamsi-month" ref={monthRef} type="number" placeholder="۸" value={shamsiMonth} onChange={e => handleShamsiChange('month', e.target.value)} className="h-12 text-center" max={12} min={1} maxLength={2}/>
            </div>
            <div className="flex-1 space-y-1">
                <Label htmlFor="shamsi-year" className="text-xs text-muted-foreground">سال</Label>
                <Input id="shamsi-year" ref={yearRef} type="number" placeholder="۱۳۷۵" value={shamsiYear} onChange={e => handleShamsiChange('year', e.target.value)} className="h-12 text-center" maxLength={4}/>
            </div>
          </div>
      ) : (
        <Popover open={gregorianPopoverOpen} onOpenChange={setGregorianPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal h-12 text-base', !gregorianDate && 'text-muted-foreground')}>
              <CalendarIcon className="ml-2 h-5 w-5" />
              {gregorianDate ? format(gregorianDate, 'PPP', { locale: enUS }) : <span>تاریخ تولد خود را انتخاب کنید</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 glass-effect" align="start">
            <Calendar
              mode="single"
              selected={gregorianDate}
              onSelect={handleGregorianSelect}
              locale={enUS}
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
              initialFocus
              classNames={{
                day_selected: "bg-primary text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </PopoverContent>
        </Popover>
      )}

      {age ? (
        <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-2 space-y-2">
          <div>
            <p className="text-lg text-muted-foreground">سن شما (به عدد)</p>
            <div className="text-2xl font-bold text-primary" dir="rtl">
              <span>{age.years}</span>
              <span className="text-base font-normal mx-1">سال و</span>
              <span>{age.months}</span>
              <span className="text-base font-normal mx-1">ماه و</span>
              <span>{age.days}</span>
              <span className="text-base font-normal mx-1">روز</span>
            </div>
          </div>
          {ageInWords && (
            <div>
              <p className="text-lg text-muted-foreground">سن شما (به حروف)</p>
              <p className="text-xl font-medium text-primary/90">{ageInWords}</p>
            </div>
          )}
        </div>
      ) : (
          <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
              <p>تاریخ تولد را برای محاسبه انتخاب کنید.</p>
          </div>
      )}
    </CardContent>
  );
}
