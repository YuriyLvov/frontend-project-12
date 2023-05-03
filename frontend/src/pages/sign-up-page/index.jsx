import axios from 'axios';
import { Formik } from 'formik';
import { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/auth';
import { ROUTER_PATHS } from '../../constants';
import validator from './validator';

const SignUpPage = () => {
  const { setToken, setUsername } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <h1>{t('registration')}</h1>
      <Formik
        initialValues={{
          login: '', password: '', confirmPassword: '', error: '',
        }}
        onSubmit={(values, helpers) => {
          helpers.setFieldError('error', '');
          axios.post('/api/v1/signup', { username: values.login, password: values.password })
            .then((response) => {
              if (!response?.data?.token) {
                helpers.setFieldError('error', t('hasNoToken'));
                throw new Error(t('hasNoToken'));
              }

              setToken(response.data.token);
              setUsername(values.login);

              navigate(ROUTER_PATHS.MAIN_PAGE);
            })
            .catch((error) => {
              if (error.response.status === 409) {
                helpers.setFieldError('error', t('userAlreadyExsists'));
              }
              console.error(error);
              toast(t('networkError'), { type: 'error' });
            });
        }}
        // eslint-disable-next-line consistent-return
        validate={({ password, confirmPassword }) => {
          if (password !== confirmPassword) {
            return {
              confirmPassword: t('passwordShouldMatch'),
            };
          }
        }}
        validationSchema={validator}
      >
        {({
          errors,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login">
              <Form.Label>{t('userName')}</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder={t('enterNickname')}
                value={values.email}
                isInvalid={errors.login}
              />
              <Form.Control.Feedback type="invalid">
                {errors.login}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>{t('password')}</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder={t('enterPassword')}
                value={values.password}
                isInvalid={errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>{t('passwordConfirmation')}</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder={t('confirmPassword')}
                value={values.confirmPassword}
                isInvalid={errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="error">
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.error}
                isInvalid={errors.error}
                className="d-none"
              />
              <Form.Control.Feedback type="invalid">
                {errors.error}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              {t('register')}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpPage;
