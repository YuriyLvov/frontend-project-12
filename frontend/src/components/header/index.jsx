import { useContext } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/auth';
import { ROUTER_PATHS } from '../../constants';

const Header = () => {
  const { logOut, token } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Navbar bg="white" className="shadow-sm navbar navbar-expand-lg navbar-light bg-white" expand="lg" variant="light">
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
    </Navbar>
  );
};

export default Header;
