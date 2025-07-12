function fetchProjects(){
    if(localStorage.getItem("projects") ==  null){
        let arr = JSON.stringify([{"name":"General", "id":5, "items":[]}]);
        localStorage.setItem("projects", arr);
    }
    const projects = JSON.parse(localStorage.getItem("projects"));
    return projects;
}
function storeProjects(projects){
    let string =  JSON.stringify(projects);
    localStorage.setItem("projects", string)
}
function generateUniqueId(){
    let lastId = parseInt(localStorage.getItem("lastId")) || 5;
    let newId = lastId + 1;
    localStorage.setItem("lastId", newId);
    return newId;
}
function storeUsername(username){
    localStorage.setItem("username", username);
}
function fetchUsername(){
    const username = localStorage.getItem("username") || "John Doe";
    return username;
}
function fetchLastId(){
    let lastId = localStorage.getItem("lastId");
    return lastId
}
export {storeProjects, fetchProjects, generateUniqueId, storeUsername, fetchUsername, fetchLastId};