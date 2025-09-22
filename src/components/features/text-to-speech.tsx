"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Voicemail, Copy, Sparkles, Download, Play } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = z.object({
  text: z.string().min(1, { message: 'متن برای تبدیل به گفتار نمی‌تواند خالی باشد.' }).max(1000, 'حداکثر طول متن ۱۰۰۰ کاراکتر است.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function TextToSpeech() {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setAudioDataUri(null);

    setTimeout(() => {
        setLoading(false);
        toast({
            title: 'سرویس غیرفعال است',
            description: 'قابلیت تبدیل نوشتار به گفتار به طور موقت غیرفعال است.',
            variant: 'destructive',
        });
    }, 1000);
  };

  const handleDownload = () => {
    if (!audioDataUri) return;
    const link = document.createElement('a');
    link.href = audioDataUri;
    link.download = 'tabdila-speech.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-to-speech-input" className="text-muted-foreground">متن فارسی خود را وارد کنید (حداکثر ۱۰۰۰ کاراکتر)</Label>
          <Textarea
            id="text-to-speech-input"
            {...register('text')}
            placeholder="سلام، به «تبدیلا» خوش آمدید..."
            className="min-h-[120px] text-base"
          />
          {errors.text && <p className="text-sm text-destructive mt-1">{errors.text.message}</p>}
        </div>
        <Button type="submit" disabled={loading || !isValid} className="w-full h-12 text-base">
          {loading ? (
            <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال پردازش...</>
          ) : (
            <><Sparkles className="ml-2 h-5 w-5" /> تبدیل به گفتار</>
          )}
        </Button>
      </form>

      {loading && (
        <div className="flex items-center justify-center min-h-[80px] bg-muted/50 rounded-lg">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {audioDataUri && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <Voicemail className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700 dark:text-green-400">فایل صوتی آماده است</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            <audio controls src={audioDataUri} className="w-full sm:w-auto">
              مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
            </audio>
             <Button variant="outline" onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="h-4 w-4 ml-2" />
                دانلود (WAV)
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  );
}
