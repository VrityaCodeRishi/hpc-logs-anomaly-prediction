import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Button } from '@mui/material';

export default function BatchUpload({ onResults }) {
  const [csv, setCsv] = useState();
  const handleUpload = (e) => setCsv(e.target.files[0]);
  const handleParse = () => {
    Papa.parse(csv, { header: true, complete: async (results) => {
      const predictions = [];
      for (const row of results.data) {
        const res = await axios.post('http://127.0.0.1:8000/predict', row);
        predictions.push(res.data.prediction);
      }
      onResults(predictions);
    }});
  };

  return (
    <div style={{ marginTop: 20 }}>
      <input type="file" accept=".csv" onChange={handleUpload} />
      <Button variant="outlined" onClick={handleParse}>Predict Batch</Button>
    </div>
  );
}
