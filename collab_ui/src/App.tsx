import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProblemAreasPage } from './pages/ProblemAreasPage';
import { DetailPage } from './pages/DetailPage';
import { api } from './utils/api';
import { subscribeToSession, unsubscribeFromSession, onEntryUpdated, onParticipantJoined } from './utils/realtime';
import type { UserInfo, StorageData, EntryData } from './types';
import type { ParticipantJoinedPayload } from './utils/realtime';
import './App.css';

const DEFAULT_SESSION = 'ONEHEALTH-MAIN';

function DetailPageWrapper({
  userInfo,
  sessionCode,
  sessionData,
  participantCount,
  onBack,
  showSummary,
  onOpenSummary,
  onCloseSummary,
  setSelectedCategoryIndex,
  onSaveEntry,
}: {
  userInfo: UserInfo;
  sessionCode: string;
  sessionData: StorageData;
  participantCount: number;
  onBack: () => void;
  showSummary: boolean;
  onOpenSummary: () => void;
  onCloseSummary: () => void;
  setSelectedCategoryIndex: (index: number) => void;
  onSaveEntry: (catId: string, subIndex: number, entry: EntryData) => Promise<void>;
}) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryIndex = categoryId ? parseInt(categoryId) : 0;

  useEffect(() => {
    setSelectedCategoryIndex(categoryIndex);
  }, [categoryIndex, setSelectedCategoryIndex]);

  return (
    <DetailPage
      userInfo={userInfo}
      sessionCode={sessionCode}
      sessionData={sessionData}
      participantCount={participantCount}
      categoryIndex={categoryIndex}
      onBack={onBack}
      showSummary={showSummary}
      onOpenSummary={onOpenSummary}
      onCloseSummary={onCloseSummary}
      onSaveEntry={onSaveEntry}
    />
  );
}

function AppRoutes() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [sessionCode, setSessionCode] = useState<string>('');
  const [sessionData, setSessionData] = useState<StorageData>({});
  const [_selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount: verify Frappe login then auto-join shared workspace
  useEffect(() => {
    api.getCurrentUser()
      .then((u) => {
        setUserInfo({ name: u.name, email: u.email, org: '' });
        return api.joinSession(DEFAULT_SESSION, '').then(() => {
          setSessionCode(DEFAULT_SESSION);
          setLoading(false);
        });
      })
      .catch(() => {
        window.location.href = '/login?redirect-to=/krcs-x-ifaw';
      });
  }, []);

  // When sessionCode set: load entries + subscribe realtime
  useEffect(() => {
    if (!sessionCode) return;

    api.getSessionEntries(sessionCode).then(setSessionData);
    subscribeToSession(sessionCode);

    const offEntry = onEntryUpdated(({ cat_id, sub_index, entry }) => {
      setSessionData((prev) => ({
        ...prev,
        [cat_id]: { ...prev[cat_id], [String(sub_index)]: entry },
      }));
    });

    const offParticipant = onParticipantJoined((_data: ParticipantJoinedPayload) => {
      setParticipantCount((n) => n + 1);
    });

    return () => {
      offEntry();
      offParticipant();
      unsubscribeFromSession(sessionCode);
    };
  }, [sessionCode]);

  const handleEnterApp = async (org: string) => {
    await api.joinSession(DEFAULT_SESSION, org);
    setUserInfo((prev) => prev ? { ...prev, org } : { name: '', email: '', org });
    navigate('/dashboard');
  };

  const handleSaveEntry = async (catId: string, subIndex: number, entry: EntryData) => {
    setSessionData((prev) => ({
      ...prev,
      [catId]: { ...prev[catId], [String(subIndex)]: entry },
    }));
    await api.saveEntry(sessionCode, catId, subIndex, entry);
  };

  const handleCategoryClick = (index: number) => {
    setSelectedCategoryIndex(index);
    navigate(`/detail/${index}`);
  };

  const handleBackToGrid = () => {
    navigate('/problem-areas');
    setSelectedCategoryIndex(null);
  };

  const handleNavigateToCategory = (index: number) => {
    setSelectedCategoryIndex(index);
    navigate(`/detail/${index}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--deep)', fontSize: '1rem', opacity: 0.6 }}>Loading…</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            onEnter={handleEnterApp}
            frappeUser={userInfo ? { name: userInfo.name, email: userInfo.email } : undefined}
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          userInfo && sessionCode ? (
            <DashboardPage
              userInfo={userInfo}
              sessionCode={sessionCode}
              sessionData={sessionData}
              participantCount={participantCount}
              showSummary={showSummary}
              onOpenSummary={() => setShowSummary(true)}
              onCloseSummary={() => setShowSummary(false)}
              onNavigateToCategory={handleNavigateToCategory}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/problem-areas"
        element={
          userInfo && sessionCode ? (
            <ProblemAreasPage
              userInfo={userInfo}
              sessionCode={sessionCode}
              sessionData={sessionData}
              participantCount={participantCount}
              onCategoryClick={handleCategoryClick}
              showSummary={showSummary}
              onOpenSummary={() => setShowSummary(true)}
              onCloseSummary={() => setShowSummary(false)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/overview"
        element={
          userInfo && sessionCode ? (
            <OverviewPage
              userInfo={userInfo}
              sessionCode={sessionCode}
              sessionData={sessionData}
              participantCount={participantCount}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/detail/:categoryId"
        element={
          userInfo && sessionCode ? (
            <DetailPageWrapper
              userInfo={userInfo}
              sessionCode={sessionCode}
              sessionData={sessionData}
              participantCount={participantCount}
              onBack={handleBackToGrid}
              showSummary={showSummary}
              onOpenSummary={() => setShowSummary(true)}
              onCloseSummary={() => setShowSummary(false)}
              setSelectedCategoryIndex={setSelectedCategoryIndex}
              onSaveEntry={handleSaveEntry}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/krcs-x-ifaw">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
