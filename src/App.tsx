import React, { useState } from 'react';

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  public_repos?: number;
  followers?: number;
}

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error('Пользователь не найден');
      }
      const data: GitHubUser = await response.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке');
    } finally {
      setLoading(false);
    }
  };

  // Обработка сабмита формы
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // чтобы страница не перезагружалась
    fetchUser();
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Github user search</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex w-full max-w-md">
        <input
          type="text"
          placeholder="Введите имя пользователя GitHub"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded-l border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Найти'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {user && (
        <div className="bg-white rounded shadow p-6 w-full max-w-sm text-center">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold mb-1">{user.name || user.login}</h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @{user.login}
          </a>
          <p className="mt-3">
            Репозиториев: <b>{user.public_repos ?? 0}</b> | Подписчиков: <b>{user.followers ?? 0}</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
