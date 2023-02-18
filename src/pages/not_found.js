import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    document.title = 'Not Found - Instagram';
  }, []);
  return (
    <div className="bg-gray-background">
      <div className="mx-auth max-w-screen-lg h-screen flex items-center justify-center">
        <p className="text-center text-2xl">Not Found!</p>
      </div>
    </div>
  );
}
