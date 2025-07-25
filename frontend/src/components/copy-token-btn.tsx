'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export default function CopyTokenButton({ className }: { className?: string }) {
  const copyAccessToken = async () => {
    const { getAccessToken } = authClient;
    try {
      const token = await getAccessToken({ providerId: '2' });
      if (!token?.data?.accessToken) {
        throw new Error('No access token available');
      }
      navigator.clipboard.writeText(token.data.accessToken);
    } catch {
      alert('Failed to copy access token');
    }
  };

  return (
    <Button variant="outline" onClick={copyAccessToken} className={className}>
      Copy Token
    </Button>
  );
}
