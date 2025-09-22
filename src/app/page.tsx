import React from 'react';
import Header from '@/components/layout/header';
import UnitConverter from '@/components/features/unit-converter';
import CurrencyConverter from '@/components/features/currency-converter';
import DateConverter from '@/components/features/date-converter';
import CryptoConverter from '@/components/features/crypto-converter';
import AgeCalculator from '@/components/features/age-calculator';
import BmiCalculator from '@/components/features/bmi-calculator';
import PercentageCalculator from '@/components/features/percentage-calculator';
import LoanCalculator from '@/components/features/loan-calculator';
import Stopwatch from '@/components/features/stopwatch';
import CountdownTimer from '@/components/features/countdown-timer';
import DepositCalculator from '@/components/features/deposit-calculator';
import NumberToWordsConverter from '@/components/features/number-to-words-converter';
import NumberSystemConverter from '@/components/features/number-system-converter';
import PasswordGenerator from '@/components/features/password-generator';
import RandomNumberGenerator from '@/components/features/random-number-generator';
import BinaryConverter from '@/components/features/binary-converter';
import DistanceCalculator from '@/components/features/distance-calculator';
import VehiclePlateIdentifier from '@/components/features/vehicle-plate-identifier';
import TextAnalyzer from '@/components/features/text-analyzer';
import ImageOptimizer from '@/components/features/image-optimizer';
import TextSummarizer from '@/components/features/text-summarizer';
import RialTomanConverter from '@/components/features/rial-toman-converter';
import SavingsCalculator from '@/components/features/savings-calculator';
import NationalIdValidator from '@/components/features/national-id-validator';
import WorkoutTimer from '@/components/features/workout-timer';
import ShebaConverter from '@/components/features/sheba-converter';
import QrCodeGenerator from '@/components/features/qr-code-generator';
import QrCodeReader from '@/components/features/qr-code-reader';
import TicTacToe from '@/components/features/tic-tac-toe';
import RockPaperScissors from '@/components/features/rock-paper-scissors';
import Hangman from '@/components/features/hangman';
import LegalFinancialChatbot from '@/components/features/legal-financial-chatbot';
import SignatureGenerator from '@/components/features/signature-generator';
import MemoryGame from '@/components/features/memory-game';
import GuessTheNumber from '@/components/features/guess-the-number';
import ConnectFour from '@/components/features/connect-four';
import SimonSays from '@/components/features/simon-says';
import OthelloGame from '@/components/features/othello-game';
import TextToSpeech from '@/components/features/text-to-speech';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollToTop from '@/components/layout/scroll-to-top';
import type { LivePrice, PriceData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sword, Brain, ArrowLeft, BrainCircuit, BookText, FlaskConical, Scale, Landmark, CalendarDays, Repeat, SpellCheck, Binary, CalendarClock, Gift, Clock, Hourglass, Wallet, Bitcoin, Banknote, PiggyBank, TrendingUp, Percent, HeartPulse, Dumbbell, User, ShieldCheck, Fingerprint, RectangleEllipsis, Dices, KeyRound, QrCode, ScanLine, LocateFixed, Image, Monitor, FileText, Map, Info, HeartHandshake, Globe, Wrench, ArrowUp, ArrowDown, RefreshCw, Timer, CandlestickChart, ExternalLink, Construction, Calculator, Gamepad2, Puzzle, Bot, Mailbox, ReceiptText, CalendarCheck, PenLine, MemoryStick, Hash, Link as LinkIcon, Users, Ghost, CircleDot, Castle, Rocket, Target, Ship, ArrowDownRight, Square, Search, Shield, MessageSquareHeart, Bomb, Crown, Blocks, Rows3, AlignVerticalDistributeCenter, Hand, Voicemail, FileSliders, FileImage, ScanText } from 'lucide-react';
import ImageNext from 'next/image';
import AdvancedLivePrices from '@/components/features/advanced-live-prices';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import PWAInstallPrompt from '@/components/layout/pwa-install-prompt';
import LinkShortener from '@/components/features/link-shortener';

const OthelloIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <circle cx="16" cy="16" r="14" fill="currentColor" className="text-emerald-500" />
    <path d="M16 2C23.732 2 30 8.26801 30 16C30 18.2523 29.3995 20.3753 28.3751 22.2474C25.7533 16.5971 20.597 8.24354 16 2Z" fill="white"/>
    <path d="M16 30C8.26801 30 2 23.732 2 16C2 13.7477 2.60051 11.6247 3.62489 9.75259C6.24669 15.4029 11.403 23.7565 16 30Z" fill="black"/>
  </svg>
);

const SnakeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-lime-400">
        <path d="M7.5 7.5c0-2 2-3 4.5-3s4.5 1 4.5 3-2 3-4.5 3-4.5-1-4.5-3z"/>
        <path d="M4 10.5c0-2 2-3 4.5-3s4.5 1 4.5 3-2 3-4.5 3-4.5-1-4.5-3z"/>
        <path d="M10.5 14c0-2 2-3 4.5-3s4.5 1 4.5 3-2 3-4.5 3-4.5-1-4.5-3z"/>
    </svg>
);

const ModeBadge = ({ mode }: { mode?: string }) => {
  if (!mode) return null;
  const badgeInfo = {
    'دو نفره': { icon: <Users className="w-3 h-3" />, class: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' },
    'مقابل سیستم': { icon: <Bot className="w-3 h-3" />, class: 'bg-purple-500/20 text-purple-700 dark:text-purple-400' },
    'تک نفره': { icon: <User className="w-3 h-3" />, class: 'bg-green-500/20 text-green-700 dark:text-green-400' },
    'دو حالته': { icon: <Users className="w-3 h-3" />, class: 'bg-orange-500/20 text-orange-700 dark:text-orange-400' },
  };
  const info = badgeInfo[mode as keyof typeof badgeInfo];
  if (!info) return null;

  return (
    <Badge variant="secondary" className={cn("absolute top-2 left-2 border-none text-xs px-1.5 py-0.5 h-auto", info.class)}>
      {info.icon}
    </Badge>
  );
};


const toolCategories = [
  {
    title: 'ابزارهای هوش مصنوعی',
    icon: <BrainCircuit className="h-6 w-6 text-primary-foreground" />,
    tools: [
       { id: 'text-summarizer', title: 'خلاصه‌ساز هوشمند', icon: <BookText className="h-8 w-8 text-cyan-400" />, component: <TextSummarizer />, isWip: true },
       { id: 'legal-financial-chatbot', title: 'چت‌بات حقوقی و مالی', icon: <Bot className="h-8 w-8 text-blue-400" />, component: <LegalFinancialChatbot />, isWip: true },
       { id: 'text-to-speech', title: 'نوشتار به گفتار', icon: <Voicemail className="h-8 w-8 text-fuchsia-400" />, component: <TextToSpeech />, isWip: true },
       { id: 'pdf-word-converter', title: 'تبدیل PDF به Word (و بالعکس)', icon: <FileSliders className="h-8 w-8 text-blue-400" />, isWip: true },
       { id: 'pdf-image-converter', title: 'تبدیل PDF به عکس (و برعکس)', icon: <FileImage className="h-8 w-8 text-green-400" />, isWip: true },
       { id: 'ocr', title: 'استخراج متن از PDF و عکس (OCR)', icon: <ScanText className="h-8 w-8 text-indigo-400" />, isWip: true },
    ]
  },
  {
    title: 'مبدل‌ها',
    icon: <FlaskConical className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'unit-converter', title: 'تبدیل واحد', icon: <Scale className="h-8 w-8 text-blue-400" />, component: <UnitConverter /> },
      { id: 'currency-converter', title: 'تبدیل ارز', icon: <Landmark className="h-8 w-8 text-green-400" />, component: <CurrencyConverter /> },
      { id: 'date-converter', title: 'تبدیل تاریخ', icon: <CalendarDays className="h-8 w-8 text-purple-400" />, component: <DateConverter /> },
      { id: 'rial-toman-converter', title: 'ریال و تومان', icon: <Repeat className="h-8 w-8 text-emerald-400" />, component: <RialTomanConverter /> },
      { id: 'number-to-words', title: 'عدد به حروف', icon: <SpellCheck className="h-8 w-8 text-amber-400" />, component: <NumberToWordsConverter /> },
      { id: 'number-system', title: 'تبدیل ارقام', icon: <Binary className="h-8 w-8 text-sky-400" />, component: <NumberSystemConverter /> },
      { id: 'binary-converter', title: 'متن و باینری', icon: <Binary className="h-8 w-8 text-cyan-400" />, component: <BinaryConverter /> },
    ]
  },
  {
    title: 'ابزارهای زمان و تاریخ',
    icon: <CalendarClock className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'age-calculator', title: 'محاسبه سن', icon: <Gift className="h-8 w-8 text-pink-400" />, component: <AgeCalculator /> },
      { id: 'stopwatch', title: 'کرونومتر', icon: <Clock className="h-8 w-8 text-indigo-400" />, component: <Stopwatch /> },
      { id: 'countdown-timer', title: 'تایمر شمارش معکوس', icon: <Hourglass className="h-8 w-8 text-blue-400" />, component: <CountdownTimer /> },
      { id: 'events-calendar', title: 'تقویم مناسبت‌ها', icon: <CalendarCheck className="h-8 w-8 text-rose-400" />, isWip: true },
    ]
  },
    {
    title: 'محاسبات عمومی و مالی',
    icon: <Wallet className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'crypto-converter', title: 'نرخ ارز دیجیتال', icon: <Bitcoin className="h-8 w-8 text-orange-400" />, component: <CryptoConverter /> },
      { id: 'loan-calculator', title: 'اقساط وام', icon: <Banknote className="h-8 w-8 text-rose-400" />, component: <LoanCalculator /> },
      { id: 'deposit-calculator', title: 'سود سپرده', icon: <PiggyBank className="h-8 w-8 text-emerald-400" />, component: <DepositCalculator /> },
      { id: 'savings-calculator', title: 'محاسبه‌گر پس‌انداز', icon: <TrendingUp className="h-8 w-8 text-lime-400" />, component: <SavingsCalculator /> },
      { id: 'percentage-calculator', title: 'محاسبه درصد', icon: <Percent className="h-8 w-8 text-teal-400" />, component: <PercentageCalculator /> },
      { id: 'invoice-generator', title: 'مولد فاکتور رسمی', icon: <ReceiptText className="h-8 w-8 text-indigo-400" />, isWip: true },
    ]
  },
  {
    title: 'ورزش و سلامت',
    icon: <HeartPulse className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'workout-timer', title: 'زمان‌سنج تمرین', icon: <Dumbbell className="h-8 w-8 text-orange-400" />, component: <WorkoutTimer /> },
      { id: 'bmi-calculator', title: 'محاسبه BMI', icon: <HeartPulse className="h-8 w-8 text-red-400" />, component: <BmiCalculator /> },
    ]
  },
  {
    title: 'سرگرمی و بازی',
    icon: <Gamepad2 className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'tic-tac-toe', title: 'بازی دوز', icon: <Puzzle className="h-8 w-8 text-red-400" />, component: <TicTacToe />, mode: 'دو حالته' },
      { id: 'rock-paper-scissors', title: 'سنگ کاغذ قیچی', icon: <Hand className="h-8 w-8 text-yellow-400" />, component: <RockPaperScissors />, mode: 'دو حالته' },
      { id: 'hangman', title: 'حدس کلمه', icon: <Brain className="h-8 w-8 text-green-400" />, component: <Hangman />, mode: 'مقابل سیستم' },
      { id: 'memory-game', title: 'بازی حافظه', icon: <MemoryStick className="h-8 w-8 text-sky-400" />, component: <MemoryGame />, mode: 'تک نفره' },
      { id: 'guess-the-number', title: 'حدس عدد', icon: <Hash className="h-8 w-8 text-fuchsia-400" />, component: <GuessTheNumber />, mode: 'مقابل سیستم' },
      { id: 'connect-four', title: 'چهار در یک ردیف', icon: <AlignVerticalDistributeCenter className="h-8 w-8 text-blue-500" />, component: <ConnectFour />, mode: 'دو نفره' },
      { id: 'simon-says', title: 'بازی سایمون', icon: <BrainCircuit className="h-8 w-8 text-purple-500" />, component: <SimonSays />, mode: 'تک نفره' },
      { id: 'othello-game', title: 'بازی اتللو', icon: <OthelloIcon />, component: <OthelloGame />, mode: 'دو نفره' },
      { id: 'minesweeper-3d', title: 'Minesweeper Extreme 3D', icon: <Bomb className="h-8 w-8 text-gray-400" />, isWip: true },
      { id: 'archaeology-game', title: 'بازی زیرخاکی', icon: <Ghost className="h-8 w-8 text-yellow-400" />, isWip: true },
      { id: 'pac-man', title: 'Pac-Man Glow', icon: <Ghost className="h-8 w-8 text-yellow-400" />, isWip: true },
      { id: 'air-hockey', title: 'Air Hockey Neon', icon: <CircleDot className="h-8 w-8 text-cyan-400" />, isWip: true },
      { id: 'tower-defense', title: 'Tower Defense Lite', icon: <Castle className="h-8 w-8 text-gray-500" />, isWip: true },
      { id: 'space-invaders', title: 'Space Invaders 2025', icon: <Rocket className="h-8 w-8 text-slate-400" />, isWip: true },
      { id: 'carrom-board', title: 'Carrom Board 2D', icon: <Target className="h-8 w-8 text-red-500" />, isWip: true },
      { id: 'battleship', title: 'BattleShip Grid War', icon: <Ship className="h-8 w-8 text-blue-600" />, isWip: true },
      { id: 'pinball', title: 'Pinball Retro-Fusion', icon: <ArrowDownRight className="h-8 w-8 text-pink-500" />, isWip: true },
      { id: 'checkers', title: 'Checkers Royal', icon: <Square className="h-8 w-8 text-black" />, isWip: true },
      { id: 'word-hunt', title: 'Word Hunt Blitz', icon: <Search className="h-8 w-8 text-orange-500" />, isWip: true },
      { id: '2048', title: 'بازی 2048', icon: <Hash className="h-8 w-8 text-indigo-400" />, isWip: true },
      { id: 'snake', title: 'مار نئونی', icon: <SnakeIcon />, isWip: true },
      { id: 'chess', title: 'شطرنج', icon: <Crown className="h-8 w-8 text-yellow-500" />, isWip: true },
      { id: 'tetris', title: 'خانه سازی (Tetris)', icon: <Blocks className="h-8 w-8 text-cyan-400" />, isWip: true },
      { id: 'breakout', title: 'آجر شکن نئونی', icon: <Rows3 className="h-8 w-8 text-rose-400" />, isWip: true },
    ]
  },
  {
    title: 'ابزارهای کاربردی',
    icon: <User className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'sheba-converter', title: 'ابزار شبا/حساب', icon: <ShieldCheck className="h-8 w-8 text-green-500" />, isWip: true },
      { id: 'national-id-validator', title: 'بررسی صحت و شهر شماره ملی', icon: <Fingerprint className="h-8 w-8 text-teal-400" />, component: <NationalIdValidator /> },
      { id: 'link-shortener', title: 'کوتاه کننده لینک', icon: <LinkIcon className="h-8 w-8 text-sky-400" />, component: <LinkShortener />, isWip: true },
      { id: 'vehicle-plate-identifier', title: 'هوشمند پلاک', icon: <RectangleEllipsis className="h-8 w-8 text-indigo-400" />, component: <VehiclePlateIdentifier /> },
      { id: 'random-number', title: 'عدد تصادفی', icon: <Dices className="h-8 w-8 text-orange-400" />, component: <RandomNumberGenerator /> },
      { id: 'password-generator', title: 'تولید رمز عبور', icon: <KeyRound className="h-8 w-8 text-violet-400" />, component: <PasswordGenerator /> },
      { id: 'qr-code-generator', title: 'QR Code ساز', icon: <QrCode className="h-8 w-8 text-emerald-400" />, component: <QrCodeGenerator /> },
      { id: 'qr-code-reader', title: 'QR Code خوان', icon: <ScanLine className="h-8 w-8 text-blue-400" />, component: <QrCodeReader /> },
      { id: 'image-optimizer', title: 'کاهش حجم تصویر', icon: <Image className="h-8 w-8 text-orange-400" />, component: <ImageOptimizer /> },
      { id: 'text-analyzer', title: 'تحلیلگر متن', icon: <FileText className="h-8 w-8 text-yellow-400" />, component: <TextAnalyzer /> },
      { id: 'distance-calculator', title: 'محاسبه مسافت', icon: <Map className="h-8 w-8 text-fuchsia-400" />, component: <DistanceCalculator /> },
      { id: 'signature-generator', title: 'تولید امضا دیجیتال', icon: <PenLine className="h-8 w-8 text-slate-400" />, component: <SignatureGenerator /> },
      { id: 'ip-detector', title: 'تشخیص IP', icon: <LocateFixed className="h-8 w-8 text-sky-400" />, isWip: true },
      { id: 'post-tracker', title: 'پیگیری مرسوله پستی', icon: <Mailbox className="h-8 w-8 text-rose-400" />, isExternal: true, href: 'https://tracking.post.ir/'},
    ]
  }
];


