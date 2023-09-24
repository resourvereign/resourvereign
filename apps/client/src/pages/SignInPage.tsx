import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { Password } from 'primereact/password';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useAuth from '../hooks/useAuth';

type SignInValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const SignInPage = () => {
  const { t } = useTranslation('signIn');
  const { login } = useAuth();
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
  }, []);

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

  const onSubmit = useCallback(async (data: SignInValues) => {
    try {
      setError(false);
      const result = await login(data.email, data.password, data.rememberMe);
      setError(!result);
    } catch (err) {
      setError(true);
    }
  }, []);

  return (
    <Card className="p-4 shadow-2 border-round w-full lg:w-6">
      <div className="text-center mb-5">
        <img src="/ResourVereign.png" alt="ResourVereign" height="50" className="mb-3" />
        <div className="text-900 text-3xl font-medium mb-3">ResourVereign</div>
        <div className="text-900 text-2xl font-medium mb-3">{t('title')}</div>
      </div>

      <Messages ref={msgs} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="block text-900 font-medium mb-2">
          {t('form.email.label')}
        </label>
        <InputText
          placeholder={t('form.email.placeholder')}
          className="w-full mb-3"
          {...register('email')}
        />
        <label htmlFor="password" className="block text-900 font-medium mb-2">
          {t('form.password.label')}
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Password
              placeholder={t('form.password.placeholder')}
              className="w-full mb-3"
              inputClassName="w-full"
              feedback={false}
              toggleMask
              inputRef={field.ref}
              {...field}
            />
          )}
        />

        <div className="flex align-items-center justify-content-between mb-4">
          <div className="flex align-items-center">
            <div id="rememberme" className="p-checkbox p-component mr-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    inputRef={field.ref}
                    onChange={(e) => field.onChange(e.checked)}
                  />
                )}
              />
            </div>
            <label htmlFor="rememberme">{t('form.rememberMe')}</label>
          </div>
        </div>
        <button aria-label="Sign In" className="p-button p-component w-full">
          <span className="p-button-icon p-c p-button-icon-left pi pi-user"></span>
          <span className="p-button-label p-c">{t('form.submit')}</span>
          <span role="presentation" className="p-ink"></span>
        </button>
      </form>
    </Card>
  );
};

export default SignInPage;
