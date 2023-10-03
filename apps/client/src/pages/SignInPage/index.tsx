import classNames from 'classnames';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { Password } from 'primereact/password';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useAuthStore from '../../hooks/useAuthStore';

import styles from './index.module.css';

type SignInValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const SignInPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'signIn' });
  const { login } = useAuthStore();
  const { register, handleSubmit, control } = useForm<SignInValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });
  const msgs = useRef<Messages>(null);
  const [error, setError] = useState(false);

  const showError = useCallback(() => {
    msgs.current &&
      msgs.current.show([
        {
          severity: 'error',
          summary: t('error.title'),
          detail: t('error.message'),
          sticky: true,
          closable: false,
        },
      ]);
  }, [t]);

  useEffect(() => {
    if (error) {
      showError();
    } else {
      clearError();
    }
  });

  const clearError = useCallback(() => {
    msgs.current && msgs.current.clear();
  }, []);

  const onSubmit = useCallback(
    async (data: SignInValues) => {
      try {
        setError(false);
        const result = await login(data.email, data.password, data.rememberMe);
        setError(!result);
      } catch (err) {
        setError(true);
      }
    },
    [login],
  );

  return (
    <Card className={classNames(styles.signIn, 'p-4 shadow-2 border-round w-full lg:w-6')}>
      <div className={classNames(styles.header, 'text-center mb-5')}>
        <img src="/ResourVereign.png" alt="ResourVereign" className="mb-3" />
        <div className={classNames(styles.title, 'text-900 text-3xl font-medium mb-3')}>
          ResourVereign
        </div>
        <div className="text-900 text-2xl font-medium mb-3">{t('title')}</div>
      </div>

      <Messages ref={msgs} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block text-900 font-medium mb-2" htmlFor="email">
          {t('form.email.label')}
        </label>
        <InputText
          className="w-full mb-3"
          placeholder={t('form.email.placeholder')}
          {...register('email')}
        />
        <label className="block text-900 font-medium mb-2" htmlFor="password">
          {t('form.password.label')}
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Password
              placeholder={t('form.password.placeholder')}
              className={classNames(styles.password, 'w-full mb-3')}
              inputClassName="w-full mb-0"
              feedback={false}
              toggleMask
              inputRef={field.ref}
              {...field}
            />
          )}
        />

        <div className={classNames(styles.rememberMe, 'flex align-items-center mb-4')}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                inputRef={field.ref}
                className="mr-2"
                onChange={(e) => field.onChange(e.checked)}
              />
            )}
          />
          <label className="mb-0" htmlFor="rememberme">
            {t('form.rememberMe')}
          </label>
        </div>
        <button aria-label="Sign In" className="p-component p-button  w-full">
          <span className="p-button-icon p-c p-button-icon-left pi pi-user"></span>
          <span className="p-button-label p-c">{t('form.submit')}</span>
          <span role="presentation" className="p-ink"></span>
        </button>
      </form>
    </Card>
  );
};

export default SignInPage;
