import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { api } from './services/api';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';

export default function RedirectPage() {
  const { code } = useParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function lookup() {
      try {
        const { data } = await api.get(`/api/lookup/${code}`);
        window.location.replace(data.longUrl);
      } catch (err) {
        setError(err?.response?.data?.error || 'Invalid link');
        setStatus('error');
      }
    }
    lookup();
  }, [code]);

  if (status === 'loading') {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Redirecting…</Typography>
      </Container>
    );
  }
  return (
    <Container sx={{ mt: 6 }}>
      <Alert severity="error">{error}</Alert>
      <Navigate to="/" />
    </Container>
  );
}
