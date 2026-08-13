import { Hero } from '../components/Hero';

interface HomePageProps {
  onEnter: (org: string) => void;
  frappeUser?: { name: string; email: string };
}

export const HomePage = ({ onEnter, frappeUser }: HomePageProps) => {
  return <Hero onEnter={onEnter} frappeUser={frappeUser} />;
};
