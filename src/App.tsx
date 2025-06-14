import { useState } from 'react';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/Toast';
import { ToastProvider, useToastContext } from './contexts/ToastContext';
import { HomeView } from './features/home/HomeView';
import { AssistantView } from './features/assistant/AssistantView';
import { LiturgyView } from './features/liturgy/LiturgyView';
import { RepertoireList } from './features/repertoire/RepertoireList';
import { SearchView } from './features/search/SearchView';
import { PlanningView } from './features/planning/PlanningView';
import { ChordsView } from './features/chords/ChordsView';
import { LibraryView } from './features/library/LibraryView';
import { SettingsView } from './features/settings/SettingsView';
import { MoreMenuView } from './features/more/MoreMenuView';

type View = 'home' | 'assistant' | 'liturgy' | 'repertoire' | 'search' | 'planning' | 'chords' | 'library' | 'settings' | 'more';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { toasts, removeToast } = useToastContext();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'assistant':
        return <AssistantView />;
      case 'liturgy':
        return <LiturgyView />;
      case 'repertoire':
        return <RepertoireList />;
      case 'search':
        return <SearchView />;
      case 'planning':
        return <PlanningView />;
      case 'chords':
        return <ChordsView />;
      case 'library':
        return <LibraryView />;
      case 'settings':
        return <SettingsView />;
      case 'more':
        return <MoreMenuView onNavigate={handleNavigate} />;
      default:
        return <HomeView />;
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  return (
    <>
      <Layout currentView={currentView} onNavigate={handleNavigate}>
        {renderView()}
      </Layout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;