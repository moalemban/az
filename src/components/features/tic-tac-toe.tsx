"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, X, Circle, Bot as BotIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

type Player = 'X' | 'O';
type SquareValue = Player | null;
type GameMode = 'two-player' | 'vs-computer';
type Difficulty = 'easy' | 'medium' | 'hard';
type Board = SquareValue[][];
type Line = [number, number][];

const Square = ({ value, isWinnerSquare, onSquareClick }: { value: SquareValue, isWinnerSquare: boolean, onSquareClick: () => void }) => {
  return (
    <button 
      className={cn(
        "bg-muted/30 rounded-lg flex items-center justify-center shadow-inner transition-colors duration-300",
        isWinnerSquare && "bg-yellow-400/30",
        !value && "hover:bg-muted/50"
      )}
      onClick={onSquareClick}
      style={{ width: 'clamp(3rem, 20vw, 5rem)', height: 'clamp(3rem, 20vw, 5rem)' }}
    >
        {value === 'X' && <X className="w-3/4 h-3/4 text-blue-400 transition-transform duration-300" />}
        {value === 'O' && <Circle className="w-3/4 h-3/4 text-pink-400 transition-transform duration-300" />}
    </button>
  );
};

export default function TicTacToe() {
  const [boardSize, setBoardSize] = useState(3);
  const [winCondition, setWinCondition] = useState(3);
  const [board, setBoard] = useState<Board>([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player, line: Line } | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  const createBoard = useCallback((size: number) => Array.from({ length: size }, () => Array(size).fill(null)), []);

  const calculateWinner = useCallback((currentBoard: Board, size: number, condition: number): { winner: Player; line: Line } | null => {
    // Check rows and columns
    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= size - condition; j++) {
            // Rows
            const rowSlice = currentBoard[i].slice(j, j + condition);
            if (rowSlice.every(s => s === 'X') || rowSlice.every(s => s === 'O')) {
                return { winner: rowSlice[0]!, line: Array.from({ length: condition }, (_, k) => [i, j + k]) };
            }
            // Columns
            const colSlice = Array.from({ length: condition }, (_, k) => currentBoard[j + k][i]);
            if (colSlice.every(s => s === 'X') || colSlice.every(s => s === 'O')) {
                return { winner: colSlice[0]!, line: Array.from({ length: condition }, (_, k) => [j + k, i]) };
            }
        }
    }
    // Check diagonals
    for (let i = 0; i <= size - condition; i++) {
        for (let j = 0; j <= size - condition; j++) {
            // Top-left to bottom-right
            const diag1 = Array.from({ length: condition }, (_, k) => currentBoard[i + k][j + k]);
            if (diag1.every(s => s === 'X') || diag1.every(s => s === 'O')) {
                return { winner: diag1[0]!, line: Array.from({ length: condition }, (_, k) => [i + k, j + k]) };
            }
            // Top-right to bottom-left
            const diag2 = Array.from({ length: condition }, (_, k) => currentBoard[i + k][j + condition - 1 - k]);
            if (diag2.every(s => s === 'X') || diag2.every(s => s === 'O')) {
                return { winner: diag2[0]!, line: Array.from({ length: condition }, (_, k) => [i + k, j + condition - 1 - k]) };
            }
        }
    }
    return null;
  }, []);

  const makeComputerMove = useCallback((currentBoard: Board): [number, number] | null => {
    const emptySquares: [number, number][] = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (!currentBoard[r][c]) emptySquares.push([r, c]);
        }
    }
    if (emptySquares.length === 0) return null;

    // --- AI Logic ---
    const player = xIsNext ? 'X' : 'O';
    const opponent = player === 'X' ? 'O' : 'X';

    // 1. Check if computer can win
    for (const [r, c] of emptySquares) {
        const tempBoard = currentBoard.map(row => [...row]);
        tempBoard[r][c] = opponent;
        if (calculateWinner(tempBoard, boardSize, winCondition)) return [r, c];
    }
    // 2. Check if player can win and block
    for (const [r, c] of emptySquares) {
        const tempBoard = currentBoard.map(row => [...row]);
        tempBoard[r][c] = player;
        if (calculateWinner(tempBoard, boardSize, winCondition)) return [r, c];
    }
    // 3. Hard difficulty: more strategic moves
    if (difficulty === 'hard') {
        // Try to create a fork (two ways to win)
        for (const [r, c] of emptySquares) {
            const tempBoard = currentBoard.map(row => [...row]);
            tempBoard[r][c] = opponent;
            const nextEmpty = [];
            for (let i=0; i<boardSize; i++) for(let j=0; j<boardSize; j++) if(!tempBoard[i][j]) nextEmpty.push([i,j]);
            
            let winOpportunities = 0;
            for(const [r2, c2] of nextEmpty) {
                const tempBoard2 = tempBoard.map(row => [...row]);
                tempBoard2[r2][c2] = opponent;
                if(calculateWinner(tempBoard2, boardSize, winCondition)) winOpportunities++;
            }
            if(winOpportunities >= 2) return [r, c];
        }
    }
    // 4. Take center if available
    const center = Math.floor(boardSize / 2);
    if (!currentBoard[center][center]) return [center, center];
    
    // 5. Fallback to random move
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];

  }, [boardSize, winCondition, xIsNext, difficulty, calculateWinner]);

  useEffect(() => {
    handleReset(false, boardSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize]);
  
  useEffect(() => {
      if(board.length === 0) return; // Don't run on initial empty state
      const winnerCheck = calculateWinner(board, boardSize, winCondition);
      if (winnerCheck) {
          setWinnerInfo(winnerCheck);
      } else if (board.flat().every(Boolean)) {
          setIsDraw(true);
      }
  }, [board, boardSize, winCondition, calculateWinner]);

  useEffect(() => {
    if (gameMode === 'vs-computer' && !xIsNext && !winnerInfo && !isDraw) {
        const move = makeComputerMove(board);
        if (move) {
            setTimeout(() => {
                handleClick(move[0], move[1], true);
            }, 500);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, gameMode, board, winnerInfo, isDraw, makeComputerMove]);


  const handleClick = (row: number, col: number, isComputerMove = false) => {
    if (board[row][col] || winnerInfo) return;
    if (gameMode === 'vs-computer' && !xIsNext && !isComputerMove) return;

    const nextBoard = board.map(r => [...r]);
    nextBoard[row][col] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  const handleReset = (fullReset = false, newSize = 3) => {
    setBoardSize(newSize);
    setWinCondition(newSize === 3 ? 3 : (newSize === 5 ? 4 : 5));
    setBoard(createBoard(newSize));
    setXIsNext(true);
    setWinnerInfo(null);
    setIsDraw(false);
    if (fullReset) {
      setGameMode(null);
      setDifficulty(null);
    }
  };

  const renderStatus = () => {
    if (winnerInfo) return `برنده: بازیکن ${winnerInfo.winner}`;
    if (isDraw) return 'بازی مساوی شد!';
    if(gameMode === 'vs-computer') return xIsNext ? "نوبت شما (X)" : "نوبت ربات (O)...";
    return `نوبت بازیکن: ${xIsNext ? 'X' : 'O'}`;
  };
  
  const getStatusBadgeVariant = () => {
    if(winnerInfo?.winner === 'X') return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
    if(winnerInfo?.winner === 'O') return 'bg-pink-500/20 text-pink-700 dark:text-pink-400';
    if(isDraw) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    return 'default';
  };

  const ModeBadge = ({ mode }: { mode?: string }) => {
    if (!mode) return null;
    const badgeInfo = {
      'دو نفره': { icon: <Users className="w-3 h-3" />, class: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' },
      'مقابل سیستم': { icon: <BotIcon className="w-3 h-3" />, class: 'bg-purple-500/20 text-purple-700 dark:text-purple-400' },
    };
    const info = badgeInfo[mode as keyof typeof badgeInfo];
    if (!info) return null;
  
    return (
      <Badge variant="secondary" className={cn("absolute top-2 right-2 border-none text-xs px-1.5 py-0.5 h-auto", info.class)}>
        <span className="mr-1">{mode}</span>{info.icon}
      </Badge>
    );
  };

  if (!gameMode) {
      return (
          <CardContent className="flex flex-col items-center gap-4 pt-6">
              <h3 className="text-lg font-semibold text-foreground">حالت بازی را انتخاب کنید:</h3>
              <div className="flex gap-4">
                 <Button onClick={() => setGameMode('two-player')} className="h-12 text-base"><Users className="ml-2 w-5 h-5"/>دو نفره</Button>
                 <Button onClick={() => setGameMode('vs-computer')} variant="secondary" className="h-12 text-base"><BotIcon className="ml-2 w-5 h-5"/>مقابل ربات</Button>
              </div>
          </CardContent>
      )
  }

  if (gameMode === 'vs-computer' && !difficulty) {
    return (
        <CardContent className="flex flex-col items-center gap-4 pt-6">
            <h3 className="text-lg font-semibold text-foreground">درجه سختی ربات را انتخاب کنید:</h3>
            <div className="flex gap-4"><Button onClick={() => setDifficulty('easy')} className="h-12">آسان</Button><Button onClick={() => setDifficulty('medium')} className="h-12">متوسط</Button><Button onClick={() => setDifficulty('hard')} className="h-12">سخت</Button></div>
            <Button onClick={() => handleReset(true)} variant="link" className="text-muted-foreground">بازگشت</Button>
        </CardContent>
    )
  }

  return (
    <CardContent className="flex flex-col items-center gap-6 pt-6 relative">
      <ModeBadge mode={gameMode === 'vs-computer' ? 'مقابل سیستم' : 'دو نفره'} />
      <div className="flex flex-col items-center gap-4">
        <Badge variant="outline" className={cn("text-base font-semibold h-10 px-4", getStatusBadgeVariant())}>{renderStatus()}</Badge>
        <div className="flex items-center gap-2">
            <Label>اندازه برد:</Label>
            <div className='flex p-1 bg-muted rounded-lg'>
                {[3, 5, 7].map(size => (
                    <Button key={size} onClick={() => handleReset(false, size)} variant={boardSize === size ? 'default' : 'ghost'} size="sm">{size}x{size}</Button>
                ))}
            </div>
        </div>
      </div>
      
      <div className="relative">
        <div className={cn("grid gap-2", `grid-cols-${boardSize}`)}>
          {board.map((row, r) => row.map((cell, c) => (
            <Square key={`${r}-${c}`} value={cell} onSquareClick={() => handleClick(r, c)} isWinnerSquare={!!winnerInfo?.line.find(([wr, wc]) => wr === r && wc === c)} />
          )))}
        </div>
        {winnerInfo && (
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox={`0 0 ${boardSize * 10} ${boardSize * 10}`}>
                <line
                    x1={winnerInfo.line[0][1] * 10 + 5}
                    y1={winnerInfo.line[0][0] * 10 + 5}
                    x2={winnerInfo.line[winnerInfo.line.length-1][1] * 10 + 5}
                    y2={winnerInfo.line[winnerInfo.line.length-1][0] * 10 + 5}
                    className="stroke-red-500/80"
                    strokeWidth="1"
                    strokeLinecap="round"
                    style={{ animation: 'draw-line 0.5s ease-out forwards' }}
                />
            </svg>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => handleReset(false, boardSize)} variant="outline"><Redo className="ml-2 h-4 w-4" />بازی مجدد</Button>
        <Button onClick={() => handleReset(true)} variant="ghost" className="text-muted-foreground">تغییر حالت</Button>
      </div>
       <style>{`
        @keyframes draw-line { from { stroke-dasharray: 0, 1000; } to { stroke-dasharray: 1000, 1000; } }
      `}</style>
    </CardContent>
  );
}
