import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './header';

const Layout = () => (
  <div className="d-flex flex-column h-100">
    <Header />
    <Container className="container h-100 my-4 overflow-hidden">
      <Outlet />
    </Container>
  </div>
);

export default Layout;
