import { useTranslation } from 'react-i18next';

import Page from '../components/Page';

const HomePage = () => {
  const { t } = useTranslation('homePage');

  return (
    <Page title={t('title')} className="min-h-full place-items-center ">
      <p className="mt-6 text-base leading-7 text-gray-600">{t('body')}</p>
    </Page>
  );
};

export default HomePage;
