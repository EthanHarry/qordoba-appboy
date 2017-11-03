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


//TODO
  //Send update call instead of upload when source content already exists
  //Render some successful upload msg 
  //auth
  //Fix event listeners so that extension can fire multiple times without reload
  //Fix config import and usage
  //Webpack config
  //Loading spinner while w8ing for init
  //Stop alert from firing every time
  //Set App header contents
  //Determine where to put classes on React containers (we have 2 containers -- target and container in App)
  //Get rid of iframe react Component dependency -- doesnt take srcdoc only url



//NEXT
  //1. Fix how we identify abSourceContent -- after translating, we cant just grab the text content
  //2. MUST -- fix how we ID files -- id is query param

class App extends React.Component {
  constructor(props) {
    super(props);

    //Need to actually render from auth
    this.state = {
      qAuthToken: '74872eed-b0a6-4053-a83a-19170fd4ae90',
      qOrganizationId: '3168',
      qProjectId: '5843',
      qProjectLanguages: {},
      qProjectLocaleFiles: {},
      qProjectAllFiles: {},
      qTranslationStatus: '',
      abLanguageCode: '',
      abLanguageName: '',
      abType: '',
      abId: '',
      abTitle: '',
      abSourceContent: '',
      abHeadContent: '',
      abLocaleTargetContent: '',
      abAllTargetContent: {},
      abTranslationStatuses: {},
      abContentToPublish: {},
      sourceLocale: 'en-us', //need to actually set,
      jsonReqHeader: {},
      downloadAllModalOpen: false
    }
    this.state.jsonReqHeader = {'X-AUTH-TOKEN': this.state.qAuthToken,'Content-Type': 'application/json'};
    this.qGetLanguages = this.qGetLanguages.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.qFileUpload = this.qFileUpload.bind(this);
    this.qGetOneTranslation = this.qGetOneTranslation.bind(this);
    this.handleDownloadAllClick = this.handleDownloadAllClick.bind(this);
    this.handleDownloadAllClose = this.handleDownloadAllClose.bind(this);
  }


  //React Data
  async componentDidUpdate() {
    console.log('STATE', this.state)
  }

  //TODO should this go after qGetAllFiles? I feel like the stuff that triggers rerender should come first and the safe stuff (i.e. this) should come after


  async componentDidMount() {
    console.log('COMPONENT DID MOUNT')
    await this.qGetLanguages();
    await this.qGetAllFiles();
    this.abGetTemplateContent();
    this.abGetTemplate();
  }


  async handleLanguageChange(e) {
    var dropdownMenu = e.target;
    var selectedOption = dropdownMenu.querySelector(`[data-name="${e.target.value}"]`);
    await this.setState({abLanguageName: selectedOption.dataset.name, abLanguageCode: selectedOption.dataset.locale});
    //TODO this is assuming we send up articles to Qordoba with type and ID NOT name
    await this.qGetSelectedFiles();
    var qFileTitle = `${this.state.abType}-${this.state.abId}`;
    await this.qGetAllTranslations();
    if (this.state.qProjectLocaleFiles[qFileTitle]) {
      if (this.state.qProjectLocaleFiles[qFileTitle].completed) {
        await this.qGetOneTranslation();
        await this.setState({qTranslationStatus: 'completed'})
      }
      else {
        await this.setState({qTranslationStatus: 'enabled'})
      }
    }
    else {
      await this.setState({qTranslationStatus: 'none'})
      console.log('setting state to untranslated')
    }
      //TODO maybe check if the file has actually changed before we make this available?
  }

