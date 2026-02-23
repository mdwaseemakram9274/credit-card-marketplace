import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/designinhtmlcss/index.html',
      permanent: false,
    },
  };
};

export default function HomePage() {
  return null;
}
