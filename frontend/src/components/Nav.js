import React from 'react';
import PropTypes from 'prop-types';

function Nav(props) {
  const logged_out_nav = (
    <ul className="nav">
      <li onClick={() => props.displayed_form('login')}>login</li>
      <li onClick={() => props.displayed_form('signup')}>signup</li>
    </ul>
  );

  const logged_in_nav = (
    <ul className="nav">
      <li onClick={props.handle_logout}>logout</li>
    </ul>
  );
  return (
    <header className="header">
      <div>
        {props.logged_in ? logged_in_nav : logged_out_nav}
      </div>
      <div>
        <h1 className="text-white text-center my-4">BAD MOVIE TIME</h1>
      </div>
    </header>
  )
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  displayed_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};