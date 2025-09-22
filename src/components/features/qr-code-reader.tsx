
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Copy, AlertCircle, Video, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';


export default function QrCodeReader() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const stopScan = useCallback(() => {
    setIsScanning(false);
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if(videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, []);

  const scanQrCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        try {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });
    
            if (code) {
              setResult(code.data);
              setError(null);
              toast({ title: 'موفق!', description: 'کد QR با موفقیت خوانده شد.', className: 'bg-green-500/10 text-green-600'});
              stopScan();
            }
        } catch (e) {
            console.error("Error getting image data from canvas", e)
        }
      }
    }
    if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(scanQrCode);
    }
  }, [isScanning, stopScan, toast]);
  
   useEffect(() => {
    if (isScanning) {
      animationFrameRef.current = requestAnimationFrame(scanQrCode);
    } else {
        if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopScan();
    };
  }, [isScanning, scanQrCode, stopScan]);


  const startCamera = async () => {
    stopScan(); 
    setResult(null);
    setError(null);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("دوربین در این مرورگر پشتیبانی نمی‌شود.");
        setHasCameraPermission(false);
        setIsScanning(false);
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        setHasCameraPermission(true);
        
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Wait for video to load metadata before trying to scan
            videoRef.current.onloadedmetadata = () => {
                 setIsScanning(true); // Start scanning only after video is ready
            };
        }
    } catch (err) {
        console.error("Camera access error:", err);
        setError("امکان دسترسی به دوربین وجود ندارد. لطفاً دسترسی لازم را بدهید.");
        setHasCameraPermission(false);
        stopScan();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopScan();
    setResult(null);
    setError(null);
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0, img.width, img.height);
              const imageData = context.getImageData(0, 0, img.width, img.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code) {
                setResult(code.data);
                toast({ title: 'موفق!', description: 'کد QR از فایل خوانده شد.'});
              } else {
                setError("هیچ کد QR در تصویر یافت نشد.");
              }
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({ title: 'کپی شد!', description: 'محتوای کد در کلیپ‌بورد کپی شد.' });
  };


  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button onClick={startCamera} className="h-12 text-base">
          <Camera className="ml-2 h-5 w-5" />
          اسکن با دوربین
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="h-12 text-base">
          <Upload className="ml-2 h-5 w-5" />
          آپلود تصویر
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
      </div>

        <div className="relative w-full aspect-video bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className={cn("w-full h-full object-cover", !isScanning && "hidden")} autoPlay playsInline muted/>
            <canvas ref={canvasRef} className="hidden" />
            
            {!isScanning && (
                <div className="text-center text-muted-foreground p-4">
                     {hasCameraPermission === false && (
                        <Alert variant="destructive" className="max-w-sm mx-auto">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>خطای دسترسی به دوربین</AlertTitle>
                            <AlertDescription>
                                برای اسکن، لطفاً دسترسی به دوربین را در تنظیمات مرورگر خود فعال کنید.
                            </AlertDescription>
                        </Alert>
                     )}
                     {hasCameraPermission === null && (
                        <>
                           <Video className="mx-auto h-12 w-12" />
                           <p className="mt-2">برای خواندن کد QR، دوربین را فعال کنید یا یک تصویر آپلود نمایید.</p>
                        </>
                     )}
                      {hasCameraPermission === true && !isScanning && (
                         <>
                           <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                           <p className="mt-2">برای اسکن مجدد، دکمه را بزنید.</p>
                        </>
                     )}
                </div>
            )}

            {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-60 h-60 border-4 border-dashed border-primary/50 rounded-lg animate-pulse"/>
                    <p className="mt-4 text-white bg-black/50 px-3 py-1 rounded-md">در جستجوی کد QR...</p>
                    <Button onClick={stopScan} size="icon" variant="destructive" className="absolute bottom-4 pointer-events-auto rounded-full h-14 w-14">
                        <X className="w-8 h-8"/>
                    </Button>
                </div>
            )}
        </div>


      {(result || error) && (
        <div className="space-y-2">
            <Label>نتیجه</Label>
            {result && (
                <div className="relative">
                    <Textarea readOnly value={result} className="min-h-[100px] text-base bg-green-400/10 text-green-800 dark:text-green-300 border-green-400/50" />
                    <Button onClick={copyResult} size="icon" variant="ghost" className="absolute top-2 left-2 text-muted-foreground">
                        <Copy className="h-5 w-5" />
                    </Button>
                </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </CardContent>
  );
}
