console.log('hi inject script')

import React from 'react';
import ReactDOM from 'react-dom';

import App from '../app/App.js';



//Global variables
var appPanelTab;
var outerContainer = document.querySelector('.panel.preview-panel');
var controlPanel = outerContainer.querySelector('div.controls.left-controls');
var previewContainer = outerContainer.querySelector('.panel-body');
var header = outerContainer.querySelector('div.panel-header.padded-header');
var appRendered = false;
var renderedApp = document.querySelector('#q-app-container');
var appContainer;


// Create click target in control panel to launch our app
var createControlPanelTab = () => {
  if (!renderedApp) {
    appPanelTab = document.createElement('div');
    appPanelTab.innerHTML = 'Qordoba';
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
}


//Handle clicks on other tabs in targrt control panel
var handleOtherTabClicks = () => {
  for (var i = 0; i < controlPanel.children.length; i++) {
    if (controlPanel.children[i] !== appPanelTab) {
      controlPanel.children[i].addEventListener('click', (e) => {
        header.style.display = 'block';
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
  header.style.display = 'none';

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
    previewContainer.appendChild(appContainer);
    ReactDOM.render(<App/>, appContainer);
    appRendered = true;
  }
  appContainer.classList.add('flex');
  appContainer.id = 'q-app-container';
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

