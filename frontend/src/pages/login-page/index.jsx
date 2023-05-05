import { Formik } from 'formik';
import { useContext, useEffect, useRef } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { login } from '../../api';
import { AuthContext } from '../../context/auth';
import { ROUTER_PATHS } from '../../constants';
import validator from './validator';

const LoginPage = () => {
  const { setToken, setUsername } = useContext(AuthContext);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <Card>
      <Card.Body>
        <h1>{t('enter')}</h1>
        <Formik
          initialValues={{ login: '', password: '', error: '' }}
          onSubmit={(values, helpers) => {
            login({ username: values.login, password: values.password })
              .then((response) => {
                if (!response?.data?.token) {
                  throw new Error(t('hasNoToken'));
                }

                setToken(response.data.token);
                setUsername(values.login);

                navigate(ROUTER_PATHS.MAIN_PAGE);
              })
              .catch((error) => {
                if (error.response.status === 401) {
                  helpers.setFieldError('error', t('wrongNameOrPassword'));
                  return;
                }
                console.error(error);
                toast(t('networkError'), { type: 'error' });
              });
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
                <Form.Label>
                  {t('yourNickname')}
                </Form.Label>
                <Form.Control
                  ref={inputRef}
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
                {t('enter')}
              </Button>
            </Form>
          )}
        </Formik>

      </Card.Body>
      <Card.Footer className="text-center">
        <div>
          <b>{t('haveNoAccount')}</b>
        </div>
        <div>
          <Link to={ROUTER_PATHS.SIGN_UP}>
            {t('registration')}
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default LoginPage;
