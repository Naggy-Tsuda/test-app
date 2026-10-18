import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { LogoutButton } from './LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/supabase/auth';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Image from 'next/image';

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
          <Stack direction="row" sx={{ mr: 2 }}>
            <Button href="/staff" color="inherit">
              Staff
            </Button>
            {isAdmin && (
              <Button href="/users" color="inherit">
                Users
              </Button>
            )}
          </Stack>
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}