require('!style-loader!css-loader!../css/style.css');
import {pageSet, newProject, newTodo, handleSubmit, dateMin} from './dom.js';
import {displayProjectPage} from './ui.js';

// add Event listener for Add Project button
newProject();

// add Event listener for Add Todo button
newTodo();

// set up default Leetcode project with event listener
pageSet();

// default with Inbox
displayProjectPage('Inbox');

// add onsubmit property to form to prevent it from submitting/refreshing the page--this is required since HTML JS is not on the same scope as the webpack bundle JS
window.handleSubmit = handleSubmit;

dateMin();