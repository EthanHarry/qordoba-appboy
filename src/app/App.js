console.log('hi react app')
import React from 'react';
import $ from 'jquery';
import styles from './main.css';
import LanguageDropdown from './LanguageDropdown.js';
import TranslationPreview from './TranslationPreview.js';
import DownloadAllButton from './DownloadAllButton.js';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import Spinner from 'react-spinkit';
import config from './config.js';


//TODO
  //RELEASE BLOCKERS
    //Pagination on Qordoba request -- we cant find translation
    //Setup postmates proj
    //Change Config to Postmates
    //QA MANY MANY DIFF TEMPLATES
    //Audit performance again (setState calls, etc.)

  //FEATURES
  //CONFIG!!!! Right now, hard-coding in all Auth
  //Publish as private Chrome extension
  //Loading spinner for modal
  //Add functionality for "add ONE translation to template"
  //Upload files by name instead of ID
  //auth

class App extends React.Component {
  constructor(props) {
    super(props);

    //Need to actually render from auth
    this.state = {
      qAuthToken: config.qAuthToken,
      qOrganizationId: config.qOrganizationId,
      qProjectId: config.qProjectId,

      qProjectLanguages: {},
      qProjectLocaleFiles: {},
      qProjectAllFiles: {},
      qTranslationStatus: '',
      qSourceContent: '',

      abLanguageCode: '',
      abLanguageName: '',
      abType: '',
      abId: '',
      abTitle: '',

      abFileExistsInQ: false,
      abFileCompletedInQ: false,
      abSourceContent: '',
      abHeadContent: '',
      abLocaleTargetContent: '',
      abAllTargetContent: {},
      abTranslationStatuses: {},
      abContentToPublish: {},
      
      sourceLocale: 'en-us', //need to actually set,
      jsonReqHeader: {},
      downloadAllModalOpen: false,
      loading: true,
      dropdownValue: 0,
      sourceContentChanged: ''
    }
    this.state.jsonReqHeader = {'X-AUTH-TOKEN': this.state.qAuthToken,'Content-Type': 'application/json'};
    this.qGetLanguages = this.qGetLanguages.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.qFileUpload = this.qFileUpload.bind(this);
    this.qGetOneTranslation = this.qGetOneTranslation.bind(this);
    this.handleDownloadAllClick = this.handleDownloadAllClick.bind(this);
    this.handleDownloadAllClose = this.handleDownloadAllClose.bind(this);
    this.afterModalOpen = this.afterModalOpen.bind(this);
    this.init = this.init.bind(this);
  }


  //React Data
  async componentDidUpdate() {
    console.log('STATE', this.state)
    if (this.state.qSourceContent !== this.state.abSourceContent && this.state.qSourceContent && this.state.abSourceContent) {
      console.log(this.state.qSourceContent)
      console.log('!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!')
      console.log(this.state.abSourceContent)
    }
  }


  async init () {
    this.setState({loading: true, abFileExistsInQ: false, abFileCompletedInQ: false, dropdownValue: 0})
    this.abGetTemplateContent();
    this.abGetTemplate();
    await this.qGetLanguages();
    await this.qGetAllFiles();
    if (this.state.qPageId) {
      await this.qGetOneTranslation(true);
    }
    this.setState({loading: false});
  }


  async componentDidMount() {
    await this.init();
  }


  async handleLanguageChange(e) {
    this.setState({loading: true})
    var dropdownMenu = e.target;
    var selectedOption = dropdownMenu.querySelector(`[value="${e.target.value}"]`);
    dropdownMenu.value = selectedOption.value;
    await this.setState({dropdownValue: e.target.value, abLanguageName: selectedOption.dataset.name, abLanguageCode: selectedOption.dataset.locale, qProjectLocaleFiles: this.state.qProjectAllFiles[selectedOption.dataset.locale]});
    await this.qGetOneTranslation(false)
    var qFileTitle = `${this.state.abType}-${this.state.abId}`;
    if (this.state.qProjectLocaleFiles[qFileTitle]) {
      if (this.state.qProjectLocaleFiles[qFileTitle].completed) {
        await this.setState({qTranslationStatus: 'completed', loading: false})
      }
      else {
        await this.setState({qTranslationStatus: 'enabled', loading: false})
      }
    }
    else {
      await this.setState({qTranslationStatus: 'none', loading: false})
    }
  }

