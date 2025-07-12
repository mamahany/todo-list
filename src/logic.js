import {fetchProjects, storeProjects} from "./storage.js"
function addProject(project){
    let projects = fetchProjects();
    projects.push(project);
    storeProjects(projects);
}
function removeProject(projectId){
    let projects = fetchProjects();
    projects = projects.filter(item => item.id !== projectId);
    storeProjects(projects);
}
function addTodo(item, projectId){
    let projects = fetchProjects();
    let projectIndex = projects.findIndex(project => project.id == projectId);
    projects[projectIndex]["items"].push(item);
    storeProjects(projects);
}
function updateTodo(updatedTodo, todoId, projectId){
    let projects = fetchProjects();
    let project = projects.find(p => p.id == projectId);
    let todoIndex = project.items.findIndex(todo => todo.id == todoId);
    const mergedTodo = {
        ...project.items[todoIndex],
        ...updatedTodo
    }
    project.items[todoIndex] = mergedTodo;
    storeProjects(projects);
}
function removeTodo(todoId, projectId){
    let projects = fetchProjects();
    let projectIndex = projects.findIndex(item => item.id == projectId);
    let todoIndex = projects[projectIndex]["items"].findIndex(todo => todo.id == todoId);
    projects[projectIndex]["items"].splice(todoIndex, 1);
    storeProjects(projects);
}

export {addProject, removeProject, addTodo, updateTodo, removeTodo}