
"use client";

import { useState, useMemo, useRef, ChangeEvent } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Printer, FileText, Upload, Building, User, Wand2, Star, Share2, Settings, Briefcase, CreditCard, Send, TrendingUp, Archive, File, BrainCircuit, Sun, Moon, Waves as WavesIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { numToWords } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type InvoiceTemplate = 'venus_official' | 'classic_simple' | 'galaxy' | 'ocean' | 'sunset';

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
  const englishStr = str.replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x0660)).replace(/[\u06F0-\u06F9]/g, c => String(c.charCodeAt(0) - 0x06F0));
  return parseFloat(englishStr.replace(/,/g, ''));
};


const PartyInput = ({ title, party, setParty }: { title: string, party: PartyInfo, setParty: (value: PartyInfo) => void }) => (
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
        <div className="space-y-1">
          <Label>کد/شناسه ملی</Label>
          <Input placeholder="کد ملی/شناسه" value={party.nationalId} onChange={(e) => setParty({ ...party, nationalId: e.target.value })} />
        </div>
        <div className="space-y-1">
           <Label>تلفن</Label>
          <Input placeholder="شماره تماس" value={party.phone} onChange={(e) => setParty({ ...party, phone: e.target.value })} />
        </div>
        <div className="space-y-1 sm:col-span-2">
            <Label>آدرس</Label>
            <Input placeholder="آدرس کامل" value={party.address} onChange={(e) => setParty({ ...party, address: e.target.value })} />
        </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>ایمیل</Label>
            <Input placeholder="ایمیل" value={party.email} onChange={(e) => setParty({ ...party, email: e.target.value })} />
        </div>
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
  const [template, setTemplate] = useState<InvoiceTemplate>('venus_official');

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
  const [logo, setLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>چاپ فاکتور</title>');
            printWindow.document.write('<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />');
            
            const isVenus = template === 'venus_official';
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
                    .ql-editor { padding: 0 !important; }
                    .ql-editor p, .ql-editor ol, .ql-editor ul, .ql-editor pre, .ql-editor blockquote, .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 { margin: 0 !important; }

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
            printWindow.document.write(printContent.innerHTML);
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

  const isOfficial = template === 'venus_official';
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items]);
  const totalDiscount = useMemo(() => items.reduce((acc, item) => acc + (item.quantity * item.discount), 0), [items]);
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const taxAmount = useMemo(() => isOfficial ? subtotalAfterDiscount * (taxRate / 100) : 0, [subtotalAfterDiscount, taxRate, isOfficial]);
  const grandTotal = useMemo(() => subtotalAfterDiscount + taxAmount, [subtotalAfterDiscount, taxAmount]);

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
      <div className="h-1 bg-primary w-full my-2" style={{ backgroundColor: '#6A3EAB' }}></div>
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
         <div className='text-xs text-gray-600 w-1/2'>
            <p className='font-bold text-xs text-black'>توضیحات:</p>
            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: description || 'ندارد' }} />
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
            <div className="text-sm ql-editor" dangerouslySetInnerHTML={{ __html: description || 'فاکتور فروش کالا و خدمات' }} />
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

  const renderGalaxyPreview = () => (
    <div className='bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-purple-500/30' style={{ fontFamily: 'Vazirmatn' }}>
        <div className="flex justify-between items-start pb-2 border-b-2 border-purple-400">
            <div className="text-left space-y-1">
                <h2 className="font-bold text-2xl text-purple-400">فاکتور</h2>
                <p className="text-xs text-gray-400 font-mono">{invoiceNumber || '---'}</p>
            </div>
            <div className="text-right space-y-1 text-xs">
                {logo ? <Image src={logo} alt="Logo" width={50} height={50} className='object-contain rounded-full bg-white/10 p-1' /> : 
                <div className="w-12 h-12 border-2 border-dashed border-purple-400/50 rounded-full flex items-center justify-center text-gray-500 text-xs">لوگو</div>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4 text-xs">
            <div className='space-y-1'>
                <p className='text-gray-400'>از طرف:</p>
                <p className='font-bold'>{seller.name}</p>
                <p>{seller.address}</p>
                <p>{seller.phone}</p>
            </div>
            <div className='space-y-1 text-left'>
                <p className='text-gray-400'>به:</p>
                <p className='font-bold'>{buyer.name}</p>
                <p>{buyer.address}</p>
                <p>{buyer.phone}</p>
            </div>
        </div>
        <Table className='text-xs text-white'>
            <TableHeader><TableRow className='border-gray-700'><TableHead>شرح</TableHead><TableHead>تعداد</TableHead><TableHead>قیمت واحد</TableHead><TableHead>جمع</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item, index) => (<TableRow key={item.id} className='border-gray-800'><TableCell className='text-right'>{item.description}</TableCell><TableCell>{formatNumber(item.quantity)}</TableCell><TableCell>{formatNumber(item.unitPrice)}</TableCell><TableCell>{formatNumber(item.quantity * item.unitPrice)}</TableCell></TableRow>))}</TableBody>
        </Table>
        <div className="flex justify-end mt-4">
            <div className="w-1/2 space-y-2 text-xs">
                <div className="flex justify-between"><span className='text-gray-400'>جمع کل:</span><span>{formatNumber(subtotal)}</span></div>
                <div className="flex justify-between"><span className='text-gray-400'>تخفیف:</span><span>{formatNumber(totalDiscount)}</span></div>
                {taxRate > 0 && <div className="flex justify-between"><span className='text-gray-400'>مالیات ({formatNumber(taxRate)}%):</span><span>{formatNumber(taxAmount)}</span></div>}
                <Separator className='bg-purple-400/50 my-1'/>
                <div className="flex justify-between font-bold text-base"><span className=''>مبلغ نهایی:</span><span className='text-purple-400'>{formatNumber(grandTotal)}</span></div>
            </div>
        </div>
         <div className="mt-8 text-xs text-gray-400 ql-editor" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );

  const renderOceanPreview = () => (
    <div className='bg-blue-50 text-gray-800 p-4 rounded-lg shadow-lg border'>
        <div className="flex justify-between items-center pb-2">
             <div className="text-right space-y-1">
                {logo ? <Image src={logo} alt="Logo" width={60} height={60} className='object-contain' /> : 
                <div className="w-16 h-16 border-2 border-dashed flex items-center justify-center text-gray-500 text-xs">لوگو</div>}
            </div>
            <div className="text-left space-y-1">
                <h2 className="font-bold text-3xl text-blue-700">فاکتور</h2>
                <p className="text-xs text-gray-500">شماره: <span className='font-mono'>{invoiceNumber || '---'}</span></p>
                <p className="text-xs text-gray-500">تاریخ: {invoiceDate || '---'}</p>
            </div>
        </div>
        <div className="my-4 p-3 bg-white rounded-lg grid grid-cols-2 gap-4 text-xs border">
            <div><p className='font-bold'>فروشنده:</p><p>{seller.name}</p><p>{seller.address}</p></div>
            <div><p className='font-bold'>خریدار:</p><p>{buyer.name}</p><p>{buyer.address}</p></div>
        </div>
        <Table className='text-xs bg-white rounded-lg'>
            <TableHeader><TableRow><TableHead className='text-blue-800'>شرح</TableHead><TableHead className='text-blue-800'>تعداد</TableHead><TableHead className='text-blue-800'>قیمت</TableHead><TableHead className='text-blue-800'>جمع کل</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item, index) => (<TableRow key={item.id}><TableCell className='text-right'>{item.description}</TableCell><TableCell>{formatNumber(item.quantity)}</TableCell><TableCell>{formatNumber(item.unitPrice)}</TableCell><TableCell>{formatNumber(item.quantity * item.unitPrice)}</TableCell></TableRow>))}</TableBody>
            <TableFooter className='bg-blue-100/50'>
                <TableRow><TableCell colSpan={3} className='text-right font-bold'>جمع کل</TableCell><TableCell className='font-bold'>{formatNumber(grandTotal)}</TableCell></TableRow>
            </TableFooter>
        </Table>
         <div className="mt-4 text-xs text-gray-600 ql-editor" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );

  const renderSunsetPreview = () => (
    <div className='bg-white text-gray-800 p-4 rounded-lg shadow-lg border-t-4 border-orange-500'>
        <div className="flex justify-between items-center pb-2">
            <div className="text-right space-y-1">
                <h2 className="font-bold text-2xl">{seller.name}</h2>
                <p className="text-xs text-gray-500">{seller.address}</p>
            </div>
            <div className="text-left space-y-1">
                {logo && <Image src={logo} alt="Logo" width={50} height={50} className='object-contain rounded-full' />}
            </div>
        </div>
        <Separator className='my-4'/>
        <div className="grid grid-cols-2 gap-4 my-4 text-xs">
            <div><p className='font-bold'>فاکتور برای:</p><p>{buyer.name}</p></div>
            <div className='text-left'><p>شماره فاکتور: {invoiceNumber}</p><p>تاریخ: {invoiceDate}</p></div>
        </div>
        <Table className='text-xs'>
            <TableHeader className='bg-orange-100/70'><TableRow><TableHead>شرح</TableHead><TableHead>تعداد</TableHead><TableHead>قیمت واحد</TableHead><TableHead>جمع</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item, index) => (<TableRow key={item.id} className='border-orange-100'><TableCell className='text-right'>{item.description}</TableCell><TableCell>{formatNumber(item.quantity)}</TableCell><TableCell>{formatNumber(item.unitPrice)}</TableCell><TableCell>{formatNumber(item.quantity * item.unitPrice)}</TableCell></TableRow>))}</TableBody>
        </Table>
        <div className='flex justify-end mt-4'><div className='w-1/2 p-4 bg-orange-50 rounded-lg space-y-2 text-sm'>
            <div className='flex justify-between'><span>جمع:</span><span>{formatNumber(subtotal)}</span></div>
            <div className='flex justify-between text-red-600'><span>تخفیف:</span><span>{formatNumber(totalDiscount)}</span></div>
            <Separator />
            <div className='flex justify-between font-bold text-base'><span>مبلغ نهایی:</span><span>{formatNumber(grandTotal)}</span></div>
        </div></div>
         <div className="mt-6 text-center text-xs text-gray-500 ql-editor" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
  
  const FileInputCard = ({ title, description, onFileChange, inputRef }: { title: string, description: string, onFileChange: (e: ChangeEvent<HTMLInputElement>) => void, inputRef: React.RefObject<HTMLInputElement> }) => (
    <div 
        className="text-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors" 
        onClick={() => inputRef.current?.click()}
    >
        <div className="flex justify-center items-center">
            <Upload className="w-8 h-8 text-muted-foreground"/>
            <div className="ml-4 text-right">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
        <input type="file" accept="image/*" onChange={onFileChange} ref={inputRef} className="hidden" />
    </div>
 );

 const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-[1fr,450px] gap-8 items-start">
            <div className="space-y-6 no-print">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <FileText className="w-6 h-6 text-primary" />
                        اطلاعات فاکتور
                    </h3>
                </div>
                 <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full space-y-4">
                    <AccordionItem value="item-1" className="glass-effect rounded-xl border px-4">
                        <AccordionTrigger><div className='flex items-center gap-2'><User className='w-5 h-5'/>اطلاعات طرفین</div></AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            <PartyInput title="فروشنده" party={seller} setParty={setSeller} />
                            <Separator />
                            <PartyInput title="خریدار" party={buyer} setParty={setBuyer} />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="glass-effect rounded-xl border px-4">
                        <AccordionTrigger><div className='flex items-center gap-2'><Briefcase className='w-5 h-5'/>اقلام فاکتور</div></AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                             {items.map((item, i) => (
                                <div key={item.id} className="grid gap-2 items-end grid-cols-1 sm:grid-cols-[1fr,80px,110px,100px,auto]">
                                    <div className='sm:col-span-5'><Label className='text-xs text-muted-foreground'>شرح کالا/خدمات {i+1}</Label><Input placeholder={`شرح کالا ${i+1}`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} /></div>
                                    <div><Label className='text-xs text-muted-foreground'>تعداد</Label><Input type="text" placeholder="تعداد" value={formatNumber(item.quantity)} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="text-center" dir="ltr"/></div>
                                    <div><Label className='text-xs text-muted-foreground'>قیمت واحد</Label><Input type="text" placeholder="قیمت واحد" value={formatNumber(item.unitPrice)} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="text-center" dir="ltr"/></div>
                                    <div><Label className='text-xs text-muted-foreground'>تخفیف</Label><Input type="text" placeholder="تخفیف" value={formatNumber(item.discount)} onChange={e => handleItemChange(item.id, 'discount', e.target.value)} className="text-center" dir="ltr"/></div>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive self-end"><Trash2 className="w-5 h-5"/></Button>
                                </div>
                            ))}
                            <Button onClick={addItem} variant="outline" size="sm" className="mt-2"><Plus className="w-4 h-4 ml-2"/> افزودن ردیف</Button>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3" className="glass-effect rounded-xl border px-4">
                        <AccordionTrigger><div className='flex items-center gap-2'><Settings className='w-5 h-5'/>تنظیمات و جزئیات</div></AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                             <div className="grid gap-4 md:grid-cols-3">
                               <div className="space-y-1"><Label>شماره فاکتور</Label><Input placeholder="شماره فاکتور" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} /></div>
                               <div className="space-y-1"><Label>تاریخ ثبت</Label><Input placeholder="تاریخ ثبت" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} /></div>
                               <div className="space-y-1"><Label>تاریخ سررسید</Label><Input placeholder="تاریخ سررسید" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
                            </div>
                            <div className="space-y-1">
                              <Label>مالیات بر ارزش افزوده (%)</Label>
                              <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="text-center"/>
                            </div>
                            <div className="space-y-2">
                                <Label>توضیحات</Label>
                                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} className='bg-background rounded-lg'/>
                            </div>
                             <div className="grid sm:grid-cols-2 gap-4">
                                <FileInputCard title="لوگو" description="در صورت داشتن لوگو می توانید در این بخش وارد نمایید" onFileChange={handleFileUpload(setLogo)} inputRef={logoInputRef} />
                                <FileInputCard title="امضای فروشنده" description="تصویر امضای فروشنده" onFileChange={handleFileUpload(setSignature)} inputRef={signatureInputRef} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className='space-y-3 no-print mt-8'>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Wand2 className="w-6 h-6 text-primary" />
                        امکانات فاکتورساز
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <FeatureCard icon={<CreditCard className="w-6 h-6"/>} title="پرداخت آنلاین فاکتور" description="اتصال به درگاه پرداخت مستقیم و واسط" />
                        <FeatureCard icon={<Archive className="w-6 h-6"/>} title="سوابق فاکتورها" description="مشاهده و ذخیره تمام فاکتور های قبلی" />
                        <FeatureCard icon={<BrainCircuit className="w-6 h-6"/>} title="فرمول نویسی و محاسبه‌گر" description="محاسبه هزینه و تخفیف ‌های فاکتور" />
                        <FeatureCard icon={<TrendingUp className="w-6 h-6"/>} title="گزارش گیری و نمودارهای آماری" description="گزارش‌گیری فروش هر کالا و خدمات" />
                        <FeatureCard icon={<File className="w-6 h-6"/>} title="طراحی قالب دلخواه" description="شخصی سازی ورودی‌های فاکتور" />
                        <FeatureCard icon={<Star className="w-6 h-6"/>} title="امضای دیجیتال" description="دریافت امضای دیجیتال فروشنده و خریدار" />
                        <FeatureCard icon={<Send className="w-6 h-6"/>} title="ارسال پیامک و ایمیل" description="ارسال اطلاعات فاکتور از طریق ایمیل و پیامک" />
                        <FeatureCard icon={<Share2 className="w-6 h-6"/>} title="اشتراک‌گذاری فاکتور" description="اشتراک‌گذاری فاکتور در شبکه‌های اجتماعی" />
                    </div>
                </div>
            </div>
            
            <div className='space-y-4 lg:sticky top-24'>
                 <div className="flex items-center justify-center p-1 bg-muted rounded-lg w-full flex-wrap">
                    <Button onClick={() => setTemplate('venus_official')} variant={template === 'venus_official' ? 'default' : 'ghost'} className="flex-1 text-xs sm:text-sm">ونوس (رسمی)</Button>
                    <Button onClick={() => setTemplate('classic_simple')} variant={template === 'classic_simple' ? 'default' : 'ghost'} className="flex-1 text-xs sm:text-sm">کلاسیک</Button>
                    <Button onClick={() => setTemplate('galaxy')} variant={template === 'galaxy' ? 'default' : 'ghost'} className="flex-1 text-xs sm:text-sm">کهکشان</Button>
                    <Button onClick={() => setTemplate('ocean')} variant={template === 'ocean' ? 'default' : 'ghost'} className="flex-1 text-xs sm:text-sm">اقیانوس</Button>
                    <Button onClick={() => setTemplate('sunset')} variant={template === 'sunset' ? 'default' : 'ghost'} className="flex-1 text-xs sm:text-sm">آفتاب</Button>
                 </div>
                 <div ref={printRef} className='hidden print:block'>
                   {template === 'venus_official' && renderVenusPreview()}
                   {template === 'classic_simple' && renderClassicPreview()}
                   {template === 'galaxy' && renderGalaxyPreview()}
                   {template === 'ocean' && renderOceanPreview()}
                   {template === 'sunset' && renderSunsetPreview()}
                </div>
                 <div className='hidden lg:block'>
                   {template === 'venus_official' && renderVenusPreview()}
                   {template === 'classic_simple' && renderClassicPreview()}
                   {template === 'galaxy' && renderGalaxyPreview()}
                   {template === 'ocean' && renderOceanPreview()}
                   {template === 'sunset' && renderSunsetPreview()}
                </div>
                 <Button onClick={handlePrint} className="w-full h-12 text-lg no-print"><Printer className="w-5 h-5 ml-2"/> چاپ یا دریافت PDF</Button>
            </div>
        </div>
    </CardContent>
  );
}