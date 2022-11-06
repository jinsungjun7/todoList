import { myData } from './storage.js';
import { displayProjectPage, createProjectElement, completeTodo, removeProjectElement} from './ui.js';
import { format, startOfToday } from 'date-fns';
import {populateStorage} from './index.js';


//displays the page based on the button clicked on the sidebar (i.e. projects)
function pageSet() {
    const projectBtns = document.querySelectorAll('.project');
    projectBtns.forEach(btn => btn.addEventListener('click', (e) => {
        if (btn.classList.contains('projectContent')) {
            btn = btn.parentElement;
        }
        let btnId = btn.getAttribute('id');
        displayProjectPage(btnId);
        clearTodoPrompt();
        resetPage();
    }));   
    
    //running these at the beginning from index.js calling pageSet()
    deleteProject();
    expandTodo();
    clearTodoPrompt();
}

//Add Project button functionality => 
function newProject() {
    const projectActions = document.querySelectorAll('.projectAction');
    const projectBtns = document.querySelectorAll('.projectBtn');

    projectBtns.forEach(btn => btn.addEventListener( 'click', (e) => {
        projectActions.forEach(action => action.classList.toggle('hide'));
     
        if (btn.getAttribute('id') == 'add') {
            let name = document.getElementById('addProjectInput').value;
            if (name.length > 0 && myData.checkDuplicateProject(name)) {
                myData.createProject(name); 
                createProjectElement(name);
                pageSet();
                displayProjectPage(name);
                clearTodoPrompt();
            } else if (!myData.checkDuplicateProject(name)) {
                alert("You cannot have duplicate project names.");
            }
            document.getElementById('addProjectInput').value = '';

            //set up functionality for remove project button and update localStorage with new project
            deleteProject();
            populateStorage();
        } else if (btn.getAttribute('id') == 'cancel') {
            document.getElementById('addProjectInput').value = '';
        }   
    }))
}

//Add todo button to display form and set up button functionality
function newTodo() {
    const todoBtns = document.querySelectorAll('.todoBtn');
    todoBtns.forEach(btn => btn.addEventListener('click', (e) => {
        hideAddTodo();
        toggleEditAndCompleteBtn();
        if (btn.getAttribute('id') == 'cancel') {
            clearTodoPrompt();
        } else if (btn.getAttribute('id') == 'saveEdit') {
            let name = document.getElementById('todoName').value;
            myData.removeTodo(name);
            createNewTodo();
            saveEdit();
            
        }
    }));
}

//hides add todo button to prevent unexpected closing
function hideAddTodo() {
    const todoActions = document.querySelectorAll('.todoAction');
    todoActions.forEach(action => action.classList.toggle('hide'));
}

//resets form inputs
function clearTodoPrompt() {
    document.getElementById('todoName').value = '';
    document.getElementById('todoDescription').value = '';

    let d = new Date();
    let datestring = d.getFullYear().toString().padStart(4, '0') + '-' + (d.getMonth()+1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
    document.getElementById('dueDate').value = datestring;
    document.getElementById('priority').value = 'Low';
    
    defaultProject();
}

function defaultProject() {
    const bodyTitle = document.querySelector('.bodyTitle');
    document.getElementById('project').value = bodyTitle.textContent;
}

function handleSubmit(event) {
    event.preventDefault();

    createNewTodo();

    const todoActions = document.querySelectorAll('.todoAction');
    todoActions.forEach(action => action.classList.toggle('hide'));
}

function createNewTodo() {
    let name = document.getElementById('todoName').value;
    let description = document.getElementById('todoDescription').value;
    let dueDate = document.getElementById('dueDate').value;
    let priority = document.getElementById('priority').value;
    let project = document.getElementById('project').value;
    myData.createTodo(name, description, dueDate, priority, project);

    //refresh current page
    let bodyTitle = document.querySelector('.bodyTitle');
    displayProjectPage(bodyTitle.textContent);
    clearTodoPrompt();
    expandTodo();
    setUpEditBtn();
    populateStorage();
}

function dateMin() {
    let dateInput = document.getElementById('dueDate');
    let today = format(startOfToday(), 'yyyy-MM-dd');
    dateInput.setAttribute('min', today);
}

function resetPage() {
    let form = document.querySelector('form');
    let todoBtn = document.querySelector('.todoAction.todoBtn');

    form.classList.add('hide');
    todoBtn.classList.remove('hide');  
    expandTodo();    
    setUpEditBtn();  
    defaultProject();
    deleteProject();
}

function expandTodo() {
    const todos = document.querySelectorAll('.todoContent');
    
    todos.forEach(todo => todo.addEventListener('click', (e) => {
        handleExpand(todo);
    }));
}

function handleExpand(todo) {
    if (todo.classList.contains('expanded')) {
        let description = todo.querySelector('.description');
        todo.removeChild(description);
        todo.classList.remove('expanded');

    } else {
        let description = document.createElement('div');
        description.classList.add('description');     
        // todo Index in myData
        let i = myData.getTodoIndex(todo.parentElement.getAttribute('id'));
        description.textContent = myData.getTodoList()[i].getDescription  ();
        todo.appendChild(description);
        todo.classList.add('expanded');
    }
}

function setUpEditBtn() {
    let editBtns = document.querySelectorAll('.editBtn');
    editBtns.forEach(editBtn => editBtn.addEventListener('click', (e) => {
        hideAddTodo();
        let formBtns = document.querySelectorAll('.formBtn');
        formBtns.forEach(btn => btn.classList.toggle('hide'));

        let nameInput = document.querySelector('#todoName');
        nameInput.setAttribute('disabled', 'disabled');
        let todo = myData.getTodo(editBtn.parentElement.getAttribute('id'));

        document.getElementById('todoName').value = todo.getName();
        document.getElementById('todoDescription').value = todo.getDescription();;  
        let d = todo.getDate();
        let datestring = d.getFullYear().toString().padStart(4, '0') + '-' + (d.getMonth()+1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
        document.getElementById('dueDate').value = datestring;
        document.getElementById('priority').value = todo.getPriority();
        document.getElementById('project').value = todo.getProject();
        toggleEditAndCompleteBtn();

    }));
}

function saveEdit() {
    let formBtns = document.querySelectorAll('.formBtn');
    formBtns.forEach(btn => btn.classList.toggle('hide'));
    let nameInput = document.querySelector('#todoName');
    nameInput.removeAttribute('disabled');
}

function toggleEditAndCompleteBtn() {
    let editBtns = document.querySelectorAll('.editBtn');
    editBtns.forEach(editBtn => editBtn.classList.toggle('hide'));

    let completeBtns = document.querySelectorAll('.completeBtn');
    completeBtns.forEach(completeBtn => completeBtn.classList.toggle('hide'));
}

function deleteProject() {
    const deleteProject = document.querySelectorAll('.delProject');
    deleteProject.forEach(btn => btn.addEventListener('click', (e) => {
        let projectName = btn.parentElement.getAttribute('id');
        myData.removeProject(projectName);
        removeProjectElement(projectName);
        btn.outerHTML = btn.outerHTML;
        displayProjectPage('Inbox');

        let projectInput = document.querySelector(`div.todoPrompt option[value=${projectName}]`);
        projectInput.parentElement.removeChild(projectInput);
        populateStorage();
    }))
}



export {
    pageSet,
    newProject,
    newTodo, 
    handleSubmit,
    dateMin,
    expandTodo, 
    handleExpand,
    setUpEditBtn,
}