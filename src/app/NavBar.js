import React from 'react';
import LanguageDropdown from './LanguageDropdown.js';
import LogoutButton from './LogoutButton.js';
import DownloadAllButton from './DownloadAllButton.js';
import CanvasSelectionDropdown from './CanvasSelectionDropdown.js';

var NavBar = (props) => {
  console.log('NavBar props', props)
  if (props.abType.includes('canvas') && props.abCanvasExistInQ) {
    return (
      <div className="q-nav-bar">
        <LanguageDropdown disabled={!props.abFileCompletedInQ} qTranslationStatusObj={props.qTranslationStatusObj} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages}/>
        <div onClick={props.init} className='q-nav-item' id='q-refresh'>
          <i className="fa fa-refresh" aria-hidden="true"></i>
        </div>
        <div className='q-nav-item'>
          <button disabled={!props.sourceContentChanged && props.abFileExistsInQ} className='q-btn btn img-btn pull-left' onClick={props.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
        </div>
        <DownloadAllButton disabled={!props.abFileCompletedInQ} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} />
        <CanvasSelectionDropdown abId={props.abId} handleCanvasSelect={props.handleCanvasSelect} qCanvasFileMatches={props.qCanvasFileMatches} />
        <LogoutButton handleLogoutClick={props.handleLogoutClick} />
      </div>
    )
  }
  else {
    return (
      <div className="q-nav-bar">
        <LanguageDropdown disabled={!props.abFileCompletedInQ} qTranslationStatusObj={props.qTranslationStatusObj} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages}/>
        <div onClick={props.init} className='q-nav-item' id='q-refresh'>
          <i className="fa fa-refresh" aria-hidden="true"></i>
        </div>
        <div className='q-nav-item'>
          <button disabled={!props.sourceContentChanged && props.abFileExistsInQ} className='q-btn btn img-btn pull-left' onClick={props.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
        </div>
        <DownloadAllButton disabled={!props.abFileCompletedInQ} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} />
        <LogoutButton handleLogoutClick={props.handleLogoutClick} />
      </div>
    )
  }
}

export default NavBar;