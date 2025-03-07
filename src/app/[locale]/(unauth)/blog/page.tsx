import { getTranslations } from 'next-intl/server';

import ComingSoon from '@/components/ComingSoon';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const Home = async () => {
  return (
    <>
      <Navbar />
      <ComingSoon />
    </>
  );
};

export default Home;
