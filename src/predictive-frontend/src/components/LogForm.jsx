import React, { useState } from 'react';
import { TextField, Button, Autocomplete, Box } from '@mui/material';
import axios from 'axios';

// Option arrays (populate these from your encoding!)
const nodeOptions = [0, 1, 2, 3, 17, 18, 19];
const componentOptions = [1, 4, 6, 7];
const stateOptions = [11, 16, 20, 22];
const eventIdOptions = [3, 36, 55, 300];
const eventTemplateOptions = [3, 17, 19, 300];

export default function LogForm({ onResult }) {
  const [form, setForm] = useState({
    Node_enc: 0,
    Component_enc: 1,
    State_enc: 16,
    EventId_enc: 3,
    EventTemplate_enc: 3,
    hour: 11,
    dayofweek: 1
  });

  const handleChange = (field, value) => setForm({...form, [field]: value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://127.0.0.1:8000/predict', form);
    onResult(res.data.prediction === 1 ? "Anomaly Detected" : "Normal Event");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ m: 1 }}>
      <Autocomplete options={nodeOptions} value={form.Node_enc} onChange={(_, v) => handleChange('Node_enc', v)}
        renderInput={(p) => <TextField {...p} label="Node" sx={{ m: 1 }} />} />
      <Autocomplete options={componentOptions} value={form.Component_enc} onChange={(_, v) => handleChange('Component_enc', v)}
        renderInput={(p) => <TextField {...p} label="Component" sx={{ m: 1 }} />} />
      <Autocomplete options={stateOptions} value={form.State_enc} onChange={(_, v) => handleChange('State_enc', v)}
        renderInput={(p) => <TextField {...p} label="State" sx={{ m: 1 }} />} />
      <Autocomplete options={eventIdOptions} value={form.EventId_enc} onChange={(_, v) => handleChange('EventId_enc', v)}
        renderInput={(p) => <TextField {...p} label="Event ID" sx={{ m: 1 }} />} />
      <Autocomplete options={eventTemplateOptions} value={form.EventTemplate_enc} onChange={(_, v) => handleChange('EventTemplate_enc', v)}
        renderInput={(p) => <TextField {...p} label="Event Template" sx={{ m: 1 }} />} />
      <TextField label="hour" type="number" sx={{ m: 1 }} value={form.hour} onChange={e => handleChange('hour', parseInt(e.target.value))} />
      <TextField label="dayofweek" type="number" sx={{ m: 1 }} value={form.dayofweek} onChange={e => handleChange('dayofweek', parseInt(e.target.value))} />
      <Button sx={{ m: 1 }} type="submit" variant="contained">Predict</Button>
    </Box>
  );
}
