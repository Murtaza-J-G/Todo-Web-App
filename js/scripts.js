const themeSwitcherBtn = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const btnFilter = document.querySelector("#clear-completed");

function main(){
  // Theme switcher
  themeSwitcherBtn.addEventListener('click', () => {
    bodyTag.classList.toggle("light");

    const themeImg = themeSwitcherBtn.children[0];
    themeImg.setAttribute("src", 
      themeImg.getAttribute("src") === "./assets/images/icon-sun.svg" ? 
      "./assets/images/icon-moon.svg" :
       "./assets/images/icon-sun.svg"
    );
    
  });

  makeTodoElement(JSON.parse(localStorage.getItem("todos")));

  // add event for ul tag
  ul.addEventListener('dragover', (e)=>{
    e.preventDefault();

    if(e.target.classList.contains("card") && !e.target.classList.contains("dragging")){
      const draggingCard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];
      const currentPosition = cards.indexOf(draggingCard);
      const newPosition = cards.indexOf(e.target);
      if(currentPosition > newPosition){
        ul.insertBefore(draggingCard, e.target);
      } else{
        ul.insertBefore(draggingCard, e.target.nextSibling);
      }

      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currentPosition, 1);
      
      todos.splice(newPosition, 0, removed[0]);
      localStorage.setItem("todos", JSON.stringify(todos));
      
    }
  });



  // Add todo to local storage
  addBtn.addEventListener("click", () => {
    const item = todoInput.value.trim();
    if(item){
      todoInput.value = "";
      const todos = !localStorage.getItem("todos") ? [] : JSON.parse(localStorage.getItem('todos'));

      const currentTodo = {
        item:item,
        isCompleted: false,
      }

      todos.push(currentTodo);
      localStorage.setItem("todos", JSON.stringify(todos));
      makeTodoElement([currentTodo]);
    }
  });

  todoInput.addEventListener('keydown', (e) => {
    if(e.key == 'Enter'){
      addBtn.click();
    }
  });



  // Add function for delete, show and filter todos 
  filter.addEventListener('click', (e) => {
    const id = e.target.id;
    if(id){
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }
  });

  // add an event listener for delete multiple todos
  btnFilter.addEventListener('click', ()=>{
    var deleteIndexes = [];

    document.querySelectorAll(".card.checked").forEach((card) =>{
      deleteIndexes.push(
        [...document.querySelectorAll(".todos .card")].indexOf(card)
      );
      card.classList.add("fall");
      card.addEventListener('animationend', ()=>{
        card.remove();
      });
    });
    removeMultipleTodos(deleteIndexes);
  });

}

// add function for remove a todo
function removeTodo(index){
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// add function for delete multiple todos
function removeMultipleTodos(indexes){
  var todos = JSON.parse(localStorage.getItem("todos"));
    todos = todos.filter((todo, index) => {
      return !indexes.includes(index);
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// add function for change the state of a todo
function stateTodo(index, isComplete){
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = isComplete;
  localStorage.setItem("todos", JSON.stringify(todos));

}

// Add function for inject data in html elements
function makeTodoElement(todoArray){
  if(!todoArray){
    return null;
  }


  const itemsLeft = document.querySelector('#items-left');

  todoArray.forEach(todoObject => {
    // Create HTML Elements of Todo
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const itemP = document.createElement("p");
    const clearButton = document.createElement("button");
    const img = document.createElement("img");

    // Add Classes
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    itemP.classList.add("item");
    clearButton.classList.add("clear");

    // Add Attributes
    card.setAttribute("draggable", true);
    cbInput.setAttribute("type", "checkbox");
    
    img.setAttribute("src", "./assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear it");
    itemP.textContent = todoObject.item;

    if(todoObject.isCompleted){
      card.classList.add('checked');
      cbInput.setAttribute('checked', 'checked');
    }

    // Add EventListener
    card.addEventListener('dragstart', ()=>{
      card.classList.add("dragging");
    });

    card.addEventListener('dragend', ()=>{
      card.classList.remove("dragging");
    });

    cbInput.addEventListener('click', (e) => {
      const currentCard = cbInput.parentElement.parentElement;
      const checked = cbInput.checked;
      currentCardIndex = [...document.querySelectorAll(".todos .card")].indexOf(currentCard);
      stateTodo(currentCardIndex, checked);

      checked ? currentCard.classList.add('checked') : currentCard.classList.remove('checked');

      itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;

    });

    clearButton.addEventListener('click', (e) => {
      const currentCard = clearButton.parentElement;
      currentCard.classList.add('fall');
      const indexOfCurrentCard = [...document.querySelectorAll(".todos .card")].indexOf(currentCard);
      removeTodo(indexOfCurrentCard);

      currentCard.addEventListener('animationend', () => {
        setTimeout(()=>{
          currentCard.remove();
          itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length; 
        }, 100);
      });

    });    

    // Set Elements by parent of child
    clearButton.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);
    card.appendChild(cbContainer);
    card.appendChild(itemP);
    card.appendChild(clearButton);

    document.querySelector(".todos").appendChild(card); 


  });

  itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length; 

}

document.addEventListener('DOMContentLoaded', main);