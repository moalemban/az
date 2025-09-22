"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown, RefreshCw, Timer, Bitcoin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CryptoPrice } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

const mockCryptoData: CryptoPrice[] = [
    { name_fa: "بیت‌کوین", name_en: "Bitcoin", symbol: "BTC", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/bitcoin.png", price_usdt: 68000, price_irr: 40500000000, change_percent: 1.5, volume_24h: 30000000000, market_cap: 1300000000000, last_update: "" },
    { name_fa: "اتریوم", name_en: "Ethereum", symbol: "ETH", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/ethereum.png", price_usdt: 3500, price_irr: 2080000000, change_percent: -0.5, volume_24h: 15000000000, market_cap: 420000000000, last_update: "" },
    { name_fa: "تتر", name_en: "Tether", symbol: "USDT", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/tether.png", price_usdt: 1, price_irr: 596500, change_percent: 0.1, volume_24h: 50000000000, market_cap: 110000000000, last_update: "" },
    { name_fa: "بایننس کوین", name_en: "BNB", symbol: "BNB", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/bnb.png", price_usdt: 600, price_irr: 357000000, change_percent: 2.1, volume_24h: 2000000000, market_cap: 88000000000, last_update: "" },
    { name_fa: "سولانا", name_en: "Solana", symbol: "SOL", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/solana.png", price_usdt: 150, price_irr: 89250000, change_percent: 5.3, volume_24h: 3000000000, market_cap: 69000000000, last_update: "" },
    { name_fa: "ریپل", name_en: "XRP", symbol: "XRP", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/xrp.png", price_usdt: 0.5, price_irr: 29750, change_percent: -1.2, volume_24h: 1000000000, market_cap: 27000000000, last_update: "" },
    { name_fa: "کاردانو", name_en: "Cardano", symbol: "ADA", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/cardano.png", price_usdt: 0.45, price_irr: 26775, change_percent: 0.8, volume_24h: 400000000, market_cap: 16000000000, last_update: "" },
    { name_fa: "دوج کوین", name_en: "Dogecoin", symbol: "DOGE", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/dogecoin.png", price_usdt: 0.15, price_irr: 8925, change_percent: 3.5, volume_24h: 800000000, market_cap: 21000000000, last_update: "" },
    { name_fa: "شیبا اینو", name_en: "Shiba Inu", symbol: "SHIB", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/shiba-inu.png", price_usdt: 0.000025, price_irr: 1.48, change_percent: -2.5, volume_24h: 500000000, market_cap: 14000000000, last_update: "" },
    { name_fa: "پالیگان", name_en: "Polygon", symbol: "MATIC", icon: "https://cdn.arzdigital.com/uploads/assets/coins/icons/polygon.png", price_usdt: 0.7, price_irr: 41650, change_percent: 1.1, volume_24h: 300000000, market_cap: 6900000000, last_update: "" }
];


const PriceChangeIndicator = ({ change }: { change: number }) => {
  if (change === 0) {
    return <div className="text-muted-foreground text-sm font-mono">۰.۰۰٪</div>;
  }
  const isPositive = change > 0;
  const color = isPositive ? 'text-green-500' : 'text-red-500';
  const Icon = isPositive ? ArrowUp : ArrowDown;

  return (
    <div className={cn("flex items-center justify-center gap-1 font-mono text-sm", color)}>
      <Icon className="w-3 h-3" />
      <span>{change.toFixed(2)}%</span>
    </div>
  );
};


const formatNumber = (num: number, maximumFractionDigits = 0) => {
    return num.toLocaleString('fa-IR', { maximumFractionDigits });
}

export default function CryptoConverter() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const COOLDOWN_SECONDS = 30;

  const fetchPrices = async () => {
    setLoading(true);
    setIsCooldown(true);
    setCooldownTime(COOLDOWN_SECONDS);

    try {
       console.error("Crypto price fetching is temporarily disabled. Using mock data.");
       // This is a placeholder for when the functionality is restored.
       setPrices(mockCryptoData);
       setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch crypto prices:", error);
      setPrices([]);
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
    fetchPrices();
    
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PriceBadge = ({ crypto }: { crypto: CryptoPrice }) => {
    const isPositive = crypto.change_percent > 0;
    const isNegative = crypto.change_percent < 0;
    const badgeClass = isPositive 
        ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
        : isNegative 
        ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" 
        : "bg-muted text-muted-foreground";
    return (
         <div className={cn("inline-flex flex-col items-center justify-center h-auto px-3 py-1.5 gap-1 w-32 rounded-2xl border", badgeClass)}>
            <span className="font-display font-bold text-base">{formatNumber(crypto.price_usdt, 2)} $</span>
            <PriceChangeIndicator change={crypto.change_percent} />
        </div>
    )
  }

  return (
    <div id="crypto-prices" className="p-0 md:p-0">
        <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4 px-4 md:px-0">
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
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto horizontal-scrollbar">
            <Table className="w-full min-w-max">
                <TableHeader>
                    <TableRow>
                    <TableHead className="text-right w-[50px]">ردیف</TableHead>
                    <TableHead className="text-right">ارز دیجیتال</TableHead>
                    <TableHead className="text-center">قیمت (تومان)</TableHead>
                    <TableHead className="text-center">قیمت (دلار)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            </TableRow>
                        ))
                    ) : prices.length > 0 ? (
                        prices.map((crypto, index) => (
                            <TableRow key={`${crypto.symbol}-${index}`}>
                                <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        {crypto.icon ? (
                                            <Image src={crypto.icon} alt={crypto.name_en} width={28} height={28} className="rounded-full" unoptimized/>
                                        ) : (
                                            <div className="w-7 h-7 flex items-center justify-center bg-muted rounded-full">
                                                <Bitcoin className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold">{crypto.name_en}</div>
                                            <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-display font-bold text-xl text-primary text-glow">{formatNumber(crypto.price_irr / 10)}</TableCell>
                                <TableCell className="text-center">
                                    <PriceBadge crypto={crypto} />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                سرویس قیمت ارزهای دیجیتال در حال حاضر در دسترس نیست.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3 px-4">
             {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}><CardContent className='p-4'><Skeleton className="h-20 w-full" /></CardContent></Card>
                ))
            ) : prices.length > 0 ? (
                prices.map((crypto, index) => (
                    <Card key={`${crypto.symbol}-mob-${index}`} className="glass-effect">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-muted-foreground text-lg">{index + 1}</span>
                                     {crypto.icon ? (
                                        <Image src={crypto.icon} alt={crypto.name_en} width={32} height={32} className="rounded-full" unoptimized/>
                                    ) : (
                                        <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                                            <Bitcoin className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-base">{crypto.name_en}</div>
                                        <div className="text-sm text-muted-foreground">{crypto.name_fa} ({crypto.symbol})</div>
                                    </div>
                                </div>
                                 <PriceBadge crypto={crypto} />
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center text-center">
                                <span className='text-sm text-muted-foreground'>قیمت تومان</span>
                                <span className="font-display font-bold text-lg text-primary text-glow">{formatNumber(crypto.price_irr / 10)}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center text-muted-foreground py-8">
                     <p>سرویس قیمت ارزهای دیجیتال در حال حاضر در دسترس نیست.</p>
                </div>
            )}
        </div>
    </div>
  );
}

    