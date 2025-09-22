"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Refrigerator, Tv, Wind, Heater, Fan, Redo, Trophy, Info, LightbulbOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


type ApplianceType = 'lamp' | 'tv' | 'cooler' | 'fridge' | 'kettle' | 'microwave' | 'heater' | 'fan' | 'pump';
type ConsumptionLevel = 'high' | 'medium' | 'essential';

type Appliance = {
    id: string;
    name: string;
    type: ApplianceType;
    consumption: ConsumptionLevel;
    location: string;
    isOn: boolean;
};

const initialAppliances: Appliance[] = [
    { id: 'salon_lamp_1', name: 'لامپ سالن ۱', type: 'lamp', consumption: 'medium', location: 'سالن', isOn: true },
    { id: 'salon_lamp_2', name: 'لامپ سالن ۲', type: 'lamp', consumption: 'medium', location: 'سالن', isOn: true },
    { id: 'salon_tv', name: 'تلویزیون', type: 'tv', consumption: 'medium', location: 'سالن', isOn: true },
    { id: 'salon_cooler', name: 'کولر آبی', type: 'cooler', consumption: 'high', location: 'سالن', isOn: true },
    { id: 'kitchen_fridge', name: 'یخچال', type: 'fridge', consumption: 'essential', location: 'آشپزخانه', isOn: true },
    { id: 'kitchen_kettle', name: 'چای‌ساز', type: 'kettle', consumption: 'medium', location: 'آشپزخانه', isOn: true },
    { id: 'kitchen_microwave', name: 'مایکروویو', type: 'microwave', consumption: 'high', location: 'آشپزخانه', isOn: true },
    { id: 'bedroom_lamp', name: 'لامپ اتاق', type: 'lamp', consumption: 'medium', location: 'اتاق خواب', isOn: true },
    { id: 'bedroom_heater', name: 'بخاری برقی', type: 'heater', consumption: 'high', location: 'اتاق خواب', isOn: true },
    { id: 'living_fan', name: 'پنکه', type: 'fan', consumption: 'medium', location: 'پذیرایی کوچک', isOn: true },
];

const ApplianceIcon = ({ type, isOn }: { type: ApplianceType, isOn: boolean }) => {
    const commonClass = "w-8 h-8 sm:w-10 sm:h-10";
    const onClass = "text-yellow-400 animate-pulse";
    const offClass = "text-muted-foreground/50";
    const iconClass = isOn ? onClass : offClass;

    const icons: Record<ApplianceType, React.ReactNode> = {
        lamp: <Lightbulb className={cn(commonClass, iconClass)} />,
        tv: <Tv className={cn(commonClass, iconClass)} />,
        cooler: <Wind className={cn(commonClass, iconClass)} />,
        fridge: <Refrigerator className={cn(commonClass, isOn ? "text-cyan-400" : offClass)} />,
        kettle: <Lightbulb className={cn(commonClass, iconClass)} />, // Placeholder
        microwave: <Lightbulb className={cn(commonClass, iconClass)} />, // Placeholder
        heater: <Heater className={cn(commonClass, iconClass)} />,
        fan: <Fan className={cn(commonClass, iconClass)} />,
        pump: <Lightbulb className={cn(commonClass, iconClass)} />, // Placeholder
    };
    return icons[type] || <LightbulbOff className={cn(commonClass, iconClass)} />;
}

