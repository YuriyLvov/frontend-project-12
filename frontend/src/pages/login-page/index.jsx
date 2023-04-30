import axios from 'axios';
import { Formik } from 'formik';
import { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/auth';
import { ROUTER_PATHS } from '../../constants';
import validator from './validator';

const LoginPage = () => {
  const { setToken, setUsername } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <h1>{t('enter')}</h1>
      <Formik
        initialValues={{ login: '', password: '' }}
        onSubmit={(values) => {
          axios.post('/api/v1/login', { username: values.login, password: values.password })
            .then((response) => {
              if (!response?.data?.token) {
                throw new Error(t('hasNoToken'));
              }

              setToken(response.data.token);
              setUsername(values.login);

              navigate(ROUTER_PATHS.MAIN_PAGE);
            })
            .catch((error) => {
              console.error('error', error);
              toast('Ошибка сети', { type: 'error' });
            });
        }}
        validationSchema={validator}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login">
              <Form.Label>
                {t('yourNickname')}
              </Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder={t('enterNickname')}
                value={values.email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>
                {t('password')}
              </Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder={t('enterPassword')}
                value={values.password}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {t('enter')}
            </Button>
          </Form>
        )}
      </Formik>
      <div>
        <b>{t('haveNoAccount')}</b>
        <Link to={ROUTER_PATHS.SIGN_UP}>{t('registration')}</Link>
      </div>
    </div>
  );
};

export default LoginPage;
