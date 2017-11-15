console.log('hi react app')
import React from 'react';
import $ from 'jquery';
import styles from './main.css';
import TranslationPreview from './TranslationPreview.js';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import Spinner from 'react-spinkit';
import LoginModal from './LoginModal.js';
import NavBar from './NavBar.js';;
import Modal from 'react-modal';
import CanvasSelectionModal from './CanvasSelectionModal.js';
import CanvasCreationModal from './CanvasCreationModal.js';

//TODO
  //Confirm that replacing ' ' with &nbsp fixes Postmates' problem
  //Add default behaviors for Canvas (i.e. only 0 or 1 canvas found)
  //Add canvas switcher dropdown to Nav
  //Need to actually set qSourceLocale from API call

  //FEATURES
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
      qAuthToken: '',
      qAllOrgs: [],
      qAllProjects: [],
      qOrganizationId: 0,
      qProjectId: 0,

      qProjectLanguages: {},
      qLocaleTranslationStatus: '',
      qSourceContent: '',

      abLanguageCode: '',
      abLanguageName: '',
      abType: '',
      abId: 0,
      abCanvasSelectionInProgress: false,
      abCanvasExistInQ: true,
      abTitle: '',

      abFileExistsInQ: false,
      abFileCompletedInQ: false,
      abSourceContent: '',
      abHeadContent: '',
      abLocaleTargetContent: '',
      abAllTargetContent: {},
      
      qSourceLocale: 'en-us', //need to actually set,
      jsonReqHeader: {},
      downloadAllModalOpen: false,
      loading: true,
      languageDropdownValue: 0,
      sourceContentChanged: false,
      randomLangId: '',

      qLoginModalOpen: false,
      qModalStyle: {overlay: {position: 'absolute'}, content: {left: '10px', right: '10px'}}
    }
    this.qGetLanguages = this.qGetLanguages.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.qFileUpload = this.qFileUpload.bind(this);
    this.qGetOneTranslation = this.qGetOneTranslation.bind(this);
    this.handleDownloadAllClick = this.handleDownloadAllClick.bind(this);
    this.handleDownloadAllClose = this.handleDownloadAllClose.bind(this);
    this.afterModalOpen = this.afterModalOpen.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.qHandleLoginSubmit = this.qHandleLoginSubmit.bind(this);
    this.qHandleOrgSubmit = this.qHandleOrgSubmit.bind(this);
    this.qHandleConfigSubmit = this.qHandleConfigSubmit.bind(this);
    this.qHandleProjectSubmit = this.qHandleProjectSubmit.bind(this);
    this.handleCanvasIdSubmit = this.handleCanvasIdSubmit.bind(this);
    this.handleCanvasNoMatchClick = this.handleCanvasNoMatchClick.bind(this);
    this.handleCanvasSelect = this.handleCanvasSelect.bind(this);
    this.init = this.init.bind(this);
  }


  //React Data
  async componentDidUpdate() {
    console.log('STATE', this.state)
  }


  async init() {
    this.setState({loading: true, abFileExistsInQ: false, abFileCompletedInQ: false})
    try {
      await this.abCheckCookie();
      await this.qGetLanguages();
      await this.abGetTemplateContent();
      await this.abGetTemplate();
      // await this.qGetAllFiles();
      await this.qGetTranslationStatuses();
      if (this.state.abFileExistsInQ) {
        await this.qGetOneTranslation(true);
      }
    }
    catch(err) {
      console.log('ERROR FETCHING DATA FROM Q', err)
      this.setState({qLoginModalOpen: true})
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
    await this.setState({languageDropdownValue: e.target.value, abLanguageName: selectedOption.dataset.name, abLanguageCode: selectedOption.dataset.locale});
    await this.qGetOneTranslation(false);
    var qFileTitle = `${this.state.abType}-${this.state.abId}`;
    if (this.state.qTranslationStatusObj[this.state.abLanguageCode]) {
      if (this.state.qTranslationStatusObj[this.state.abLanguageCode].completed) {
        await this.setState({qLocaleTranslationStatus: 'completed', loading: false})
      }
      else {
        await this.setState({qLocaleTranslationStatus: 'enabled', loading: false})
      }
    }
    else {
      await this.setState({qLocaleTranslationStatus: 'none', loading: false})
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


  qModalGetParentSelector() {
    return document.querySelector('#q-app-container')
  }


  handleLoginModalClose(e) {

  }

  async handleLogoutClick(e) {
    this.abDeleteCookie();
    await this.setState({qAuthToken: '', qOrganizationId: 0, qProjectId: 0})
    this.init();
  }

  async handleCanvasSelect(e) {
    console.log('canvas selected', e.target.value)
    await this.setState({abId: e.target.value, abCanvasSelectionInProgress: false})
    this.init();
  }

  async handleCanvasNoMatchClick() {
    await this.setState({abCanvasExistInQ: false})
  }

  async handleCanvasIdSubmit(e) {
    e.preventDefault();
    var input = e.target.querySelector('input.q-input');
    console.log('INPUT FROM CANVAS', input)
    await this.setState({abId: input.value, canvasCreationModalOpen: false})
    // this.init();
    this.qFileUpload();
  }


  async qHandleLoginSubmit(e) {
    var qOrgArray = [];
    e.preventDefault();
    var usernameInput = e.target.querySelector('#q-username-input');
    var username = usernameInput.value;
    var passwordInput = e.target.querySelector('#q-password-input');
    var password = passwordInput.value;
    var authResponse = await $.ajax({
      url: 'https://app.qordoba.com/api/login',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      })
    })
    var qOrgObjects = authResponse.loggedUser.organizations;
    for (var i = 0; i < qOrgObjects.length; i++) {
      var qOrgObject = {id: qOrgObjects[i].id, name: qOrgObjects[i].name};
      qOrgArray.push(qOrgObject);
    }
    document.cookie = `qAuthToken=${authResponse.token}`;
    document.cookie = `qAllOrgs=${JSON.stringify(qOrgArray)}`;
    if (qOrgArray.length > 1) {
      await this.setState({qAuthToken: authResponse.token, qAllOrgs: qOrgArray, jsonReqHeader: {'X-AUTH-TOKEN': authResponse.token,'Content-Type': 'application/json'}})
    }
    else {
      await this.setState({qAuthToken: authResponse.token, qAllOrgs: qOrgArray, qOrganizationId: JSON.stringify(qOrgArray[0].id), jsonReqHeader: {'X-AUTH-TOKEN': authResponse.token,'Content-Type': 'application/json'}})
      await this.qGetAllProjects();
    }
  }

  async qHandleConfigSubmit() {
    document.cookie = `qOrganizationId=${this.state.qOrganizationId}`;
    document.cookie = `qProjectId=${this.state.qProjectId}`;
    console.log('cookie value', document.cookie.replace(/(?:(?:^|.*;\s*)qProjectId\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
    await this.setState({qLoginModalOpen: false});
    this.init();
  }


  async qHandleOrgSubmit(e) {
    var dropdownMenu = e.target;
    var selectedOption = dropdownMenu.querySelector(`[value="${e.target.value}"]`);
    // dropdownMenu.value = selectedOption.value;
    await this.setState({qOrganizationId: e.target.value});
    await this.qGetAllProjects();
  }


  async qHandleProjectSubmit(e) {
    var dropdownMenu = e.target;
    var selectedOption = dropdownMenu.querySelector(`[value="${e.target.value}"]`);
    console.log('t value', e.target.value);
    console.log('SELECTED OPTION', selectedOption);
    dropdownMenu.value = selectedOption.value;
    await this.setState({qProjectId: String(e.target.value)})
  }




  //Appboy Data
  async abGetTemplate() {
    var abType;
    var abId;
    var urlPathArray = window.location.pathname.split('/');
    var modalOpen;
    var articleTitleSpan = document.querySelector('span.editable-heading');
    console.log('URL PATH ARRAY', urlPathArray)
    for (var i = 0; i < urlPathArray.length; i++) {
      if (urlPathArray[i] === 'email_templates') {
        abType = urlPathArray[i];
        abId = window.location.search.split('=')[1];
        await this.setState({abType: abType, abId: abId, abTitle: articleTitleSpan.innerHTML})
        break;
      }
      else if (urlPathArray[i] === 'canvas') {
        abType = `${urlPathArray[i]}_${urlPathArray[i + 1]}`;
        modalOpen = this.state.canvasCreationModalOpen;
        if (this.state.abId) {
          abId = this.state.abId;
          await this.setState({abType: abType, abTitle: articleTitleSpan.innerHTML, abId: abId})
        }
        else {
          await this.setState({abType: abType, abTitle: articleTitleSpan.innerHTML, abCanvasSelectionInProgress: true})
          await this.qGetCanvasFileMatches();
        }
        break;
      }
    } 
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
          var sourceContent = sourceContent.replace(/></g, '>\n<');
          sourceContent = sourceContent.replace(/<script.*<\/script>/g, '');
          await this.setState({sourceIframe: sourceIframe, abSourceContent: sourceContent, abHeadContent: headRegexMatches[1]});
        }
      }
    }
  }


  async abCheckCookie() {
    var qAuthCookie = document.cookie.replace(/(?:(?:^|.*;\s*)qAuthToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var qOrgCookie = document.cookie.replace(/(?:(?:^|.*;\s*)qAllOrgs\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var qOrgIdCookie = document.cookie.replace(/(?:(?:^|.*;\s*)qOrganizationId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var qProjectIdCookie = document.cookie.replace(/(?:(?:^|.*;\s*)qProjectId\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    if (qAuthCookie) {
      if (qOrgCookie) {
        if (qOrgIdCookie) {
          if (qProjectIdCookie) {
            await this.setState({qAuthToken: qAuthCookie, qProjectId: String(qProjectIdCookie), qOrganizationId: String(qOrgIdCookie), qAllOrgs: JSON.parse(qOrgCookie), jsonReqHeader: {'X-AUTH-TOKEN': qAuthCookie,'Content-Type': 'application/json'}});
          }
          else {
            await this.setState({qAuthToken: qAuthCookie, qOrganizationId: String(qOrgIdCookie), qAllOrgs: JSON.parse(qOrgCookie), jsonReqHeader: {'X-AUTH-TOKEN': qAuthCookie,'Content-Type': 'application/json'}});
          }
        }
        else {
          await this.setState({qAuthToken: qAuthCookie, qAllOrgs: JSON.parse(qOrgCookie), jsonReqHeader: {'X-AUTH-TOKEN': qAuthCookie,'Content-Type': 'application/json'}})
        }
      }
      else {
        await this.setState({qAuthToken: qAuthCookie, jsonReqHeader: {'X-AUTH-TOKEN': qAuthCookie,'Content-Type': 'application/json'}})
      }
    }
    else {
      throw new Error ('No token found on cookie')
    }
  }


  abDeleteCookie() {
    document.cookie = 'qAuthToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'qAllOrgs=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'qOrganizationId=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }


  getParentSelector() {
    return document.querySelector('#q-app-container')
  }



  //QORDOBA API CALLS
  async qGetAllProjects() {
    var allProjectsResponse = await $.ajax({
      type: 'GET',
      url: `https://app.qordoba.com/api/organizations/${this.state.qOrganizationId}/projects?limit=100&offset=0&search_string=strings`,
      headers: this.state.jsonReqHeader
    })
    console.log('RESPONSE TO FETCHING PROJECTS', allProjectsResponse)
    if (allProjectsResponse.projects.length === 1) {
      await this.setState({qProjectId: allProjectsResponse.projects[0].id, qAllProjects: allProjectsResponse, qLoginModalOpen: false})
    }
    else {
      await this.setState({qAllProjects: allProjectsResponse.projects})
    }
  }


  async qGetLanguages() {
    var randomLangId;
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
      if (!randomLangId && qProjectLanguages[i] !== this.state.abLanguageCode) {
        randomLangId = qProjectLanguages[i].id;
      }
      qLangs[qProjectLanguages[i].code] = {id: qProjectLanguages[i].id, name: qProjectLanguages[i].name}
    }
    await this.setState({qProjectLanguages: qLangs, randomLangId: randomLangId});
  }


  async qCheckLanguageComplete() {

  }



  async qGetTranslationStatuses() {
    console.log('calling qGetTranslationStatuses')
    var languageId;
    var allLocalesObj = {};
    var abFileExistsInQ = false;
    var abFileCompletedInQ = false;
    for (var key in this.state.qProjectLanguages) {
      if (key !== this.state.qSourceLocale) {
        languageId = this.state.qProjectLanguages[key].id;
        var currentLocaleObj = {};
        var qordobaResponse = await $.ajax({
          type: 'POST',
          url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/languages/${languageId}/page_settings/search`, 
          headers: this.state.jsonReqHeader,
          data: JSON.stringify({title: `${this.state.abType}-${this.state.abId}`})
        })
        if (qordobaResponse.pages.length === 1) {
          abFileExistsInQ = true; 
          currentLocaleObj.completed = qordobaResponse.pages[0].completed;
          currentLocaleObj.enabled = qordobaResponse.pages[0].enabled;
          currentLocaleObj.createdAt = qordobaResponse.pages[0].created_at;
          currentLocaleObj.updatedAt = qordobaResponse.pages[0].update;
          currentLocaleObj.qArticleId = qordobaResponse.pages[0].page_id;
          if (currentLocaleObj.completed && currentLocaleObj.enabled) {
            abFileCompletedInQ = true;
          }
        }
        else if (qordobaResponse.pages.length > 1) {
          throw new Error('found more than one match')
        }
        allLocalesObj[key] = currentLocaleObj;
      }
    }
    await this.setState({qPageId: currentLocaleObj.qArticleId, abFileExistsInQ: abFileExistsInQ, abFileCompletedInQ: abFileCompletedInQ, qTranslationStatusObj: allLocalesObj})
  }


  async qGetCanvasFileMatches() {
    var qCanvasFileMatches = {};

    var matchingProjects = await $.ajax({
      type: 'POST',
      url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/languages/${this.state.randomLangId}/page_settings/search`,
      headers: this.state.jsonReqHeader,
      data: JSON.stringify({title: this.state.abType})
    })

    console.log('MATCHING PROJECTS!!', matchingProjects.pages)

    this.setState({qCanvasFileMatches: matchingProjects.pages});
  }

  async qFileUpload() {
    if (this.state.abId === 0) {
      await this.setState({canvasCreationModalOpen: true})
    }
    else {
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
  }


  async qGetAllTranslations() {
    var pageIdArray = [this.state.qPageId];
    var languageIdArray = [];
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
        console.log('KEY', key)
        var locale = key.split('/')[0];
        if (!key.includes(this.state.qSourceLocale)) {
          var myRegexp = /.*\/([a-z,_,0-9]*-[a-z,0-9,\s,A-Z]*).*.html/g;
          var regexMatches = myRegexp.exec(key);
          var templateName = regexMatches[1];
          if (templateName === `${this.state.abType}-${this.state.abId}` && this.state.qTranslationStatusObj[locale].completed) {
            var finalizedZipData = await completedZipData[key].async('text');
            console.log('this file zip data', finalizedZipData)
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
      if (languageKey === this.state.qSourceLocale) {
        languageKey = Object.keys(this.state.qProjectLanguages)[1];
      }
      languageCode = this.state.qSourceLocale;
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

    console.log('COMPLETE ZIP FILE!', completeZipFile)

    var newZip = new JSZip();
    JSZipUtils.getBinaryContent(`https://app.qordoba.com/api/file/download?token=${completeZipFile.token}&filename=${encodeURIComponent(completeZipFile.filename)}`, async (err, data) => {
      var completedZipDataObj = await newZip.loadAsync(data);
      var completedZipData = completedZipDataObj.files;
      console.log('COMPLETED ZIP DATA!', completedZipData)

      for (var key in completedZipData) {
        if (key.includes(languageCode)) {
          var myRegexp = /.*\/([a-z,_,0-9]*-[a-z,0-9,\s,A-Z]*).*.html/g;
          var regexMatches = myRegexp.exec(key);
          var templateName = regexMatches[1];
          console.log('FOUND SOURCE BOOL', templateName, `${this.state.abType}-${this.state.abId}`)
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
      if (!this.state.qLoginModalOpen) {
        if (!this.state.canvasCreationModalOpen) {
          if (this.state.abId || !this.state.abId && this.state.abCanvasSelectionInProgress && !this.state.abCanvasExistInQ) {
            if (this.state.abFileExistsInQ) {
              if (this.state.abFileCompletedInQ) {
                return (
                  <div id='q-translation-status-container-email'>
                    <NavBar abFileCompletedInQ={this.state.abFileCompletedInQ} abFileExistsInQ={this.state.abFileExistsInQ} handleLogoutClick={this.handleLogoutClick} qModalGetParentSelector={this.qModalGetParentSelector} qModalStyle={this.state.qModalStyle} qSourceContent={this.state.qSourceContent} downloadAllModalOpen={this.state.downloadAllModalOpen} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} qFileUpload={this.qFileUpload} sourceContentChanged={this.state.sourceContentChanged} languageDropdownValue={this.state.languageDropdownValue} qSourceLocale={this.state.qSourceLocale} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages} init={this.init} qTranslationStatusObj={this.state.qTranslationStatusObj}  />
                    <TranslationPreview handleDownloadAllClose={this.handleDownloadAllClose} abLanguageCode={this.state.abLanguageCode} disabled={this.state.qLocaleTranslationStatus !== 'completed'} abTranslationStatuses={this.state.abTranslationStatuses} qFileUpload={this.qFileUpload} abLocaleTargetContent={this.state.abLocaleTargetContent} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
                  </div>
                )
              }
              else {
                return (
                  <div className='q-translation-status-container'>
                    <NavBar abFileCompletedInQ={this.state.abFileCompletedInQ} abFileExistsInQ={this.state.abFileExistsInQ} handleLogoutClick={this.handleLogoutClick} qModalGetParentSelector={this.qModalGetParentSelector} qModalStyle={this.state.qModalStyle} qSourceContent={this.state.qSourceContent} downloadAllModalOpen={this.state.downloadAllModalOpen} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} qFileUpload={this.qFileUpload} sourceContentChanged={this.state.sourceContentChanged} languageDropdownValue={this.state.languageDropdownValue} qSourceLocale={this.state.qSourceLocale} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages} init={this.init} qTranslationStatusObj={this.state.qTranslationStatusObj}  />
                    <p className='helptext'>This template is currently being translated in Qordoba. Please return when translators have finished!</p>
                  </div>
                )
              }
            }
            else {
              return (
                <div className='q-translation-status-container'>
                  <NavBar abFileCompletedInQ={this.state.abFileCompletedInQ} abFileExistsInQ={this.state.abFileExistsInQ} handleLogoutClick={this.handleLogoutClick} qModalGetParentSelector={this.qModalGetParentSelector} qModalStyle={this.state.qModalStyle} qSourceContent={this.state.qSourceContent} downloadAllModalOpen={this.state.downloadAllModalOpen} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} qFileUpload={this.qFileUpload} sourceContentChanged={this.state.sourceContentChanged} languageDropdownValue={this.state.languageDropdownValue} qSourceLocale={this.state.qSourceLocale} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages} init={this.init} qTranslationStatusObj={this.state.qTranslationStatusObj}  />
                  <p className='helptext'>This template is not yet in Qordoba. Please click the button above to start translating! </p>
                </div>
              )
            }
          }
          else {
            if (this.state.abCanvasSelectionInProgress) {
              return (
                  <CanvasSelectionModal qCanvasFileMatches={this.state.qCanvasFileMatches} abId={this.state.abId} abCanvasSelectionInProgress={this.state.abCanvasSelectionInProgress} qModalGetParentSelector={this.qModalGetParentSelector} handleCanvasModalClose={this.handleCanvasModalClose} qModalStyle={this.state.qModalStyle} handleCanvasSelect={this.handleCanvasSelect} handleCanvasNoMatchClick={this.handleCanvasNoMatchClick} />
              )
            }
            else {
              return (
                <div className='q-translation-status-container'>
                  <NavBar abFileCompletedInQ={this.state.abFileCompletedInQ} abFileExistsInQ={this.state.abFileExistsInQ} handleLogoutClick={this.handleLogoutClick} qModalGetParentSelector={this.qModalGetParentSelector} qModalStyle={this.state.qModalStyle} qSourceContent={this.state.qSourceContent} downloadAllModalOpen={this.state.downloadAllModalOpen} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} qFileUpload={this.qFileUpload} sourceContentChanged={this.state.sourceContentChanged} languageDropdownValue={this.state.languageDropdownValue} qSourceLocale={this.state.qSourceLocale} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages} init={this.init} qTranslationStatusObj={this.state.qTranslationStatusObj}  />
                  <p className='helptext'>This template does not yet have a unique ID assigned to it. Please make a change to the template, save it, and refresh. </p>
                </div>
              )
            }
          }
        }
        else {
          return (
            <CanvasCreationModal handleCanvasIdSubmit={this.handleCanvasIdSubmit} qModalStyle={this.state.qModalStyle} handleCanvasModalClose={this.handleCanvasModalClose} qModalGetParentSelector={this.qModalGetParentSelector} canvasCreationModalOpen={this.state.canvasCreationModalOpen} />
          )
        }
      }
      else {
        //render prompt and set state accordingly
        return (
          <div className='q-translation-status-container'>
            <LoginModal handleLogoutClick={this.handleLogoutClick} qHandleProjectSubmit={this.qHandleProjectSubmit} qAllProjects={this.state.qAllProjects} qProjectId={this.state.qProjectId} qHandleConfigSubmit={this.qHandleConfigSubmit} qOrganizationId={this.state.qOrganizationId} qHandleOrgSubmit={this.qHandleOrgSubmit} qAllOrgs={this.state.qAllOrgs} qAuthenticated={!!this.state.qAuthToken} qHandleLoginSubmit={this.qHandleLoginSubmit} qModalGetParentSelector={this.qModalGetParentSelector} qLoginModalOpen={this.state.qLoginModalOpen} handleLoginClose={this.handleLoginClose} qModalStyle={this.state.qModalStyle} />
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
