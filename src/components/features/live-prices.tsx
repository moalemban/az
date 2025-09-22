"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandlestickChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PriceData } from '@/lib/types';


const PriceItem = ({ label, value, change }: { label: string, value: string | undefined, change: string | null | undefined }) => {
    if (value === undefined) return null;
    const isPositive = change && !change.startsWith('-');
    const isNegative = change && change.startsWith('-');
    const displayChange = change?.replace(/[+-]/, '');

    return (
        <div className="flex justify-between items-baseline p-2 rounded-md hover:bg-muted/50">
            <span className="font-semibold text-muted-foreground">{label}</span>
            <div className='text-left'>
                <p className="font-mono text-foreground">{parseFloat(value).toLocaleString('fa-IR')}</p>
                {displayChange && <p className={`text-xs font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{displayChange}</p>}
            </div>
        </div>
    )
};


export default function LivePrices() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPrices() {
      try {
        setLoading(true);
        // AI Flow is disabled, using mock data for now.
        // const fetchedPrices = await fetchPrices();
        setPrices({});
      } catch (error) {
        console.error("Failed to fetch prices:", error);
        setPrices({}); // Set to empty object on error
      } finally {
        setLoading(false);
      }
    }
    getPrices();
  }, []);

  return (
    <CardContent>
        {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
        ) : prices ? (
            <div className="space-y-2">
                <PriceItem label="انس طلا" value={prices.GoldOunce?.price} change={prices.GoldOunce?.change} />
                <PriceItem label="مثقال طلا" value={prices.MesghalGold?.price} change={prices.MesghalGold?.change} />
                <PriceItem label="طلا ۱۸ عیار" value={prices.Gold18K?.price} change={prices.Gold18K?.change} />
                <PriceItem label="سکه امامی" value={prices.EmamiCoin?.price} change={prices.EmamiCoin?.change} />
                <PriceItem label="دلار" value={prices.Dollar?.price} change={prices.Dollar?.change} />
                <PriceItem label="تتر" value={prices.USDT?.price} change={prices.USDT?.change} />
            </div>
        ) : (
             <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
                <p>اطلاعات قیمت در حال حاضر در دسترس نیست.</p>
            </div>
        )}
    </CardContent>
  );
}
