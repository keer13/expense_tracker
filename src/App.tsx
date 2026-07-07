import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { AppRoutes } from './router/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <AppRoutes />
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
