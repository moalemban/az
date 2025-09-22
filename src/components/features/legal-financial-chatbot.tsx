"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Bot, Sparkles, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const FormSchema = z.object({
  prompt: z.string().min(5, { message: 'سوال شما باید حداقل ۵ کاراکتر باشد.' }),
});

type FormValues = z.infer<typeof FormSchema>;
type Message = {
  role: 'user' | 'bot';
  content: string;
};

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

const LegalFinancialChatInputSchema = z.object({
  history: z.array(HistoryItemSchema).optional(),
  prompt: z.string(),
});

type LegalFinancialChatInput = z.infer<typeof LegalFinancialChatInputSchema>;


export default function LegalFinancialChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const logo = PlaceHolderImages.find(p => p.id === 'logo');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    const userMessage: Message = { role: 'user', content: data.prompt };
    setMessages(prev => [...prev, userMessage]);
    reset();

    // Simulate bot response since flow is disabled
    setTimeout(() => {
        const botMessage: Message = { role: 'bot', content: 'سرویس چت‌بات در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.' };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
        toast({
            title: 'سرویس غیرفعال است',
            description: 'قابلیت چت‌بات حقوقی و مالی به طور موقت غیرفعال است.',
            variant: 'destructive'
        });
    }, 1000);
  };

  return (
    <CardContent className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4 mb-4 border rounded-lg bg-muted/30" ref={scrollAreaRef}>
        <div className="space-y-6">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                     <Avatar className="w-20 h-20 mb-4">
                        {logo && <AvatarImage src={logo.imageUrl} alt="Tabdila Bot" />}
                        <AvatarFallback><Bot/></AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-foreground">دستیار حقوقی و مالی تبدیلا</h3>
                    <p className="text-sm">سوالات خود را در مورد قوانین، مالیات، محاسبات حقوقی و مسائل مالی ایران بپرسید.</p>
                </div>
            ) : (
                messages.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                >
                    {message.role === 'bot' && (
                    <Avatar className="w-8 h-8">
                        {logo && <AvatarImage src={logo.imageUrl} alt="Tabdila Bot" />}
                        <AvatarFallback><Bot/></AvatarFallback>
                    </Avatar>
                    )}
                    <div
                    className={cn(
                        'max-w-md rounded-2xl p-3 text-base whitespace-pre-wrap',
                        message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-background border rounded-bl-none'
                    )}
                    >
                    {message.content}
                     {loading && index === messages.length -1 && message.content === '' && <Loader2 className="inline-block w-4 h-4 ml-2 animate-spin"/>}
                    </div>
                    {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))
            )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <Textarea
          {...register('prompt')}
          placeholder="سوال خود را بپرسید..."
          className="min-h-[50px] pr-12 text-base resize-none"
          disabled={loading}
          onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
              }
          }}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
      {errors.prompt && <p className="text-sm text-destructive mt-2">{errors.prompt.message}</p>}
    </CardContent>
  );
}
