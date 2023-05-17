import { useContext } from 'react';
import { Container, Button, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { LocalesContext } from '../../context/locales';
import { ROUTER_PATHS } from '../../constants';

const Header = () => {
  const { logOut, token } = useContext(AuthContext);
  const { t } = useContext(LocalesContext);
  const navigate = useNavigate();

  return (
    <Navbar bg="white" className="shadow-sm navbar navbar-expand-lg navbar-light bg-white" expand="lg" variant="light">
      <Container>
        <Link to={ROUTER_PATHS.MAIN_PAGE}>Hexlet Chat</Link>
        {token && (
          <Button onClick={() => {
            logOut();
            navigate(ROUTER_PATHS.LOGIN);
          }}
          >
            {t('logOut')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
