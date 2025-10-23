import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

export default function LogLinePredict({ onResult }) {
  const [logLine, setLogLine] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/predict_logline', { logLine });
      onResult(res.data.prediction === 1 ? "Anomaly Detected" : "Normal Event");
    } catch (e) {
      onResult("Error: Could not predict (check backend/log format)");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Paste Log Line"
        value={logLine}
        onChange={e => setLogLine(e.target.value)}
        multiline
        rows={3}
        fullWidth
        sx={{ my: 2 }}
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </Button>
    </form>
  );
}