  async handleDownloadAllClick(e) {
    this.setState({loading: true})
    await this.qGetAllTranslations();
    this.setState({loading: false})
  }

  async afterModalOpen() {
    await this.setState({loading: false})
  }


  async handleDownloadAllClose() {
    this.setState({ downloadAllModalOpen: false })
  }


  //Appboy Data
  async abGetTemplate() {
    var urlPathArray = window.location.pathname.split('/');
    var articleTitleSpan = document.querySelector('span.editable-heading');
    await this.setState({abType: urlPathArray[urlPathArray.length - 2], abId: window.location.search.split('=')[1], abTitle: articleTitleSpan.innerHTML})
  }

  async abGetTemplateContent() {
    var iFramesArray = document.querySelectorAll('iframe');
    for (var i = 0; i < iFramesArray.length; i++) {
      if (iFramesArray[i].classList.length !== 0 && iFramesArray[i].id !== 'q-preview-iframe') {
        var sourceIframe = iFramesArray[i].contentWindow.document;
        var iframeHtml = iFramesArray[i].contentWindow.document.documentElement.outerHTML;
        var headRegex = /<head[\s, \S]*?>([\s,\S]*?)<\/head>/g;
        var headRegexMatches = headRegex.exec(iframeHtml);
        if (iframeHtml.includes('{% else %}')) {
          var tagRegex = /{% else %}([\s,\S]*?){% endif %}/g;
          var tagRegexMatches = tagRegex.exec(iframeHtml);
          await this.setState({sourceIframe: sourceIframe, abSourceContent: tagRegexMatches[1], abHeadContent: headRegexMatches[1]});
        }
        else {
          var bodyRegex = /<body[\s,\S]*?>([\s,\S]*?)<\/body>/g;
          var bodyRegexMatches = bodyRegex.exec(iframeHtml);
          var sourceContent = bodyRegexMatches[1];
          sourceContent = bodyRegexMatches[1].replace(/&nbsp;*/g, '');
          var sourceContent = sourceContent.replace(/></g, '>\n<');
          sourceContent = sourceContent.replace(/^\s*[\r\n]/gm, '');
          sourceContent = sourceContent.replace(/<script.*<\/script>/g, '');
          var removeNBSP = new RegExp(String.fromCharCode(160), "g");
          sourceContent = sourceContent.replace(removeNBSP, '');
          console.log('!!!')
          console.log('!!!')
          console.log('!!!')
          console.log('!!!')
          console.log('!!!')
          console.log('!!!')
          console.log(typeof sourceContent)
          console.log('removing nbsp')
          console.log('?????')
          console.log('?????')
          console.log('?????')
          console.log('?????')
          console.log('?????')
          console.log('?????')
          console.log(sourceContent)
          await this.setState({sourceIframe: sourceIframe, abSourceContent: sourceContent, abHeadContent: headRegexMatches[1]});
        }
      }
    }
  }




  //QORDOBA API CALLS
  async qGetLanguages() {
    var projectDetailCall = await $.ajax({
      type: 'GET',
      url: `https://app.qordoba.com/api/organizations/${this.state.qOrganizationId}/projects?limit=1&offset=0&limit_to_projects=${this.state.qProjectId}`,
      headers: this.state.jsonReqHeader
    })
    var qProjectLanguages = projectDetailCall.projects[0].target_languages;
    var qLangs = {};
    var sourceLangObj = projectDetailCall.projects[0].source_language;
    qLangs[sourceLangObj.code] = {id: sourceLangObj.id, name: sourceLangObj.name};
    for (var i = 0; i < qProjectLanguages.length; i++) {
      qLangs[qProjectLanguages[i].code] = {id: qProjectLanguages[i].id, name: qProjectLanguages[i].name}
    }
    await this.setState({qProjectLanguages: qLangs});
  }


