
"use client";

import { useState, useMemo, useRef, ChangeEvent } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Printer, FileText, Upload, ArrowLeft, Building, User, Wand2, Star, Share2, Ticket, Settings, Briefcase, CreditCard, Send, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Barcode from 'react-barcode';
import { cn } from '@/lib/utils';
import { numToWords } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Textarea } from '../ui/textarea';

type InvoiceTemplate = 'venus_official' | 'classic_simple';
type InvoiceMode = 'template_selector' | InvoiceTemplate;

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
  phone:string;
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
    <div className="space-y-3">
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
                 <div className="space-y-1 sm:col-span-2">
                    <Label>ایمیل</Label>
                    <Input placeholder="ایمیل" value={party.email} onChange={(e) => setParty({ ...party, email: e.target.value })} />
                </div>
            </>
        )}
      </div>
    </div>
  );

  const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-4 bg-muted/30 rounded-xl flex items-center gap-4">
        <div className="text-primary bg-primary/10 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    </div>
);
  
export default function InvoiceGenerator() {
  const [invoiceMode, setInvoiceMode] = useState<InvoiceMode>('template_selector');

  const [seller, setSeller] = useState<PartyInfo>({ name: 'شرکت شما', nationalId: '۱۲۳۴۵۶۷۸۹۰', address: 'آدرس فروشنده', phone: 'تلفن فروشنده', email: 'ایمیل فروشنده' });
  const [buyer, setBuyer] = useState<PartyInfo>({ name: 'مشتری', nationalId: '۰۹۸۷۶۵۴۳۲۱', address: 'آدرس خریدار', phone: 'تلفن خریدار', email: 'ایمیل خریدار' });
  const [invoiceNumber, setInvoiceNumber] = useState('۱۴۰۳-۰۰۱');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/'));
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
      { id: 1, description: 'کالا/خدمات نمونه ۱', quantity: 2, unitPrice: 50000, discount: 5000 },
      { id: 2, description: 'کالا/خدمات نمونه ۲', quantity: 1, unitPrice: 120000, discount: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(10);
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<string | null>(PlaceHolderImages.find(p => p.id === 'logo')?.imageUrl || null);
  const [signature, setSignature] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>چاپ فاکتور</title>');
            printWindow.document.write('<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />');
            
            const isVenus = invoiceMode === 'venus_official';
            const styles = `
                <style>
                    body { font-family: 'Vazirmatn', sans-serif; direction: rtl; background-color: #fff; color: #000; }
                    @page { size: A4; margin: 0; }
                    .invoice-print-container { max-width: 800px; margin: auto; padding: 20px; font-size: 11px; }
                    .no-print { display: none !important; }
                    .font-mono { font-family: monospace; }
                    img { max-width: 100%; height: auto; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
                    th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
                    th { background-color: #f2f2f2; }
                    td:nth-child(2) {text-align: right;}

                    /* Venus Template Styles */
                    .venus-header-print { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 10px; }
                    .venus-header-left {text-align: left;}
                    .venus-header-right {text-align: right;}
                    .venus-buyer-info-print { padding: 8px; border: 1px solid #ddd; border-radius: 8px; margin: 15px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size:10px}
                    .venus-totals-container-print { display: flex; justify-content: space-between; align-items: flex-start; font-size: 11px; margin-top: 20px;}
                    .venus-calc-section-print { width: 300px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
                    .venus-calc-section-print > div { display: flex; justify-content: space-between; padding: 8px; }
                    .venus-calc-section-print > div:not(:last-child) { border-bottom: 1px solid #ddd; }
                    .venus-grand-total-print { font-weight: bold; background-color: #f2f2f2; }
                    .venus-signatures-print { margin-top: 60px; display: flex; justify-content: space-around; font-size: 12px; }
                    .venus-footer-print { margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #555; }

                     /* Classic Template Styles */
                    .classic-header { text-align: center; margin-bottom: 20px; }
                    .classic-header h2 { font-size: 16px; margin: 0; }
                    .classic-header p { font-size: 12px; margin: 0; }
                    .classic-info-section { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 10px; }
                    .classic-party-info { border: 1px solid #ddd; padding: 8px; border-radius: 4px; width: 48%;}
                    .classic-totals { border: 1px solid #ddd; margin-top: -1px;}
                    .classic-totals-row { display: flex; justify-content: space-between; padding: 6px 8px; }
                    .classic-totals-row:not(:last-child) { border-bottom: 1px solid #ddd; }
                    .classic-signatures { display: flex; justify-content: space-around; margin-top: 50px; font-size: 12px;}
                    .classic-footer { text-align: center; font-size: 10px; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 40px;}

                </style>
            `;
            printWindow.document.write(styles);
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
  
  const handleFileUpload = (setter: (value: string | null) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setter(event.target?.result as string);
        }
        reader.readAsDataURL(file);
    }
  }

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items]);
  const totalDiscount = useMemo(() => items.reduce((acc, item) => acc + (item.quantity * item.discount), 0), [items]);
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const taxAmount = useMemo(() => isOfficial ? subtotalAfterDiscount * (taxRate / 100) : 0, [subtotalAfterDiscount, taxRate, invoiceMode]);
  const grandTotal = useMemo(() => subtotalAfterDiscount + taxAmount, [subtotalAfterDiscount, taxAmount]);
  
  const isOfficial = invoiceMode === 'venus_official';

  if (invoiceMode === 'template_selector') {
    return (
      <CardContent className="flex flex-col items-center gap-6 pt-10">
        <h3 className="text-xl font-bold text-center">جهت مشاهده یا دریافت فاکتور، قالب مدنظر خود را انتخاب نمایید:</h3>
        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-4xl">
          <button className="text-right p-6 rounded-2xl border-2 border-transparent hover:border-primary bg-muted/30 card-hover" onClick={() => setInvoiceMode('venus_official')}>
            <div className='flex justify-between items-center'>
                <h4 className="text-lg font-semibold text-primary flex items-center gap-2"><FileText />قالب ونوس (رسمی)</h4>
                <div className='w-40 h-28 border rounded-md p-1 bg-white shadow-sm overflow-hidden'>
                    <Image src="https://i.imgur.com/uGg0mTO.png" alt="Venus Template Preview" width={160} height={112} className="object-cover object-top" />
                </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">یک قالب شیک و مدرن مناسب برای اکثر کسب‌وکارها، با تمام جزئیات رسمی و محاسبه مالیات.</p>
          </button>
           <button className="text-right p-6 rounded-2xl border-2 border-transparent hover:border-primary bg-muted/30 card-hover" onClick={() => setInvoiceMode('classic_simple')}>
            <div className='flex justify-between items-center'>
                <h4 className="text-lg font-semibold text-primary flex items-center gap-2"><FileText />قالب کلاسیک (ساده)</h4>
                <div className='w-40 h-28 border rounded-md p-1 bg-white shadow-sm overflow-hidden'>
                    <Image src="https://i.imgur.com/gKIn0De.png" alt="Classic Template Preview" width={160} height={112} className="object-cover object-top" />
                </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">یک قالب ساده و استاندارد، مناسب برای فاکتورهای سریع و غیررسمی بدون محاسبه مالیات.</p>
          </button>
        </div>
      </CardContent>
    );
  }

  const renderVenusPreview = () => (
    <div className='bg-white text-black p-4 rounded-lg shadow-lg border'>
      <div className="venus-header-print">
        <div className="venus-header-left text-left space-y-1">
          {logo ? <Image src={logo} alt="Logo" width={60} height={60} className='object-contain' /> : 
          <div className="w-16 h-16 border-2 border-dashed flex flex-col items-center justify-center text-gray-500 text-xs"><FileText className="w-6 h-6 mb-1"/><span>لوگوی شما</span></div>}
          <h2 className="font-bold text-base">{seller.name}</h2>
          <p className="text-xs text-gray-600">{seller.nationalId ? `شناسه ملی: ${seller.nationalId}` : ''}</p>
        </div>
        <div className="venus-header-right text-right space-y-1 text-xs">
          <p><strong>تاریخ ثبت:</strong> {invoiceDate || '---'}</p>
          <p><strong>تاریخ سررسید:</strong> {dueDate || '---'}</p>
          <p><strong>شماره فاکتور:</strong> <span className='font-mono'>{invoiceNumber || '---'}</span></p>
        </div>
      </div>
      <div className="h-1 bg-primary w-full my-2"></div>
      <div className="venus-buyer-info-print text-xs">
        <span><strong>خریدار:</strong> {buyer.name || '---'}</span>
        <span><strong>موبایل/تلفن:</strong> {buyer.phone || '---'}</span>
        <span><strong>شناسه ملی:</strong> {buyer.nationalId || '---'}</span>
        <span><strong>آدرس:</strong> {buyer.address || '---'}</span>
      </div>
      <Table className='text-xs'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">ردیف</TableHead>
            <TableHead>نام کالا/خدمات</TableHead>
            <TableHead>تعداد</TableHead>
            <TableHead>تخفیف (واحد)</TableHead>
            <TableHead>قیمت واحد</TableHead>
            <TableHead>جمع بدون تخفیف</TableHead>
            <TableHead>جمع کل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const totalWithoutDiscount = item.quantity * item.unitPrice;
            const total = totalWithoutDiscount - (item.quantity * item.discount);
            return (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className='text-right'>{item.description}</TableCell>
                <TableCell>{formatNumber(item.quantity)}</TableCell>
                <TableCell className="text-red-600">{formatNumber(item.discount)}</TableCell>
                <TableCell>{formatNumber(item.unitPrice)}</TableCell>
                <TableCell>{formatNumber(totalWithoutDiscount)}</TableCell>
                <TableCell className="font-semibold">{formatNumber(total)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="venus-totals-container-print">
        <div>
          <p className='font-bold text-xs'>توضیحات:</p>
          <p className='text-xs text-gray-600'>{description || 'ندارد'}</p>
        </div>
        <div className="venus-calc-section-print">
          <div><span>مجموع:</span><span className="font-mono">{formatNumber(subtotal)}</span></div>
          <div><span>تخفیف:</span><span className="font-mono text-red-600">{formatNumber(totalDiscount)}</span></div>
          {isOfficial && <div><span>ارزش افزوده ({formatNumber(taxRate)}٪):</span><span className="font-mono">{formatNumber(taxAmount)}</span></div>}
          <div className="venus-grand-total-print"><span>مبلغ نهایی:</span><span className="font-mono">{formatNumber(grandTotal)}</span></div>
        </div>
      </div>
       <div className="venus-signatures-print">
        <div className="flex flex-col items-center">
            مهر و امضای فروشنده
            {signature && <Image src={signature} alt="امضای فروشنده" width={100} height={50} className='object-contain mt-2'/>}
        </div>
        <div>امضای خریدار</div>
      </div>
      <div className="venus-footer-print">
        <p>{seller.address}</p>
        <p>تلفن: {seller.phone} - ایمیل: {seller.email}</p>
      </div>
    </div>
  );

  const renderClassicPreview = () => (
     <div className='bg-white text-black p-4 rounded-lg shadow-lg border'>
        <div className='classic-header'>
            {logo && <Image src={logo} alt="لوگو" width={80} height={80} className="mx-auto mb-2 object-contain" />}
            <h2 className="text-xl font-bold">{seller.name || 'نام فروشنده'}</h2>
            <p className="text-sm">{description || 'فاکتور فروش کالا و خدمات'}</p>
        </div>
         <div className="classic-info-section">
            <div className='classic-party-info space-y-1'>
                 <h3 className="font-bold border-b pb-1 mb-2">اطلاعات فروشنده</h3>
                 <p><strong>نام:</strong> {seller.name}</p>
                 <p><strong>تلفن/موبایل:</strong> {seller.phone}</p>
                 <p><strong>آدرس:</strong> {seller.address}</p>
            </div>
            <div className='classic-party-info space-y-1'>
                 <h3 className="font-bold border-b pb-1 mb-2">اطلاعات خریدار</h3>
                 <p><strong>نام:</strong> {buyer.name}</p>
                 <p><strong>تلفن/موبایل:</strong> {buyer.phone}</p>
                 <p><strong>آدرس:</strong> {buyer.address}</p>
            </div>
        </div>
         <div className="flex justify-between items-center text-xs mb-2">
            <span>شماره فاکتور: {invoiceNumber}</span>
            <span>تاریخ: {invoiceDate}</span>
         </div>
        <Table className='text-xs'>
            <TableHeader><TableRow><TableHead className="w-[40px]">ردیف</TableHead><TableHead>نام کالا/خدمات</TableHead><TableHead>تعداد</TableHead><TableHead>قیمت واحد</TableHead><TableHead>جمع کل</TableHead></TableRow></TableHeader>
            <TableBody>
                {items.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className='text-right'>{item.description}</TableCell>
                        <TableCell>{formatNumber(item.quantity)}</TableCell>
                        <TableCell>{formatNumber(item.unitPrice)}</TableCell>
                        <TableCell className="font-semibold">{formatNumber(item.unitPrice * item.quantity)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
         <div className="grid grid-cols-[3fr,2fr] mt-0">
            <div className='border border-t-0 border-l-0 p-2 text-xs'>
                <p>به حروف: {numToWords(String(grandTotal))} تومان</p>
            </div>
            <div className="classic-totals">
                <div className="classic-totals-row"><span>مجموع:</span><span className="font-mono">{formatNumber(subtotal)}</span></div>
                <div className="classic-totals-row"><span>تخفیف:</span><span className="font-mono text-red-600">{formatNumber(totalDiscount)}</span></div>
                <div className="classic-totals-row font-bold"><span>جمع کل:</span><span className="font-mono">{formatNumber(grandTotal)}</span></div>
            </div>
         </div>
         <div className="classic-signatures">
            <div className="flex flex-col items-center">
                امضاء فروشنده
                {signature && <Image src={signature} alt="امضای فروشنده" width={100} height={50} className='object-contain mt-2'/>}
            </div>
            <p>امضاء خریدار</p>
         </div>
         <div className="classic-footer">
            <p>آدرس: {seller.address} - تلفن: {seller.phone}</p>
         </div>
     </div>
  );

  return (
    <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6 no-print">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <FileText className="w-6 h-6 text-primary" />
                        اطلاعات فاکتور
                    </h3>
                    <Button variant="link" onClick={() => setInvoiceMode('template_selector')}>
                        <ArrowLeft className="w-4 h-4 ml-1" />
                        تغییر قالب
                    </Button>
                </div>
                 <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full space-y-4">
                    <AccordionItem value="item-1" className="glass-effect rounded-xl border px-4">
                        <AccordionTrigger><div className='flex items-center gap-2'><User className='w-5 h-5'/>اطلاعات طرفین</div></AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            <PartyInput title="فروشنده" party={seller} setParty={setSeller} isOfficial={isOfficial} />
                            <Separator />
                            <PartyInput title="خریدار" party={buyer} setParty={setBuyer} isOfficial={isOfficial} />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="glass-effect rounded-xl border px-4">
                        <AccordionTrigger><div className='flex items-center gap-2'><Briefcase className='w-5 h-5'/>اقلام فاکتور</div></AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                             {items.map((item, i) => (
                                <div key={item.id} className="grid gap-2 items-end grid-cols-[1fr,80px,110px,100px,auto]">
                                    <Input placeholder={`شرح کالا ${i+1}`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                                    <Input type="text" placeholder="تعداد" value={formatNumber(item.quantity)} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="text-center" dir="ltr"/>
                                    <Input type="text" placeholder="قیمت واحد" value={formatNumber(item.unitPrice)} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="text-center" dir="ltr"/>
                                    <Input type="text" placeholder="تخفیف" value={formatNumber(item.discount)} onChange={e => handleItemChange(item.id, 'discount', e.target.value)} className="text-center" dir="ltr"/>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive"><Trash2 className="w-5 h-5"/></Button>
                                </div>
                            ))}
                            <Button onClick={addItem} variant="outline" size="sm" className="mt-2"><Plus className="w-4 h-4 ml-2"/> افزودن ردیف</Button>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3" className="glass-effect rounded-xl border px-4">
                        <AccordionTrigger><div className='flex items-center gap-2'><Settings className='w-5 h-5'/>تنظیمات و جزئیات</div></AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                             <div className={cn("grid gap-4", isOfficial ? "md:grid-cols-3" : "md:grid-cols-2")}>
                                <Input placeholder="شماره فاکتور" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                                <Input placeholder="تاریخ ثبت" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                                {isOfficial && <Input placeholder="تاریخ سررسید" value={dueDate} onChange={e => setDueDate(e.target.value)} />}
                            </div>
                            {isOfficial && (
                              <div className="space-y-2">
                                <Label>مالیات بر ارزش افزوده (%)</Label>
                                <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="text-center"/>
                              </div>
                            )}
                            <div className="space-y-2">
                                <Label>توضیحات</Label>
                                <Textarea placeholder="توضیحات اضافی فاکتور" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                              <Label>لوگو</Label>
                              <Input type="file" accept="image/*" onChange={handleFileUpload(setLogo)} />
                            </div>
                             <div className="space-y-2">
                              <Label>تصویر امضا</Label>
                              <Input type="file" accept="image/*" onChange={handleFileUpload(setSignature)} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button onClick={handlePrint} className="w-full h-12 text-lg"><Printer className="w-5 h-5 ml-2"/> چاپ فاکتور</Button>
            </div>
            
            <div className='space-y-6'>
                <div className='lg:sticky top-28'>
                     <div ref={printRef} className='hidden print:block'>
                       {isOfficial ? renderVenusPreview() : renderClassicPreview()}
                    </div>
                     <div className='hidden lg:block'>
                       {isOfficial ? renderVenusPreview() : renderClassicPreview()}
                    </div>
                </div>

                <div className='space-y-3 no-print'>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Wand2 className="w-6 h-6 text-primary" />
                        امکانات فاکتورساز
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <FeatureCard icon={<CreditCard className="w-6 h-6"/>} title="پرداخت آنلاین فاکتور" description="اتصال به درگاه پرداخت مستقیم و واسط" />
                        <FeatureCard icon={<TrendingUp className="w-6 h-6"/>} title="گزارش‌گیری و نمودارها" description="گزارش فروش هر کالا و خدمات" />
                        <FeatureCard icon={<Star className="w-6 h-6"/>} title="امضای دیجیتال" description="دریافت امضای دیجیتال فروشنده و خریدار" />
                        <FeatureCard icon={<Ticket className="w-6 h-6"/>} title="کد تخفیف" description="تعریف کد تخفیف به صورت مبلغ یا درصد" />
                        <FeatureCard icon={<Send className="w-6 h-6"/>} title="ارسال پیامک و ایمیل" description="ارسال اطلاعات فاکتور از طریق ایمیل و پیامک" />
                        <FeatureCard icon={<Share2 className="w-6 h-6"/>} title="اشتراک‌گذاری فاکتور" description="اشتراک‌گذاری فاکتور در شبکه‌های اجتماعی" />
                    </div>
                </div>
            </div>
        </div>
    </CardContent>
  );
}
