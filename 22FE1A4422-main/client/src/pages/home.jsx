import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  Container, Paper, Typography, Grid, TextField, Button, Alert,
  Table, TableBody, TableRow, TableCell, TableHead
} from "@mui/material";

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [validity, setValidity] = useState("");
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getUrls().then(setLinks);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.shortenUrl({ url, validity: Number(validity) || undefined, code });
      setLinks(await api.getUrls());
      setUrl("");
      setCode("");
      setValidity("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>🔗 URL Shortener (Frontend Only)</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Long URL" fullWidth value={url} onChange={(e) => setUrl(e.target.value)} required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Validity (minutes)" fullWidth value={validity} onChange={(e) => setValidity(e.target.value)} placeholder="30" />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Custom Shortcode" fullWidth value={code} onChange={(e) => setCode(e.target.value)} placeholder="abc123" />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Shorten</Button>
            </Grid>
          </Grid>
        </form>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Typography variant="h6" sx={{ mt: 4 }}>Saved Links</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Expires</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((l) => (
              <TableRow key={l.code}>
                <TableCell>{l.code}</TableCell>
                <TableCell><a href={l.shortUrl}>{l.shortUrl}</a></TableCell>
                <TableCell>{l.url}</TableCell>
                <TableCell>{l.clicks}</TableCell>
                <TableCell>{new Date(l.expiresAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
