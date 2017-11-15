import React from 'react';
import LanguageDropdown from './LanguageDropdown.js';
import LogoutButton from './LogoutButton.js';
import DownloadAllButton from './DownloadAllButton.js';

var NavBar = (props) => {
  return (
    <div className="q-nav-bar">
      <LanguageDropdown qTranslationStatusObj={props.qTranslationStatusObj} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages}/>
      <div onClick={props.init} className='q-nav-item' id='q-refresh'>
        <i className="fa fa-refresh" aria-hidden="true"></i>
      </div>
      <div className='q-nav-item'>
        <button disabled={!props.sourceContentChanged} className='q-btn btn img-btn pull-left' onClick={props.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
      </div>
      <DownloadAllButton qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} />
      <LogoutButton handleLogoutClick={props.handleLogoutClick} />
    </div>
  )
}

export default NavBar;