
"use client";

import { useState, useMemo, useRef, ChangeEvent } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Printer, FileText, Upload, BarChart, CalendarDays, ArrowLeft, Building, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { numToWords } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Barcode from 'react-barcode';
import { cn } from '@/lib/utils';

type InvoiceMode = 'selector' | 'official' | 'simple';

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number; // Discount per item
};

type PartyInfo = {
  name: string;
  nationalId: string;
  address: string;
  phone: string;
  email: string;
};

const formatNumber = (num: number) => {
  if (isNaN(num)) return '';
  return num.toLocaleString('fa-IR', { useGrouping: true });
};

const parseFormattedNumber = (str: string) => {
  if (!str) return 0;
  // This regex handles both English and Persian numbers and removes commas
  const englishStr = str.replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x0660)).replace(/[\u06F0-\u06F9]/g, c => String(c.charCodeAt(0) - 0x06F0));
  return parseFloat(englishStr.replace(/,/g, ''));
};


const PartyInput = ({ title, party, setParty, isOfficial }: { title: string, party: PartyInfo, setParty: (value: PartyInfo) => void, isOfficial: boolean }) => (
    <div className="space-y-3 glass-effect p-4 rounded-xl">
      <h4 className="font-semibold text-lg text-foreground/90 border-b pb-2 flex items-center gap-2">
          {title === 'فروشنده' ? <Building className="w-5 h-5"/> : <User className="w-5 h-5"/>}
          {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1 sm:col-span-2">
          <Label>نام شخص/شرکت</Label>
          <Input placeholder="نام کامل" value={party.name} onChange={(e) => setParty({ ...party, name: e.target.value })} />
        </div>
        {isOfficial && (
             <div className="space-y-1">
                <Label>کد/شناسه ملی</Label>
                <Input placeholder="کد ملی/شناسه" value={party.nationalId} onChange={(e) => setParty({ ...party, nationalId: e.target.value })} />
            </div>
        )}
        <div className="space-y-1">
           <Label>تلفن</Label>
          <Input placeholder="شماره تماس" value={party.phone} onChange={(e) => setParty({ ...party, phone: e.target.value })} />
        </div>
        {isOfficial && (
            <>
                <div className="space-y-1 sm:col-span-2">
                    <Label>آدرس</Label>
                    <Input placeholder="آدرس کامل" value={party.address} onChange={(e) => setParty({ ...party, address: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <Label>ایمیل</Label>
                    <Input placeholder="آدرس ایمیل" type="email" value={party.email} onChange={(e) => setParty({ ...party, email: e.target.value })} />
                </div>
            </>
        )}
      </div>
    </div>
  );
  
export default function InvoiceGenerator() {
  const [invoiceMode, setInvoiceMode] = useState<InvoiceMode>('selector');

  const [seller, setSeller] = useState<PartyInfo>({ name: 'نام شرکت شما', nationalId: '', address: 'آدرس شما', phone: 'تلفن شما', email: 'ایمیل شما' });
  const [buyer, setBuyer] = useState<PartyInfo>({ name: 'مرتضی محمدی', nationalId: '', address: '', phone: '۰۹۱۲۱۲۳۴۵۶۷', email: 'morteza123@gmail.com' });
  const [invoiceNumber, setInvoiceNumber] = useState('۱۳۹۹۰۰۰۰۱');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/'));
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
      { id: 1, description: 'نام کالای ۱', quantity: 1, unitPrice: 10000, discount: 1000 },
      { id: 2, description: 'نام کالای ۲', quantity: 1, unitPrice: 20000, discount: 1000 },
  ]);
  const [taxRate, setTaxRate] = useState(9);
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<string | null>(PlaceHolderImages.find(p => p.id === 'logo')?.imageUrl || null);
  
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>چاپ فاکتور</title>');
            printWindow.document.write('<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />');
            printWindow.document.write(`
                <style>
                    body { font-family: 'Vazirmatn', sans-serif; direction: rtl; background-color: #fff; color: #000; }
                    @page { size: A4; margin: 0; }
                    .invoice-print-container { max-width: 800px; margin: auto; padding: 20px; }
                    .invoice-header-print { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #ddd; padding-bottom: 15px; }
                    .party-info-container-print { display: flex; justify-content: space-between; gap: 20px; margin: 20px 0; font-size: 13px; }
                    .party-info-print { width: 48%; }
                    .party-info-print div { padding: 4px 0; }
                    .totals-container-print { display: flex; justify-content: space-between; align-items: flex-start; font-size: 13px; margin-top: 20px;}
                    .calc-section-print { width: 320px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
                    .calc-section-print > div { display: flex; justify-content: space-between; padding: 8px; }
                    .calc-section-print > div:not(:last-child) { border-bottom: 1px solid #ddd; }
                    .grand-total-print { font-weight: bold; font-size: 14px; background-color: #eee; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    th { background-color: #f2f2f2; }
                    .signatures-print { margin-top: 60px; display: flex; justify-content: space-around; font-size: 13px; }
                    .no-print { display: none !important; }
                    .font-mono { font-family: monospace; }
                </style>
            `);
            printWindow.document.write('</head><body><div class="invoice-print-container">');
            printWindow.document.write(printContent.innerHTML.replace(/<canvas/g, '<img src="' + (printContent.querySelector('canvas')?.toDataURL() || '') + '" style="height: 50px;"'));
            printWindow.document.write('</div></body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof Omit<InvoiceItem, 'id'>, value: string) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        if (field === 'description') return { ...item, [field]: value };
        return { ...item, [field]: parseFormattedNumber(value) };
      }
      return item;
    });
    setItems(newItems);
  };
  
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setLogo(event.target?.result as string);
        }
        reader.readAsDataURL(file);
    }
  }

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items]);
  const totalDiscount = useMemo(() => items.reduce((acc, item) => acc + (item.quantity * item.discount), 0), [items]);
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const taxAmount = useMemo(() => invoiceMode === 'official' ? subtotalAfterDiscount * (taxRate / 100) : 0, [subtotalAfterDiscount, taxRate, invoiceMode]);
  const grandTotal = useMemo(() => subtotalAfterDiscount + taxAmount, [subtotalAfterDiscount, taxAmount]);
  const grandTotalInWords = useMemo(() => numToWords(String(Math.floor(grandTotal))), [grandTotal]);
  
  if (invoiceMode === 'selector') {
    return (
      <CardContent className="flex flex-col items-center gap-6 pt-10">
        <h3 className="text-xl font-bold">ابتدا نوع فاکتور خود را انتخاب کنید:</h3>
        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <button className="text-right p-6 rounded-2xl border-2 border-transparent hover:border-primary bg-muted/30 card-hover" onClick={() => setInvoiceMode('official')}>
            <h4 className="text-lg font-semibold text-primary flex items-center gap-2"><FileText />فاکتور رسمی</h4>
            <p className="text-sm text-muted-foreground mt-2">شامل تمامی جزئیات قانونی مانند کد ملی، شناسه اقتصادی، آدرس، و محاسبه مالیات بر ارزش افزوده.</p>
          </button>
          <button className="text-right p-6 rounded-2xl border-2 border-transparent hover:border-primary bg-muted/30 card-hover" onClick={() => setInvoiceMode('simple')}>
            <h4 className="text-lg font-semibold text-primary flex items-center gap-2"><FileText />فاکتور ساده</h4>
            <p className="text-sm text-muted-foreground mt-2">یک پیش‌فاکتور یا فاکتور فروش سریع بدون جزئیات رسمی و مالیات. مناسب برای کارهای داخلی.</p>
          </button>
        </div>
      </CardContent>
    );
  }

  const isOfficial = invoiceMode === 'official';

  return (
    <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Area */}
            <div className="space-y-6 no-print">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <FileText className="w-6 h-6 text-primary" />
                        اطلاعات فاکتور {isOfficial ? 'رسمی' : 'ساده'}
                    </h3>
                    <Button variant="link" onClick={() => setInvoiceMode('selector')}>
                        <ArrowLeft className="w-4 h-4 ml-1" />
                        تغییر نوع
                    </Button>
                </div>
                <div className="grid md:grid-cols-1 gap-4">
                    <PartyInput title="فروشنده" party={seller} setParty={setSeller} isOfficial={isOfficial} />
                    <PartyInput title="خریدار" party={buyer} setParty={setBuyer} isOfficial={isOfficial} />
                </div>
                <div className={cn("grid md:grid-cols-2 gap-4", !isOfficial && 'md:grid-cols-1')}>
                    <Input placeholder="شماره فاکتور" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                    {isOfficial && <Input placeholder="تاریخ فاکتور" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />}
                </div>

                <div className="space-y-3 glass-effect p-4 rounded-xl">
                    <h4 className="font-semibold text-lg text-foreground/90">ردیف‌های فاکتور</h4>
                    {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-[1fr,80px,110px,100px,auto] gap-2 items-center">
                            <Input placeholder={`شرح کالا`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                            <Input type="text" placeholder="تعداد" value={formatNumber(item.quantity)} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="text-center" dir="ltr"/>
                            <Input type="text" placeholder="قیمت واحد" value={formatNumber(item.unitPrice)} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="text-center" dir="ltr"/>
                            <Input type="text" placeholder="تخفیف" value={formatNumber(item.discount)} onChange={e => handleItemChange(item.id, 'discount', e.target.value)} className="text-center" dir="ltr"/>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive"><Trash2 className="w-5 h-5"/></Button>
                        </div>
                    ))}
                    <Button onClick={addItem} variant="outline" size="sm" className="mt-2"><Plus className="w-4 h-4 ml-2"/> افزودن ردیف</Button>
                </div>

                 <div className={cn("grid gap-4", isOfficial ? "md:grid-cols-2" : "md:grid-cols-1")}>
                     {isOfficial && (
                        <div className="space-y-2">
                            <Label>مالیات بر ارزش افزوده (%)</Label>
                            <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="text-center"/>
                        </div>
                     )}
                      <div className="space-y-2">
                        <Label>لوگو</Label>
                        <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                     </div>
                </div>

                <Button onClick={handlePrint} className="w-full h-12 text-lg"><Printer className="w-5 h-5 ml-2"/> چاپ فاکتور</Button>
            </div>
            
             {/* Printable Area */}
            <div ref={printRef} className='space-y-4 bg-white text-black p-6 rounded-2xl shadow-lg border -z-10 relative'>
                {/* Header */}
                <div className="invoice-header-print">
                    <div className="text-right space-y-1">
                        <h1 className="text-2xl font-bold">فاکتور فروش {isOfficial ? 'رسمی' : 'ساده'}</h1>
                        <p className="font-semibold">{seller.name || 'نام شرکت'}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        {logo ? <Image src={logo} alt="Logo" width={80} height={80} className='object-contain' /> : 
                        <div className="w-20 h-20 border-2 border-dashed flex flex-col items-center justify-center text-gray-500 text-xs"><FileText className="w-6 h-6 mb-1"/><span>لوگوی شما</span></div>}
                    </div>
                    <div className="text-left space-y-1 text-sm">
                        <div><strong className='ml-2'>تاریخ ثبت:</strong>{invoiceDate || '---'}</div>
                        {isOfficial && <div><strong className='ml-2'>تاریخ سررسید:</strong>{dueDate || '---'}</div>}
                        <div className='flex items-center justify-end'><strong className='ml-2'>شماره:</strong> <span className='font-mono'>{invoiceNumber || '---'}</span></div>
                        {isOfficial && invoiceNumber && <div className='pt-1'><Barcode value={invoiceNumber} height={30} width={1.5} displayValue={false} /></div>}
                    </div>
                </div>

                {/* Seller & Buyer Info */}
                <div className="party-info-container-print border-y py-3">
                    <div className="party-info-print">
                        <p><strong>فروشنده:</strong> {seller.name || '---'}</p>
                        <p><strong>تلفن:</strong> {seller.phone || '---'}</p>
                        {isOfficial && <p><strong>شناسه ملی:</strong> {seller.nationalId || '---'}</p>}
                    </div>
                     <div className="party-info-print">
                        <p><strong>خریدار:</strong> {buyer.name || '---'}</p>
                        <p><strong>تلفن:</strong> {buyer.phone || '---'}</p>
                        {isOfficial && <p><strong>شناسه ملی:</strong> {buyer.nationalId || '---'}</p>}
                    </div>
                </div>

                {/* Items Table */}
                <Table className='text-xs'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">ردیف</TableHead>
                            <TableHead>شرح کالا / خدمات</TableHead>
                            <TableHead className="text-center">تعداد</TableHead>
                            <TableHead className="text-center">قیمت واحد (تومان)</TableHead>
                            {isOfficial && <TableHead className="text-center">تخفیف (تومان)</TableHead>}
                            <TableHead className="text-center">جمع کل (تومان)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => {
                            const total = item.quantity * item.unitPrice - (isOfficial ? item.quantity * item.discount : 0);
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-center font-mono">{formatNumber(item.quantity)}</TableCell>
                                    <TableCell className="text-center font-mono">{formatNumber(item.unitPrice)}</TableCell>
                                    {isOfficial && <TableCell className="text-center font-mono text-red-600">{formatNumber(item.discount)}</TableCell>}
                                    <TableCell className="text-center font-mono font-semibold">{formatNumber(total)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                
                 <div className="totals-container-print mt-4">
                    <div className="words-section flex-1">
                        <p><strong>توضیحات:</strong> {description || '---'}</p>
                        {isOfficial && 
                            <div className="signatures-print">
                                <div><p>امضای فروشنده</p><div className="h-16 w-32 border-t mt-2"></div></div>
                                <div><p>امضای خریدار</p><div className="h-16 w-32 border-t mt-2"></div></div>
                            </div>
                        }
                    </div>
                     <div className="calc-section-print">
                        <div><span>جمع کل:</span><span className="font-mono">{formatNumber(subtotal)} تومان</span></div>
                        {isOfficial && <>
                            <div><span>تخفیف:</span><span className="font-mono">{formatNumber(totalDiscount)} تومان</span></div>
                            <div><span>ارزش افزوده ({formatNumber(taxRate)}٪):</span><span className="font-mono">{formatNumber(taxAmount)} تومان</span></div>
                        </>}
                        <div className="grand-total-print"><span>مبلغ نهایی:</span><span className="font-mono">{formatNumber(grandTotal)} تومان</span></div>
                    </div>
                </div>

            </div>
        </div>
        
    </CardContent>
  );
}

    