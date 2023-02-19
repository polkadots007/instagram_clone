import { useEffect } from 'react';
import Header from '../components/header';

export default function NotFound() {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    document.title = 'Not Found - Snapper';
  }, []);
  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auth max-w-screen-lg h-screen flex items-center justify-center">
        <p className="text-center text-2xl">Not Found!</p>
      </div>
    </div>
  );
}
