import { Formik } from 'formik';
import { useContext, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signup } from '../api';
import { useAuth } from '../context/auth';
import { LocalesContext } from '../context/locales';
import { ROUTER_PATHS } from '../constants';
import { getSignupFormSchema } from '../validators';

const SignUpPage = () => {
  const { setToken, setUsername } = useAuth();
  const inputRef = useRef(null);
  const { t } = useContext(LocalesContext);
  const navigate = useNavigate();
  const validator = getSignupFormSchema(t);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <Col className="m-auto" xs={6}>
      <Card>
        <Card.Body>
          <h1>{t('registration')}</h1>
          <Formik
            initialValues={{
              login: '', password: '', confirmPassword: '', error: '',
            }}
            onSubmit={(values, helpers) => {
              helpers.setFieldError('error', '');
              signup({ username: values.login, password: values.password })
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
                    return;
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
                    ref={inputRef}
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
                  <Form.Label>{t('confirmPassword')}</Form.Label>
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
        </Card.Body>
      </Card>
    </Col>
  );
};

export default SignUpPage;
