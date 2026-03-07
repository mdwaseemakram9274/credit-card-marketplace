import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import AdminPage (client-side only, not needed for SEO)
const AdminPage = dynamic(() => import('@/designinhtmlcss/src/app/pages/AdminPage'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'system-ui',
    }}>
      <p>Loading Admin Panel...</p>
    </div>
  ),
});

const Admin: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin Panel | Fintech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminPage />
    </>
  );
};

export default Admin;
