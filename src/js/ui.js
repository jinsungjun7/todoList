import {localStorage} from './storage.js';
import {Project} from './project.js';
import { format } from 'date-fns';

function displayProjectPage(btnId) {
    let bodyTitle = document.querySelector('.bodyTitle');
    const todoListElement = document.querySelector('.todoList');
    todoListElement.innerHTML = "";
    let projectList = localStorage.getProjectList();
    for (let i=0; i < projectList.length; i++) {
        let name = projectList[i].getName();
        if (name == btnId) {
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
                    console.log(todoList);
                } else {
                    todoList = projectList[i].getTodo();
                }
            }
            bodyTitle.innerHTML = btnId;
            for (let j=0; j<todoList.length; j++) {
                createTodoElement(todoList[j].getName(), todoList[j].getDate());
            } 
            return;
        }
        
    }
}

function createProjectElement(name) {
    const projectList = document.querySelector('.projectList');
    let newElement = document.createElement('div');
    newElement.classList.add('project');
    newElement.classList.add('button');
    newElement.setAttribute('id', `${name}`);
    newElement.innerHTML = `<img src=55c4de0d6968889bf3d4.jpg size="1.5rem"> ${name}`;
    projectList.appendChild(newElement);

}

function createTodoElement(name, date) {
    let todoContainer = document.createElement('div');
    todoContainer.classList.add('todo');
    todoContainer.setAttribute('id', `${name}`);
    
    let todoName = document.createElement('div');
    todoName.innerHTML = name;

    let todoDate = document.createElement('div');
    todoDate.innerHTML = format(date,'MM-dd-yyyy');

    todoContainer.appendChild(todoName);
    todoContainer.appendChild(todoDate);
    
    const todoListElement = document.querySelector('.todoList');
    todoListElement.appendChild(todoContainer);
}

export {displayProjectPage, createProjectElement};