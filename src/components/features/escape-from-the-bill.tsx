"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Refrigerator, Tv, Wind, Heater, Fan, Redo, Trophy, Info, LightbulbOff, Sparkles, Waves, AirVent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


type ApplianceType = 'lamp' | 'tv' | 'cooler' | 'fridge' | 'kettle' | 'microwave' | 'heater' | 'fan';
type ConsumptionLevel = 'high' | 'medium' | 'essential';

type Appliance = {
    id: string;
    name: string;
    type: ApplianceType;
    consumption: ConsumptionLevel;
    icon: React.ReactNode;
};

type Room = {
    name: string;
    appliances: Appliance[];
    className: string;
};

const initialRooms: Room[] = [
    {
        name: 'سالن',
        className: 'col-span-2 row-span-2 bg-amber-100/30 dark:bg-amber-800/20',
        appliances: [
            { id: 'salon_lamp_1', name: 'لامپ', type: 'lamp', consumption: 'medium', icon: <Lightbulb /> },
            { id: 'salon_tv', name: 'تلویزیون', type: 'tv', consumption: 'medium', icon: <Tv /> },
            { id: 'salon_cooler', name: 'کولر گازی', type: 'cooler', consumption: 'high', icon: <AirVent /> },
        ],
    },
    {
        name: 'آشپزخانه',
        className: 'bg-sky-100/30 dark:bg-sky-800/20',
        appliances: [
            { id: 'kitchen_fridge', name: 'یخچال', type: 'fridge', consumption: 'essential', icon: <Refrigerator /> },
            { id: 'kitchen_microwave', name: 'مایکروویو', type: 'microwave', consumption: 'high', icon: <Waves /> },
        ],
    },
     {
        name: 'اتاق خواب',
        className: 'bg-rose-100/30 dark:bg-rose-800/20',
        appliances: [
            { id: 'bedroom_lamp', name: 'لامپ', type: 'lamp', consumption: 'medium', icon: <Lightbulb /> },
            { id: 'bedroom_heater', name: 'بخاری', type: 'heater', consumption: 'high', icon: <Heater /> },
        ],
    },
    {
        name: 'پذیرایی',
        className: 'col-span-2 bg-lime-100/30 dark:bg-lime-800/20',
        appliances: [
            { id: 'living_fan', name: 'پنکه', type: 'fan', consumption: 'medium', icon: <Fan /> },
             { id: 'living_lamp', name: 'لامپ', type: 'lamp', consumption: 'medium', icon: <Lightbulb /> },
        ],
    },
];

const ApplianceButton = ({ appliance, isOn, onToggle }: { appliance: Appliance, isOn: boolean, onToggle: () => void}) => {
    
    const isEssentialAndOn = appliance.consumption === 'essential' && isOn;

    return (
        <button
            onClick={onToggle}
            className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all duration-300 transform hover:scale-105",
                isOn ? 'bg-white/80 dark:bg-black/50 shadow-lg' : 'bg-black/10 dark:bg-white/10'
            )}
        >
            {isOn && <div className={cn("absolute -inset-1 rounded-xl blur-md -z-10", isEssentialAndOn ? 'bg-cyan-500/50' : 'bg-yellow-400/50 animate-pulse')} />}
            
            <div className={cn('text-5xl transition-colors', isOn ? (isEssentialAndOn ? 'text-cyan-400' : 'text-yellow-400') : 'text-slate-500/70')}>
                {appliance.icon}
            </div>
            <span className="text-xs font-semibold text-foreground/80">{appliance.name}</span>
            <Badge variant={isOn ? "default" : "secondary"} className={cn("text-[10px] px-1 h-auto transition-colors", isOn ? (isEssentialAndOn ? 'bg-cyan-500' : 'bg-yellow-500') : '')}>
                {isOn ? "روشن" : "خاموش"}
            </Badge>
        </button>
    );
};


