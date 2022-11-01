import { localStorage } from './storage.js';
import { displayProjectPage, createProjectElement } from './ui.js';
import { format, startOfToday } from 'date-fns';

function pageSet() {
    const projectBtns = document.querySelectorAll('.project');
    projectBtns.forEach(btn => btn.addEventListener('click', (e) => {
        let btnId = btn.getAttribute('id');
        displayProjectPage(btnId);
        clearTodoPrompt();
        resetPage();
    }));    
}

function newProject() {
    const projectActions = document.querySelectorAll('.projectAction');
    const projectBtns = document.querySelectorAll('.projectBtn');

    projectBtns.forEach(btn => btn.addEventListener( 'click', (e) => {
        projectActions.forEach(action => action.classList.toggle('hide'));
     
        if (btn.getAttribute('id') == 'add') {
            let name = document.getElementById('addProjectInput').value;
            if (name.length > 0 && localStorage.checkDuplicate(name)) {
                localStorage.createProject(name); 
                createProjectElement(name);
                pageSet();
            } else if (!localStorage.checkDuplicate(name)) {
                alert("You cannot have duplicate project names.");
            }
            document.getElementById('addProjectInput').value = '';
        } else if (btn.getAttribute('id') == 'cancel') {
            document.getElementById('addProjectInput').value = '';
        }   

    }))
}


function newTodo() {
    const todoActions = document.querySelectorAll('.todoAction');
    const todoBtns = document.querySelectorAll('.todoBtn');
    todoBtns.forEach(btn => btn.addEventListener('click', (e) => {
        todoActions.forEach(action => action.classList.toggle('hide'));
        if (btn.getAttribute('id') == 'cancel') {
            clearTodoPrompt();
        }   
    }));
}

function clearTodoPrompt() {
    document.getElementById('todoName').value = '';
    document.getElementById('todoDescription').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('priority').value = 'Low';
    
    const bodyTitle = document.querySelector('.bodyTitle');
    document.getElementById('project').value = bodyTitle.textContent;
}

function handleSubmit(event) {
    console.log('test');
    event.preventDefault();
    let name = document.getElementById('todoName').value;
    let description = document.getElementById('todoDescription').value;
    let dueDate = document.getElementById('dueDate').value;
    let priority = document.getElementById('priority').value;
    let project = document.getElementById('project').value;
    localStorage.createTodo(name, description, dueDate, priority, project);
    displayProjectPage(project);
    const todoActions = document.querySelectorAll('.todoAction');
    todoActions.forEach(action => action.classList.toggle('hide'));
    clearTodoPrompt();
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
}

export {
    pageSet,
    newProject,
    newTodo, 
    handleSubmit,
    dateMin
}