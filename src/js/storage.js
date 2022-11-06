import { Project } from './project.js';
import { Todo } from './todo.js';
import { isToday, differenceInCalendarDays } from 'date-fns';
import { createProjectElement } from './ui.js';

class Storage {
    projectList = [];
    todoList = [];

    createProject(name) {
        this.projectList.push(new Project(name));
    }

    createTodo(title, description, dueDate, priority, projectName) {
        let newTodo = new Todo(title, description, dueDate, priority, projectName);
        this.todoList.push(newTodo);


        if (projectName != "Inbox") {
            let project = this.getProject(projectName);
            project.addTodo(newTodo);
        }
    }

    getTodo(todoName) {
        let i = 0;
        while (this.todoList[i].getName() != todoName) {
            i++;
        }
        return this.todoList[i];
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

    setProjectList(projects) {
        this.projectList = [];
        projects.forEach(project => this.createProject(project.name));
        
    }

    getTodoList() {
        return this.todoList;
    }

    setTodoList(todos) {
        this.todoList = [];

        function changeDueDate(date) {

        }
        todos.forEach(todo => this.createTodo(todo.title, todo.description, todo.dueDate, todo.priority, todo.project));

    }


    checkDuplicateTodo(name) {
        if (this.todoList.some(todo => todo.getName() == name)) {
            return false;
        }
        return true;
    }

    checkDuplicateProject(name) {
        if (this.projectList.some(project => project.getName() == name)) {
            return false;
        }
        return true;
    }

    generateToday() {
        const todayProject = this.getProject('Today');
        todayProject.clearTodo();
        for (let i = 0; i < this.todoList.length; i++) {
            if (isToday(this.todoList[i].getDate())) {
                todayProject.addTodo(this.todoList[i])
            }
        }
        return todayProject.getTodo();
    }

    generateWeek() {
        const weekProject = this.getProject('This Week');
        weekProject.clearTodo();
        for (let i = 0; i < this.todoList.length; i++) {
            let difference = differenceInCalendarDays(this.todoList[i].getDate(), new Date());
            if (difference <= 7 && difference >= 0) {
                weekProject.addTodo(this.todoList[i])
            }
        }
        return weekProject.getTodo();

    }

    removeTodo(id) {
        let i = this.getTodoIndex(id);


        let project = this.todoList[i].getProject();
        let j = this.getProjectIndex(project);
        if (j >= 0) {
            this.projectList[j].removeTodo(id);
        }

        this.todoList.splice(i, 1);
    }

    removeProject(id) {
        let i = this.getProjectIndex(id);

        let todos = this.projectList[i].getTodo();
        
        todos.forEach(todo => this.removeTodo(todo.getName()));

        this.projectList.splice(i,1);
    }

    getTodoIndex(id) {
        let found = false;
        let i = 0;
        while (!found) {
            if (this.todoList[i].getName() == id) {
                found = true;
                return i;
            }
            i++;
        }
    }

    getProjectIndex(project) {
        if (project != 'Inbox') {
            let found = false;
            let j = 0;
            while (!found) {
                if (this.projectList[j].getName() == project) {
                    found = true;
                    return j;
                }
                j++;
            }
        }
        return -1;
    }
}


// default Projects + Todo for the page
let myData = new Storage();
export { myData };
