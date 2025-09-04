import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { api } from "../services/api";
import { Container, Typography, Alert } from "@mui/material";

export default function RedirectPage() {
  const { code } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    api.visitShortcode(code)
      .then((longUrl) => {
        window.location.href = longUrl;
      })
      .catch((err) => setError(err.message));
  }, [code]);

  if (error) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Typography sx={{ mt: 2 }}>Redirect failed</Typography>
        <Navigate to="/" />
      </Container>
    );
  }

  return <Typography sx={{ mt: 6, textAlign: "center" }}>Redirecting…</Typography>;
}