export default async function Home() {
  // AI flows are disabled, so we pass empty data
  const initialPrices: Omit<PriceData, 'cryptos'> = {};
    
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">

          <AdvancedLivePrices initialData={initialPrices} />


          {/* Toolbox Shortcuts */}
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
             <h2 className="col-span-12 text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3 text-glow">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-accent/80 rounded-xl flex items-center justify-center animate-pulse">
                  <Wrench className="w-6 h-6 text-primary-foreground"/>
              </div>
              جعبه ابزار
            </h2>
            <div className="space-y-8">
              {toolCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="text-lg font-semibold font-display text-foreground/90 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/70 to-accent/70 rounded-lg flex items-center justify-center">
                      {category.icon}
                    </div>
                    {category.title}
                  </h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {category.tools.map((tool) => {
                      const typedTool = tool as any;
                      const content = (
                        <div className="glass-effect rounded-2xl p-4 w-full h-full flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                          {typedTool.isWip && <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-600 border-none">بزودی</Badge>}
                           <ModeBadge mode={typedTool.mode} />
                          {tool.icon}
                          <span className="font-semibold text-sm text-foreground">{tool.title}</span>
                        </div>
                      );
                      if(typedTool.isWip) {
                          return <div key={`shortcut-${tool.id}`} className="block opacity-60 cursor-not-allowed">{content}</div>
                      }
                      return (
                      <a href={typedTool.href || `#${tool.id}`} key={`shortcut-${tool.id}`} className="block card-hover" target={typedTool.isExternal ? '_blank' : '_self'}>
                        {content}
                      </a>
                    )}
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tools Sections */}
          <div className="space-y-12">
            {toolCategories.map((category) => (
              <div key={`category-section-${category.title}`} className="space-y-6">
                <h2 className="text-2xl font-bold font-display text-foreground text-glow border-r-4 border-primary pr-4">
                  {category.title}
                </h2>
                {category.tools.map((tool) => {
                    const typedTool = tool as any;
                    if (typedTool.isWip) {
                      return (
                        <Card key={tool.id} id={tool.id} className="glass-effect scroll-mt-24 opacity-70">
                            <CardHeader>
                              <CardTitle className='flex items-center justify-between text-xl font-display text-muted-foreground'>
                                 <div className='flex items-center gap-3'>
                                     {React.cloneElement(tool.icon, { className: "h-7 w-7" })}
                                     {tool.title}
                                 </div>
                                 <Badge variant="outline">به‌زودی...</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-24 gap-4">
                                  <Construction className="w-12 h-12" />
                                  <p>این ابزار در حال توسعه است و به‌زودی فعال خواهد شد.</p>
                                </div>
                            </CardContent>
                        </Card>
                      )
                    }
                    if (typedTool.isExternal) {
                      return (
                        <a key={tool.id} href={typedTool.href} target="_blank" rel="noopener noreferrer">
                            <Card id={tool.id} className="glass-effect card-hover scroll-mt-24">
                              <CardHeader>
                                <CardTitle className='flex items-center justify-between text-xl font-display'>
                                   <div className='flex items-center gap-3'>
                                       {React.cloneElement(tool.icon, { className: "h-7 w-7" })}
                                       {tool.title}
                                   </div>
                                   <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                      مشاهده
                                      <ExternalLink className="h-5 w-5" />
                                   </div>
                                </CardTitle>
                              </CardHeader>
                            </Card>
                        </a>
                      )
                    }
                    return (
                        <Card key={tool.id} id={tool.id} className="glass-effect scroll-mt-24">
                          <CardHeader>
                            <CardTitle className='flex items-center justify-between text-xl font-display'>
                               <div className='flex items-center gap-3'>
                                {React.cloneElement(tool.icon, { className: "h-7 w-7" })}
                                {tool.title}
                              </div>
                               <ModeBadge mode={typedTool.mode} />
                            </CardTitle>
                          </CardHeader>
                          {typedTool.component}
                        </Card>
                    )
                })}
              </div>
            ))}
          </div>
          
           {/* About Us Section */}
           <div className="mt-12 glass-effect rounded-3xl p-6 md:p-8">
             <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
                <div className="p-3 bg-gradient-to-br from-primary/80 to-accent/80 rounded-2xl inline-flex animate-pulse">
                    <Info className="h-10 w-10 text-primary-foreground"/>
                </div>
               <div className='flex-grow'>
                  <h3 className="text-xl font-semibold font-display text-foreground">درباره «تبدیلا»</h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    «تبدیلا» فقط یک ابزار نیست؛ یک دستیار هوشمند برای تمام لحظاتی است که به محاسبات و تبدیلات سریع، دقیق و زیبا نیاز دارید. ما با وسواس، مجموعه‌ای از بهترین ابزارهای روزمره را در یک پلتفرم مدرن و چشم‌نواز گرد هم آورده‌ایم تا کار شما را آسان‌تر کنیم.
                  </p>
               </div>
             </div>
           </div>
           
           {/* Financial Support Section */}
           <div className="mt-6 glass-effect rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-grow flex items-center gap-6 text-center sm:text-right">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl inline-flex animate-pulse">
                        <HeartHandshake className="h-10 w-10 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold font-display text-foreground">حمایت از توسعه «تبدیلا»</h3>
                        <p className="text-muted-foreground mt-2">
                           اگر «تبدیلا» برایتان مفید بوده، با حمایت خود به رشد و پیشرفت آن کمک کنید. هر حمایتی، انرژی ما را برای ساخت ابزارهای بهتر دوچندان می‌کند.
                        </p>
                    </div>
                </div>
                 <a href="https://idpay.ir/tbdila" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold h-12 px-8 text-base shrink-0">
                        حمایت می‌کنم
                        <ArrowLeft className="mr-2 h-5 w-5" />
                    </Button>
                </a>
            </div>
           </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm font-body space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <div className="inline-flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                <span>
                  توسعه داده شده توسط <a href="https://www.hosseintaheri.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">حسین طاهری</a>
                </span>
            </div>
             <div className="inline-flex items-center justify-center gap-2">
                <CalendarClock className="w-5 h-5" />
                <span>
                  آخرین بروزرسانی: شهریور 1404
                </span>
            </div>
            
            <Dialog>
                <DialogTrigger asChild>
                    <div className="inline-flex items-center justify-center gap-2 cursor-pointer hover:text-foreground">
                        <FileText className="w-5 h-5" />
                        <span>قوانین و مقررات</span>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] glass-effect">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display">قوانین استفاده از «تبدیلا»</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-right leading-relaxed max-h-[70vh] overflow-y-auto p-1 pr-3">
                        <p>به «تبدیلا» خوش آمدید. استفاده از خدمات ما به منزله پذیرش قوانین زیر است:</p>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-foreground">۱. استفاده منصفانه</h4>
                                <p>تمام ابزارها برای استفاده شخصی و قانونی طراحی شده‌اند. استفاده غیرقانونی، سوءاستفاده یا بارگذاری محتوای خلاف مقررات، مجاز نیست.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">۲. حقوق مالکیت فکری</h4>
                                <p>محتوای موجود، شامل کدها، طراحی و داده‌ها، متعلق به «تبدیلا» بوده و هرگونه کپی‌برداری یا انتشار بدون اجازه کتبی، ممنوع است.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">۳. مسئولیت داده‌ها</h4>
                                <p>اطلاعات و نتایج ارائه‌شده توسط ابزارها، جنبه اطلاع‌رسانی دارند. مسئولیت نهایی استفاده از این داده‌ها بر عهده کاربر است.</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground">۴. تغییرات قوانین</h4>
                                <p>«تبدیلا» حق به‌روزرسانی یا اصلاح این قوانین را بدون اطلاع قبلی برای خود محفوظ می‌دارد. نسخه جدید قوانین بلافاصله پس از انتشار معتبر خواهد بود.</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <div className="inline-flex items-center justify-center gap-2 cursor-pointer hover:text-foreground">
                        <Shield className="w-5 h-5" />
                        <span>سیاست حفظ حریم خصوصی</span>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] glass-effect">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display">🔒 سیاست حفظ حریم خصوصی</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-right leading-relaxed max-h-[70vh] overflow-y-auto p-1 pr-3">
                        <p>حفظ حریم خصوصی شما برای ما در «تبدیلا» اهمیت بالایی دارد. این سند نحوه جمع‌آوری و استفاده از اطلاعات شما را توضیح می‌دهد:</p>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-foreground">۱. اطلاعات جمع‌آوری شده</h4>
                                <p>ما هیچ‌گونه اطلاعات شخصی شناسایی‌پذیر (مانند نام، ایمیل و...) را بدون اجازه مستقیم شما جمع‌آوری نمی‌کنیم. برای ابزارهایی مانند خلاصه‌ساز متن، فقط آدرس IP شما به صورت موقت برای جلوگیری از سوءاستفاده (Rate Limiting) ذخیره می‌شود.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">۲. استفاده از کوکی‌ها</h4>
                                <p>«تبدیلا» از کوکی‌ها فقط برای ذخیره تنظیمات ظاهری شما (مانند تم روشن/تاریک) استفاده می‌کند و هیچ اطلاعات شخصی در آن‌ها ذخیره نمی‌شود.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">۳. امنیت داده‌ها</h4>
                                <p>ارتباط شما با سرورهای «تبدیلا» از طریق پروتکل امن SSL انجام می‌شود. ما متعهد به حفاظت از داده‌های شما در برابر دسترسی غیرمجاز هستیم.</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground">۴. سرویس‌های شخص ثالث</h4>
                                <p>برخی از قابلیت‌های سایت مانند مدل‌های هوش مصنوعی توسط سرویس‌دهندگان معتبر (مانند گوگل) ارائه می‌شوند. داده‌های ارسالی به این سرویس‌ها تابع قوانین حریم خصوصی آن‌ها خواهد بود.</p>
                             </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

             <a href="mailto:feedback@tabdila.com?subject=انتقادات و پیشنهادات درباره تبدیلا" className="inline-flex items-center justify-center gap-2 cursor-pointer hover:text-foreground">
                <MessageSquareHeart className="w-5 h-5" />
                <span>انتقادات و پیشنهادات</span>
            </a>

        </div>
        <div className="inline-flex items-center justify-center gap-2 pt-2 border-t border-border/50 w-full max-w-lg mx-auto mt-4">
            <p>
              تمام حقوق مادی و معنوی این وبسایت متعلق به مجموعه تبدیلا است.
            </p>
        </div>
      </footer>
      <ScrollToTop />
      <PWAInstallPrompt />
    </div>
  );
}

    








