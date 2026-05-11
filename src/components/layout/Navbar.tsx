import { getCurrentUser, getUserDisplayName, getUserAvatarConfig } from '@/lib/auth/helpers';
import { NavbarClient } from './NavbarClient';

/**
 * Server-side Navbar wrapper.
 * Fetches current user dari Supabase, lalu pass ke NavbarClient.
 */
export async function Navbar() {
  const user = await getCurrentUser();

  const userData = user
    ? {
        displayName: getUserDisplayName(user),
        email: user.email || '',
        avatarConfig: getUserAvatarConfig(user),
      }
    : null;

  return <NavbarClient user={userData} />;
}
