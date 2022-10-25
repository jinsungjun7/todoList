import { Project } from './project.js';
import { Todo } from './todo.js';
import { isToday, differenceInCalendarDays } from 'date-fns';

class Storage {
    projectList = [];
    todoList = [];

    createProject(name) {
        this.projectList.push(new Project(name));
    }

    createTodo(title, description, dueDate, priority, projectName) {
        let newTodo = new Todo(title, description, dueDate, priority, projectName);
        this.todoList.push(newTodo);
        

        let project = this.getProject(projectName);
        project.addTodo(newTodo);
    }

    getProject(projectName) {
        let i = 0;
        while (this.projectList[i].getName() != projectName) {
            i++;
        }
        return this.projectList[i];
    }

    getProjectList() {
        return this.projectList;
    }

    getTodoList() {
        return this.todoList;
    }

    checkDuplicate(name) {
        if (this.projectList.some(project => project.getName() == name)) {
            return false;
        }
        return true;
    }

    generateToday() {
        const todayProject = this.getProject('Today');
        todayProject.clearTodo();
        for (let i = 0; i < this.todoList.length; i ++) {
            if (isToday(this.todoList[i].getDate())) {  
                todayProject.addTodo(this.todoList[i])
            }
        }
        return todayProject.getTodo();
    }

    generateWeek() {
        const weekProject = this.getProject('This Week');
        weekProject.clearTodo();
        for (let i = 0; i < this.todoList.length; i ++) {           
            if (differenceInCalendarDays(this.todoList[i].getDate(), new Date()) <= 7) {
                weekProject.addTodo(this.todoList[i])
            }
        }
        return weekProject.getTodo();

    }
}


// default Projects + Todo for the page
let localStorage = new Storage();
localStorage.createProject('Inbox');
localStorage.createProject('Today');
localStorage.createProject('This Week');
localStorage.createProject('Leetcode');

localStorage.createTodo('study', 'hi', new Date(2022, 9, 24), 'high', 'Leetcode');

export { localStorage };
