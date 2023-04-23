import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTER_PATHS } from '../../constants';

const Header = () => (
  <Navbar bg="white" className="shadow-sm navbar navbar-expand-lg navbar-light bg-white" expand="lg" variant="light">
    <Link to={ROUTER_PATHS.MAIN_PAGE}>HOME</Link>
  </Navbar>
);

export default Header;
