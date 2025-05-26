import { useState } from 'react';
import CharacterList from './components/CharacterList';

function App() {
  const [name, setName] = useState('');
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 p-6 mb-4">
        <h1  className="text-3xl font-bold text-center" style={{color:"#1976d2"}}>
          Star Wars Characters
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {/* Top Bar: Search on Right */}
       <div className="flex justify-center  mb-6 ">
  <input
    type="text"
    placeholder="Search characters..."
    value={name}
    onChange={(e) => {
      setName(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


        {/* Character List */}
        <CharacterList page={page} limit={6} name={name} onPageChange={setPage} />
      </main>
    </div>
  );
}

export default App;
