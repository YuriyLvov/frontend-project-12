import axios from 'axios';
import { Formik } from 'formik';
import { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { ROUTER_PATHS } from '../../constants';
import validator from './validator';

const LoginPage = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Войти</h1>
      <Formik
        initialValues={{ login: '', password: '' }}
        onSubmit={(values) => {
          axios.post('/api/v1/login', { username: values.login, password: values.password })
            .then((response) => {
              if (!response?.data?.token) {
                throw new Error('Has no token');
              }

              setToken(response.data.token);

              navigate(ROUTER_PATHS.MAIN_PAGE);
            })
            .catch((error) => {
              console.error('error', error);
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
              <Form.Label>Ваш ник</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Введите никнейм"
                value={values.email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="Введите пароль"
                value={values.password}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Войти
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
