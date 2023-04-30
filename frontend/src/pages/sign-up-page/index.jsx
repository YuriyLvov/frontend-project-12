import axios from 'axios';
import { Formik } from 'formik';
import { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { ROUTER_PATHS } from '../../constants';
import validator from './validator';

const SignUpPage = () => {
  const { setToken, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Регистрация</h1>
      <Formik
        initialValues={{
          login: '', password: '', confirmPassword: '', error: '',
        }}
        onSubmit={(values, helpers) => {
          helpers.setFieldError('error', '');
          axios.post('/api/v1/signup', { username: values.login, password: values.password })
            .then((response) => {
              if (!response?.data?.token) {
                helpers.setFieldError('error', 'Has no token');
                throw new Error('Has no token');
              }

              setToken(response.data.token);
              setUsername(values.login);

              navigate(ROUTER_PATHS.MAIN_PAGE);
            })
            .catch((error) => {
              if (error.response.status === 409) {
                helpers.setFieldError('error', 'Такой пользователь уже существует');
              }
              console.error('error', error);
            });
        }}
        // eslint-disable-next-line consistent-return
        validate={({ password, confirmPassword }) => {
          if (password !== confirmPassword) {
            return {
              confirmPassword: 'Пароль и подтверждение должны совпадать',
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
        // eslint-disable-next-line no-sequences
        }) => (console.log('errors', errors), (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Введите никнейм"
                value={values.email}
                isInvalid={errors.login}
              />
              <Form.Control.Feedback type="invalid">
                {errors.login}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="Введите пароль"
                value={values.password}
                isInvalid={errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="Подтвердите пароль"
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
              Зарегистрироваться
            </Button>
          </Form>
        ))}
      </Formik>
    </div>
  );
};

export default SignUpPage;
