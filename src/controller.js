import {addProject, addTodo, removeTodo, updateTodo} from "./logic.js";
import { fetchProjects,  storeUsername} from "./storage.js";
import { Project, Todo } from "./models.js";

function createProject(projectName){
    let newProject = new Project(projectName);
    addProject(newProject);
}
function createTodo(obj, projectId){
    let todo = new Todo(obj.title, obj.priority, obj.dueDate, obj.details);
    addTodo(todo, projectId);
}
function updateUsername(username){
    if(username != ""){
        storeUsername(username);
    }
}
function deleteTodo(todoId, projectId){
    removeTodo(todoId, projectId);
}

function toggleTodoDone(todoId, projectId){
    let projects = fetchProjects();
    let project = projects.find(project => project.id == projectId);
    let todo = project.items.find(t => t.id == todoId);
    todo.done = !todo.done;
    updateTodo(todo, todoId, projectId);
}

export{createProject, createTodo, updateUsername, deleteTodo, toggleTodoDone};