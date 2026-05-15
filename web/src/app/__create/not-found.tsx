import { useNavigate } from 'react-router';

export default function CreateDefaultNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'sans-serif',
        textAlign: 'center',
      }}
    >
      <h1>404 - Page Not Found</h1>

      <p>The page you are looking for does not exist.</p>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        Go Home
      </button>
    </div>
  );
}