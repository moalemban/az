"use client";

import { useState, useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Trash2, Copy, Sparkles, FileText, FileCheck } from 'lucide-react';
import { ZodError } from 'zod';
import { Progress } from '../ui/progress';

const MIN_CHARS = 100;

export default function TextSummarizer() {
  const [originalText, setOriginalText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const charCount = originalText.length;
  const progress = Math.min((charCount / MIN_CHARS) * 100, 100);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary('');

    try {
      if(originalText.length < MIN_CHARS) {
          throw new Error(`متن برای خلاصه‌سازی باید حداقل ${MIN_CHARS} کاراکتر باشد.`);
      }

      // Simulate API call since flow is disabled
      setTimeout(() => {
        setSummary('سرویس خلاصه‌ساز متن در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.');
        setLoading(false);
        toast({
            title: 'سرویس غیرفعال است',
            description: 'قابلیت خلاصه‌ساز به طور موقت غیرفعال است.',
            variant: 'destructive'
        });
      }, 1000);

    } catch (error: any) {
      console.error(error);
      let description = 'مشکلی در ارتباط با سرور هوش مصنوعی به وجود آمد.';
      if (error.message) {
        description = error.message;
      }
      toast({
        title: 'خطا در خلاصه‌سازی',
        description,
        variant: 'destructive',
      });
       setLoading(false);
    }
  };

  const handleClear = () => {
    setOriginalText('');
    setSummary('');
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    toast({
      title: 'کپی شد!',
      description: 'متن خلاصه شده با موفقیت در کلیپ‌بورد کپی شد.',
    });
  };

  return (
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="original-text" className="flex items-center gap-2 text-muted-foreground">
             <FileText className="w-5 h-5" />
            متن اصلی
          </Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={!originalText && !summary}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        <Textarea
          id="original-text"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="متن طولانی خود را اینجا وارد یا پیست کنید..."
          className="min-h-[200px] text-base"
          maxLength={10000}
        />
        <div className="flex items-center gap-4">
            <Progress value={progress} className="h-2 w-full"/>
            <p className="text-xs text-muted-foreground text-left" dir='ltr'>
                {charCount.toLocaleString('fa-IR')} / {MIN_CHARS.toLocaleString('fa-IR')}
            </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleSummarize} disabled={loading || charCount < MIN_CHARS} className="w-full max-w-sm h-12 text-base">
          {loading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              در حال پردازش...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 h-5 w-5" />
              خلاصه‌سازی کن
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="summary-text" className="flex items-center gap-2 text-muted-foreground">
            <FileCheck className="w-5 h-5"/>
            متن خلاصه‌شده
          </Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!summary || loading}
            className="text-muted-foreground hover:text-primary"
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative min-h-[150px] p-4 bg-muted/50 rounded-lg border">
             <p className="text-base whitespace-pre-wrap leading-relaxed">{summary}</p>
            {loading && !summary && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
             {!loading && !summary && (
                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <p>خلاصه متن اینجا نمایش داده می‌شود...</p>
                </div>
            )}
        </div>
      </div>
    </CardContent>
  );
}
