
"use client";

import { CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function EscapeFromTheBill() {
  return (
    <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-24 gap-4">
          <Construction className="w-12 h-12" />
          <p>این ابزار در حال توسعه است و به‌زودی فعال خواهد شد.</p>
        </div>
    </CardContent>
  );
}

    