import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/data`)
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-blue-600">{message || 'Loading...'}</h1>
    </div>
  );
}

export default App;