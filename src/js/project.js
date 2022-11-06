import { Todo } from './todo.js';

class Project {
    constructor(name) {
        this.name = name;
        this.todoList = [];
    }

    getName() {
        return this.name;
    }

    addTodo(todo) {
        if (todo instanceof Todo) {
            this.todoList.push(todo);
        };
    }

    getTodo() {
        return this.todoList;
    }

    removeTodo(todo) {
        let i = 0;
        let todoExist = true;
        while (todoExist) {
            if (this.todoList[i].getName() == todo) {
                this.todoList.splice(i,1);
                todoExist = false;
            }
            i++;
        };
    }

    // specifically for today and tomorrow projects
    clearTodo() {
        this.todoList = [];
    }

    

};

export { Project };