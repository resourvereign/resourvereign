import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'home' });

  return (
    <div>
      <h1>{t('title')}</h1>
      <p className="mt-6 text-base leading-7 text-gray-600">{t('body')}</p>
    </div>
  );
};

export default HomePage;
