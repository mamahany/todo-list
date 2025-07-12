import { format} from "date-fns";
import { generateUniqueId} from "./storage.js";
class Project{
    constructor(name){
        this.name = name;
        this.id = generateUniqueId();
        this.items = [];
    }
}
class Todo{
    constructor(title, priority, dueDate, details){
        this.id = generateUniqueId();
        this.title = title;
        this.priority = priority;
        this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
        this.details = details;
        this.done = false;
    }
}

export {Project, Todo}