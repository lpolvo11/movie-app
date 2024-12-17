import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { ThemeProvider, createTheme, Button, CssBaseline, TextField, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

function App() {
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  const api_key = 'c032462e';

  const fetchMovies = async (api_key) => {
    if (value.length > 2) {
      setIsLoading(true);
    }
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${api_key}&s=${value}`);
      const data = await response.data;
      setData(data);
    } catch (e) {
      console.log(`Error: ${e.message}`);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fetchMovies(api_key);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <Typography variant="h4">Loading...</Typography>
      </div>
    );
  }

  return (
    <div className={`App ${isDarkMode ? 'dark' : ''}`}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ padding: 4 }}>
          {/* Dark Mode Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <Button variant="contained" onClick={toggleDarkMode} fullWidth>
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>
          </div>

          {/* Search Input and Button */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                fullWidth
                label="Find Movies & TV Shows..."
                variant="outlined"
                onChange={handleValueChange}
                value={value}
                onKeyPress={(e) => e.key === 'Enter' && handleClick()}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleClick}>
                Search
              </Button>
            </Grid>
          </Grid>

          {/* Movie Results */}
          <div style={{ marginTop: '20px' }}>
            {data.Search && data.Search.length > 0 ? (
              <Grid container spacing={3} justifyContent="center">
                {data.Search.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.imdbID}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.Poster}
                        alt={item.Title}
                        sx={{ cursor: 'pointer' }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {item.Title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Year: {item.Year} | Type: {item.Type}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="h6" align="center" color="text.secondary">
                No movies found. Try searching for something else!
              </Typography>
            )}
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
