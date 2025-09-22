"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { KeyRound, Clipboard, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const charSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const ambiguousChars = '{}[]()/\\\'"~,;.<>';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ value: 0, label: 'بسیار ضعیف', color: 'bg-red-500' });
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: true,
    excludeAmbiguous: true,
  });
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = '';
    
    let localCharsets = { ...charSets };

    if (options.excludeSimilar) {
        localCharsets.lowercase = localCharsets.lowercase.replace(/[l]/g, '');
        localCharsets.uppercase = localCharsets.uppercase.replace(/[O]/g, '');
        localCharsets.numbers = localCharsets.numbers.replace(/[01]/g, '');
    }
    if (options.excludeAmbiguous) {
        localCharsets.symbols = localCharsets.symbols.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }

    if (options.lowercase) charset += localCharsets.lowercase;
    if (options.uppercase) charset += localCharsets.uppercase;
    if (options.numbers) charset += localCharsets.numbers;
    if (options.symbols) charset += localCharsets.symbols;

    if (charset === '') {
      toast({
        title: 'خطا',
        description: 'حداقل یک نوع کاراکتر را برای تولید رمز انتخاب کنید.',
        variant: 'destructive',
      });
      setPassword('');
      return;
    }

    let newPassword = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      newPassword += charset[randomValues[i] % charset.length];
    }
    setPassword(newPassword);
  };
  
  const calculateStrength = () => {
    let score = 0;
    if (options.lowercase) score += 1;
    if (options.uppercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 2;

    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;

    let totalScore = (score / 8) * 100;
      if (length < 8) totalScore = Math.min(totalScore, 20);

    let strengthLabel = 'بسیار ضعیف';
    let strengthColor = 'bg-red-500';

    if (totalScore > 85) {
        strengthLabel = 'بسیار قوی';
        strengthColor = 'bg-emerald-500';
    } else if (totalScore > 65) {
        strengthLabel = 'قوی';
        strengthColor = 'bg-green-500';
    } else if (totalScore > 40) {
        strengthLabel = 'متوسط';
        strengthColor = 'bg-yellow-500';
    } else if (totalScore > 20) {
        strengthLabel = 'ضعیف';
        strengthColor = 'bg-orange-500';
    }
    
    setStrength({ value: totalScore, label: strengthLabel, color: strengthColor });
  };


  useEffect(() => {
    // We don't generate a password on initial load to avoid hydration issues with crypto
  }, [length, options]);

  useEffect(() => {
    calculateStrength();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, length, options]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: 'کپی شد!',
      description: 'رمز عبور با موفقیت در کلیپ‌بورد شما کپی شد.',
    });
  };

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const optionLabels: Record<keyof typeof options, string> = {
      'lowercase': 'حروف کوچک (a-z)',
      'uppercase': 'حروف بزرگ (A-Z)',
      'numbers': 'اعداد (0-9)',
      'symbols': 'نمادها (!@#$)',
      'excludeSimilar': 'حذف کاراکترهای مشابه (O, 0, l, 1)',
      'excludeAmbiguous': 'حذف کاراکترهای مبهم ({[]})'
  }

  return (
    <CardContent className="space-y-6">
      <div className="relative">
        <Input
          readOnly
          value={password}
          className="h-14 text-lg text-center font-mono tracking-widest pr-24 pl-12"
          placeholder="برای تولید رمز، دکمه را بزنید"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={generatePassword} className="text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-5 w-5" />
            </Button>
          <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-muted-foreground hover:text-foreground">
            <Clipboard className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
          <div className='flex items-center justify-between'>
              <Label className="text-muted-foreground">طول رمز: <span className='font-mono text-primary text-lg'>{length}</span></Label>
                <div className='w-48'>
                    <Slider
                      value={[length]}
                      onValueChange={(val) => setLength(val[0])}
                      min={6}
                      max={32}
                      step={1}
                    />
                </div>
          </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                  <Label className="text-muted-foreground">قدرت رمز:</Label>
                  <span className='text-sm font-medium' style={{color: `hsl(var(${strength.color.replace('bg-', '--')}))`}}>{strength.label}</span>
              </div>
                <Progress value={strength.value} className={cn("h-2", strength.color)} />
            </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        {Object.keys(options).map(keyStr => {
            const key = keyStr as keyof typeof options;
            return (
              <div key={key} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={key}
                  checked={options[key]}
                  onCheckedChange={() => handleOptionChange(key)}
                />
                <Label htmlFor={key} className="text-sm cursor-pointer text-muted-foreground">
                  {optionLabels[key]}
                </Label>
              </div>
            )
        })}
      </div>
    </CardContent>
  );
}
