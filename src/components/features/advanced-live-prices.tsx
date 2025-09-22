"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown, RefreshCw, Timer, CandlestickChart, Gem, CircleDollarSign, BarChart3, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LivePrice, PriceData, PriceDataItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const PriceChangeIndicator = ({ change }: { change: string | null }) => {
  if (!change || change === "0" || change === "۰") {
     const isZero = change === "0" || change === "۰";
     return (
        <div className={cn("flex items-center text-xs font-mono", isZero ? "text-muted-foreground" : "text-green-500")}>
            <span>{isZero ? "0" : change}</span>
        </div>
     )
  }

  const isPositive = !change.startsWith('-');
  const isNegative = change.startsWith('-');
  
  const displayChange = change.replace(/[+-]/, '');

  return (
    <div className={cn("flex items-center text-xs font-mono", isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground")}>
      <span>{displayChange}</span>
      {isPositive && <ArrowUp className="w-3 h-3 ml-1" />}
      {isNegative && <ArrowDown className="w-3 h-3 ml-1" />}
    </div>
  );
};

const PriceCard = ({ item }: { item: LivePrice }) => (
    <div className="glass-effect rounded-2xl p-3 card-hover w-full flex-shrink-0">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
                {typeof item.icon === 'string' ? (
                     <Image src={item.icon} alt={`${item.name} icon`} width={28} height={28} className='object-contain'/>
                ) : (
                    React.isValidElement(item.icon) ? React.cloneElement(item.icon, { className: 'w-7 h-7 text-primary' } as React.HTMLAttributes<HTMLElement>) : item.icon
                )}
            </div>
            <div className="flex-grow text-right">
                <h3 className="text-foreground font-display font-semibold text-sm truncate">{item.name}</h3>
                <div className="text-muted-foreground text-[11px] font-body">{item.symbol}</div>
            </div>
        </div>
        <div className="mt-2 text-right">
            <div className="text-lg text-foreground font-display font-bold text-glow">{item.price}</div>
             <div className="flex justify-end mt-1 h-5">
                <PriceChangeIndicator change={item.change} />
            </div>
        </div>
    </div>
);

const priceConfig: { [key in keyof Omit<PriceData, 'cryptos'>]: Omit<LivePrice, 'price' | 'change'> | null } = {
    GoldOunce: { id: 'GoldOunce', name: 'انس طلا', symbol: 'USD', icon: <Gem /> },
    MesghalGold: { id: 'MesghalGold', name: 'مثقال طلا', symbol: 'IRT', icon: <BarChart3 /> },
    Gold18K: { id: 'Gold18K', name: 'طلا ۱۸ عیار', symbol: 'IRT', icon: <Gem /> },
    EmamiCoin: { id: 'EmamiCoin', name: 'سکه امامی', symbol: 'IRT', icon: <CircleDollarSign /> },
    Dollar: { id: 'Dollar', name: 'دلار', symbol: 'IRT', icon: <Banknote /> },
    USDT: { id: 'USDT', name: 'تتر', symbol: 'IRT', icon: <CircleDollarSign /> },
};

type AdvancedLivePricesProps = {
  initialData: Omit<PriceData, 'cryptos'>;
};

export default function AdvancedLivePrices({ initialData }: AdvancedLivePricesProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Object.keys(initialData).length === 0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const COOLDOWN_SECONDS = 30;

  useEffect(() => {
    if(initialData && Object.keys(initialData).length > 0) {
        setData(initialData);
        setLoading(false);
        setLastUpdated(new Date());
    } else {
        fetchPrices();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const prices: LivePrice[] = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return [];
    return Object.entries(data)
      .map(([key, value]) => {
        if (key === 'cryptos' || !value) return null;
        const configKey = key as keyof Omit<PriceData, 'cryptos'>;
        const config = priceConfig[configKey];
        
        if (!config || !value?.price) return null;
        
        const priceNumber = Number(value.price);

        return {
          ...config,
          price: priceNumber.toLocaleString('fa-IR'),
          change: value.change,
        };
      })
      .filter((p): p is LivePrice => p !== null);
  }, [data]);

  const fetchPrices = async () => {
    setLoading(true);
    setIsCooldown(true);
    setCooldownTime(COOLDOWN_SECONDS);

    try {
      // Since flows are disabled, we cannot fetch prices.
      // This is a placeholder for when the functionality is restored.
      console.error("Price fetching is temporarily disabled. Using mock data.");
       // Using mock data
      const mockData = {
        GoldOunce: { price: "2320", change: "+0.2%" },
        MesghalGold: { price: "146500000", change: "-0.5%" },
        Gold18K: { price: "33850000", change: "-0.5%" },
        EmamiCoin: { price: "408000000", change: "+1.2%" },
        Dollar: { price: "595000", change: "0" },
        USDT: { price: "596500", change: "+0.1%" },
      };
      setData(mockData);
      setLastUpdated(new Date());

    } catch (error) {
      console.error("Failed to fetch prices:", error);
    } finally {
      setLoading(false);
      cooldownIntervalRef.current = setInterval(() => {
        setCooldownTime(prev => prev - 1);
      }, 1000);
      setTimeout(() => {
          setIsCooldown(false);
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
          }
      }, COOLDOWN_SECONDS * 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  return (
    <div id="live-prices-main" className="glass-effect rounded-3xl p-4 md:p-8 mb-10 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center text-glow">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center ml-3 animate-pulse">
                  <CandlestickChart className="w-6 h-6 text-white"/>
              </div>
              قیمت‌های لحظه‌ای
            </h2>
            <div className="flex items-center space-x-2 space-x-reverse">
                <Button variant="ghost" size="sm" onClick={fetchPrices} disabled={isCooldown || loading} className="text-muted-foreground w-28">
                    {loading ? <RefreshCw className={cn("h-5 w-5 animate-spin")} /> 
                            : isCooldown ? <><Timer className="h-5 w-5 ml-2" /> {cooldownTime} ثانیه</>
                            : <><RefreshCw className="h-5 w-5 ml-2" /> به‌روزرسانی</>
                    }
                </Button>
                {lastUpdated && !loading && (
                    <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    <span className="text-sm text-muted-foreground font-body">
                    زنده - {lastUpdated.toLocaleTimeString('fa-IR')}
                    </span>
                    </>
                )}
                {loading && (
                    <span className="text-sm text-muted-foreground font-body">
                    در حال بروزرسانی...
                    </span>
                )}
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {loading ? (
                 Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-2xl"/>
                 ))
            ) : prices.length > 0 ? (
                prices.map((item) => item ? <PriceCard key={item.id} item={item} /> : null)
            ): (
                 <p className='col-span-full text-center text-muted-foreground py-8'>
                    سرویس قیمت‌های لحظه‌ای در حال حاضر در دسترس نیست.
                 </p>
            )}
        </div>
    </div>
  );
}

    