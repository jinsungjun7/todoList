require('!style-loader!css-loader!../css/style.css');
import {pageSet, newProject, newTodo, handleSubmit, dateMin, expandTodo, setUpEditBtn} from './dom.js';
import {displayProjectPage, completeTodo, todoNameChecker} from './ui.js';

// add Event listener for Add Project button
newProject();

// add Event listener for Add Todo button
newTodo();

// default with Inbox; displays default page of the Inbox upon web page load
displayProjectPage('Inbox');

//The majority of these functions are for testing the initial page load with sample todos/projects
// set up default Leetcode project with event listener
pageSet();

todoNameChecker();

setUpEditBtn();
// sample Todo/project^



// add onsubmit property to form to prevent it from submitting/refreshing the page--this is required since HTML JS is not on the same scope as the webpack bundle JS
window.handleSubmit = handleSubmit;

dateMin();