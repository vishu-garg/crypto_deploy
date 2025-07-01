import { getTranslations } from 'next-intl/server';

import ComingSoon from '@/components/ComingSoon';

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
      <ComingSoon />
    </>
  );
};

export default Home;