  async handleDownloadAllClick(e) {
    await this.abPublishAllTranslations();
    this.setState({ downloadAllModalOpen: true })
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
    console.log('iFramesArray', iFramesArray)
    for (var i = 0; i < iFramesArray.length; i++) {
      if (iFramesArray[i].classList.length !== 0 && iFramesArray[i].id !== 'q-preview-iframe') {
        var iframeHtml = iFramesArray[i].contentWindow.document.documentElement.outerHTML;
        // console.log('IFRMAEHTML', i, iframeHtml)

        var headRegexp = /<head[\s, \S]*?>([\s,\S]*?)<\/head>/g;
        var headRegexMatches = headRegexp.exec(iframeHtml);

        if (iframeHtml.includes('{% else %}')) {
          console.log('FOUND TRANSLATIONS -- GRABBING EVERYTHING BETWEEN TAGS');
          var tagRegExp = /{% else %}([\s,\S]*){% endif %}/g;
          var tagRegexMatches = tagRegExp.exec(iframeHtml);
          console.log('TAG REGEX MATCHES', tagRegexMatches[1]);
          await this.setState({abSourceContent: tagRegexMatches[1], abHeadContent: headRegexMatches[1]});
        }
        else {
          var bodyRegexp = /<body[\s, \S]*?>([\s,\S]*?)<\/body>/g;
          var bodyRegexMatches = bodyRegexp.exec(iframeHtml);
          console.log('BODY REGEX MATCHES', bodyRegexMatches[1]);
          console.log('head REGEX MATCHES', headRegexMatches[1]);
          await this.setState({abSourceContent: bodyRegexMatches[1], abHeadContent: headRegexMatches[1]});
        }
      }
    }
  }


  async abPublishAllTranslations() {
    // var textEditor = document.querySelector('div.ace_content');
    // var textLayer = textEditor.querySelector('.ace_text-layer');
    // textLayer.remove();


  }




  //QORDOBA API CALLS
  async qGetLanguages() {
    var projectDetailCall = await $.ajax({
      type: 'GET',
      url: `https://app.qordoba.com/api/organizations/${this.state.qOrganizationId}/projects?limit=1&offset=0&limit_to_projects=${this.state.qProjectId}`,
      headers: this.state.jsonReqHeader
    })
    var qProjectLanguages = projectDetailCall.projects[0].target_languages;
    for (var i = 0; i < qProjectLanguages.length; i++) {
      var qLangs = Object.assign({}, this.state.qProjectLanguages);
      qLangs[qProjectLanguages[i].code] = {id: qProjectLanguages[i].id, name: qProjectLanguages[i].name}
      await this.setState({qProjectLanguages: qLangs});
    }
  }


