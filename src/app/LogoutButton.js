import React from 'react';

var LogoutButton = (props) => {
  return (
    <div className='q-nav-item' id='q-logout'>
      <button className='btn' type='button' onClick={props.handleLogoutClick}> Logout </button>
    </div>
  )
}

export default LogoutButton;