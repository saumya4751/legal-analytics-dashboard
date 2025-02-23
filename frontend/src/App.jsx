import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/layout';
import Dashboard from './components/dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Dashboard />
      </Layout>
    </ThemeProvider>
  );
}

export default App;