import React from 'react';
import NavBar from './NavBar.js';
import TranslationPreview from './TranslationPreview.js';
import CanvasSelectionModal from './CanvasSelectionModal.js';
import CanvasCreationModal from './CanvasCreationModal.js';
import LoginModal from './LoginModal.js';

var EmailTemplateMainView = (props) => {
  if (props.abId || props.abCanvasSelectionInProgress) {
    if (props.abFileExistsInQ) {
      if (props.abFileCompletedInQ) {
        return (
          <div id='q-translation-status-container-email'>
            <NavBar qCanvasFileMatches={props.qCanvasFileMatches} handleCanvasSelect={props.handleCanvasSelect} abId={props.abId} abType={props.abType} abCanvasExistInQ={props.abCanvasExistInQ} abFileCompletedInQ={props.abFileCompletedInQ} abFileExistsInQ={props.abFileExistsInQ} handleLogoutClick={props.handleLogoutClick} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} qFileUpload={props.qFileUpload} sourceContentChanged={props.sourceContentChanged} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages} init={props.init} qTranslationStatusObj={props.qTranslationStatusObj}  />
            <TranslationPreview handleDownloadAllClose={props.handleDownloadAllClose} abLanguageCode={props.abLanguageCode} disabled={props.qLocaleTranslationStatus !== 'completed'} abTranslationStatuses={props.abTranslationStatuses} qFileUpload={props.qFileUpload} abLocaleTargetContent={props.abLocaleTargetContent} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages}/>
            <LoginModal handleLogoutClick={props.handleLogoutClick} qHandleProjectSubmit={props.qHandleProjectSubmit} qAllProjects={props.qAllProjects} qProjectId={props.qProjectId} qHandleConfigSubmit={props.qHandleConfigSubmit} qOrganizationId={props.qOrganizationId} qHandleOrgSubmit={props.qHandleOrgSubmit} qAllOrgs={props.qAllOrgs} qAuthenticated={!!props.qAuthToken} qHandleLoginSubmit={props.qHandleLoginSubmit} qModalGetParentSelector={props.qModalGetParentSelector} qLoginModalOpen={props.qLoginModalOpen} handleLoginClose={props.handleLoginClose} qModalStyle={props.qModalStyle} />
          </div>
        )
      }
      else {
        return (
          <div className='q-translation-status-container'>
            <NavBar qCanvasFileMatches={props.qCanvasFileMatches} handleCanvasSelect={props.handleCanvasSelect} abId={props.abId} abType={props.abType} abCanvasExistInQ={props.abCanvasExistInQ} abFileCompletedInQ={props.abFileCompletedInQ} abFileExistsInQ={props.abFileExistsInQ} handleLogoutClick={props.handleLogoutClick} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} qFileUpload={props.qFileUpload} sourceContentChanged={props.sourceContentChanged} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages} init={props.init} qTranslationStatusObj={props.qTranslationStatusObj}  />
            <p className='helptext'>props template is currently being translated in Qordoba. Please return when translators have finished!</p>
            <LoginModal handleLogoutClick={props.handleLogoutClick} qHandleProjectSubmit={props.qHandleProjectSubmit} qAllProjects={props.qAllProjects} qProjectId={props.qProjectId} qHandleConfigSubmit={props.qHandleConfigSubmit} qOrganizationId={props.qOrganizationId} qHandleOrgSubmit={props.qHandleOrgSubmit} qAllOrgs={props.qAllOrgs} qAuthenticated={!!props.qAuthToken} qHandleLoginSubmit={props.qHandleLoginSubmit} qModalGetParentSelector={props.qModalGetParentSelector} qLoginModalOpen={props.qLoginModalOpen} handleLoginClose={props.handleLoginClose} qModalStyle={props.qModalStyle} />
          </div>
        )
      }
    }
    else {
      return (
        <div className='q-translation-status-container'>
          <NavBar qCanvasFileMatches={props.qCanvasFileMatches} handleCanvasSelect={props.handleCanvasSelect} abId={props.abId} abType={props.abType} abCanvasExistInQ={props.abCanvasExistInQ} abFileCompletedInQ={props.abFileCompletedInQ} abFileExistsInQ={props.abFileExistsInQ} handleLogoutClick={props.handleLogoutClick} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} qFileUpload={props.qFileUpload} sourceContentChanged={props.sourceContentChanged} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages} init={props.init} qTranslationStatusObj={props.qTranslationStatusObj}  />
          <p className='helptext'>This template is not yet in Qordoba. Please click the button above to start translating! </p>
          <CanvasSelectionModal qCanvasFileMatches={props.qCanvasFileMatches} abId={props.abId} abCanvasSelectionInProgress={props.abCanvasSelectionInProgress} qModalGetParentSelector={props.qModalGetParentSelector} handleCanvasModalClose={props.handleCanvasModalClose} qModalStyle={props.qModalStyle} handleCanvasSelect={props.handleCanvasSelect} handleCanvasNoMatchClick={props.handleCanvasNoMatchClick} />
          <CanvasCreationModal handleCanvasIdSubmit={props.handleCanvasIdSubmit} qModalStyle={props.qModalStyle} handleCanvasModalClose={props.handleCanvasModalClose} qModalGetParentSelector={props.qModalGetParentSelector} canvasCreationModalOpen={props.canvasCreationModalOpen} />
          <LoginModal handleLogoutClick={props.handleLogoutClick} qHandleProjectSubmit={props.qHandleProjectSubmit} qAllProjects={props.qAllProjects} qProjectId={props.qProjectId} qHandleConfigSubmit={props.qHandleConfigSubmit} qOrganizationId={props.qOrganizationId} qHandleOrgSubmit={props.qHandleOrgSubmit} qAllOrgs={props.qAllOrgs} qAuthenticated={!!props.qAuthToken} qHandleLoginSubmit={props.qHandleLoginSubmit} qModalGetParentSelector={props.qModalGetParentSelector} qLoginModalOpen={props.qLoginModalOpen} handleLoginClose={props.handleLoginClose} qModalStyle={props.qModalStyle} />
        </div>
      )
    }
  }
  else {
    return (
      <div className='q-translation-status-container'>
        <NavBar qCanvasFileMatches={props.qCanvasFileMatches} handleCanvasSelect={props.handleCanvasSelect} abId={props.abId} abType={props.abType} abCanvasExistInQ={props.abCanvasExistInQ} abFileCompletedInQ={props.abFileCompletedInQ} abFileExistsInQ={props.abFileExistsInQ} handleLogoutClick={props.handleLogoutClick} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} qFileUpload={props.qFileUpload} sourceContentChanged={props.sourceContentChanged} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages} init={props.init} qTranslationStatusObj={props.qTranslationStatusObj}  />
        <p className='helptext'>props template does not yet have a unique ID assigned to it. Please make a change to the template, save it, and refresh. </p>
        <LoginModal handleLogoutClick={props.handleLogoutClick} qHandleProjectSubmit={props.qHandleProjectSubmit} qAllProjects={props.qAllProjects} qProjectId={props.qProjectId} qHandleConfigSubmit={props.qHandleConfigSubmit} qOrganizationId={props.qOrganizationId} qHandleOrgSubmit={props.qHandleOrgSubmit} qAllOrgs={props.qAllOrgs} qAuthenticated={!!props.qAuthToken} qHandleLoginSubmit={props.qHandleLoginSubmit} qModalGetParentSelector={props.qModalGetParentSelector} qLoginModalOpen={props.qLoginModalOpen} handleLoginClose={props.handleLoginClose} qModalStyle={props.qModalStyle} />
      </div>
    )
  }
}

export default EmailTemplateMainView;