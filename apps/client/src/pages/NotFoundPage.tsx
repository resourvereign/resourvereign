import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LinkButton from '../components/LinkButton';

type NotFoundPageProps = {
  homeTo: string;
};

const NotFoundPage = ({ homeTo }: NotFoundPageProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'notFound' });
  const navigate = useNavigate();
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Card
      className="p-4 shadow-2 border-round w-full lg:w-4"
      title={t('title')}
      footer={
        <div className="flex flex-wrap justify-content-end gap-2">
          <Button
            label={t('buttons.goBack')}
            icon="pi pi-chevron-circle-left"
            onClick={handleGoBack}
          />
          <LinkButton
            to={homeTo}
            label={t('buttons.goHome')}
            icon="pi pi-home"
            className="p-button-outlined p-button-secondary"
          />
        </div>
      }
    >
      <p className="">{t('message')}</p>
    </Card>
  );
};

export default NotFoundPage;
