import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { LogoutButton } from './LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/supabase/auth';
import Link from 'next/link';
import Image from 'next/image';
import HeaderNav from './HeaderNav';

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const isAdmin = await isCurrentUserAdmin()

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <Link
            href={'/staff'}
            style={{
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none'
            }}>
            <Image src='/logo.png' alt="Logo" width={32} height={24} />
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
              Test App
            </Typography>
          </Link>

          <HeaderNav isAdmin={isAdmin} />

          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}