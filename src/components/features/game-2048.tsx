"use client";

import { useState, useEffect, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Redo, RotateCcw, Trophy, ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown, Info, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

type Cell = number;
type Board = Cell[][];
type GameMode = 'classic' | 'challenge' | 'infinite';

const BOARD_SIZE = 4;
const CHALLENGE_MOVES = 50;

const tileColorMapping: { [key: number]: string } = {
    2: "bg-gray-200 text-gray-800",
    4: "bg-orange-200 text-orange-800",
    8: "bg-amber-300 text-amber-900",
    16: "bg-yellow-400 text-yellow-900",
    32: "bg-lime-400 text-lime-900",
    64: "bg-green-500 text-white",
    128: "bg-teal-500 text-white",
    256: "bg-cyan-500 text-white",
    512: "bg-sky-500 text-white",
    1024: "bg-blue-600 text-white",
    2048: "bg-indigo-600 text-white shadow-lg shadow-indigo-400/50",
    4096: "bg-purple-700 text-white shadow-lg shadow-purple-400/50",
    8192: "bg-fuchsia-700 text-white shadow-lg shadow-fuchsia-400/50",
};


const Tile = ({ value }: { value: Cell }) => {
    const colorClass = tileColorMapping[value] || "bg-card-foreground text-background";
    const textSize = value > 1000 ? (value > 10000 ? 'text-xl' : 'text-2xl') : 'text-3xl';
    if (value === 0) {
        return <div className="w-full h-full bg-muted/50 rounded-lg" />;
    }
    return (
        <div className={cn(
            "w-full h-full rounded-lg flex items-center justify-center font-bold shadow-md animate-tile-pop",
            colorClass,
            textSize
        )}>
            {value.toLocaleString('fa-IR')}
        </div>
    );
};

export default function Game2048() {
    const [board, setBoard] = useState<Board>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [history, setHistory] = useState<{ board: Board; score: number }[]>([]);
    const { toast } = useToast();

    const createEmptyBoard = (): Board => Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

    const addRandomTile = (currentBoard: Board): Board => {
        const newBoard = currentBoard.map(row => [...row]);
        const emptyCells: [number, number][] = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (newBoard[r][c] === 0) {
                    emptyCells.push([r, c]);
                }
            }
        }
        if (emptyCells.length === 0) return newBoard;
        const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
        return newBoard;
    };

    const startGame = useCallback((mode: GameMode) => {
        let newBoard = createEmptyBoard();
        newBoard = addRandomTile(newBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setMoves(0);
        setGameOver(false);
        setHistory([{ board: newBoard, score: 0 }]);
        setGameMode(mode);

        const storedHighScore = localStorage.getItem(`2048-highscore-${mode}`);
        setHighScore(storedHighScore ? parseInt(storedHighScore, 10) : 0);
    }, []);

    const saveHighScore = useCallback(() => {
        if (score > highScore && gameMode) {
            setHighScore(score);
            localStorage.setItem(`2048-highscore-${gameMode}`, score.toString());
            toast({ title: 'رکورد جدید!', description: `شما رکورد جدید ${score.toLocaleString('fa-IR')} را برای حالت ${getModeText(gameMode)} ثبت کردید.` });
        }
    }, [score, highScore, gameMode, toast]);

    const checkGameOver = (currentBoard: Board) => {
        if (gameMode === 'challenge' && moves >= CHALLENGE_MOVES) {
            setGameOver(true);
            saveHighScore();
            return;
        }

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (currentBoard[r][c] === 0) return;
                if (r < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r + 1][c]) return;
                if (c < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r][c + 1]) return;
            }
        }
        setGameOver(true);
        saveHighScore();
    };

    const move = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;
        let moved = false;
        let newScore = score;
        const newBoard: Board = createEmptyBoard();

        const processLine = (line: Cell[]): Cell[] => {
            const filtered = line.filter(cell => cell !== 0);
            const newLine: Cell[] = [];
            for (let i = 0; i < filtered.length; i++) {
                if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
                    const newValue = filtered[i] * 2;
                    newLine.push(newValue);
                    newScore += newValue;
                    i++;
                } else {
                    newLine.push(filtered[i]);
                }
            }
            while (newLine.length < BOARD_SIZE) {
                newLine.push(0);
            }
            return newLine;
        };

        let tempBoard = board.map(row => [...row]);

        if (direction === 'left' || direction === 'right') {
            for (let r = 0; r < BOARD_SIZE; r++) {
                const line = tempBoard[r];
                const reversed = direction === 'right' ? [...line].reverse() : line;
                const processed = processLine(reversed);
                const finalLine = direction === 'right' ? [...processed].reverse() : processed;
                if (JSON.stringify(finalLine) !== JSON.stringify(line)) moved = true;
                newBoard[r] = finalLine;
            }
        } else { // up or down
            for (let c = 0; c < BOARD_SIZE; c++) {
                let line: Cell[] = [];
                for (let r = 0; r < BOARD_SIZE; r++) line.push(tempBoard[r][c]);
                const reversed = direction === 'down' ? [...line].reverse() : line;
                const processed = processLine(reversed);
                const finalLine = direction === 'down' ? [...processed].reverse() : processed;
                if(newBoard.some((row, rIdx) => row[c] !== finalLine[rIdx])) moved = true;
                for (let r = 0; r < BOARD_SIZE; r++) {
                    newBoard[r][c] = finalLine[r];
                }
            }
        }

        if (moved) {
            const boardWithNewTile = addRandomTile(newBoard);
            setBoard(boardWithNewTile);
            setScore(newScore);
            setMoves(m => m + 1);
            setHistory(h => [...h, { board: boardWithNewTile, score: newScore }]);
            checkGameOver(boardWithNewTile);
        }
    };
    
    const undoMove = () => {
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            const lastState = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            setBoard(lastState.board);
            setScore(lastState.score);
            setMoves(m => m - 1);
            setGameOver(false);
        }
    }


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver || !gameMode) return;
            switch (e.key) {
                case 'ArrowUp': move('up'); break;
                case 'ArrowDown': move('down'); break;
                case 'ArrowLeft': move('left'); break;
                case 'ArrowRight': move('right'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameOver, gameMode, board]); // re-bind with updated board state

    const getModeText = (mode: GameMode | null) => {
        if (mode === 'classic') return "کلاسیک";
        if (mode === 'challenge') return "چالش سرعتی";
        return "بی‌نهایت";
    }

    if (!gameMode) {
        return (
            <CardContent className="flex flex-col items-center gap-4 pt-6">
                <h3 className="text-xl font-semibold text-foreground">حالت بازی را انتخاب کنید:</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => startGame('classic')} className="h-12 w-48 text-base">کلاسیک (۴×۴)</Button>
                    <Button onClick={() => startGame('challenge')} className="h-12 w-48 text-base">چالش سرعتی</Button>
                    <Button onClick={() => startGame('infinite')} className="h-12 w-48 text-base">بی‌نهایت</Button>
                </div>
            </CardContent>
        );
    }

    return (
        <CardContent className="flex flex-col items-center gap-4">
             <style>{`
                @keyframes tile-pop {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-tile-pop { animation: tile-pop 0.2s ease-out; }
            `}</style>
            
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className='flex gap-2'>
                    <div className="bg-muted p-2 rounded-lg text-center w-32">
                        <p className="text-xs text-muted-foreground">امتیاز</p>
                        <p className="text-2xl font-bold">{score.toLocaleString('fa-IR')}</p>
                    </div>
                    <div className="bg-muted p-2 rounded-lg text-center w-32">
                        <p className="text-xs text-muted-foreground">رکورد</p>
                        <p className="text-2xl font-bold">{highScore.toLocaleString('fa-IR')}</p>
                    </div>
                </div>
                
                 <div className='flex items-center gap-2'>
                    <Badge variant="secondary" className="h-8 px-3 text-sm">{getModeText(gameMode)}</Badge>
                    {gameMode === 'challenge' && (
                        <Badge variant="outline" className="h-8 px-3 text-sm font-mono">{CHALLENGE_MOVES - moves} حرکت</Badge>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={undoMove} disabled={history.length <= 1 || gameOver} variant="outline" size="icon" className="w-12 h-12"><RotateCcw className="w-5 h-5"/></Button>
                    <Button onClick={() => startGame(gameMode)} variant="outline" size="icon" className="w-12 h-12"><Redo className="w-5 h-5" /></Button>
                    <Button onClick={() => setGameMode(null)} variant="ghost" className="h-12 text-muted-foreground">تغییر حالت</Button>
                </div>
            </div>

            <div className="relative p-2 bg-muted/80 rounded-xl shadow-inner">
                 {gameOver && (
                    <div className="absolute inset-0 bg-background/80 z-10 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                        <Trophy className="w-16 h-16 text-yellow-400" />
                        <h3 className="text-3xl font-bold mt-2">بازی تمام شد!</h3>
                        <p className="text-lg">امتیاز نهایی: {score.toLocaleString('fa-IR')}</p>
                        <Button onClick={() => startGame(gameMode)} className="mt-4">
                            <Redo className="ml-2 w-4 h-4"/>
                            بازی مجدد
                        </Button>
                    </div>
                )}
                <div className="grid grid-cols-4 gap-2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
                    {board.map((row, r) => row.map((cell, c) => (
                        <Tile key={`${r}-${c}`} value={cell} />
                    )))}
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30 max-w-md text-center">
              <Info className="w-5 h-5 shrink-0" />
              <span>
                از کلیدهای جهت‌نما برای حرکت دادن خانه‌ها استفاده کنید. خانه‌های هم‌عدد با هم ترکیب شده و امتیاز شما را دو برابر می‌کنند.
              </span>
            </div>
             <div className="md:hidden flex flex-col items-center gap-2">
                <Button onClick={() => move('up')} size="icon" variant="outline"><ChevronsUp /></Button>
                <div className="flex gap-2">
                    <Button onClick={() => move('left')} size="icon" variant="outline"><ChevronsLeft /></Button>
                    <Button onClick={() => move('down')} size="icon" variant="outline"><ChevronsDown /></Button>
                    <Button onClick={() => move('right')} size="icon" variant="outline"><ChevronsRight /></Button>
                </div>
             </div>
        </CardContent>
    );
}
