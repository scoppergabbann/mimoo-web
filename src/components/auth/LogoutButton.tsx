'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/Button';
import { LogOutIcon } from '@/components/ui/AuthIcons';

interface LogoutButtonProps {
  label: string;
}

export function LogoutButton({ label }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <Button
      variant="outline"
      size="md"
      onClick={handleLogout}
      isLoading={isPending}
      leftIcon={!isPending && <LogOutIcon className="w-4 h-4" />}
    >
      {label}
    </Button>
  );
}