  async qGetAllFiles() {
    var allQFilesObj = {};
    var abFileExistsInQ = false;
    var abFileCompletedInQ = false;
    for (var key in this.state.qProjectLanguages) {
      var qordobaResponse = await $.ajax({
        type: 'POST',
        url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/languages/${this.state.qProjectLanguages[key].id}/page_settings/search`,
        headers: this.state.jsonReqHeader,
        data: JSON.stringify({}),
      })
      console.log('QORDOBA RESPONSE GETTING ALL FILES', qordobaResponse)
      var qordobaFiles = qordobaResponse.pages;
      allQFilesObj[key] = {};
      var currentFileObj = {};
      for (var i = 0; i < qordobaFiles.length; i++) {
        var qordobaFileObj = {};
        var fileNameNoHtml = qordobaFiles[i].url.replace('.html', '');
        qordobaFileObj.completed = qordobaFiles[i].completed;
        qordobaFileObj.enabled = qordobaFiles[i].enabled;
        qordobaFileObj.createdAt = qordobaFiles[i].created_at;
        qordobaFileObj.updatedAt = qordobaFiles[i].update;
        qordobaFileObj.qArticleId = qordobaFiles[i].page_id;
        allQFilesObj[key][fileNameNoHtml] = qordobaFileObj;
        if (fileNameNoHtml === `${this.state.abType}-${this.state.abId}`) {
          currentFileObj = Object.assign({}, qordobaFileObj);
          console.log('FOUND OUR FILE', key, currentFileObj)
          var qPageId = currentFileObj.qArticleId;
          if (currentFileObj.completed && currentFileObj.enabled) {
            abFileCompletedInQ = true;
          }
        }
      }
    }
    if (Object.keys(currentFileObj).length > 0) {
      abFileExistsInQ = true;
    }
    await this.setState({qPageId: qPageId, abFileExistsInQ: abFileExistsInQ, abFileCompletedInQ: abFileCompletedInQ, qProjectAllFiles: allQFilesObj})
  }


  async qFileUpload() {
    var fileToUpload = new File([this.state.abSourceContent], `${this.state.abType}-${this.state.abId}.html`, {
      type: "text/html"
    })
    console.log('FILE TO UPLOAD', fileToUpload)
    var fd = new FormData();
    fd.append('project_id', this.state.qProjectId);
    fd.append('file_names', `[]`);
    fd.append('file', fileToUpload);

    var qordobaSendFilesRequest = {
      type: 'POST',
      contentType: false,
      processData: false,
      data: fd,
      headers: {'X-AUTH-TOKEN': this.state.qAuthToken},
    }
    if (this.state.qSourceContent) {
      qordobaSendFilesRequest.url = `https://app.qordoba.com/api/projects/${this.state.qProjectId}/files/${this.state.qPageId}/update/upload`;
      var qordobaSendFilesResponse = await $.ajax(qordobaSendFilesRequest);
      var responseToFilesUpdated = await $.ajax({
        type: 'PUT',
        url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/files/${this.state.qPageId}/update/apply`,
        data: JSON.stringify({
          new_file_id: qordobaSendFilesResponse.id,
          keep_in_project: false
        }),
        headers: this.state.jsonReqHeader
      })
      console.log('RESPONSE AFTER UPDATE', responseToFilesUpdated)
    }
    else {
      qordobaSendFilesRequest.url = `https://app.qordoba.com/api/organizations/${this.state.qOrganizationId}/upload/uploadFile_anyType?content_type_code=stringsHtml&projectId=${this.state.qProjectId}`;
      var qordobaSendFilesResponse = await $.ajax(qordobaSendFilesRequest);
      var responseToFilesUploaded = await $.ajax({
        type: 'POST',
        url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/append_files`,
        data: JSON.stringify([{
          content_type_codes: [{name: "Html String", content_type_code: "stringsHtml", extensions: ["html"]}],
          file_name: `${qordobaSendFilesResponse.file_name}`,
          id: qordobaSendFilesResponse.upload_id,
          source_columns: [],
          version_tag: ""
        }]),
        headers: this.state.jsonReqHeader
      })
      console.log('RESPONSE AFTER APPEND', responseToFilesUploaded)
    }
    this.init();
  }


  async qGetAllTranslations() {
    var pageIdArray = [this.state.qPageId];
    var languageIdArray = [];
    var anyLanguage = Object.keys(this.state.qProjectAllFiles)[0];
    if (anyLanguage === this.state.sourceLocale) {
      anyLanguage = Object.keys(this.state.qProjectAllFiles)[1];
    }
    for (var key in this.state.qProjectLanguages) {
      languageIdArray.push(this.state.qProjectLanguages[key].id);
    }
    var completeZipFile = await $.ajax({
      type: 'POST',
      url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/export_files_bulk`,
      data: JSON.stringify({
        bilingual: false,
        compress_columns: false,
        language_ids: languageIdArray,
        original_format: false,
        page_ids: pageIdArray
      }),
      headers: this.state.jsonReqHeader,
    })

    var newZip = new JSZip();
    JSZipUtils.getBinaryContent(`https://app.qordoba.com/api/file/download?token=${completeZipFile.token}&filename=${encodeURIComponent(completeZipFile.filename)}`, async (err, data) => {
      var completedZipDataObj = await newZip.loadAsync(data);
      var completedZipData = completedZipDataObj.files;
      console.log('COMPLETED ZIP DATA!!!', completedZipData)
      var abToBePublished = {};
      var qSourceContent = '';

      for (var key in completedZipData) {
        var locale = key.split('/')[0];
        if (!key.includes(this.state.sourceLocale)) {
          var myRegexp = /.*\/([a-z,_]*-[a-z,0-9]*).*.html/g;
          var regexMatches = myRegexp.exec(key);
          var templateName = regexMatches[1];
          if (templateName === `${this.state.abType}-${this.state.abId}` && this.state.qProjectAllFiles[locale][templateName].completed) {
            var finalizedZipData = await completedZipData[key].async('text');
            var bodyRegexp = /<body[\s, \S]*?>([\s,\S]*?)<\/body>/g;
            var bodyRegexMatches = bodyRegexp.exec(finalizedZipData);
            abToBePublished[locale] = bodyRegexMatches[1];
          }
        }
      }
      await this.setState({abAllTargetContent: abToBePublished, downloadAllModalOpen: true});
    });
  }


  async qGetOneTranslation(sourceBool) {
    var languageCode;
    var languageIdArray;
    var pageIdArray = [this.state.qPageId];
    if (sourceBool) {
      var languageKey = Object.keys(this.state.qProjectLanguages)[0];
      if (languageKey === this.state.sourceLocale) {
        languageKey = Object.keys(this.state.qProjectLanguages)[1];
      }
      languageCode = this.state.sourceLocale;
      languageIdArray = [this.state.qProjectLanguages[languageKey].id];
    }
    else {
      languageIdArray = [this.state.qProjectLanguages[this.state.abLanguageCode].id];
      languageCode = this.state.abLanguageCode;
    }

    var completeZipFile = await $.ajax({
      type: 'POST',
      url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/export_files_bulk`,
      data: JSON.stringify({
        bilingual: false,
        compress_columns: false,
        language_ids: languageIdArray,
        original_format: false,
        page_ids: pageIdArray
      }),
      headers: this.state.jsonReqHeader,
    })

    var newZip = new JSZip();
    JSZipUtils.getBinaryContent(`https://app.qordoba.com/api/file/download?token=${completeZipFile.token}&filename=${encodeURIComponent(completeZipFile.filename)}`, async (err, data) => {
      var completedZipDataObj = await newZip.loadAsync(data);
      var completedZipData = completedZipDataObj.files;
      console.log('COMPLETED ZIP DATA!', completedZipData)

      for (var key in completedZipData) {
        if (key.includes(languageCode)) {
          var myRegexp = /.*\/([a-z,_]*-[a-z,0-9]*).*.html/g;
          var regexMatches = myRegexp.exec(key);
          var templateName = regexMatches[1];
          if (templateName === `${this.state.abType}-${this.state.abId}`) {
            var finalizedZipData = await completedZipData[key].async('text');
            if (sourceBool) {
              if (finalizedZipData === this.state.abSourceContent) {
                await this.setState({sourceContentChanged: false, qSourceContent: finalizedZipData, loading: false})
              }
              else {
                await this.setState({sourceContentChanged: true, qSourceContent: finalizedZipData, loading: false})
              }
            }
            else {
              await this.setState({abLocaleTargetContent:this.state.abHeadContent +  finalizedZipData, loading: false});
            }
            break; 
          }
        }
      }
    });
  }




  //React UI
  render() {
    if (!this.state.loading) {
      if (this.state.abId) {
        if (this.state.abFileExistsInQ) {
          if (this.state.abFileCompletedInQ) {
            return (
              <div id='q-translation-status-container-email'>
                <div className="q-nav-bar">
                  <LanguageDropdown dropdownValue={this.state.dropdownValue} sourceLocale={this.state.sourceLocale} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
                  <div onClick={this.init} className='q-nav-item' id='q-refresh'>
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                  </div>
                  <div className='q-nav-item'>
                    <button disabled={!this.state.sourceContentChanged} className='btn img-btn pull-left' onClick={this.qFileUpload} type="submit" id='q-upload-button'> Re-upload changed template to Qordoba </button>
                  </div>
                  <DownloadAllButton qSourceContent={this.state.qSourceContent} downloadAllModalOpen={this.state.downloadAllModalOpen} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
                </div>
                <TranslationPreview handleDownloadAllClose={this.handleDownloadAllClose} abLanguageCode={this.state.abLanguageCode} disabled={this.state.qTranslationStatus !== 'completed'} abTranslationStatuses={this.state.abTranslationStatuses} qFileUpload={this.qFileUpload} abLocaleTargetContent={this.state.abLocaleTargetContent} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
              </div>
            )
          }
          else {
            return (
              <div className='q-translation-status-container'>
                <div className="q-nav-bar">
                  <LanguageDropdown dropdownValue={this.state.dropdownValue} sourceLocale={this.state.sourceLocale} disabled={true} abFileExistsInQ={this.state.abFileExistsInQ} abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'}  handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
                  <div onClick={this.init} className='q-nav-item' id='q-refresh'>
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                  </div>
                  <div className='q-nav-item'>
                    <button disabled={!this.state.sourceContentChanged} className='btn img-btn pull-left' onClick={this.qFileUpload} type="submit" id='q-upload-button'> Re-upload changed template to Qordoba </button>
                  </div>
                  <DownloadAllButton qSourceContent={this.state.qSourceContent} downloadAllModalOpen={this.state.downloadAllModalOpen} disabled={true} abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
                </div>
                <p className='helptext'>This template is currently being translated in Qordoba. Please return when translators have finished!</p>
              </div>
            )
          }
        }
        else {
          return (
            <div className='q-translation-status-container'>
              <div className="q-nav-bar">
                <LanguageDropdown dropdownValue={this.state.dropdownValue} sourceLocale={this.state.sourceLocale} disabled={true} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
                <div className='q-nav-item' id='q-refresh'>
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                </div>
                <div className='q-nav-item'>
                  <button className='btn img-btn' onClick={this.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
                </div>
                <DownloadAllButton qSourceContent={this.state.qSourceContent} downloadAllModalOpen={this.state.downloadAllModalOpen} disabled={true} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
              </div>
              <p className='helptext'>This template is not yet in Qordoba. Please click the button above to start translating! </p>
            </div>
          )
        }
      }
      else {
        return (
          <div className='q-translation-status-container'>
            <div className="q-nav-bar">
              <LanguageDropdown dropdownValue={this.state.dropdownValue} sourceLocale={this.state.sourceLocale} disabled={true} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
              <div className='q-nav-item' id='q-refresh'>
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </div>
              <div className='q-nav-item'>
                <button disabled={!this.state.sourceContentChanged} className='btn img-btn' onClick={this.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
              </div>
              <DownloadAllButton downloadAllModalOpen={this.state.downloadAllModalOpen} disabled={true} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
            </div>
            <p className='helptext'>This template does not yet have a unique ID assigned to it. Please make a change to the template, save it, and refresh. </p>
          </div>
        )
      }
    }
    else {
      return (
        <div className='q-translation-status-container'>
          <Spinner name='double-bounce' />
        </div>
      )
    }
  }
}
export default App;