export default function EscapeFromTheBill() {
    const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
    const { toast } = useToast();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const consumptionValues: Record<ConsumptionLevel, number> = { high: 3, medium: 2, essential: 1 };
    
    const totalConsumption = useMemo(() => appliances.reduce((acc, app) => acc + (app.isOn ? consumptionValues[app.consumption] : 0), 0), [appliances, consumptionValues]);
    const maxConsumption = useMemo(() => initialAppliances.reduce((acc, app) => acc + consumptionValues[app.consumption], 0), [consumptionValues]);
    const targetConsumption = useMemo(() => initialAppliances.filter(a => a.consumption === 'essential').reduce((acc, app) => acc + consumptionValues[app.consumption], 0), [consumptionValues]);

    const startGame = () => {
        setAppliances(initialAppliances.map(a => ({...a, isOn: true})));
        setTimeLeft(60);
        setGameState('playing');
    };

    const toggleAppliance = (id: string) => {
        if (gameState !== 'playing') return;

        setAppliances(prev => prev.map(app => {
            if (app.id === id) {
                if (app.consumption === 'essential' && app.isOn) {
                    toast({ title: 'جریمه!', description: 'یخچال نباید خاموش شود!', variant: 'destructive' });
                    setTimeLeft(t => Math.max(0, t - 10)); // Penalty
                    return app;
                }
                const newState = !app.isOn;
                if (!newState && app.consumption === 'high') {
                    setTimeLeft(t => t + 5);
                    toast({ title: 'پاداش زمانی!', description: '۵ ثانیه به زمان شما اضافه شد.'});
                }
                return { ...app, isOn: newState };
            }
            return app;
        }));
    };

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            setGameState('lost');
            toast({ title: 'زمان تمام شد!', description: 'متاسفانه قبض برق صادر شد!', variant: 'destructive' });
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [gameState, timeLeft, toast]);
    
    useEffect(() => {
        if (gameState === 'playing' && totalConsumption <= targetConsumption) {
             if (timerRef.current) clearInterval(timerRef.current);
             setGameState('won');
             toast({ title: 'تبریک!', description: 'شما موفق شدید از قبض برق فرار کنید!', className: 'bg-green-500/20 text-green-600'});
        }
    }, [totalConsumption, targetConsumption, gameState, toast]);
    
    const locations = useMemo(() => [...new Set(initialAppliances.map(a => a.location))], []);

    const score = useMemo(() => {
        if (gameState === 'won') {
            return (60 - timeLeft) * 10 + (maxConsumption - totalConsumption) * 50;
        }
        return 0;
    }, [gameState, timeLeft, maxConsumption, totalConsumption]);

    if (gameState === 'idle' || gameState === 'won' || gameState === 'lost') {
        return (
            <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[400px]">
                 {(gameState === 'won' || gameState === 'lost') && (
                     <div className="text-center space-y-2">
                        <Trophy className={cn("w-16 h-16 mx-auto", gameState === 'won' ? 'text-yellow-400' : 'text-muted-foreground/50')} />
                        <h3 className="text-2xl font-bold">{gameState === 'won' ? 'شما برنده شدید!' : 'شما باختید!'}</h3>
                        {gameState === 'won' && <p>امتیاز شما: <span className="font-mono font-bold text-primary">{score.toLocaleString('fa-IR')}</span></p>}
                        <p className="text-muted-foreground">{gameState === 'won' ? 'موفق شدید مصرف برق را به موقع کاهش دهید.' : 'زمان شما به پایان رسید.'}</p>
                     </div>
                 )}
                <Button onClick={startGame} size="lg" className="h-14 text-lg">
                    <Redo className="ml-2 h-5 w-5" />
                    {gameState === 'idle' ? 'شروع بازی' : 'بازی مجدد'}
                </Button>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30 max-w-sm text-center">
                    <Info className="w-5 h-5 shrink-0" />
                    <span>
                       قبل از اتمام زمان، تمام وسایل پرمصرف (به جز یخچال) را خاموش کنید تا برنده شوید.
                    </span>
                </div>
            </CardContent>
        );
    }
    

    return (
        <CardContent className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl shadow-inner">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">زمان باقی‌مانده</p>
                    <p className={cn("text-3xl font-bold font-mono", timeLeft <= 10 && 'text-red-500 animate-pulse')}>{timeLeft.toLocaleString('fa-IR')}</p>
                </div>
                <div className="w-1/2 text-center">
                     <p className="text-sm text-muted-foreground">میزان مصرف کل</p>
                    <Progress value={(totalConsumption / maxConsumption) * 100} className="h-4 mt-1" />
                    <p className="text-xs font-mono text-muted-foreground mt-1">{totalConsumption} / {maxConsumption}</p>
                </div>
            </div>
            
            <div className="space-y-4">
                 {locations.map(location => (
                     <div key={location}>
                         <h4 className="font-semibold text-foreground mb-2">{location}</h4>
                         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                             {appliances.filter(a => a.location === location).map(appliance => (
                                 <button key={appliance.id} onClick={() => toggleAppliance(appliance.id)} className="flex flex-col items-center justify-center p-2 border rounded-lg gap-1 glass-effect card-hover">
                                     <ApplianceIcon type={appliance.type} isOn={appliance.isOn}/>
                                     <span className="text-xs text-center">{appliance.name}</span>
                                     <Badge variant={appliance.isOn ? "destructive" : "secondary"} className="text-[10px] px-1 h-auto">
                                        {appliance.isOn ? "روشن" : "خاموش"}
                                    </Badge>
                                 </button>
                             ))}
                         </div>
                     </div>
                 ))}
            </div>

        </CardContent>
    );
}
