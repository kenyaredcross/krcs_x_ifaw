import { Hero } from '../components/Hero';
import type { UserInfo } from '../types';

interface HomePageProps {
  onEnter: (userInfo: UserInfo) => void;
}

export const HomePage = ({ onEnter }: HomePageProps) => {
  return <Hero onEnter={onEnter} />;
};
