import React from 'react';

var LogoutButton = (props) => {
  return (
    <div className='q-nav-item' id='q-logout-container'>
      <a id='q-logout-link' onClick={props.handleLogoutClick}> Logout </a>
    </div>
  )
}

export default LogoutButton;