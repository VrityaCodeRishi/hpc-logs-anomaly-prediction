import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Grid,
  Input,
  Paper,
  Tooltip,
  InputAdornment,
  IconButton
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

function App() {
  const [logLine, setLogLine] = useState("");
  const [logFile, setLogFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleLogLineChange = (e) => setLogLine(e.target.value);
  const handleFileChange = (e) => {
    if (e.target.files[0]) setLogFile(e.target.files[0]);
  };
  const handleRemoveFile = () => setLogFile(null);
  const handlePasteClick = async () => {
    if (navigator.clipboard) {
      const text = await navigator.clipboard.readText();
      setLogLine((cur) => (cur ? cur + "\n" + text : text));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setResult(null);
  try {
    const response = await fetch("http://localhost:8000/predict_logline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logLine }),
    });
    const data = await response.json();
    if (data.error) {
      setResult(`Error: ${data.error}`);
    } else if (data.prediction === 1) {
      setResult("🚨 Anomaly detected");
    } else if (data.prediction === 0) {
      setResult("✅ No anomaly detected");
    } else {
      setResult("Prediction: " + data.prediction);
    }
  } catch (err) {
    setResult("Error during prediction");
  }
};


  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        <Card
          elevation={10}
          sx={{
            borderRadius: 7,
            boxShadow: "0 8px 36px rgb(30 33 38 / 11%)",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <StorageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography
                variant="h4"
                align="center"
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                Predictive Maintenance <br /> Anomaly Detection
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ mb: 2, color: "#636e72" }}
            >
              Paste one or more <b>raw HPC log lines</b> <i>or</i> upload your <b>HPC log file</b> (CSV format) from the dataset.
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="flex-start" justifyContent="center">
                <Grid item xs={12}>
                  <TextField
                    label="Paste Log Lines"
                    multiline
                    minRows={7}
                    variant="outlined"
                    fullWidth
                    value={logLine}
                    onChange={handleLogLineChange}
                    placeholder={`Example (paste multi-line logs):
2023-10-15 12:34:10 [INFO] Node01 ComponentX State=OK
2023-10-15 12:35:01 [WARN] Node02 ComponentY State=Warning`}
                    InputLabelProps={{
                      sx: {
                        color: '#b3bac1',
                        '&.Mui-focused': {
                          color: '#53aafe',
                        },
                      },
                    }}
                    InputProps={{
                      sx: {
                        fontFamily: "'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace",
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        backgroundColor: '#222',
                        color: '#e6fff7', // much lighter text
                        borderRadius: 2,
                        padding: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#444',
                          borderWidth: 2,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#53aafe',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#53aafe',
                          borderWidth: 2,
                        },
                        '& textarea': {
                          '&::placeholder': {
                            color: '#b3bac1',
                            opacity: 1,
                          },
                          '&::-webkit-scrollbar': {
                            width: '10px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: '#2d2d30',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#424245',
                            borderRadius: '4px',
                            '&:hover': {
                              background: '#4e4e50',
                            },
                          },
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end" sx={{ position: 'absolute', right: 8, top: 8 }}>
                          <Tooltip title="Paste from clipboard" arrow placement="left">
                            <IconButton
                              onClick={handlePasteClick}
                              edge="end"
                              sx={{
                                color: '#53aafe',
                                backgroundColor: 'rgba(83, 170, 254, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(83, 170, 254, 0.2)',
                                },
                              }}
                            >
                              <ContentPasteIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    helperText="You can paste or type multiple HPC log lines (will auto-detect for batch prediction)"
                    FormHelperTextProps={{
                      sx: {
                        color: '#b3bac1',
                        fontSize: '0.9rem',
                        marginTop: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}><Divider sx={{ fontWeight: 700, color: "#636e72" }}>OR</Divider></Grid>
                <Grid item xs={12} sm={10}>
                  <Paper
                    elevation={logFile ? 2 : 0}
                    sx={{
                      p: 2,
                      bgcolor: "#eaf6fb",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      borderRadius: 4,
                      mb: 1,
                    }}
                  >
                    <label htmlFor="hpc-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        size="large"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          bgcolor: "#f0f4fa",
                          borderRadius: 3,
                          ":hover": { bgcolor: "#d0e6fc" },
                        }}
                      >
                        Upload HPC Log File (CSV)
                      </Button>
                    </label>
                    <Input
                      id="hpc-upload"
                      type="file"
                      inputProps={{ accept: ".csv" }}
                      onChange={handleFileChange}
                      sx={{ display: "none" }}
                    />
                    <Typography variant="body2" color="textSecondary" align="center">
                      Only CSV files exported from HPC (e.g. <a href="https://github.com/logpai/loghub/blob/master/HPC/HPC_2k.log_structured.csv" target="_blank" rel="noopener noreferrer">sample dataset</a>)
                    </Typography>
                    {logFile && (
                      <Box mt={2}>
                        <Typography variant="body2" color="primary">
                          Selected: {logFile.name} ({(logFile.size / 1024).toFixed(1)} KB)
                        </Typography>
                        <Button size="small" color="error" onClick={handleRemoveFile}>
                          Remove
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 3,
                      fontWeight: 700,
                      bgcolor: "#0984e3",
                      fontSize: "1rem",
                      py: 2,
                    }}
                    disabled={!logLine && !logFile}
                  >
                    Predict
                  </Button>
                </Grid>
              </Grid>
            </form>
            {result && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="secondary"
                  fontWeight={600}
                >
                  {result}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default App;