  async qGetSelectedFiles() {
    if (Object.keys(this.state.qProjectAllFiles).length > 0 && this.state.qProjectAllFiles[this.state.abLanguageCode][`${this.state.abType}-${this.state.abId}`]) {
      var qProjectFiles = this.state.qProjectAllFiles[this.state.abLanguageCode];
      console.log('NOT FETCHING PROJECT FILES CUZ i already got em', qProjectFiles)
      await this.setState({qProjectLocaleFiles: qProjectFiles})
    }
    else {
      var qordobaLanguageId = this.state.qProjectLanguages[this.state.abLanguageCode].id;
      var qordobaResponse = await $.ajax({
        type: 'POST',
        url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/languages/${qordobaLanguageId}/page_settings/search`,
        headers: this.state.jsonReqHeader,
        data: JSON.stringify({})
      })
      var qordobaFiles = qordobaResponse.pages;
      var allQFilesObj = Object.assign({}, this.state.qProjectLocaleFiles);
      for (var i = 0; i < qordobaFiles.length; i++) {
        var qordobaFileObj = {};
        var fileNameNoHtml = qordobaFiles[i].url.replace('.html', '');
        qordobaFileObj.completed = qordobaFiles[i].completed;
        qordobaFileObj.enabled = qordobaFiles[i].enabled;
        qordobaFileObj.createdAt = qordobaFiles[i].created_at;
        qordobaFileObj.updatedAt = qordobaFiles[i].update;
        qordobaFileObj.qArticleId = qordobaFiles[i].page_id;
        allQFilesObj[fileNameNoHtml] = qordobaFileObj;
      }
      await this.setState({qProjectLocaleFiles: allQFilesObj})
    }
  }


  async qGetAllFiles() {
    console.log('GETTING ALL FILES')
    var allQFilesObj = Object.assign({}, this.state.qProjectAllFiles);
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
      var abFileExistsInQ = false;
      var qFileTranslationStatus;
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
        }
      }
    }
    if (Object.keys(currentFileObj).length > 0) {
      abFileExistsInQ = true;
      if (currentFileObj.completed) {
        qFileTranslationStatus = 'completed';
      }
      else {
       qFileTranslationStatus = 'enabled'; 
      }
    }
    else {
      qFileTranslationStatus = 'none'; 
    }
    await this.setState({abFileExistsInQ: abFileExistsInQ, qTranslationStatus: qFileTranslationStatus, qProjectAllFiles: allQFilesObj, qProjectLocaleFiles: currentFileObj})
  }


  async qFileUpload() {
    console.log('uploading file')
    var fileToUpload = new File([this.state.abSourceContent], `${this.state.abType}-${this.state.abId}`, {
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

    qordobaSendFilesRequest.url = `https://app.qordoba.com/api/organizations/${this.state.qOrganizationId}/upload/uploadFile_anyType?content_type_code=stringsHtml&projectId=${this.state.qProjectId}`;
    var qordobaSendFilesResponse = await $.ajax(qordobaSendFilesRequest);
    console.log('ORIGINAL RESPONSE', qordobaSendFilesResponse);
    var responseToFilesUploaded = await $.ajax({
      type: 'POST',
      url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/append_files`,
      data: JSON.stringify([{
        content_type_codes: [{name: "Html String", content_type_code: "stringsHtml", extensions: ["html"]}],
        file_name: `${qordobaSendFilesResponse.file_name}.html`,
        id: qordobaSendFilesResponse.upload_id,
        source_columns: [],
        version_tag: ""
      }]),
      headers: this.state.jsonReqHeader
    })
    console.log('RESPONSE AFTER APPEND', responseToFilesUploaded)
    this.setState({abFileExistsInQ: true});
  }


  async qGetAllTranslations() {
    var pageIdArray = [];
    var languageIdArray = [];
    var anyLanguage = Object.keys(this.state.qProjectAllFiles)[0];

    for (var key in this.state.qProjectAllFiles[anyLanguage]) {
      pageIdArray.push(this.state.qProjectAllFiles[anyLanguage][key].qArticleId);
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

    console.log('COMPLETED ZIP !!!!!!PICK UP HERE!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PICK UP HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', completeZipFile)
    var newZip = new JSZip();
    JSZipUtils.getBinaryContent(`https://app.qordoba.com/api/file/download?token=${completeZipFile.token}&filename=${encodeURIComponent(completeZipFile.filename)}`, async (err, data) => {


      var completedZipDataObj = await newZip.loadAsync(data);
      var completedZipData = completedZipDataObj.files;

      var abToBePublished = {};

      for (var key in completedZipData) {
        var locale = key.split('/')[0];
        if (!key.includes(this.state.sourceLocale)) {
          console.log('found file to include', key)
          var myRegexp = /.*\/([a-z,_]*-[a-z,0-9]*)-.*.html/g;
          var regexMatches = myRegexp.exec(key);
          var templateName = regexMatches[1];
          if (templateName === `${this.state.abType}-${this.state.abId}` && this.state.qProjectAllFiles[locale][templateName].completed) {
            var finalizedZipData = await completedZipData[key].async('text');
            var bodyRegexp = /<body[\s, \S]*?>([\s,\S]*?)<\/body>/g;
            var bodyRegexMatches = bodyRegexp.exec(finalizedZipData);
            abToBePublished[locale] = bodyRegexMatches[1];
            //TODO FIX SO I DONT CALL SETSTATE TWICE HERE -- ONCE FOR .COMPLETED AND ONCE FOR ZIP DATA
          }
        }
      }
      await this.setState({abAllTargetContent: abToBePublished});
    });
  }


  async qGetOneTranslation() {
    var pageIdArray = [];
    for (var key in this.state.qProjectLocaleFiles) {
      pageIdArray.push(this.state.qProjectLocaleFiles[key].qArticleId);
    }

    var completeZipFile = await $.ajax({
      type: 'POST',
      url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/export_files_bulk`,
      data: JSON.stringify({
        bilingual: false,
        compress_columns: false,
        language_ids: [this.state.qProjectLanguages[this.state.abLanguageCode].id],
        original_format: false,
        page_ids: pageIdArray
      }),
      headers: this.state.jsonReqHeader,
    })
    console.log('RESPONSE COMP FILE', completeZipFile)

    var newZip = new JSZip();
    JSZipUtils.getBinaryContent(`https://app.qordoba.com/api/file/download?token=${completeZipFile.token}&filename=${encodeURIComponent(completeZipFile.filename)}`, async (err, data) => {

      console.log('first data', data)
      var completedZipDataObj = await newZip.loadAsync(data);
      var completedZipData = completedZipDataObj.files;

      for (var key in completedZipData) {
        if (key.includes(this.state.abLanguageCode)) {
          var myRegexp = /.*\/([a-z,_]*-[a-z,0-9]*)-.*.html/g;
          var regexMatches = myRegexp.exec(key);
          var templateName = regexMatches[1];
          if (templateName === `${this.state.abType}-${this.state.abId}`) {
            var finalizedZipData = await completedZipData[key].async('text');
            await this.setState({abLocaleTargetContent: finalizedZipData});
            break; //TODO FIX SO I DONT CALL SETSTATE TWICE HERE -- ONCE FOR .COMPLETED AND ONCE FOR ZIP DATA
          }
        }
      }
    });
  }




  //React UI
  render() {
    if (this.state.qTranslationStatus === 'none') {
      //Render blurb explaining that resource not in Q
      //Render button to send
      return (
        <div className='q-translation-status-container'>
          <div className="q-nav-bar">
            <LanguageDropdown abFileExistsInQ={this.state.abFileExistsInQ} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
            <div className='q-nav-item' id='q-refresh'>
              <i class="fa fa-refresh" aria-hidden="true"></i>
            </div>
            <DownloadAllButton abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
          </div>
          <p className='helptext'>This template is not yet in Qordoba. Please click the button below to start translating! </p>
          <button disabled={!this.state.abFileExistsInQ} className='btn img-btn pull-left' onClick={this.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
        </div>
      )
    }
    else if (this.state.qTranslationStatus === 'enabled') {
      //Show enabled status 
      //Render button to send

      return (
        <div className='q-translation-status-container'>
          <div className="q-nav-bar">
            <LanguageDropdown abFileExistsInQ={this.state.abFileExistsInQ} abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'}  handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
            <div className='q-nav-item' id='q-refresh'>
              <i class="fa fa-refresh" aria-hidden="true"></i>
            </div>
            <DownloadAllButton abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
          </div>
          <p className='helptext'>This template is currently being translated in Qordoba. If the original template content has changed, please click the button below to re-upload to Qordoba.</p>
          <button disabled={!this.state.abFileExistsInQ} className='btn img-btn pull-left' onClick={this.qFileUpload} type="submit" id='q-upload-button'> Re-upload changed template to Qordoba </button>
        </div>
      )
    }
    else if (this.state.qTranslationStatus === 'completed') {
      return (
        <div className='q-translation-status-container flex flex-column flex-full-width-height'>
          <div className="q-nav-bar">
            <LanguageDropdown abFileExistsInQ={this.state.abFileExistsInQ} abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'}  handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
            <DownloadAllButton abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
          </div>
          <TranslationPreview abTranslationStatuses={this.state.abTranslationStatuses} qFileUpload={this.qFileUpload} abLocaleTargetContent={this.state.abLocaleTargetContent} handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
        </div>
      )
    }
    else {
      //TODO
      //Render a short blurb about how to get started
      //Render button to send
      return (
        <div className='q-translation-status-container'>
          <Spinner name='double-bounce' />
        </div>
      )
    }
  }
}
/*
        <div className='q-translation-status-container'>
          <div className="q-nav-bar">
            <LanguageDropdown abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'}  handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
            <DownloadAllButton abFileCompletedInQ = {this.state.qFileTranslationStatus === 'completed'} abHeadContent={this.state.abHeadContent} abSourceContent={this.state.abSourceContent} abAllTargetContent={this.state.abAllTargetContent} downloadAllModalOpen={this.state.downloadAllModalOpen} handleDownloadAllClick={this.handleDownloadAllClick} handleDownloadAllClose={this.handleDownloadAllClose} />
          </div>
          <p className='helptext'> Please send a file to Qordoba or select a language from the dropdown menu above to get started with Qordoba!</p>
          <button disabled={this.state.abFileExistsInQ} className='btn img-btn pull-left' onClick={this.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
        </div>  */
export default App;
