import {localStorage} from './storage.js';
import {Project} from './project.js';
import { format } from 'date-fns';
import {handleExpand} from './dom.js';

function displayProjectPage(btnId) {
    let bodyTitle = document.querySelector('.bodyTitle');
    const todoListElement = document.querySelector('.todoList');
    todoListElement.innerHTML = "";
    let projectList = localStorage.getProjectList();
    for (let i=0; i < projectList.length; i++) {
        let name = projectList[i].getName();
        if (name == btnId) {
            let project = projectList[i];
            let todoList = [];
            const addTodo = document.querySelector('.addTodo');
            if (name == 'Today' || name == 'This Week') {
                addTodo.classList.add('hide');
                if (name == 'Today') {
                    todoList = localStorage.generateToday();
                } else {
                    todoList = localStorage.generateWeek();
                }
            } else {
                addTodo.classList.remove('hide');
                if (name == 'Inbox') {
                    todoList = localStorage.getTodoList();
                } else {
                    todoList = project.getTodo();
                }
            }

            bodyTitle.innerHTML = btnId;

            if (todoList.length == 0) {// || todoList[0].title == '') {
                return;
            }
                for (let j=0; j<todoList.length; j++) {
                    createTodoElement(todoList[j].getName(), todoList[j].getDate(), todoList[j].getPriority()  );
                }  
            return;
        }
        
    }
}

function createProjectElement(name) {
    const projectList = document.querySelector('.projectList');
    let newElement = document.createElement('div');
    newElement.classList.add('projectName');
    newElement.classList.add('button');
    newElement.setAttribute('id', `${name}`);
    newElement.innerHTML = `<div class="projectContent project"><img src='./project.jpg' alt="project icon" size="1.5rem">${name}</div>
    <img src='./delete.jpg' alt="delete icon" size="1.5rem" class='delProject'>`;
    projectList.appendChild(newElement);

    const projectForm = document.querySelector('select#project');
    let newOption = document.createElement('option');
    newOption.value = name;
    newOption.textContent = name;
    projectForm.appendChild(newOption);
}

function removeProjectElement(name) {
    const projectList = document.querySelector('.projectList');
    let projectElement = projectList.querySelector(`#${name}`);
    projectList.removeChild(projectElement);
}

function createTodoElement(name, date, priority) {
    let todoContainer = document.createElement('div');
    todoContainer.classList.add('todo');
    todoContainer.setAttribute('id', `${name}`);
    priorityColor(todoContainer, priority);
    todoContainer.style.border = '1px solid black';

    let todoContent = document.createElement('div');
    todoContent.classList.add('todoContent');
    
    // button to complete todo
    let complete = document.createElement('button');
    complete.classList.add('completeBtn');
    complete.type = 'button';
    complete.setAttribute('id', name);
    complete.style.borderRadius = '100%';
    complete.style.border = '1px solid black';

    let edit = document.createElement('button');
    edit.classList.add('editBtn');
    edit.type = 'button';
    edit.setAttribute('id', name);
    edit.innerHTML = `<img src=pencil.jpg>`
    edit.style.border = 'none';
    edit.style.background = 'none';     

    let todoName = document.createElement('div');
    todoName.classList.add('todoName');
    todoName.innerHTML = name;

    let todoDate = document.createElement('div');
    todoDate.classList.add('todoDate');
    todoDate.innerHTML = format(date,'MM-dd-yyyy');

    todoContent.appendChild(todoName);
    todoContent.appendChild(todoDate);

    todoContainer.appendChild(complete);
    todoContainer.appendChild(edit);
    todoContainer.appendChild(todoContent);
    
    const todoListElement = document.querySelector('.todoList');
    todoListElement.appendChild(todoContainer);

    completeTodo();
}

function completeTodo() {
    const completeBtns = document.querySelectorAll('.completeBtn');
    completeBtns.forEach(btn => btn.addEventListener('click', (e) => {
            
        localStorage.removeTodo(btn.getAttribute('id'));
        btn.parentElement.classList.add('complete');

        let todoContent = btn.parentElement.querySelector('.todoContent');
        if (todoContent.classList.contains('expanded')) {
            handleExpand(todoContent);
        };
        btn.parentElement.outerHTML = btn.parentElement.outerHTML;
        btn.outerHTML = btn.outerHTML;   
        

    }));
}

function todoNameChecker() {
    const name = document.getElementById('todoName')
    name.addEventListener('input', (e) => {
        if (!localStorage.checkDuplicateTodo(name.value)) {
            name.setCustomValidity("You cannot have two Todos with the same name!");
        } else {
            name.setCustomValidity("");
        }
    })
}

function priorityColor(todoContainer, priority) {
    if (priority == 'High') {
        todoContainer.style.background = 'rgba(255, 41, 30, 0.8)';
    } else if (priority == 'Medium') {
        todoContainer.style.background = 'rgba(243,213,78, 0.8)';
    } else if (priority == 'Low') {
        todoContainer.style.background = 'white';
    }
}


export {displayProjectPage, createProjectElement, completeTodo, todoNameChecker, removeProjectElement};