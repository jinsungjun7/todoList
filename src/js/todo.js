import {parseISO} from 'date-fns';


class Todo {
    constructor(title, description, dueDate, priority, project = 'Inbox') {
        this.title = title;
        this.description = description;

        // appending the current time to correct any timezone discrepancy
        let now = new Date();

        dueDate = dueDate.split('-');
        this.dueDate = new Date(dueDate[0], Number(dueDate[1])-1, dueDate[2], now.getHours(), now.getMinutes(),now.getSeconds() );


        this.priority = priority;
        this.project = project;
    }

    edit(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    getName() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getDate() {
        return this.dueDate;
    }
    
    getPriority() {
        return this.priority;
    }

    getProject() {
        return this.project;
    }    
}

export { Todo };