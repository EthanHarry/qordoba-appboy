console.log('hi react app')
import React from 'react';
import IFrame from 'react-iframe';
import $ from 'jquery';
import styles from './main.css';
import LanguageDropdown from './LanguageDropdown.js';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';


//TODO
  //auth
  //Fix event listeners so that extension can fire multiple times without reload
  //Fix config import and usage
  //Webpack config
  //Loading spinner while w8ing for init
  //Stop alert from firing every fucking time
  //Set App header contents
  //Determine where to put classes on React containers (we have 2 containers -- target and container in App)
  //Get rid of iframe react Component dependency -- doesnt take srcdoc only url



//NEXT
  //1. API call to Qordoba to see if asset exists
    //Lookup and save in Qordoba by TYPE and by ID (we'll get fancy and add name later)
  //2. conditional rendering of iFrame, "send to Qordoba" button, or "Translation in progress" string

class App extends React.Component {
  constructor(props) {
    super(props);

    //Need to actually render from auth
    this.state = {
      qAuthToken: 'b57c4072-6533-409c-b4b1-cdd9210c1802',
      qOrganizationId: '3168',
      qProjectId: '5843',
      qProjectLanguages: {},
      qProjectFiles: {},
      qTranslationStatus: '',
      abLanguageCode: '',
      abLanguageName: '',
      abType: '',
      abId: '',
      abTitle: '',
      abSourceContent: '',
      abTargetContent: ''
    }
    this.qGetLanguages = this.qGetLanguages.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.qFileUpload = this.qFileUpload.bind(this);
  }


  //React Data
  async componentDidUpdate() {
    console.log('STATE', this.state)
  }


  componentWillMount() {
    this.abGetTemplateContent();
  }


  async componentDidMount() {
    await this.qGetLanguages();
    this.abGetTemplate();
  }


  async handleLanguageChange(e) {
    var dropdownMenu = e.target;
    var selectedOption = dropdownMenu.querySelector(`[data-name="${e.target.value}"]`);
    await this.setState({abLanguageName: selectedOption.dataset.name, abLanguageCode: selectedOption.dataset.locale});
    if (Object.keys(this.state.qProjectFiles).length === 0) {
      await this.qGetFiles();
    }
    //TODO this is assuming we send up articles to Qordoba with type and ID NOT name
    var qFileTitle = `${this.state.abType}-${this.state.abId}`;
    console.log('QFILETITLE', qFileTitle)
    if (this.state.qProjectFiles[qFileTitle]) {
      //Template DOES exist in Qordoba
      //API call to Qordoba fetch locale/article-specific detail
      //If completed
      if (this.state.qProjectFiles[qFileTitle].completed) {
        //render preview
        await this.qGetTranslation();
        this.setState({qTranslationStatus: 'completed'})
      }
      else {
        //Show enabled status
        this.setState({qTranslationStatus: 'enabled'})
      }
    }
    else {
      //Template DOESNT exist in Qordoba
      //Show doesnt exist status'
      await this.setState({qTranslationStatus: 'none'})
      console.log('setting state to untranslated')
    }
    //In all cases, render button to send update contents back to qordoba
      //TODO maybe check if the file has actually changed before we make this available?
  }





  //Appboy Data
  abGetTemplate() {
    var urlPathArray = window.location.pathname.split('/');
    var articleTitleSpan = document.querySelector('span.editable-heading');
    this.setState({abType: urlPathArray[urlPathArray.length - 2], abId: urlPathArray[urlPathArray.length - 1], abTitle: articleTitleSpan.innerHTML})
  }


  abGetTemplateContent() {
    //TODO need to confirm that this ALWAYS grabs the right content
    var iFramesArray = document.querySelectorAll('iframe');
    for (var i = 0; i < iFramesArray.length; i++) {
      if (iFramesArray[i].classList.length === 0) {
        console.log('FOUND TEMPLATE CONTENT!!!')
        this.setState({abSourceContent: iFramesArray[i].contentWindow.document.body.outerHTML}) //TODO need to make sure we parse out non-body tags
      }
    }
  }


  async abPublishPreview() {
      

  }





  //QORDOBA API CALLS
  async qGetLanguages() {
    var reqHeader = {
      'X-AUTH-TOKEN': this.state.qAuthToken,
      'Content-Type': 'application/json'
    };
    var projectDetailCall = await $.ajax({
      type: 'GET',
      url: `https://app.qordoba.com/api/organizations/${this.state.qOrganizationId}/projects?limit=1&offset=0&limit_to_projects=${this.state.qProjectId}`,
      headers: reqHeader
    })
    var qProjectLanguages = projectDetailCall.projects[0].target_languages;
    for (var i = 0; i < qProjectLanguages.length; i++) {
      var qLangs = Object.assign({}, this.state.qProjectLanguages);
      qLangs[qProjectLanguages[i].code] = {id: qProjectLanguages[i].id, name: qProjectLanguages[i].name}
      this.setState({qProjectLanguages: qLangs});
    }
  }


