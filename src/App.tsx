import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppContent from './components/App/App';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
