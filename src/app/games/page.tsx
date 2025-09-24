
"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, RectangleEllipsis, Dices, Users, Bot, User, Puzzle, MemoryStick, Hash, Crown, Square, Search, Ship, ArrowDownRight, Target, Rocket, Castle, CircleDot, Ghost, Bomb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
        <div className="h-6 w-6 animate-spin mr-2" />
        <span>در حال بارگذاری بازی...</span>
    </div>
);

const TicTacToe = dynamic(() => import('@/components/features/tic-tac-toe'), { loading: () => <LoadingComponent /> });
const RockPaperScissors = dynamic(() => import('@/components/features/rock-paper-scissors'), { loading: () => <LoadingComponent /> });
const Hangman = dynamic(() => import('@/components/features/hangman'), { loading: () => <LoadingComponent /> });
const MemoryGame = dynamic(() => import('@/components/features/memory-game'), { loading: () => <LoadingComponent /> });
const GuessTheNumber = dynamic(() => import('@/components/features/guess-the-number'), { loading: () => <LoadingComponent /> });
const ConnectFour = dynamic(() => import('@/components/features/connect-four'), { loading: () => <LoadingComponent /> });
const SimonSays = dynamic(() => import('@/components/features/simon-says'), { loading: () => <LoadingComponent /> });
const OthelloGame = dynamic(() => import('@/components/features/othello-game'), { loading: () => <LoadingComponent /> });
const Game2048 = dynamic(() => import('@/components/features/game-2048'), { loading: () => <LoadingComponent /> });

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

const allGames = [
  { id: 'tic-tac-toe', title: 'بازی دوز', icon: <Puzzle className="h-8 w-8 text-red-400" />, component: TicTacToe, mode: 'دو حالته' },
  { id: 'rock-paper-scissors', title: 'سنگ کاغذ قیچی', icon: <RectangleEllipsis className="h-8 w-8 text-yellow-400" />, component: RockPaperScissors, mode: 'دو حالته' },
  { id: 'hangman', title: 'حدس کلمه', icon: <Brain className="h-8 w-8 text-green-400" />, component: Hangman, mode: 'مقابل سیستم' },
  { id: 'memory-game', title: 'بازی حافظه', icon: <MemoryStick className="h-8 w-8 text-sky-400" />, component: MemoryGame, mode: 'تک نفره' },
  { id: 'guess-the-number', title: 'حدس عدد', icon: <Hash className="h-8 w-8 text-fuchsia-400" />, component: GuessTheNumber, mode: 'مقابل سیستم' },
  { id: 'connect-four', title: 'چهار در یک ردیف', icon: <RectangleEllipsis className="h-8 w-8 text-blue-500" />, component: ConnectFour, mode: 'دو نفره' },
  { id: 'simon-says', title: 'بازی سایمون', icon: <Dices className="h-8 w-8 text-purple-500" />, component: SimonSays, mode: 'تک نفره' },
  { id: 'othello-game', title: 'بازی اتللو', icon: <OthelloIcon />, component: OthelloGame, mode: 'دو حالته' },
  { id: '2048', title: 'بازی 2048', icon: <RectangleEllipsis className="h-8 w-8 text-indigo-400" />, component: Game2048, mode: 'تک نفره' },
  { id: 'escape-the-bill', title: 'فرار از قبض برق', icon: <RectangleEllipsis className="h-8 w-8 text-yellow-500" />, isWip: true },
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
  { id: 'snake', title: 'مار نئونی', icon: <SnakeIcon />, isWip: true },
  { id: 'chess', title: 'شطرنج', icon: <Crown className="h-8 w-8 text-yellow-500" />, isWip: true },
  { id: 'breakout-neon', title: 'Breakout Neon', icon: <RectangleEllipsis className="h-8 w-8 text-orange-400" />, isWip: true },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen">
      <header className="p-4 text-center sticky top-0 z-10 glass-effect rounded-b-2xl">
         <Link href="/">
             <Button variant="ghost">
                <ArrowLeft className="ml-2 h-5 w-5" />
                بازگشت به صفحه اصلی
            </Button>
        </Link>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-xl text-center">
          <h1 className="text-4xl font-bold font-display text-foreground text-glow mb-2">دنیای بازی و سرگرمی</h1>
          <p className="text-muted-foreground mb-10">مجموعه‌ای از بازی‌های جذاب برای تمام سلیقه‌ها</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allGames.map(game => {
              const typedGame = game as any;
              const content = (
                <div className="glass-effect rounded-2xl p-4 w-full h-full flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                  {typedGame.isWip && <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-600 border-none">بزودی</Badge>}
                  <ModeBadge mode={typedGame.mode} />
                  {game.icon}
                  <span className="font-semibold text-sm text-foreground">{game.title}</span>
                </div>
              );

              if (typedGame.isWip) {
                return <div key={`game-${game.id}`} className="block opacity-60 cursor-not-allowed">{content}</div>
              }

              const ToolComponent = typedGame.component;

              return (
                 <Dialog key={`game-${game.id}`}>
                    <DialogTrigger asChild>
                        <button className="block card-hover text-right">{content}</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl glass-effect p-0">
                         <Card className="border-none bg-transparent shadow-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl font-display">
                                    {React.cloneElement(game.icon as React.ReactElement, { className: "h-7 w-7" })}
                                    {game.title}
                                </CardTitle>
                            </CardHeader>
                            <ToolComponent />
                         </Card>
                    </DialogContent>
                </Dialog>
              )
            })}
          </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        <p>تمام حقوق مادی و معنوی این وبسایت متعلق به مجموعه تبدیلا است.</p>
      </footer>
    </div>
  );
}

    