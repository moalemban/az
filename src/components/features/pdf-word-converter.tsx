"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Loader2, Image as ImageIcon, File as FileIcon, ArrowRightLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FileInput = ({ onFileChange, accept, title }: { onFileChange: (file: File) => void, accept: string, title: string }) => {
  const [fileName, setFileName] = useState('');

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById(accept)?.click()}
    >
      <input type="file" id={accept} onChange={handleChange} className="hidden" accept={accept} />
      <Upload className="w-10 h-10 text-muted-foreground/50 mb-3" />
      <p className="text-muted-foreground text-center font-semibold">{title}</p>
      {fileName ? (
        <p className="text-xs text-primary mt-2">{fileName}</p>
      ) : (
        <p className="text-xs text-muted-foreground/70 mt-1">فایل را بکشید یا برای انتخاب کلیک کنید</p>
      )}
    </div>
  );
};


export default function PdfWordConverter() {
  const [loading, setLoading] = useState(false);
  const [pdfToWordFile, setPdfToWordFile] = useState<File | null>(null);
  const [wordToPdfFile, setWordToPdfFile] = useState<File | null>(null);

  const { toast } = useToast();

  const handleConvert = (type: 'pdf-to-word' | 'word-to-pdf') => {
    const file = type === 'pdf-to-word' ? pdfToWordFile : wordToPdfFile;
    if (!file) {
      toast({ title: 'خطا', description: 'لطفا ابتدا یک فایل را انتخاب کنید.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    // Placeholder for actual conversion logic
    console.log(`Converting ${file.name} from ${type.split('-')[0]} to ${type.split('-')[2]}`);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'در دست ساخت', description: 'قابلیت تبدیل فایل در حال حاضر در دست توسعه است.', variant: 'default' });
    }, 2000);
  };

  return (
    <Tabs defaultValue="pdf-to-word" className="w-full pt-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pdf-to-word">
             <div className="flex items-center gap-2">
                <FileIcon className="w-4 h-4"/> PDF به Word <ArrowRightLeft className="w-4 h-4"/> <FileIcon className="w-4 h-4"/>
            </div>
        </TabsTrigger>
        <TabsTrigger value="word-to-pdf">
             <div className="flex items-center gap-2">
                <FileIcon className="w-4 h-4"/> Word به PDF <ArrowRightLeft className="w-4 h-4"/> <FileIcon className="w-4 h-4"/>
            </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pdf-to-word" className="space-y-4">
        <FileInput onFileChange={setPdfToWordFile} accept="application/pdf" title="فایل PDF را انتخاب کنید" />
        <Button onClick={() => handleConvert('pdf-to-word')} disabled={loading || !pdfToWordFile} className="w-full h-12 text-base">
          {loading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Download className="ml-2 h-5 w-5" />}
          تبدیل و دانلود (DOCX)
        </Button>
      </TabsContent>
      <TabsContent value="word-to-pdf" className="space-y-4">
        <FileInput onFileChange={setWordToPdfFile} accept=".doc,.docx" title="فایل Word را انتخاب کنید" />
        <Button onClick={() => handleConvert('word-to-pdf')} disabled={loading || !wordToPdfFile} className="w-full h-12 text-base">
          {loading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Download className="ml-2 h-5 w-5" />}
          تبدیل و دانلود (PDF)
        </Button>
      </TabsContent>
    </Tabs>
  );
}
