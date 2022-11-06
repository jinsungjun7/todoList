require('!style-loader!css-loader!../css/style.css');
import {pageSet, newProject, newTodo, handleSubmit, dateMin, expandTodo, setUpEditBtn} from './dom.js';
import {displayProjectPage, completeTodo, todoNameChecker, createProjectElement} from './ui.js';
import {myData} from './storage.js';

// local storage set up
if (!localStorage.getItem('projectList')) {
    populateStorage();
} else {
    setStorage();
}

function populateStorage() {
    if (myData.getProjectList().length == 0) {
        myData.createProject('Inbox');
        myData.createProject('Today');
        myData.createProject('This Week');
        myData.createTodo('study', 'test', '2025-10-15', 'High',    'Inbox');
    }
    localStorage.setItem('projectList', JSON.stringify(myData.getProjectList()));
    localStorage.setItem('todoList', JSON.stringify(myData.getTodoList()));

    setStorage();
}

function setStorage() {
    
    let projectList = JSON.parse(localStorage.getItem('projectList'));
    myData.setProjectList(projectList);
    
    if (localStorage.getItem('todoList')) {
        const todoList = JSON.parse(localStorage.getItem('todoList'));
        myData.setTodoList(todoList);
    }
}

//set up sidebar of projects
let projects = JSON.parse(localStorage.getItem('projectList'));
for (let i=3; i<projects.length; i++) {
    createProjectElement(projects[i].name);
}

// localStorage.setItem('projects', JSON.stringify.)


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

export { populateStorage } ;