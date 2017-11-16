var EmailTemplateMainApp = (props) => {
  if (props.abFileExistsInQ) {
    if (props.abFileCompletedInQ) {
      return (
        <div id='q-translation-status-container-email'>
          <NavBar qCanvasFileMatches={props.qCanvasFileMatches} handleCanvasSelect={props.handleCanvasSelect} abId={props.abId} abType={props.abType} abCanvasExistInQ={props.abCanvasExistInQ} abFileCompletedInQ={props.abFileCompletedInQ} abFileExistsInQ={props.abFileExistsInQ} handleLogoutClick={props.handleLogoutClick} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} qFileUpload={props.qFileUpload} sourceContentChanged={props.sourceContentChanged} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages} init={props.init} qTranslationStatusObj={props.qTranslationStatusObj}  />
          <TranslationPreview handleDownloadAllClose={props.handleDownloadAllClose} abLanguageCode={props.abLanguageCode} disabled={props.qLocaleTranslationStatus !== 'completed'} abTranslationStatuses={props.abTranslationStatuses} qFileUpload={props.qFileUpload} abLocaleTargetContent={props.abLocaleTargetContent} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages}/>
        </div>
      )
    }
    else {
      return (
        <div className='q-translation-status-container'>
          <NavBar qCanvasFileMatches={props.qCanvasFileMatches} handleCanvasSelect={props.handleCanvasSelect} abId={props.abId} abType={props.abType} abCanvasExistInQ={props.abCanvasExistInQ} abFileCompletedInQ={props.abFileCompletedInQ} abFileExistsInQ={props.abFileExistsInQ} handleLogoutClick={props.handleLogoutClick} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} qFileUpload={props.qFileUpload} sourceContentChanged={props.sourceContentChanged} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages} init={props.init} qTranslationStatusObj={props.qTranslationStatusObj}  />
          <p className='helptext'>props template is currently being translated in Qordoba. Please return when translators have finished!</p>
        </div>
      )
    }
  }
  else {
    return (
      <div className='q-translation-status-container'>
        <NavBar qCanvasFileMatches={props.qCanvasFileMatches} handleCanvasSelect={props.handleCanvasSelect} abId={props.abId} abType={props.abType} abCanvasExistInQ={props.abCanvasExistInQ} abFileCompletedInQ={props.abFileCompletedInQ} abFileExistsInQ={props.abFileExistsInQ} handleLogoutClick={props.handleLogoutClick} qModalGetParentSelector={props.qModalGetParentSelector} qModalStyle={props.qModalStyle} qSourceContent={props.qSourceContent} downloadAllModalOpen={props.downloadAllModalOpen} abHeadContent={props.abHeadContent} abSourceContent={props.abSourceContent} abAllTargetContent={props.abAllTargetContent} downloadAllModalOpen={props.downloadAllModalOpen} handleDownloadAllClick={props.handleDownloadAllClick} handleDownloadAllClose={props.handleDownloadAllClose} qFileUpload={props.qFileUpload} sourceContentChanged={props.sourceContentChanged} languageDropdownValue={props.languageDropdownValue} qSourceLocale={props.qSourceLocale} handleLanguageChange={props.handleLanguageChange} qProjectLanguages={props.qProjectLanguages} qGetLanguages={props.qGetLanguages} init={props.init} qTranslationStatusObj={props.qTranslationStatusObj}  />
        <p className='helptext'>props template is not yet in Qordoba. Please click the button above to start translating! </p>
      </div>
    )
  }
}