import React from 'react';
import Modal from 'react-modal';

var LoginModal = (props) => {
  if (!props.qAuthenticated) {
    return (
      <Modal
        id='q-download-all-modal'
        isOpen={props.qLoginModalOpen}
        parentSelector={props.qModalGetParentSelector}
        onRequestClose={props.handleLoginClose}
        contentLabel="Login Modal"
        style={props.qModalStyle}
      >
        <h1>Login</h1>
        <p className='helptext'> Log in.</p>
        <form onSubmit={props.qHandleLoginSubmit} id='q-login-form'>
          <input id='q-username-input' style={{display: 'block'}} type='text' placeholder='email'/>
          <input id='q-password-input' style={{display: 'block'}} type='password' placeholder='password'/>
          <button className='btn' type='submit'> Submit </button>
        </form>
      </Modal>
    )
  }
  else {
    return (
      <Modal
        id='q-download-all-modal'
        isOpen={props.qLoginModalOpen}
        parentSelector={props.qModalGetParentSelector}
        onRequestClose={props.handleLoginClose}
        contentLabel="Login Modal"
        style={props.qModalStyle}
      >
        <h1>Connect to Qordoba</h1>
        <p className='helptext'> Choose organization and project</p>
        <form onSubmit={props.qHandleConfigSubmit} id='q-config-form'>
          <select value={props.qOrganizationId} onChange={props.qHandleOrgSubmit}>
            <option disabled={true} value={0}> Select an Organization </option>
            {props.qAllOrgs.map((orgObject) => {
              return (
                <option className="q-org-dropdown-option" value={orgObject.id} key={orgObject.id}>
                  {orgObject.name}
                </option>
              )
            })}
          </select>


          <select disabled={props.qOrganizationId === 0} value={props.qProjectId} onChange={props.qHandleProjectSubmit}>
            <option disabled={true} value={0}> Select a Project </option>
              {props.qAllProjects.map((projectObject) => {
                return (
                  <option className="q-project-dropdown-option" value={projectObject.id} key={projectObject.id}>
                    {projectObject.name}
                  </option>
                )
              })}
          </select>

          <button className='btn' type='submit'> Submit </button>
        </form>
      </Modal>
    )
  }
}

export default LoginModal;