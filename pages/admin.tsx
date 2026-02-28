import type { GetServerSideProps } from 'next';

// Legacy admin implementation is fully commented in: archive/admin.old.commented.txt

type AdminRedirectPageProps = {
  destination: string;
};

export default function AdminRedirectPage({ destination }: AdminRedirectPageProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        background: '#f8fafc',
        color: '#111827',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Redirecting to Admin Panel...</h1>
        <p style={{ marginTop: 12 }}>
          If you are not redirected automatically, open <a href={destination}>{destination}</a>.
        </p>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/designinhtmlcss/index.html#/admin',
      permanent: false,
    },
  };
};
