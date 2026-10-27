import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Sim Worth Tracker</h1>
      <p>Deployed correctly.</p>
      <Link href="/followers" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to /followers page
      </Link>
    </div>
  );
}
