"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Copy, Sparkles, Instagram, Twitter, Linkedin, MessageSquare, Bot } from 'lucide-react';
import { generateSocialPost, type SocialPostInput } from '@/ai/flows/social-post-flow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '../ui/switch';

const FormSchema = z.object({
  topic: z.string().min(5, { message: 'موضوع باید حداقل ۵ کاراکتر باشد.' }),
  platform: z.string(),
  tone: z.string(),
  includeHashtags: z.boolean(),
  includeEmoji: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

const platformOptions = [
    { value: 'Instagram', label: 'اینستاگرام', icon: <Instagram className="w-4 h-4"/> },
    { value: 'Twitter', label: 'توییتر (X)', icon: <Twitter className="w-4 h-4"/> },
    { value: 'LinkedIn', label: 'لینکدین', icon: <Linkedin className="w-4 h-4"/> },
    { value: 'Generic', label: 'عمومی / کانال', icon: <MessageSquare className="w-4 h-4"/> },
]

const toneOptions = [
    { value: 'Friendly', label: 'دوستانه' },
    { value: 'Formal', label: 'رسمی' },
    { value: 'Humorous', label: 'طنز' },
    { value: 'Professional', label: 'حرفه‌ای' },
    { value: 'Inspirational', label: 'انگیزشی' },
]

export default function SocialPostGenerator() {
  const [post, setPost] = useState<{ content: string; hashtags: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
        topic: '',
        platform: 'Instagram',
        tone: 'Friendly',
        includeHashtags: true,
        includeEmoji: true,
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setPost(null);

    const input: SocialPostInput = {
        topic: data.topic,
        platform: data.platform,
        tone: data.tone,
        includeHashtags: data.includeHashtags,
        includeEmoji: data.includeEmoji,
    };

    try {
      const result = await generateSocialPost(input);
      setPost({
          content: result.postContent,
          hashtags: result.hashtags || []
      });
      toast({ title: 'موفقیت!', description: 'پست شما با موفقیت تولید شد.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطا در تولید پست',
        description: 'مشکلی در ارتباط با سرور هوش مصنوعی رخ داد.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'کپی شد!',
      description: 'متن با موفقیت در کلیپ‌بورد کپی شد.',
    });
  };

  return (
    <CardContent className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic-input" className="text-muted-foreground">موضوع اصلی پست</Label>
          <Textarea
            id="topic-input"
            {...register('topic')}
            placeholder="مثال: معرفی یک قابلیت جدید برای محاسبه BMI در اپلیکیشن سلامت"
            className="min-h-[100px] text-base"
          />
          {errors.topic && <p className="text-sm text-destructive mt-1">{errors.topic.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='space-y-2'>
                <Label>پلتفرم</Label>
                 <Controller
                    name="platform"
                    control={control}
                    render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {platformOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>
                                    <div className='flex items-center gap-2'>{opt.icon} {opt.label}</div>
                                </SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                 />
            </div>
             <div className='space-y-2'>
                <Label>لحن نوشته</Label>
                 <Controller
                    name="tone"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {toneOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                 />
            </div>
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
                <Controller name="includeEmoji" control={control} render={({ field }) => <Switch id="includeEmoji" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includeEmoji">همراه با ایموجی 😍</Label>
            </div>
             <div className="flex items-center space-x-2 space-x-reverse">
                <Controller name="includeHashtags" control={control} render={({ field }) => <Switch id="includeHashtags" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includeHashtags">همراه با هشتگ #</Label>
            </div>
        </div>

        <Button type="submit" disabled={loading || !isValid} className="w-full h-12 text-base">
          {loading ? (
            <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال تولید پست...</>
          ) : (
            <><Sparkles className="ml-2 h-5 w-5" /> تولید کن</>
          )}
        </Button>
      </form>

      {(loading || post) && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2 text-muted-foreground">
                <Bot className="w-5 h-5" />
                پست تولید شده
            </Label>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(post?.content || '')} disabled={!post || loading}>
                <Copy className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative min-h-[150px] p-4 bg-muted/50 rounded-lg border">
            {loading && !post ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <p className="text-base whitespace-pre-wrap leading-relaxed">{post?.content}</p>
            )}
          </div>
          {post && post.hashtags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">هشتگ‌های پیشنهادی</Label>
                <div className="flex flex-wrap gap-2" dir="ltr">
                    {post.hashtags.map((tag, i) => (
                        <button key={i} onClick={() => handleCopy(tag)} className="bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm hover:bg-blue-500/20">
                            #{tag}
                        </button>
                    ))}
                </div>
              </div>
          )}
        </div>
      )}
    </CardContent>
  );
}
