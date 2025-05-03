import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from backend
    fetch(`${import.meta.env.VITE_API_URL}/data`)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {data ? (
        <h1 className="text-2xl font-bold text-blue-600">{data.message}</h1>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;