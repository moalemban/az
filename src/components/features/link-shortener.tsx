"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link as LinkIcon, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = z.object({
  url: z.string().url({ message: 'لطفاً یک آدرس اینترنتی معتبر وارد کنید.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function LinkShortener() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setShortUrl(null);
    
    setTimeout(() => {
        setLoading(false);
        toast({
            title: 'سرویس غیرفعال است',
            description: 'قابلیت کوتاه‌کننده لینک به طور موقت غیرفعال است.',
            variant: 'destructive',
        });
    }, 1000);
  };
  
  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    toast({
        title: 'کپی شد!',
        description: 'لینک کوتاه شده با موفقیت کپی شد.',
    });
  }

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="long-url" className="text-muted-foreground">لینک طولانی را وارد کنید</Label>
          <Input
            id="long-url"
            dir="ltr"
            {...register('url')}
            placeholder="https://www.example.com/a-very-long/url/to-be-shortened"
            className="h-12 text-lg text-center"
          />
          {errors.url && <p className="text-sm text-destructive mt-1">{errors.url.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full h-12 text-base">
          {loading ? (
            <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال پردازش...</>
          ) : (
            <><LinkIcon className="ml-2 h-5 w-5" /> کوتاه‌سازی لینک</>
          )}
        </Button>
      </form>

      {shortUrl && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <LinkIcon className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700 dark:text-green-400">لینک کوتاه شما:</AlertTitle>
          <AlertDescription className="flex justify-between items-center" dir="ltr">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-lg text-primary hover:underline">
              {shortUrl}
            </a>
             <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-muted-foreground">
                <Copy className="h-5 w-5"/>
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  );
}
