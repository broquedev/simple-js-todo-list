
/*=Selectors
==========================================================*/ 
const task = document.getElementById("task");
const list = document.getElementById("list");
const total = document.getElementById("total");
const done = document.getElementById("done");
const todo = document.getElementById("todo");
const message = document.getElementById("message");


/*=Arrays
==========================================================*/  
const listTask = JSON.parse(localStorage.getItem("item")) || [];
listTask.forEach(element => createItemList(element));


/*=Event Listeners
==========================================================*/ 
document.addEventListener("submit", event => {
    event.preventDefault();   
                
    const currentItem = {
        "task": task.value,
        "state": "todo"
    }

    const elementExists = listTask.find(element => {
        return element.task === currentItem.task
    });

    if(elementExists) {
        currentItem.id = elementExists.id;
        message.show()

        document.getElementById("closeButton")
        .addEventListener("click", () => {
            message.close();            
        })         
    
    } else {
        currentItem.id = listTask[listTask.length - 1] ? listTask[listTask.length - 1].id + 1 : 0;
        createItemList(currentItem);
        listTask.push(currentItem);
        countTasks();
    }

    localStorage.setItem("item", JSON.stringify(listTask)); 

    task.value = "";
})


/*=Functions
==========================================================*/ 
function createItemList(element) {
    const item = document.createElement("li");
    item.classList.add("list__item");

    const span = document.createElement("span");
    span.dataset.id = element.id;
    span.classList.add("list__span");

    const buttonDelte = createButtonDelete(element.id);
    const checkBox = createCheckBox(element); 
    
    list.appendChild(item);
    item.appendChild(checkBox);    
    item.appendChild(span);
    item.appendChild(buttonDelte);

    /* Check what tasks have been done by loading the list to add the "done" class. */ 
    if(element.state === "done") {
        checkBox.nextElementSibling.classList.toggle("done");
        checkBox.checked = true
    };
    
    span.innerHTML += element.task;
}

function countTasks() {
    let countDone = 0;
    let countTodo = 0;

    for(item of listTask) {
        if(item.state === "done") {
            countDone++;

        } else {
            countTodo++;

        }
    } 
    
    total.innerHTML = listTask.length;
    done.innerHTML = countDone;
    todo.innerHTML = countTodo;
}

function createCheckBox(element) {
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");    
    checkBox.classList.add("checkbox");    

    checkBox.addEventListener("click", function ()  {
        taskChecked(this.nextElementSibling, element);
    })

    return checkBox;
}

function taskChecked(state, element) {
    
    if(element.state === "todo") {
        element.state = "done";
        state.classList.toggle("done");
        countTasks();
        localStorage.setItem("item", JSON.stringify(listTask));
        
    } else {
        element.state = "todo";
        state.classList.remove("done");
        countTasks();
        localStorage.setItem("item", JSON.stringify(listTask));        

    }

}

function createButtonDelete(elementId) {
    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("trash");
    buttonDelete.innerHTML = `<i class="fa-solid fa-trash-can fa-sm"></i>`;
    
    buttonDelete.addEventListener("click", function() {
        deleteElement(this.parentElement, elementId);
    })

    return buttonDelete;
}

function deleteElement(item, elementId) {
   item.remove();   
   listTask.splice(listTask.findIndex(element => element.id === elementId), 1);
   countTasks();
   localStorage.setItem("item", JSON.stringify(listTask));
}

countTasks(); 
