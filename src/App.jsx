import { PhantomProvider, usePhantom } from './contexts/PhantomProvider';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { connected } = usePhantom();
  return connected ? <Dashboard /> : <Landing />;
};

const App = () => {
  return (
    <PhantomProvider>
      <AppContent />
    </PhantomProvider>
  );
};

export default App;
