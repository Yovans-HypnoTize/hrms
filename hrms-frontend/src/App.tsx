import './App.css';
import AppNavigate from './AppNavigate'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppStateProvider } from './common/AppState';

function App() {
  return (
    <div className="App">
      <AppStateProvider>
        <AppNavigate />
      </AppStateProvider>
    </div>
  );
}

export default App;
