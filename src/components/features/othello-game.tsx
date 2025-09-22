"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, Trophy, Info, Bot as BotIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

const BOARD_SIZE = 8;
type Player = 'black' | 'white';
type CellState = Player | null;
type Board = CellState[][];
type GameMode = 'two-player' | 'vs-computer';
type Difficulty = 'easy' | 'medium' | 'hard';

const createInitialBoard = (): Board => {
  const board: Board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
};

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],         [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const pieceWeights = [
    [120, -20, 20,  5,  5, 20, -20, 120],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [ 20,  -5, 15,  3,  3, 15,  -5,  20],
    [  5,  -5,  3,  3,  3,  3,  -5,   5],
    [  5,  -5,  3,  3,  3,  3,  -5,   5],
    [ 20,  -5, 15,  3,  3, 15,  -5,  20],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [120, -20, 20,  5,  5, 20, -20, 120]
];

export default function OthelloGame() {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const opponent = useMemo(() => (currentPlayer === 'black' ? 'white' : 'black'), [currentPlayer]);

  const getValidMoves = useCallback((boardState: Board, player: Player): [number, number][] => {
    const moves: [number, number][] = [];
    const opp = player === 'black' ? 'white' : 'black';

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (boardState[r][c] !== null) continue;

        let isValidMove = false;
        for (const [dr, dc] of directions) {
          let r_ = r + dr;
          let c_ = c + dc;
          let hasOpponentPiece = false;

          while (r_ >= 0 && r_ < BOARD_SIZE && c_ >= 0 && c_ < BOARD_SIZE) {
            if (boardState[r_][c_] === opp) {
              hasOpponentPiece = true;
            } else if (boardState[r_][c_] === player) {
              if (hasOpponentPiece) isValidMove = true;
              break;
            } else break;
            r_ += dr;
            c_ += dc;
          }
          if (isValidMove) break;
        }
        if (isValidMove) moves.push([r, c]);
      }
    }
    return moves;
  }, []);

  const validMoves = useMemo(() => getValidMoves(board, currentPlayer), [board, currentPlayer, getValidMoves]);

  const calculateScores = (boardState: Board) => {
    let black = 0, white = 0;
    boardState.flat().forEach(cell => {
      if (cell === 'black') black++;
      if (cell === 'white') white++;
    });
    return { black, white };
  };
  
    const makeMove = (currentBoard: Board, move: [number, number], player: Player) => {
      const [row, col] = move;
      const newBoard = currentBoard.map(r => [...r]);
      const piecesToFlip: [number, number][] = [];
      const opp = player === 'black' ? 'white' : 'black';

      for (const [dr, dc] of directions) {
          let r = row + dr, c = col + dc;
          const lineToFlip = [];
          while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
              if (newBoard[r][c] === opp) lineToFlip.push([r, c]);
              else if (newBoard[r][c] === player) { piecesToFlip.push(...lineToFlip); break; } 
              else break;
              r += dr; c += dc;
          }
      }
      newBoard[row][col] = player;
      piecesToFlip.forEach(([r, c]) => { newBoard[r][c] = player; });
      return { newBoard };
  }


  const checkGameOver = useCallback((boardState: Board) => {
    const blackMoves = getValidMoves(boardState, 'black');
    const whiteMoves = getValidMoves(boardState, 'white');

    if (blackMoves.length === 0 && whiteMoves.length === 0) {
      setGameOver(true);
      const finalScores = calculateScores(boardState);
      if (finalScores.black > finalScores.white) setWinner('black');
      else if (finalScores.white > finalScores.black) setWinner('white');
      else setWinner('draw');
    }
  }, [getValidMoves]);
  
  useEffect(() => {
    checkGameOver(board);
  }, [board, checkGameOver]);
  
  const makeComputerMove = useCallback(() => {
    const computerValidMoves = getValidMoves(board, 'white');
    if (computerValidMoves.length === 0) {
        if(getValidMoves(board, 'black').length > 0) {
            setCurrentPlayer('black');
        }
        return;
    }

    let bestMove: [number, number] | null = null;

    if (difficulty === 'easy') {
        bestMove = computerValidMoves[Math.floor(Math.random() * computerValidMoves.length)];
    } else { // Medium and Hard logic
        let maxScore = -Infinity;
        for (const move of computerValidMoves) {
            const [r, c] = move;
            let score = pieceWeights[r][c];
            
            if (difficulty === 'hard') {
                const tempBoard = makeMove(board, move, 'white').newBoard;
                const playerNextMoves = getValidMoves(tempBoard, 'black');
                score -= playerNextMoves.length * 5;
            }

            if (score > maxScore) {
                maxScore = score;
                bestMove = move;
            }
        }
    }

    if (bestMove) {
        const [row, col] = bestMove;
        setTimeout(() => {
             const { newBoard } = makeMove(board, [row, col], 'white');
            setBoard(newBoard);
            setScores(calculateScores(newBoard));
            const opponentHasMoves = getValidMoves(newBoard, 'black').length > 0;
            if (opponentHasMoves) {
              setCurrentPlayer('black');
            } else if (getValidMoves(newBoard, 'white').length === 0) {
              checkGameOver(newBoard);
            }
        }, 500);
    }
}, [board, difficulty, getValidMoves]);

  useEffect(() => {
    if (gameMode === 'vs-computer' && currentPlayer === 'white' && !gameOver) {
        makeComputerMove();
    }
  }, [currentPlayer, gameOver, gameMode, makeComputerMove]);


  const handleCellClick = (row: number, col: number) => {
    if (gameOver || !validMoves.some(([r, c]) => r === row && c === col)) return;
    if (gameMode === 'vs-computer' && currentPlayer === 'white') return;

    const { newBoard } = makeMove(board, [row, col], currentPlayer);
    
    setBoard(newBoard);
    setScores(calculateScores(newBoard));

    const opponentHasMoves = getValidMoves(newBoard, opponent).length > 0;
    if (opponentHasMoves) {
      setCurrentPlayer(opponent);
    } else if (getValidMoves(newBoard, currentPlayer).length === 0) {
      checkGameOver(newBoard);
    }
  };

  const startNewGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('black');
    setScores({ black: 2, white: 2 });
    setGameOver(false);
    setWinner(null);
  };
  
  const handleFullReset = (modeChange = false) => {
    startNewGame();
    if(modeChange) {
        setGameMode(null);
        setDifficulty(null);
    }
  }

  const getStatusText = () => {
      if (winner) {
          if(winner === 'draw') return "بازی مساوی شد!";
          const winnerName = gameMode === 'vs-computer' ? (winner === 'black' ? 'شما' : 'ربات') : `بازیکن ${winner === 'black' ? 'سیاه' : 'سفید'}`;
          return `برنده: ${winnerName}`;
      }
      if (gameMode === 'vs-computer') {
          return currentPlayer === 'black' ? 'نوبت شما' : 'نوبت ربات...';
      }
      return `نوبت بازیکن: ${currentPlayer === 'black' ? 'سیاه' : 'سفید'}`;
  }
  
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
            <div className="flex gap-4">
               <Button onClick={() => setDifficulty('easy')} className="h-12">آسان</Button>
               <Button onClick={() => setDifficulty('medium')} className="h-12">متوسط</Button>
               <Button onClick={() => setDifficulty('hard')} className="h-12">سخت</Button>
            </div>
            <Button onClick={() => handleFullReset(true)} variant="link" className="text-muted-foreground">بازگشت</Button>
        </CardContent>
    )
  }


  return (
    <CardContent className="flex flex-col items-center gap-4">
       <div className="flex justify-around items-center w-full max-w-sm bg-muted/50 p-3 rounded-xl shadow-inner">
            <div className="text-center font-semibold text-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-black border-2 border-white"/>
                <span>{(gameMode === 'vs-computer' ? 'شما' : 'سیاه')}: {scores.black.toLocaleString('fa-IR')}</span>
            </div>
            <Badge variant="outline" className="text-base font-semibold px-4 py-1">
                {getStatusText()}
            </Badge>
            <div className="text-center font-semibold text-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-black"/>
                <span>{(gameMode === 'vs-computer' ? 'ربات' : 'سفید')}: {scores.white.toLocaleString('fa-IR')}</span>
            </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30 max-w-sm text-center">
          <Info className="w-5 h-5 shrink-0" />
          <span>
             مهره‌های حریف را بین مهره‌های خود محاصره کنید تا به رنگ شما درآیند. بازیکنی که در پایان بیشترین مهره را داشته باشد، برنده است.
          </span>
        </div>
        
         {gameMode === 'vs-computer' && (
          <div className="flex flex-col items-center gap-2">
            <Label>درجه سختی</Label>
            <div className="flex p-1 bg-muted rounded-lg">
                 {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                     <Button key={d} variant={difficulty === d ? 'default' : 'ghost'} size="sm" onClick={() => setDifficulty(d)}>
                         {d === 'easy' ? 'آسان' : d === 'medium' ? 'متوسط' : 'سخت'}
                     </Button>
                 ))}
            </div>
          </div>
      )}

      <div className="p-2 bg-green-800 rounded-lg shadow-xl">
        <div className="grid grid-cols-8 gap-1">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isHint = validMoves.some(([vr, vc]) => vr === r && vc === c);
              return (
                <div
                  key={`${r}-${c}`}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 flex items-center justify-center cursor-pointer rounded"
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell ? (
                    <div className={cn("w-5/6 h-5/6 rounded-full shadow-md transition-transform duration-300", 
                        cell === 'black' ? 'bg-black' : 'bg-white')} />
                  ) : isHint && !gameOver && !(gameMode === 'vs-computer' && currentPlayer === 'white') ? (
                    <div className={cn("w-1/3 h-1/3 rounded-full opacity-50",
                        currentPlayer === 'black' ? 'bg-black' : 'bg-white'
                    )} />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

       {gameOver && (
        <div className="text-center space-y-2">
           <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce"/>
           <p className="text-xl font-bold">بازی تمام شد!</p>
        </div>
      )}
      
      <div className='flex items-center gap-2'>
        <Button onClick={startNewGame} variant="outline">
            <Redo className="ml-2 h-4 w-4" />
            بازی جدید
        </Button>
         <Button onClick={() => handleFullReset(true)} variant="ghost" className="text-muted-foreground">
            تغییر حالت
        </Button>
      </div>

    </CardContent>
  );
}