  async qGetFiles() {
    var reqHeader = {
      'X-AUTH-TOKEN': this.state.qAuthToken,
      'Content-Type': 'application/json'
    };
    var qordobaLanguageId = this.state.qProjectLanguages[this.state.abLanguageCode].id;
    var qordobaResponse = await $.ajax({
      type: 'POST',
      url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/languages/${qordobaLanguageId}/page_settings/search`,
      headers: reqHeader,
      data: JSON.stringify({})
    })
    var qordobaFiles = qordobaResponse.pages;
    var allQFilesObj = Object.assign({}, this.state.qProjectFiles);
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
    this.setState({qProjectFiles: allQFilesObj})
  }


  async qFileUpload() {
    console.log('uploading file')
    var reqHeader = {
      'X-AUTH-TOKEN': this.state.qAuthToken,
    };

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
      headers: reqHeader,
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
      headers: {
        'X-AUTH-TOKEN': this.state.qAuthToken,
        'Content-Type': 'application/json'
      }
    })

    console.log('RESPONSE AFTER APPEND', responseToFilesUploaded)
  }


  async qGetTranslation() {
    var reqHeader = {
      'X-AUTH-TOKEN': this.state.qAuthToken,
      'Content-Type': 'application/json;charset=UTF-8'
    };

    var pageIdArray = [];
    for (var key in this.state.qProjectFiles) {
      pageIdArray.push(this.state.qProjectFiles[key].qArticleId);
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
      headers: reqHeader,
    })
    console.log('RESPONSE COMP FILE', completeZipFile)

    var newZip = new JSZip();
    JSZipUtils.getBinaryContent(`https://app.qordoba.com/api/file/download?token=${completeZipFile.token}&filename=${encodeURIComponent(completeZipFile.filename)}`, async (err, data) => {

      console.log('first data', data)
      var completedZipDataObj = await newZip.loadAsync(data);
      var completedZipData = completedZipDataObj.files;

      for (var key in completedZipData) {
        if (key.includes(`${this.state.abLanguageCode}`)) {
          var myRegexp = /.*\/([a-z,_]*-[a-z,0-9]*)-.*.html/g;
          var regexMatches = myRegexp.exec(key);
          var templateName = regexMatches[1];
          if (templateName === `${this.state.abType}-${this.state.abId}`) {
            var finalizedZipData = await completedZipData[key].async('text');
            this.setState({abTargetContent: finalizedZipData});
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
          <div className='q-status-text'>
            This template is not yet in Qordoba. Please click the button below to start translating!
          </div>
          <button onClick={this.qFileUpload} type="submit" id='q-upload-button'> Upload to Qordoba </button>
        </div>
      )
    }
    else if (this.state.qTranslationStatus === 'enabled') {
      //Show enabled status 
      //Render button to send

      return (
        <div className='q-translation-status-container'>
          <div className='q-status-text'>
            This template is currently being translated in Qordoba. If the original template content has changed, please click the button below to re-upload to Qordoba.
          </div>
          <button onClick={this.qFileUpload} type="submit" id='q-upload-button'> Re-upload to Qordoba </button>
        </div>
      )
    }
    else if (this.state.qTranslationStatus === 'completed') {
      //Render preview
      //Render button to send
      return (
        <div id='q-app-container' className='flex flex-column flex-full-width-height'>
          <LanguageDropdown handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
          <div id="q-email-preview-holder" className="email-preview-holder flex flex-column flex-full-width-height">
            <iframe
              srcDoc={this.state.abTargetContent}
              className="email-preview flex-full-width-height"
              id="q-preview-iframe"
            />
          </div>
          <button onClick={this.qFileUpload} type="submit" id='q-upload-button'> Re-upload to Qordoba </button>
        </div>
      )
    }
    else {
      //TODO
      //Render a short blurb about how to get started
      //Render button to send
      return (
        <div id='q-app-container' className='flex flex-column flex-full-width-height'>
          <LanguageDropdown handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} qGetLanguages={this.qGetLanguages}/>
          <div id="q-email-preview-holder" className="email-preview-holder flex flex-column flex-full-width-height">
            <IFrame
              url="https://www.hackreactor.com"
              className="email-preview flex-full-width-height"
              id="q-preview-iframe"
            />
          </div>
        </div>
      )
    }
  }
}

export default App;
