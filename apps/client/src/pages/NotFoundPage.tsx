import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import Page from '../components/Page';

type NotFoundPageProps = {
  homeTo: string;
};

const NotFoundPage = ({ homeTo }: NotFoundPageProps) => {
  const { t } = useTranslation('notFoundPage');
  const navigate = useNavigate();
  const onGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Page title={t('title')} className="min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <p className="mt-6 text-base leading-7 text-gray-600">{t('body')}</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button
          onClick={onGoBack}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {t('actions.back')}
        </button>
        <Link to={homeTo} className="text-sm font-semibold text-gray-900">
          {t('actions.home')}
        </Link>
      </div>
    </Page>
  );
};

export default NotFoundPage;