export default function EscapeFromTheBill() {
    const [applianceState, setApplianceState] = useState<Record<string, boolean>>({});
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
    const { toast } = useToast();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const consumptionValues: Record<ConsumptionLevel, number> = { high: 3, medium: 2, essential: 1 };
    
    const allAppliances = useMemo(() => initialRooms.flatMap(r => r.appliances), []);

    const totalConsumption = useMemo(() => allAppliances.reduce((acc, app) => acc + (applianceState[app.id] ? consumptionValues[app.consumption] : 0), 0), [applianceState, allAppliances, consumptionValues]);
    const maxConsumption = useMemo(() => allAppliances.reduce((acc, app) => acc + consumptionValues[app.consumption], 0), [allAppliances, consumptionValues]);
    const targetConsumption = useMemo(() => allAppliances.filter(a => a.consumption === 'essential').reduce((acc, app) => acc + consumptionValues[app.consumption], 0), [allAppliances, consumptionValues]);

    const startGame = () => {
        const initialState: Record<string, boolean> = {};
        allAppliances.forEach(app => { initialState[app.id] = true });
        setApplianceState(initialState);
        setTimeLeft(60);
        setGameState('playing');
    };

    const toggleAppliance = (id: string) => {
        if (gameState !== 'playing') return;
        
        const appliance = allAppliances.find(a => a.id === id);
        if (!appliance) return;

        setApplianceState(prev => {
            const currentOnState = prev[id];
            if (appliance.consumption === 'essential' && currentOnState) {
                toast({ title: 'جریمه!', description: 'یخچال وسیله‌ای حیاتی است و نباید خاموش شود!', variant: 'destructive' });
                setTimeLeft(t => Math.max(0, t - 10)); // Penalty
                return prev;
            }
            
            const newState = !currentOnState;
             if (!newState && appliance.consumption === 'high') {
                setTimeLeft(t => t + 5);
                toast({ title: 'پاداش زمانی!', description: '۵ ثانیه به زمان شما اضافه شد.'});
            }
            
            return {...prev, [id]: newState };
        });
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
    
    const score = useMemo(() => {
        if (gameState === 'won') {
            return Math.max(0, (timeLeft * 10) + ((maxConsumption - totalConsumption) * 50));
        }
        return 0;
    }, [gameState, timeLeft, maxConsumption, totalConsumption]);

    if (gameState === 'idle' || gameState === 'won' || gameState === 'lost') {
        return (
            <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[400px]">
                 {(gameState === 'won' || gameState === 'lost') && (
                     <div className="text-center space-y-2">
                        <Trophy className={cn("w-16 h-16 mx-auto", gameState === 'won' ? 'text-yellow-400 animate-bounce' : 'text-muted-foreground/50')} />
                        <h3 className="text-2xl font-bold">{gameState === 'won' ? 'شما برنده شدید!' : 'شما باختید!'}</h3>
                        {gameState === 'won' && <p>امتیاز شما: <span className="font-mono font-bold text-primary">{score.toLocaleString('fa-IR')}</span></p>}
                        <p className="text-muted-foreground">{gameState === 'won' ? 'موفق شدید مصرف برق را به موقع کاهش دهید.' : 'زمان شما به پایان رسید.'}</p>
                     </div>
                 )}
                <Button onClick={startGame} size="lg" className="h-14 text-lg">
                    <Sparkles className="ml-2 h-5 w-5" />
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
            
            <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-slate-200/50 dark:bg-slate-900/50 shadow-inner" style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
                {initialRooms.map(room => (
                    <div key={room.name} className={cn('p-3 rounded-xl flex flex-col gap-3', room.className)}>
                        <h4 className="font-semibold text-center text-foreground/70">{room.name}</h4>
                        <div className="grid grid-cols-2 gap-2 flex-grow items-center">
                            {room.appliances.map(app => (
                                <ApplianceButton key={app.id} appliance={app} isOn={applianceState[app.id]} onToggle={() => toggleAppliance(app.id)} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </CardContent>
    );
}
