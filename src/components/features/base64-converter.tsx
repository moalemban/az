
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Copy, Download, File as FileIcon, Upload, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';

const toBase64 = (str: string) => {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        return 'خطا در انکود کردن متن. ممکن است شامل کاراکترهای نامعتبر باشد.';
    }
};

const fromBase64 = (str: string) => {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        return 'رشته Base64 نامعتبر است.';
    }
};


export default function Base64Converter() {
  const [text, setText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState('');

  const { toast } = useToast();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setBase64Text(newText ? toBase64(newText) : '');
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBase64 = e.target.value;
    setBase64Text(newBase64);
    setText(newBase64 ? fromBase64(newBase64) : '');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            // result is in format "data:mime/type;base64,the_base_64_string"
            setFileBase64(result.split(',')[1]);
        };
        reader.readAsDataURL(selectedFile);
    }
  };

  const handleDownload = () => {
    if (!fileBase64) {
      toast({ title: 'خطا', description: 'هیچ داده Base64 برای دانلود وجود ندارد.', variant: 'destructive'});
      return;
    }
    const byteCharacters = atob(fileBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file?.type || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file?.name || 'decoded-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const copyToClipboard = (content: string) => {
      if (!content) return;
      navigator.clipboard.writeText(content);
      toast({ title: 'کپی شد', description: 'محتوا در کلیپ‌بورد کپی شد.' });
  }

  return (
      <Tabs defaultValue="text" className="w-full pt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">متن</TabsTrigger>
          <TabsTrigger value="file">فایل</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="text-input" className="text-muted-foreground">متن اصلی</Label>
                <Textarea id="text-input" value={text} onChange={handleTextChange} placeholder="متن خود را اینجا وارد کنید..." className="min-h-[120px]"/>
            </div>
            <div className="flex justify-center">
                <ArrowRightLeft className="h-6 w-6 text-muted-foreground"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="base64-output" className="text-muted-foreground">خروجی Base64</Label>
                <div className="relative">
                    <Textarea id="base64-output" value={base64Text} onChange={handleBase64Change} placeholder="خروجی Base64..." className="min-h-[120px] font-mono" dir="ltr"/>
                    <Button variant="ghost" size="icon" className="absolute top-2 left-2" onClick={() => copyToClipboard(base64Text)}>
                        <Copy className="w-5 h-5 text-muted-foreground"/>
                    </Button>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="file" className="space-y-4">
             <div className="space-y-2">
                 <Label>انکود فایل به Base64</Label>
                 <Card className="p-4 border-dashed">
                     <div className="flex flex-col items-center justify-center gap-4">
                        {!file ? (
                             <>
                                <Upload className="w-10 h-10 text-muted-foreground"/>
                                <Button asChild variant="outline">
                                    <label htmlFor="file-upload">انتخاب فایل</label>
                                </Button>
                                <input id="file-upload" type="file" onChange={handleFileChange} className="hidden"/>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 bg-muted p-3 rounded-lg w-full">
                                <FileIcon className="w-6 h-6 text-primary"/>
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setFileBase64(''); }}>
                                    <X className="w-5 h-5"/>
                                </Button>
                            </div>
                        )}
                     </div>
                 </Card>
             </div>
             
             <div className="space-y-2">
                <Label htmlFor="file-base64-output" className="text-muted-foreground">خروجی Base64</Label>
                 <div className="relative">
                    <Textarea id="file-base64-output" value={fileBase64} onChange={(e) => setFileBase64(e.target.value)} placeholder="رشته Base64 فایل اینجا نمایش داده می‌شود یا می‌توانید برای دیکود کردن، آن را اینجا بچسبانید." className="min-h-[150px] font-mono" dir="ltr"/>
                     <Button variant="ghost" size="icon" className="absolute top-2 left-2" onClick={() => copyToClipboard(fileBase64)}>
                        <Copy className="w-5 h-5 text-muted-foreground"/>
                    </Button>
                </div>
             </div>

             <Button onClick={handleDownload} disabled={!fileBase64} className="w-full">
                 <Download className="w-4 h-4 ml-2"/>
                 دانلود فایل دیکود شده
             </Button>
        </TabsContent>
      </Tabs>
  );
}
