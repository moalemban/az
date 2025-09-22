"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Clipboard } from 'lucide-react';
import { currencies, mockExchangeRates, DEFAULT_USD_RATE } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { numToWords } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IRT');
  const [amount, setAmount] = useState<string>('1');
  const [liveRates, setLiveRates] = useState({ 'USD-IRR': DEFAULT_USD_RATE });
  const { toast } = useToast();

  useEffect(() => {
    async function getLiveRates() {
      try {
        // AI Flow is disabled, using default rate.
        console.log("Currency rates are using default mock data as AI flows are disabled.");
      } catch (error) {
        console.error("Could not fetch live dollar price:", error);
        // It will use the default mock rate
      }
    }
    getLiveRates();
  }, []);

  const getRate = (from: string, to: string) => {
    if (from === to) return 1;
    if (from === 'IRR' && to === 'IRT') return 0.1;
    if (from === 'IRT' && to === 'IRR') return 10;
    
    const allRates: { [key: string]: number } = { ...mockExchangeRates, 'USD-IRR': liveRates['USD-IRR'] };

    let fromRateUSD = from === 'USD' ? 1 : allRates[`USD-${from}`];
    if (from === 'IRT') fromRateUSD = allRates['USD-IRR'] / 10;
    if (from === 'IRR') fromRateUSD = allRates['USD-IRR'];

    let toRateUSD = to === 'USD' ? 1 : allRates[`USD-${to}`];
    if (to === 'IRT') toRateUSD = allRates['USD-IRR'] / 10;
    if (to === 'IRR') toRateUSD = allRates['USD-IRR'];
    
    if (fromRateUSD && toRateUSD) {
        return toRateUSD / fromRateUSD;
    }
    return NaN;
  };
  
  const numericAmount = parseFloat(amount.replace(/,/g, ''));

  const convertedValue = useMemo(() => {
    if (isNaN(numericAmount) || !fromCurrency || !toCurrency) return 0;
    const rate = getRate(fromCurrency, toCurrency);
    if(isNaN(rate)) return 0;
    return numericAmount * rate;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericAmount, fromCurrency, toCurrency, liveRates]);

  const formattedResult = useMemo(() => {
    if (convertedValue === 0 && numericAmount !== 0) return 'نرخ تبدیل موجود نیست';
    return convertedValue.toLocaleString('fa-IR', { maximumFractionDigits: convertedValue < 1 ? 6 : 2 });
  }, [convertedValue, numericAmount]);
  
  const resultInWords = useMemo(() => {
    if (convertedValue <= 0) return '';
    const toCurrencyInfo = currencies.find(c => c.code === toCurrency);
    const integerValue = Math.floor(convertedValue);
    const words = numToWords(String(integerValue));
    return `${words} ${toCurrencyInfo?.name || ''}`;
  }, [convertedValue, toCurrency]);


  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  const copyToClipboard = () => {
    if (!convertedValue) return;
    const textToCopy = `مقدار عددی: ${formattedResult}\nبه حروف: ${resultInWords}`;
    navigator.clipboard.writeText(textToCopy);
    toast({
        title: 'کپی شد!',
        description: 'نتیجه تبدیل ارز با موفقیت کپی شد.',
    });
  }

  const renderSelect = (
    value: string,
    onChange: (code: string) => void
  ) => (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-12 text-base">
          <SelectValue placeholder="ارز" />
        </SelectTrigger>
        <SelectContent className="glass-effect">
          {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
        </SelectContent>
      </Select>
  );

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
                <Label htmlFor="amount-input" className="text-muted-foreground">مبلغ</Label>
                <Input dir="ltr" id="amount-input" type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1" className="text-lg h-12 text-center"/>
            </div>
            <div className="space-y-2">
                <Label className="text-muted-foreground">از</Label>
                {renderSelect(fromCurrency, setFromCurrency)}
            </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
            <Button variant="ghost" size="icon" className="shrink-0 my-1 text-muted-foreground" onClick={swapCurrencies}>
                <ArrowRightLeft className="h-5 w-5 transition-transform group-hover/card:rotate-180 duration-300" />
            </Button>
        </div>

        {/* Output */}
        <div className="space-y-2">
             <Label className="text-muted-foreground">به</Label>
            {renderSelect(toCurrency, setToCurrency)}
        </div>
        
        <Separator className="my-2"/>

        {/* Result */}
        <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner relative">
          <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={copyToClipboard}>
            <Clipboard className="w-5 h-5"/>
          </Button>
          <p className="text-sm text-muted-foreground">نتیجه تبدیل</p>
          <p className="text-3xl font-bold text-primary mt-1">{formattedResult}</p>
          {resultInWords && <p className="text-base text-primary/80 mt-2">{resultInWords}</p>}
        </div>

      </div>
    </CardContent>
  );
}
