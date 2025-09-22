"use client";

import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clipboard, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

// --- Conversion Functions ---
// All functions should handle string inputs and return string outputs

const hexToRgb = (hex: string): string => {
  let c = hex.substring(1); // remove #
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  if (c.length !== 6) return '';
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const rgbToHex = (rgb: string): string => {
  const parts = rgb.split(',').map(s => parseInt(s.trim(), 10));
  if (parts.length !== 3 || parts.some(isNaN)) return '';
  const [r, g, b] = parts;
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (rgb: string): string => {
  const parts = rgb.split(',').map(s => parseInt(s.trim(), 10));
  if (parts.length !== 3 || parts.some(isNaN)) return '';
  let [r, g, b] = parts;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
};

const hslToRgb = (hsl: string): string => {
  const parts = hsl.replace(/%/g, '').split(',').map(s => parseFloat(s.trim()));
  if (parts.length !== 3 || parts.some(isNaN)) return '';
  let [h, s, l] = parts;
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
};


const ColorInput = ({ label, value, onChange, placeholder, onCopy }: {
    label: string,
    value: string,
    onChange: (val: string) => void,
    placeholder: string,
    onCopy: () => void,
}) => (
    <div className="space-y-2">
        <Label className="text-muted-foreground">{label}</Label>
        <div className="relative">
            <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-12 text-lg text-center font-mono"
                dir="ltr"
            />
             <Button variant="ghost" size="icon" className="absolute top-1/2 left-2 transform -translate-y-1/2" onClick={onCopy}>
                <Clipboard className="w-5 h-5 text-muted-foreground"/>
            </Button>
        </div>
    </div>
);

export default function ColorConverter() {
  const [hex, setHex] = useState('#6A3EAB');
  const [rgb, setRgb] = useState('106, 62, 171');
  const [hsl, setHsl] = useState('265, 48%, 46%');
  const [lastChanged, setLastChanged] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  
  const { toast } = useToast();

  useEffect(() => {
    if (lastChanged === 'hex' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
        const newRgb = hexToRgb(hex);
        setRgb(newRgb);
        setHsl(rgbToHsl(newRgb));
    }
  }, [hex, lastChanged]);

  useEffect(() => {
    if (lastChanged === 'rgb') {
        const newHex = rgbToHex(rgb);
        setHex(newHex);
        setHsl(rgbToHsl(rgb));
    }
  }, [rgb, lastChanged]);

  useEffect(() => {
    if (lastChanged === 'hsl') {
        const newRgb = hslToRgb(hsl);
        setRgb(newRgb);
        setHex(rgbToHex(newRgb));
    }
  }, [hsl, lastChanged]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'کپی شد!', description: `مقدار "${text}" کپی شد.` });
  };

  return (
    <CardContent className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Label>انتخاب‌گر رنگ</Label>
        <div className="relative">
          <Input 
            type="color" 
            value={hex}
            onChange={e => { setHex(e.target.value); setLastChanged('hex'); }}
            className="w-24 h-24 p-2 cursor-pointer" 
          />
        </div>
        <div className="w-full h-20 rounded-lg" style={{ backgroundColor: hex }}></div>
      </div>
      
      <div className="space-y-4">
        <ColorInput 
          label="HEX" 
          value={hex}
          onChange={val => { setHex(val); setLastChanged('hex'); }}
          placeholder="#6A3EAB"
          onCopy={() => copyToClipboard(hex)}
        />
        <ColorInput 
          label="RGB" 
          value={rgb}
          onChange={val => { setRgb(val); setLastChanged('rgb'); }}
          placeholder="106, 62, 171"
          onCopy={() => copyToClipboard(rgb)}
        />
        <ColorInput 
          label="HSL" 
          value={hsl}
          onChange={val => { setHsl(val); setLastChanged('hsl'); }}
          placeholder="265, 48%, 46%"
          onCopy={() => copyToClipboard(hsl)}
        />
      </div>
    </CardContent>
  );
}
