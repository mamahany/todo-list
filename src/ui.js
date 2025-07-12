import deleteIcon from "./assets/icons/minus-circle.png";
import editIcon from "./assets/icons/pencil.png";
import trashIcon from "./assets/icons/trash.png";
import doneImage from "./assets//icons/done.svg";
import { format, isToday, isPast, isAfter, isBefore, addDays, endOfToday } from "date-fns";
import {removeProject, updateTodo} from "./logic.js";
import { fetchProjects, fetchUsername, fetchLastId } from "./storage.js";
import { createProject, createTodo, updateUsername, deleteTodo, toggleTodoDone } from "./controller.js";

function ui(){
    const newTodoBtn = document.querySelector(".new-todo-btn");
    const todosDiv = document.querySelector(".todos");
    const userProjectsDiv = document.querySelector(".user-projects");
    const addProjectBtn =  document.querySelector(".add-project-btn");
    const addProjectForm =  document.querySelector(".add-project-form");
    const addProjectFormBtn =  document.querySelector(".add-project-form button");
    const addProjectFormInput =  document.querySelector(".add-project-form input")
    const todoDialog = document.querySelector(".todo-dialog");
    const addTodoForm = document.querySelector(".add-todo-form");
    const changeUsernameBtn = document.querySelector(".change-username-btn")
    const changeUsernameForm = document.querySelector(".change-username-form");
    const changeUsernameFormInput = document.querySelector(".change-username-form input")
    const infoArea = document.querySelector(".info-area");
    const usernameSpan = document.querySelector(".username");
    const todayTab = document.querySelector(".today-div");
    const todaySpan = document.querySelector(".today-span");
    const upcomingTab = document.querySelector(".upcoming-div");
    const upcomingSpan = document.querySelector(".upcoming-span");
    const highTab = document.querySelector(".red");
    const mediumTab = document.querySelector(".blue");
    const lowTab = document.querySelector(".yellow"); 
    const container = document.querySelector(".container");
    const toggleSidebar = document.querySelector(".toggle-sidebar");
    const sidebarTabs = document.querySelectorAll('.red,.blue,.yellow,.today-div, .upcoming-div');

    todayTab.addEventListener("click", ()=>{tabControl.setCurrentTab(0)})
    highTab.addEventListener("click", ()=>{tabControl.setCurrentTab(1)})
    mediumTab.addEventListener("click", ()=>{tabControl.setCurrentTab(2)})
    lowTab.addEventListener("click", ()=>{tabControl.setCurrentTab(3)})
    upcomingTab.addEventListener("click", ()=>{tabControl.setCurrentTab(4)})

    toggleSidebar.addEventListener("click", ()=>{
        container.classList.toggle('collapsed');
        if(window.innerWidth <= 768 && !container.classList.contains("collapsed")){
            container.classList.add("mobile-sidebar");
        }else{
            container.classList.remove("mobile-sidebar");
        }
    });

    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
            container.classList.remove('mobile-sidebar');
            container.classList.add("collapsed")
            }
        });
    });
    userProjectsDiv.addEventListener('click', e => {
        const projectDiv = e.target.closest('.project');
        if (!projectDiv) return;
        if (window.innerWidth <= 768) {
            container.classList.remove('mobile-sidebar');
            container.classList.add('collapsed');
        }
    });
    function handleSidebarCollapse() {
        if (window.innerWidth <= 768) {
          container.classList.add('collapsed');
          container.classList.remove("mobile-sidebar");
        } else {
          container.classList.remove('collapsed');
        }
      }
    handleSidebarCollapse();
    window.addEventListener('resize', handleSidebarCollapse);

    changeUsernameBtn.addEventListener("click", (event)=>{
        event.stopPropagation();
        infoArea.setAttribute("style", "display:none;");
        changeUsernameForm.setAttribute("style", "display:flex;");
        document.addEventListener("click", (event) => {
            if (!changeUsernameForm.contains(event.target) && event.target !== changeUsernameBtn) {
                changeUsernameForm.setAttribute("style", "display:none;");
                infoArea.setAttribute("style", "display:flex;");
            }
          }, { once: true });
    })
    changeUsernameForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        displayUsername(changeUsernameFormInput.value);
        changeUsernameForm.reset();
        infoArea.setAttribute("style", "display:flex;");
        changeUsernameForm.setAttribute("style", "display:none;");
    })
    addProjectBtn.addEventListener("click", ()=>{
        addNewProject()
        document.addEventListener("click", (event) => {
            if (!addProjectForm.contains(event.target) && event.target !== addProjectBtn) {
                addProjectForm.setAttribute("style", "display:none;");
              addProjectBtn.setAttribute("style", "display:flex;");
            }
          });
    })
    newTodoBtn.addEventListener("click", ()=>{openDialog();});

    addTodoForm.addEventListener("submit", function(event){
        event.preventDefault();
        if(this.dataset.tid && this.dataset.pid){
            addTodo(this.dataset.tid, this.dataset.pid);
        }else{
            addTodo();
        }
    })

    function addNewProject(){
        addProjectForm.setAttribute("style", "display:flex;");
        addProjectBtn.setAttribute("style", "display:none;");
        addProjectFormBtn.addEventListener("click", (event)=>{
            event.preventDefault();
            if(addProjectFormInput.value != ""){
                let projectName = addProjectFormInput.value;
                addProjectForm.reset();
                createProject(projectName);
                displayProjects();
                tabControl.setCurrentTab(fetchLastId());
            }
            addProjectForm.setAttribute("style", "display:none;");
            addProjectBtn.setAttribute("style", "display:block;");
        }, { once: true });
    }
    function displayProjects(){
        userProjectsDiv.innerHTML = `<h3>Your Projects</h3>`
        let projects = fetchProjects();
        projects.forEach(project => {
            let div = document.createElement("div");
            div.classList.add("project");
            div.setAttribute("data-project-id", `${project.id}`);
            div.innerHTML = `<div><button>${project.name}</button>
                        <span>${project["items"].length}</span></div>`;
            if(project.id != 5){
                let deleteBtn = document.createElement("button");
                let img = document.createElement("img");
                img.src = deleteIcon;
                deleteBtn.classList.add("delete-btn")
                deleteBtn.appendChild(img);
                deleteBtn.addEventListener("click", ()=>{deleteProject(project.id);})
                div.appendChild(deleteBtn)
            }
            userProjectsDiv.appendChild(div);
            div.addEventListener("click", (event)=>{
                if(!event.target.closest(".delete-btn")){
                    tabControl.setCurrentTab(project.id)
                }
            })
        });
    }
    
    function renderTodo(item, projectId){
        const todo = document.createElement("div");
        const mainDiv = document.createElement("div");
        const headDiv = document.createElement("div");
        const contentDiv = document.createElement("div");
        const titleHeader = document.createElement("h2");
        const titleDiv = document.createElement("div");
        const dueDateSpan = document.createElement("span");
        const priorityDiv = document.createElement("div")
        const detailsPara = document.createElement("p");
        const done = document.createElement("div");
        const deleteBtn = document.createElement("button");
        const deleteImg = document.createElement("img");
        const editBtn = document.createElement("button");
        const editImg = document.createElement("img");

        todo.classList.add("todo");
        priorityDiv.textContent =  `${item.priority}`
        priorityDiv.classList.add(`${item.priority}`);
        titleDiv.classList.add("title-div");
        titleHeader.textContent = item.title;
        titleHeader.classList.add("title");
        dueDateSpan.textContent = item.dueDate + (isToday(new Date(item.dueDate))? " -Today." : isPast(new Date(item.dueDate)) && item.done == false? " -Overdue!" : "");
        dueDateSpan.classList.add("due-date");
        detailsPara.textContent = item.details;
        detailsPara.classList.add("details");
        done.innerHTML = `<label class="custom-checkbox">
<input type="checkbox" class="checkbox-input" />
<span class="checkmark"></span>
</label>`
        done.classList.add("done");
        if(item.done == true){
            todo.classList.add("done-todo");
            const checkboxInput = done.querySelector(".checkbox-input");
            checkboxInput.checked = true;
        }
        const checkboxInput = done.querySelector(".checkbox-input")
        checkboxInput.dataset.id = item.id;
        checkboxInput.dataset.projectId = projectId;
        checkboxInput.addEventListener("click", function (){
            toggleTodoDone(item.id, projectId);
            displayProjectTodos(this.dataset.projectId);
            displayProjects();
            tabControl.setCurrentTab(tabControl.getCurrentTab());
        })
        deleteImg.src = trashIcon;
        deleteBtn.appendChild(deleteImg);
        deleteBtn.classList.add("todo-delete");
        deleteBtn.dataset.id = item.id;
        deleteBtn.dataset.projectId = projectId;
        deleteBtn.addEventListener("click", function (){
            deleteTodo(this.dataset.id, this.dataset.projectId);
            displayProjectTodos(this.dataset.projectId);
            displayTodayTodosNum();
            displayUpcomingTodosNum();
            displayProjects();
            tabControl.setCurrentTab(tabControl.getCurrentTab());
        })
        editImg.src = editIcon;
        editBtn.appendChild(editImg);
        editBtn.classList.add("todo-edit");
        editBtn.addEventListener("click", ()=>{
            openDialog(item, projectId);
            displayProjectTodos(projectId);
            displayProjects();
            tabControl.setCurrentTab(tabControl.getCurrentTab());
        });

        titleDiv.appendChild(titleHeader)
        titleDiv.appendChild(editBtn)
        headDiv.appendChild(titleDiv);
        headDiv.appendChild(dueDateSpan);
        contentDiv.appendChild(headDiv);
        contentDiv.appendChild(detailsPara);
        contentDiv.appendChild(priorityDiv)
        mainDiv.appendChild(done);
        mainDiv.appendChild(contentDiv);
        todo.appendChild(mainDiv);
        todo.appendChild(deleteBtn);
        todosDiv.appendChild(todo);
    }

    function displayProjectTodos(projectId){
        let projects = fetchProjects();
        let project = projects.find(project => project.id == projectId);
        newTodoBtn.setAttribute("style", "display:block");
        todosDiv.innerHTML = ``
        if(project["items"].length == 0){todosDiv.innerHTML = noTodosScreen}
        project["items"].forEach(item => {
            renderTodo(item, project.id);
        });
    }
    const tabControl = (function(){
        let currentTab = 5; // General tab
        function setCurrentTab(value){
            const tabs = document.querySelectorAll(".project, .red,.blue,.yellow,.today-div, .upcoming-div");
            tabs.forEach(tab => tab.classList.remove("current-tab"));
            currentTab =  value;
            switch(value){
                case 0:
                    displayTodayTodos();
                    todayTab.classList.add("current-tab");
                    break;
                case 1:
                    displayPriorityTodos("high");
                    highTab.classList.add("current-tab");
                    break;
                case 2:
                    displayPriorityTodos("medium");
                    mediumTab.classList.add("current-tab");
                    break;
                case 3:
                    displayPriorityTodos("low");
                    lowTab.classList.add("current-tab");
                    break;
                case 4:
                    displayUpcomingTodos();
                    upcomingTab.classList.add("current-tab");
                    break; 
                default:
                    const currentTabDiv = document.querySelector(`.project[data-project-id="${currentTab}"]`);
                    currentTabDiv.classList.add("current-tab");
                    displayProjectTodos(currentTab);
            }
        }
        function getCurrentTab(){
            return currentTab;
        }
        return {setCurrentTab, getCurrentTab};
    })();

    function openDialog(oldTodo, projectId){
        document.querySelector('dialog').showModal();
        if(oldTodo){
            addTodoForm.querySelector('[name="title"]').value = oldTodo.title;
            addTodoForm.querySelector('[name="priority"]').value = oldTodo.priority;
            addTodoForm.querySelector('[name="dueDate"]').value = oldTodo.dueDate;
            addTodoForm.querySelector('[name="details"]').value = oldTodo.details;
            addTodoForm.dataset.tid = oldTodo.id;
            addTodoForm.dataset.pid = projectId;
        }else{
            addTodoForm.reset();
            delete addTodoForm.dataset.tid;
            delete addTodoForm.dataset.pid;
        }
    }

    function addTodo(todoId, projectId){
        const formData = new FormData(addTodoForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        if(todoId){
            updateTodo(data, todoId, projectId);
        }else{
            createTodo(data, tabControl.getCurrentTab());
        }
        addTodoForm.reset();
        delete addTodoForm.dataset.tid;
        delete addTodoForm.dataset.pid;
        todoDialog.close();
        displayTodayTodosNum();
        displayUpcomingTodosNum();
        displayProjects();
        tabControl.setCurrentTab(tabControl.getCurrentTab());
    }
    function displayTodayTodos(){
        newTodoBtn.setAttribute("style", "display:none");
        todosDiv.innerHTML = ``;
        const projects = fetchProjects();
        const today = format(new Date(), 'yyyy-MM-dd');
        let numOfTodos = 0;
        projects.forEach(project => project["items"].forEach(item => {if(item.dueDate == today){
            numOfTodos++;
            renderTodo(item, project.id);
        }}));
        if(numOfTodos == 0){todosDiv.innerHTML = noTodosScreen}
        todaySpan.textContent = numOfTodos;
    }
    function displayTodayTodosNum(){
        const today = format(new Date(), 'yyyy-MM-dd');
        const projects = fetchProjects();
        let numOfTodos = 0;
        projects.forEach(project => project["items"].forEach(item => {if(item.dueDate == today){
            numOfTodos++;
        }}));
        todaySpan.textContent = numOfTodos;
    }
    function isUpcoming(dueDate) {
        const tomorrow = addDays(endOfToday(), 0);
        const sevenDaysLater = addDays(tomorrow, 7);
        return isAfter(dueDate, tomorrow) && isBefore(dueDate, sevenDaysLater);
    }
    function displayUpcomingTodos(){
        newTodoBtn.setAttribute("style", "display:none");
        todosDiv.innerHTML = ``;
        const projects = fetchProjects();
        let numOfTodos = 0;
        projects.forEach(project => project["items"].forEach(item => {if(isUpcoming(new Date(item.dueDate))){
            numOfTodos++;
            renderTodo(item, project.id);
        }}));
        if(numOfTodos == 0){todosDiv.innerHTML = noTodosScreen}
        upcomingSpan.textContent = numOfTodos;
    }
    function displayUpcomingTodosNum(){
        const projects = fetchProjects();
        let numOfTodos = 0;
        projects.forEach(project => project["items"].forEach(item => {if(isUpcoming(new Date(item.dueDate))){
            numOfTodos++;
        }}));
        upcomingSpan.textContent = numOfTodos;
    }
    function displayPriorityTodos(priorityLevel){
        newTodoBtn.setAttribute("style", "display:none");
        todosDiv.innerHTML = ``
        const projects = fetchProjects();
        projects.forEach(project => project["items"].forEach(item => {if(item.priority == priorityLevel){
            renderTodo(item, project.id)
        }}));
        if(!(projects.some(project => project["items"].some(item => item.priority == priorityLevel)))){todosDiv.innerHTML = noTodosScreen}
    }
    function deleteProject(projectId){
        removeProject(projectId);
        displayProjects();
        tabControl.setCurrentTab(5);
    }
    function displayUsername(username = "Jhon Doe"){
        updateUsername(username);
        usernameSpan.textContent = fetchUsername();
    }
    const noTodosScreen = `<div style=" opacity:0.9;display:flex; margin-top:20%; height:100%; width:100%; align-items: center;
  justify-content: center;
  flex-direction: column;">
  <img src="${doneImage}" width="150px" style="margin:10px;">
  <h2 style="color:#3f3d56;">Nothing here to do.</h2>
    </div>
    `

    let username = fetchUsername();
    displayUsername(username);
    displayTodayTodosNum();
    displayUpcomingTodosNum();
    displayProjects();
    tabControl.setCurrentTab(tabControl.getCurrentTab());
}

export {ui}