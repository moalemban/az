"use client";

import { useState, useEffect, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, Lightbulb, Trophy, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const words = [
  'جاوااسکریپت', 'ری‌اکت', 'کامپوننت', 'اپلیکیشن', 'برنامه‌نویسی', 'توسعه‌دهنده',
  'هوشمند', 'تبدیلا', 'طراحی', 'کاربردی', 'سرویس', 'اینترنت', 'فناوری', 'الگوریتم'
];
const alphabet = 'ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی'.split(' ');

const HangmanFigure = ({ wrongGuesses }: { wrongGuesses: number }) => {
  const parts = [
    <line key="1" x1="60" y1="20" x2="140" y2="20" />, // Top bar
    <line key="2" x1="140" y1="20" x2="140" y2="50" />, // Rope
    <circle key="3" cx="140" cy="70" r="20" />, // Head
    <line key="4" x1="140" y1="90" x2="140" y2="150" />, // Body
    <line key="5" x1="140" y1="120" x2="110" y2="100" />, // Left arm
    <line key="6" x1="140" y1="120" x2="170" y2="100" />, // Right arm
    <line key="7" x1="140" y1="150" x2="110" y2="180" />, // Left leg
    <line key="8" x1="140" y1="150" x2="170" y2="180" />, // Right leg
  ];

  return (
    <svg height="250" width="200" className="stroke-current text-foreground mx-auto transition-all duration-300">
      {/* Stand */}
      <line x1="20" y1="230" x2="100" y2="230" strokeWidth="3"/>
      <line x1="60" y1="230" x2="60" y2="20" strokeWidth="3"/>
      {/* Figure parts */}
      {parts.slice(0, wrongGuesses).map((part, index) => (
        <g key={index} className="animate-draw">
          {part}
        </g>
      ))}
      <style>{`
        @keyframes draw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
        .animate-draw { stroke-dasharray: 1000; animation: draw 0.5s ease-out forwards; }
      `}</style>
    </svg>
  );
};

export default function Hangman() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  
  const startNewGame = useCallback(() => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const wrongGuesses = guessedLetters.filter(letter => !word.includes(letter));
  const isWinner = word.split('').every(letter => guessedLetters.includes(letter));
  const isLoser = wrongGuesses.length >= 8;
  const gameOver = isWinner || isLoser;

  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter)) return;
    setGuessedLetters(prev => [...prev, letter]);
  };

  const getHint = () => {
    const unGuessedLetters = word.split('').filter(letter => !guessedLetters.includes(letter));
    if (unGuessedLetters.length > 0) {
      const hintLetter = unGuessedLetters[Math.floor(Math.random() * unGuessedLetters.length)];
      handleGuess(hintLetter);
    }
  };

  return (
    <CardContent className="flex flex-col items-center gap-6 relative">
      <div className="flex flex-col md:flex-row items-center gap-6 w-full">
        <div className='flex-shrink-0'>
            <HangmanFigure wrongGuesses={wrongGuesses.length} />
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
            <Badge variant="outline" className="text-lg">
                تعداد اشتباهات: {wrongGuesses.length.toLocaleString('fa-IR')} از ۸
            </Badge>
            <div dir="rtl" className="flex justify-center flex-wrap gap-2 text-3xl sm:text-4xl font-bold tracking-[0.2em]">
                {word.split('').map((letter, index) => (
                <span key={index} className="w-12 h-16 border-b-4 flex items-center justify-center bg-muted/20 rounded-t-md">
                    {guessedLetters.includes(letter) ? letter : ''}
                </span>
                ))}
            </div>
             {wrongGuesses.length > 0 && (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">حروف اشتباه:</p>
                    <div dir="rtl" className="flex gap-2 text-destructive font-mono text-lg">
                        {wrongGuesses.map(l => <span key={l}>{l}</span>)}
                    </div>
                </div>
            )}
        </div>
      </div>
      

      {gameOver && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10 animate-fade-in">
            {isWinner ? <Trophy className="w-20 h-20 text-yellow-400 animate-bounce" /> : <Skull className="w-20 h-20 text-destructive" />}
            <p className={cn("text-3xl font-bold", isWinner ? 'text-green-500' : 'text-red-500')}>
                {isWinner ? '🎉 شما بردید! 🎉' : 'باختی! دوباره تلاش کن.'}
            </p>
            {!isWinner && <p className="text-lg">کلمه صحیح: <span className="font-bold text-primary">{word}</span></p>}
            <Button onClick={startNewGame} size="lg">
                <Redo className="ml-2 h-5 w-5" />
                بازی جدید
            </Button>
        </div>
      )}

      {!gameOver && (
        <div className="w-full max-w-2xl space-y-4">
          <div dir="rtl" className="flex flex-wrap justify-center gap-2">
            {alphabet.map(letter => (
              <Button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter)}
                variant={guessedLetters.includes(letter) ? (word.includes(letter) ? 'default' : 'destructive') : 'outline'}
                className="w-12 h-12 text-lg"
              >
                {letter}
              </Button>
            ))}
          </div>
          <Button onClick={getHint} variant="secondary" className="w-full">
            <Lightbulb className="ml-2 h-4 w-4"/>
            راهنمایی بگیر
          </Button>
        </div>
      )}
      
       <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </CardContent>
  );
}
