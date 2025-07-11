'use client';
import { Button } from '@/components/ui/button';

export default function CopyTokenButton({
  token,
  className,
}: {
  token: string;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      onClick={() => navigator.clipboard.writeText(token)}
      className={className}
    >
      Copy Token
    </Button>
  );
}
