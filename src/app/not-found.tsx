import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <p style={{ fontFamily: 'var(--font-digit)', fontSize: '2.5rem', fontWeight: 700 }}>404</p>
      <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>This page does not compute</h1>
      <Link
        href="/"
        style={{
          padding: '10px 20px',
          borderRadius: 12,
          background: 'var(--accent)',
          color: '#fff',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Back to Calsuma
      </Link>
    </div>
  );
}
