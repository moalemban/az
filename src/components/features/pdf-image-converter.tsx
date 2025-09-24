"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Loader2, Image as ImageIcon, File as FileIcon, ArrowRightLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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


export default function PdfImageConverter() {
  const [loading, setLoading] = useState(false);
  const [pdfToImageFile, setPdfToImageFile] = useState<File | null>(null);
  const [imageToPdfFile, setImageToPdfFile] = useState<File | null>(null);
  const [imageFormat, setImageFormat] = useState<'jpeg' | 'png'>('jpeg');

  const { toast } = useToast();

  const handleConvert = (type: 'pdf-to-image' | 'image-to-pdf') => {
    const file = type === 'pdf-to-image' ? pdfToImageFile : imageToPdfFile;
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
    <Tabs defaultValue="pdf-to-image" className="w-full pt-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pdf-to-image">
            <div className="flex items-center gap-2">
                <FileIcon className="w-4 h-4"/> PDF به عکس <ArrowRightLeft className="w-4 h-4"/> <ImageIcon className="w-4 h-4"/>
            </div>
        </TabsTrigger>
        <TabsTrigger value="image-to-pdf">
             <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4"/> عکس به PDF <ArrowRightLeft className="w-4 h-4"/> <FileIcon className="w-4 h-4"/>
            </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pdf-to-image" className="space-y-6">
        <FileInput onFileChange={setPdfToImageFile} accept="application/pdf" title="فایل PDF را انتخاب کنید" />
         <div className="space-y-2">
          <Label>فرمت خروجی</Label>
           <Select value={imageFormat} onValueChange={(val: 'jpeg' | 'png') => setImageFormat(val)}>
              <SelectTrigger>
                  <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="jpeg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
              </SelectContent>
           </Select>
        </div>
        <Button onClick={() => handleConvert('pdf-to-image')} disabled={loading || !pdfToImageFile} className="w-full h-12 text-base">
          {loading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Download className="ml-2 h-5 w-5" />}
          تبدیل و دانلود
        </Button>
      </TabsContent>
      <TabsContent value="image-to-pdf" className="space-y-4">
        <FileInput onFileChange={setImageToPdfFile} accept="image/jpeg,image/png" title="فایل عکس را انتخاب کنید" />
        <Button onClick={() => handleConvert('image-to-pdf')} disabled={loading || !imageToPdfFile} className="w-full h-12 text-base">
          {loading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Download className="ml-2 h-5 w-5" />}
          تبدیل و دانلود
        </Button>
      </TabsContent>
    </Tabs>
  );
}
