"use client";

import { useState, useMemo, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Printer, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { numToWords } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '../ui/separator';

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
};

const formatNumber = (num: number) => {
  if (isNaN(num)) return '';
  return num.toLocaleString('fa-IR');
};

const parseFormattedNumber = (str: string) => {
  if (!str) return 0;
  // This regex handles both English and Persian numbers and removes commas
  const englishStr = str.replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x0660)).replace(/[\u06F0-\u06F9]/g, c => String(c.charCodeAt(0) - 0x06F0));
  return parseFloat(englishStr.replace(/,/g, ''));
};


const PartyInput = ({ title, party, setParty }: { title: string, party: typeof seller, setParty: Function }) => (
    <div className="space-y-3 glass-effect p-4 rounded-xl">
      <h4 className="font-semibold text-lg text-foreground/90 border-b pb-2">{title}</h4>
      <div className="space-y-2">
        <Label>نام</Label>
        <Input placeholder="نام شخص حقیقی/حقوقی" value={party.name} onChange={(e) => setParty({ ...party, name: e.target.value })} />
      </div>
      <div className="space-y-2">
         <Label>کد ملی / شناسه ملی</Label>
        <Input placeholder="کد ملی / شناسه ملی" value={party.nationalId} onChange={(e) => setParty({ ...party, nationalId: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>آدرس</Label>
        <Input placeholder="آدرس کامل" value={party.address} onChange={(e) => setParty({ ...party, address: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>تلفن</Label>
        <Input placeholder="شماره تماس" value={party.phone} onChange={(e) => setParty({ ...party, phone: e.target.value })} />
      </div>
    </div>
  );
  
export default function InvoiceGenerator() {
  const [seller, setSeller] = useState({ name: '', nationalId: '', address: '', phone: '' });
  const [buyer, setBuyer] = useState({ name: '', nationalId: '', address: '', phone: '' });
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('fa-IR-u-nu-latn').replace(/\//g, '/'));
  const [items, setItems] = useState<InvoiceItem[]>([{ id: 1, description: '', quantity: 1, unitPrice: 0 }]);
  const [taxRate, setTaxRate] = useState(9);
  const [discount, setDiscount] = useState(0);

  const logo = PlaceHolderImages.find(p => p.id === 'logo');
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
                    body { font-family: 'Vazirmatn', sans-serif; direction: rtl; padding: 20px; background-color: #fff; color: #000; }
                    @page { size: A4; margin: 0; }
                    .invoice-container { max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    th { background-color: #f2f2f2; }
                    .invoice-header, .party-info-container, .totals-container { margin-bottom: 20px; }
                    .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 10px;}
                    .party-info-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .party-info { border: 1px solid #ddd; padding: 10px; border-radius: 5px; font-size: 11px; }
                    .party-info h3 { font-size: 13px; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
                    .totals-container { display: flex; justify-content: space-between; align-items: flex-start; }
                    .words-section { flex: 1; }
                    .calc-section { width: 350px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; font-size: 12px; }
                    .calc-section > div { display: flex; justify-content: space-between; padding: 5px 0; }
                    .calc-section > div:not(:last-child) { border-bottom: 1px dashed #eee; }
                    .grand-total { font-weight: bold; font-size: 14px; }
                    .signatures { margin-top: 50px; display: flex; justify-content: space-around; font-size: 12px; }
                    .no-print { display: none !important; }
                </style>
            `);
            printWindow.document.write('</head><body><div class="invoice-container">');
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
    setItems([...items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof Omit<InvoiceItem, 'id'>, value: string) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        if (field === 'description') {
          return { ...item, [field]: value };
        }
        return { ...item, [field]: parseFormattedNumber(value) };
      }
      return item;
    });
    setItems(newItems);
  };

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items]);
  const taxAmount = useMemo(() => (subtotal - discount) * (taxRate / 100), [subtotal, discount, taxRate]);
  const grandTotal = useMemo(() => (subtotal - discount) + taxAmount, [subtotal, discount, taxAmount]);
  const grandTotalInWords = useMemo(() => numToWords(String(Math.floor(grandTotal))), [grandTotal]);

  return (
    <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Area */}
            <div className="space-y-6 no-print">
                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <FileText className="w-6 h-6 text-primary" />
                    اطلاعات فاکتور
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <PartyInput title="فروشنده" party={seller} setParty={setSeller} />
                    <PartyInput title="خریدار" party={buyer} setParty={setBuyer} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="شماره فاکتور" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                    <Input placeholder="تاریخ فاکتور" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </div>

                <div className="space-y-3 glass-effect p-4 rounded-xl">
                    <h4 className="font-semibold text-lg text-foreground/90">ردیف‌های فاکتور</h4>
                    {items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-[1fr,90px,140px,auto] gap-2 items-center">
                            <Input placeholder={`شرح کالا/خدمات`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                            <Input type="text" placeholder="تعداد" value={formatNumber(item.quantity)} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="text-center" dir="ltr"/>
                            <Input type="text" placeholder="مبلغ واحد (ریال)" value={formatNumber(item.unitPrice)} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="text-center" dir="ltr"/>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive"><Trash2 className="w-5 h-5"/></Button>
                        </div>
                    ))}
                    <Button onClick={addItem} variant="outline" size="sm" className="mt-2"><Plus className="w-4 h-4 ml-2"/> افزودن ردیف</Button>
                </div>

                 <div className="grid md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>تخفیف (ریال)</Label>
                        <Input type="text" value={formatNumber(discount)} onChange={e => setDiscount(parseFormattedNumber(e.target.value))} className="text-center" dir="ltr"/>
                     </div>
                     <div className="space-y-2">
                        <Label>مالیات بر ارزش افزوده (%)</Label>
                        <Input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value))} className="text-center"/>
                     </div>
                </div>

                <Button onClick={handlePrint} className="w-full h-12 text-lg"><Printer className="w-5 h-5 ml-2"/> چاپ فاکتور</Button>
            </div>
            
             {/* Printable Area */}
            <div ref={printRef} className='space-y-4 bg-white text-black p-6 rounded-2xl shadow-lg border'>
                {/* Header */}
                <div className="invoice-header">
                    <div className="flex flex-col items-center gap-2">
                        {logo && <Image src={logo.imageUrl} alt="Logo" width={60} height={60} />}
                        <h2 className="text-lg font-bold">{seller.name || 'نام فروشنده'}</h2>
                    </div>
                    <div className='text-center'>
                         <h1 className="text-2xl font-bold">صورتحساب فروش کالا و خدمات</h1>
                    </div>
                    <div className="text-left space-y-1 text-sm">
                        <p><strong>شماره:</strong> {invoiceNumber || '---'}</p>
                        <p><strong>تاریخ:</strong> {invoiceDate || '---'}</p>
                    </div>
                </div>

                {/* Seller & Buyer Info */}
                <div className="party-info-container">
                    <div className="party-info">
                        <h3 className="font-bold">اطلاعات فروشنده</h3>
                        <p><strong>نام:</strong> {seller.name || '---'}</p>
                        <p><strong>کد/شناسه ملی:</strong> {seller.nationalId || '---'}</p>
                        <p><strong>آدرس:</strong> {seller.address || '---'}</p>
                        <p><strong>تلفن:</strong> {seller.phone || '---'}</p>
                    </div>
                    <div className="party-info">
                        <h3 className="font-bold">اطلاعات خریدار</h3>
                        <p><strong>نام:</strong> {buyer.name || '---'}</p>
                        <p><strong>کد/شناسه ملی:</strong> {buyer.nationalId || '---'}</p>
                        <p><strong>آدرس:</strong> {buyer.address || '---'}</p>
                        <p><strong>تلفن:</strong> {buyer.phone || '---'}</p>
                    </div>
                </div>

                {/* Items Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">ردیف</TableHead>
                            <TableHead>شرح کالا / خدمات</TableHead>
                            <TableHead className="text-center">تعداد</TableHead>
                            <TableHead className="text-center">مبلغ واحد (ریال)</TableHead>
                            <TableHead className="text-center">مبلغ کل (ریال)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => {
                            const total = item.quantity * item.unitPrice;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-center">{formatNumber(item.quantity)}</TableCell>
                                    <TableCell className="text-center">{formatNumber(item.unitPrice)}</TableCell>
                                    <TableCell className="text-center">{formatNumber(total)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                
                 <div className="totals-container mt-4">
                    <div className="words-section">
                        <p><strong>مبلغ به حروف: </strong> {grandTotalInWords} ریال</p>
                    </div>
                     <div className="calc-section">
                        <div><span>جمع کل:</span><span className="font-mono">{formatNumber(subtotal)} ریال</span></div>
                        <div><span>تخفیف:</span><span className="font-mono">{formatNumber(discount)} ریال</span></div>
                        <div className='font-bold'><span>جمع پس از تخفیف:</span><span className="font-mono">{formatNumber(subtotal - discount)} ریال</span></div>
                        <div><span>مالیات بر ارزش افزوده ({formatNumber(taxRate)}٪):</span><span className="font-mono">{formatNumber(taxAmount)} ریال</span></div>
                        <div className="grand-total"><span>مبلغ نهایی قابل پرداخت:</span><span className="font-mono">{formatNumber(grandTotal)} ریال</span></div>
                    </div>
                </div>

                <div className="signatures">
                    <div>
                        <p>مهر و امضای فروشنده</p>
                        <div className="h-20 w-32 border mt-2"></div>
                    </div>
                    <div>
                        <p>مهر و امضای خریدار</p>
                        <div className="h-20 w-32 border mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
        
    </CardContent>
  );
}
