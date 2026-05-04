import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProblemAreasPage } from './pages/ProblemAreasPage';
import { DetailPage } from './pages/DetailPage';
import { generateSessionCode } from './utils/storage';
import type { UserInfo } from './types';
import './App.css';

// Wrapper to extract categoryId from URL params
function DetailPageWrapper({
  userInfo,
  sessionCode,
  onBack,
  showSummary,
  onOpenSummary,
  onCloseSummary,
  setSelectedCategoryIndex
}: {
  userInfo: UserInfo;
  sessionCode: string;
  onBack: () => void;
  showSummary: boolean;
  onOpenSummary: () => void;
  onCloseSummary: () => void;
  setSelectedCategoryIndex: (index: number) => void;
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
      categoryIndex={categoryIndex}
      onBack={onBack}
      showSummary={showSummary}
      onOpenSummary={onOpenSummary}
      onCloseSummary={onCloseSummary}
    />
  );
}

function AppRoutes() {
  // Initialize state from localStorage
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem('currentUserInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [sessionCode, setSessionCode] = useState<string>(() => {
    return localStorage.getItem('currentSessionCode') || '';
  });
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(() => {
    const saved = localStorage.getItem('selectedCategoryIndex');
    return saved ? parseInt(saved) : null;
  });
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('currentUserInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('currentUserInfo');
    }
  }, [userInfo]);

  useEffect(() => {
    if (sessionCode) {
      localStorage.setItem('currentSessionCode', sessionCode);
    } else {
      localStorage.removeItem('currentSessionCode');
    }
  }, [sessionCode]);

  useEffect(() => {
    if (selectedCategoryIndex !== null) {
      localStorage.setItem('selectedCategoryIndex', selectedCategoryIndex.toString());
    } else {
      localStorage.removeItem('selectedCategoryIndex');
    }
  }, [selectedCategoryIndex]);

  const handleEnterApp = (info: UserInfo) => {
    setUserInfo(info);
    const newSessionCode = generateSessionCode();
    setSessionCode(newSessionCode);
    navigate('/dashboard');
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

  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<HomePage onEnter={handleEnterApp} />} />

      {/* Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          userInfo ? (
            <DashboardPage
              userInfo={userInfo}
              sessionCode={sessionCode}
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

      {/* Problem Areas Route */}
      <Route
        path="/problem-areas"
        element={
          userInfo ? (
            <ProblemAreasPage
              userInfo={userInfo}
              sessionCode={sessionCode}
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

      {/* Overview Route */}
      <Route
        path="/overview"
        element={
          userInfo ? (
            <OverviewPage
              userInfo={userInfo}
              sessionCode={sessionCode}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Detail Route */}
      <Route
        path="/detail/:categoryId"
        element={
          userInfo ? (
            <DetailPageWrapper
              userInfo={userInfo}
              sessionCode={sessionCode}
              onBack={handleBackToGrid}
              showSummary={showSummary}
              onOpenSummary={() => setShowSummary(true)}
              onCloseSummary={() => setShowSummary(false)}
              setSelectedCategoryIndex={setSelectedCategoryIndex}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Catch all - redirect to home */}
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
