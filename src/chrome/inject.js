console.log('hi inject script')

import React from 'react';
import ReactDOM from 'react-dom';

import App from '../app/App.js';

//TODO
  //Stop alert from firing every fucking time
  //Set App header contents
  //Determine where to put classes on React containers (we have 2 containers -- target and container in App)

//Global variables
var appPanelTab;
var outerContainer = document.querySelector('.panel.preview-panel');
var controlPanel = outerContainer.querySelector('div.controls.left-controls');
var previewContainer = outerContainer.querySelector('.panel-body');
var appRendered = false;
var appContainer;


// Create click target in control panel to launch our app
var createControlPanelTab = () => {
  appPanelTab = document.createElement('div');
  appPanelTab.innerHTML = 'App';
  appPanelTab.classList.add('control');
  appPanelTab.addEventListener('click', (e) => {
    //Manage tab UI state
    var currentActiveControl = controlPanel.querySelector('div.active');
    currentActiveControl.classList.remove('active');
    appPanelTab.classList.add('active');
    //render App
    renderReactApp();
  });;
}


//Handle clicks on other tabs in targrt control panel
var handleOtherTabClicks = () => {
  for (var i = 0; i < controlPanel.children.length; i++) {
    if (controlPanel.children[i] !== appPanelTab) {
      controlPanel.children[i].addEventListener('click', (e) => {
        e.target.classList.add('active');
        appPanelTab.classList.remove('active');
        //Make other tab content visible again
        for (var j = 0; j < previewContainer.children.length; j++) {
          if (previewContainer.children[j].classList.contains('is-hidden')) {
            previewContainer.children[j].style.display = "flex";
            previewContainer.children[j].classList.remove('is-hidden');
          }
        };
        //Hide our tab's content
        if (appContainer.style) {
          appContainer.style.display = "none";
        }
      });
    }
  }
} 


var renderReactApp = () => {
  //Set header contents
  

  //Clear other tab content
  for (var i = 0; i < previewContainer.children.length; i++) {
    if (previewContainer.children[i].style.display !== "none") {
      //add class to check which we've hidden
      previewContainer.children[i].classList.add('is-hidden');
      previewContainer.children[i].style.display = "none";
    }
  }

  //Render React app
  if (!appRendered) {
    console.log(previewContainer.children);
    appContainer = document.createElement('div');
    appContainer.classList.add('flex', 'flex-column', 'flex-full-width-height');
    previewContainer.appendChild(appContainer);
    ReactDOM.render(<App/>, appContainer);
    appRendered = true;
  }
  appContainer.style.display = 'flex';
}


//Inject App if container found
var injectReactApp = () => {
  if (controlPanel) {
    console.log('FOUND CONTROL PANEL', controlPanel);
    createControlPanelTab();
    controlPanel.appendChild(appPanelTab);
    handleOtherTabClicks();
  }
  else if (1000 === 10) {
     //TODO -- MOBILE NOTIFICATION LOGIC
  } 
  else {
    console.log('DIDNT FIND CONTROL PANEL');
    alert('Didn\'t find control panel to insert Qordoba app. Make sure you\'re on the right page!')
  }
}

injectReactApp();

