import { localStorage } from './storage.js';
import { displayProjectPage, createProjectElement, completeTodo, removeProjectElement} from './ui.js';
import { format, startOfToday } from 'date-fns';

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
    deleteProject();
    expandTodo();
    clearTodoPrompt();
}

function newProject() {
    const projectActions = document.querySelectorAll('.projectAction');
    const projectBtns = document.querySelectorAll('.projectBtn');

    projectBtns.forEach(btn => btn.addEventListener( 'click', (e) => {
        projectActions.forEach(action => action.classList.toggle('hide'));
     
        if (btn.getAttribute('id') == 'add') {
            let name = document.getElementById('addProjectInput').value;
            if (name.length > 0 && localStorage.checkDuplicateProject(name)) {
                localStorage.createProject(name); 
                createProjectElement(name);
                pageSet();
                displayProjectPage(name);
                clearTodoPrompt();
            } else if (!localStorage.checkDuplicateProject(name)) {
                alert("You cannot have duplicate project names.");
            }
            document.getElementById('addProjectInput').value = '';
            deleteProject();
        } else if (btn.getAttribute('id') == 'cancel') {
            document.getElementById('addProjectInput').value = '';
        }   
    }))
}


function newTodo() {
    const todoBtns = document.querySelectorAll('.todoBtn');
    todoBtns.forEach(btn => btn.addEventListener('click', (e) => {
        hideAddTodo();
        toggleEditAndCompleteBtn();
        if (btn.getAttribute('id') == 'cancel') {
            clearTodoPrompt();
        } else if (btn.getAttribute('id') == 'saveEdit') {
            let name = document.getElementById('todoName').value;
            localStorage.removeTodo(name);
            createNewTodo();
            saveEdit();
        }
    }));
}

function hideAddTodo() {
    const todoActions = document.querySelectorAll('.todoAction');
    todoActions.forEach(action => action.classList.toggle('hide'));
}

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
    localStorage.createTodo(name, description, dueDate, priority, project);

    //refresh current page
    let bodyTitle = document.querySelector('.bodyTitle');
    displayProjectPage(bodyTitle.textContent);
    clearTodoPrompt();
    expandTodo();
    setUpEditBtn();
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
        // todo Index in localStorage
        let i = localStorage.getTodoIndex(todo.parentElement.getAttribute('id'));
        description.textContent = localStorage.getTodoList()[i].getDescription  ();
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
        let todo = localStorage.getTodo(editBtn.parentElement.getAttribute('id'));

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
        localStorage.removeProject(projectName);
        removeProjectElement(projectName);
        btn.outerHTML = btn.outerHTML;
        displayProjectPage('Inbox');

        let projectInput = document.querySelector(`div.todoPrompt option[value=${projectName}]`);
        projectInput.parentElement.removeChild(projectInput);
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