
"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Sparkles, FileText, Upload, FileSignature } from 'lucide-react';
import { extractTextFromFile, type OcrInput } from '@/ai/flows/ocr-flow';
import { Input } from '@/components/ui/input';

const MAX_FILE_SIZE_MB = 5;

export default function OcrExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast({
          title: 'حجم فایل زیاد است',
          description: `لطفاً فایلی با حجم کمتر از ${MAX_FILE_SIZE_MB} مگابایت انتخاب کنید.`,
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setExtractedText(''); // Reset previous results
    }
  };

  const handleExtract = async () => {
    if (!file) {
      toast({ title: 'فایلی انتخاب نشده است', description: 'لطفاً یک فایل تصویر یا PDF را انتخاب کنید.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setExtractedText('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        const input: OcrInput = {
            fileDataUri: base64data,
        };

        const result = await extractTextFromFile(input);
        setExtractedText(result.extractedText);
        toast({ title: 'موفقیت!', description: 'متن با موفقیت از فایل استخراج شد.' });
        setLoading(false);
      };
      reader.onerror = () => {
          throw new Error('خطا در خواندن فایل.');
      }

    } catch (error) {
      console.error(error);
      toast({
        title: 'خطا در استخراج متن',
        description: 'مشکلی در ارتباط با سرور هوش مصنوعی رخ داد.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    toast({
      title: 'کپی شد!',
      description: 'متن استخراج شده با موفقیت در کلیپ‌بورد کپی شد.',
    });
  };

  return (
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="file-input" className="text-muted-foreground">فایل تصویر (JPG, PNG) یا PDF را انتخاب کنید</Label>
        <div className="flex items-center gap-4">
          <Input id="file-input" type="file" onChange={handleFileChange} accept="image/jpeg,image/png,application/pdf" className="flex-1"/>
          {file && <p className="text-sm text-muted-foreground">{file.name}</p>}
        </div>
      </div>
      
      <Button onClick={handleExtract} disabled={loading || !file} className="w-full h-12 text-base">
        {loading ? (
          <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال پردازش...</>
        ) : (
          <><Sparkles className="ml-2 h-5 w-5" /> استخراج متن</>
        )}
      </Button>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="extracted-text" className="flex items-center gap-2 text-muted-foreground">
            <FileSignature className="w-5 h-5"/>
            متن استخراج‌شده
          </Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!extractedText || loading}
            className="text-muted-foreground hover:text-primary"
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative min-h-[200px] p-4 bg-muted/50 rounded-lg border">
             <p className="text-base whitespace-pre-wrap leading-relaxed">{extractedText}</p>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
             {!loading && !extractedText && (
                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-center p-4">
                    <p>متن استخراج شده از فایل شما اینجا نمایش داده می‌شود...</p>
                </div>
            )}
        </div>
      </div>
    </CardContent>
  );
}
