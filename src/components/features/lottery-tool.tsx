"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dices, Trophy, Users, Copy, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function LotteryTool() {
  const [participants, setParticipants] = useState('');
  const [winnerCount, setWinnerCount] = useState('1');
  const [winners, setWinners] = useState<string[]>([]);
  const { toast } = useToast();

  const handleDraw = () => {
    const participantList = participants.split('\n').map(p => p.trim()).filter(Boolean);
    const count = parseInt(winnerCount, 10);

    if (participantList.length === 0) {
      toast({ title: 'خطا', description: 'لیست شرکت‌کنندگان نمی‌تواند خالی باشد.', variant: 'destructive' });
      return;
    }
    if (isNaN(count) || count <= 0) {
      toast({ title: 'خطا', description: 'تعداد برنده‌ها باید یک عدد معتبر بزرگتر از صفر باشد.', variant: 'destructive' });
      return;
    }
    if (count > participantList.length) {
      toast({ title: 'خطا', description: 'تعداد برنده‌ها نمی‌تواند بیشتر از تعداد شرکت‌کنندگان باشد.', variant: 'destructive' });
      return;
    }

    const shuffled = shuffleArray([...participantList]);
    const drawnWinners = shuffled.slice(0, count);
    setWinners(drawnWinners);

    toast({
      title: 'قرعه‌کشی انجام شد!',
      description: `${drawnWinners.length} برنده انتخاب شد.`,
    });
  };

  const copyToClipboard = () => {
    if (winners.length === 0) return;
    const textToCopy = winners.join('\n');
    navigator.clipboard.writeText(textToCopy);
    toast({
        title: 'کپی شد!',
        description: 'لیست برنده‌ها با موفقیت کپی شد.',
    });
  }
  
  const handleClear = () => {
      setParticipants('');
      setWinners([]);
  }

  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <div className='flex justify-between items-center'>
                <Label htmlFor="participants" className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4"/>
                    شرکت‌کنندگان (هر کدام در یک خط)
                </Label>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleClear} disabled={!participants} title="پاک کردن لیست">
                    <Trash2 className="w-5 h-5"/>
                </Button>
            </div>
            <Textarea
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="حسین&#x0A;علی&#x0A;زهرا&#x0A;..."
                className="min-h-[200px] text-base"
            />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="winner-count" className="text-muted-foreground">تعداد برنده‌ها</Label>
              <Input
                id="winner-count"
                type="number"
                value={winnerCount}
                onChange={(e) => setWinnerCount(e.target.value)}
                min="1"
                className="h-14 text-2xl text-center font-display"
              />
          </div>
           <Button onClick={handleDraw} className="w-full h-12 text-base">
            <Dices className="ml-2 h-5 w-5" />
            شروع قرعه‌کشی
          </Button>
        </div>
      </div>
      
       <div>
            <div className="flex justify-between items-center mb-2">
                 <Label className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    برنده‌ها
                </Label>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={copyToClipboard} disabled={winners.length === 0} title="کپی کردن برنده‌ها">
                    <Copy className="w-5 h-5"/>
                </Button>
            </div>
            <ScrollArea className="h-48 bg-muted/50 rounded-lg shadow-inner border p-4">
                {winners.length > 0 ? (
                    <ol className="list-decimal list-inside space-y-2 text-lg font-medium text-primary">
                    {winners.map((winner, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="text-sm bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">{index + 1}</span>
                            <span>{winner}</span>
                        </li>
                    ))}
                    </ol>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>برای شروع، قرعه‌کشی را انجام دهید.</p>
                    </div>
                )}
            </ScrollArea>
       </div>
    </CardContent>
  );
}
