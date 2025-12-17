/*

TODO LIST

**NEW CONCEPTS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Create element
const li = document.createElement('li');

// Add to page
todoList.appendChild(li);

// Remove from page
li.remove();

// Array push
todos.push({ id: 1, text: "...", completed: false });

// Array filter (remove item)
todos = todos.filter(todo => todo.id !== idToRemove);

// Enter key detection
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { ... }
});

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


🧠 Quick Reference: createElement Flow
Creating elements dynamically:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. Create
const li = document.createElement('li');

// 2. Add content
li.innerHTML = `
  <input type="checkbox">
  <span>Buy groceries</span>
  <button class="delete-btn">🗑️</button>
`;

// 3. Add classes
li.classList.add('todo-item');

// 4. Add to page
todoList.appendChild(li);

// Later: Remove
li.remove();


🎯 Hint: Event Delegation
Instead of adding listeners to each button:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ❌ Hard way (listener on each)
deleteBtn.addEventListener('click', ...)

// ✅ Easy way (one listener on parent)
todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    // Handle delete
  }
  if (e.target.type === 'checkbox') {
    // Handle checkbox
  }
});

*/

/*

STEP 1: Grab DOM elements
├── #todo-input
├── # add-btn
├── #todo-list (the <ul>)
├── #task-count
├── #clear-all
└── #empty-message

*/

let todoInput = document.getElementById("todo-input");
let addBtn = document.getElementById("add-btn");
let todoList = document.getElementById("todo-list");
let taskCount = document.getElementById("task-count");
let clearBtn = document.getElementById("clear-all");
let emptyMessage = document.getElementById("empty-message");

/*

STEP 2: Create state
├── let todos = []
└── Each todo: { id: Date.now(), text: "...", completed: false }

*/

let todos = [];

/*

STEP 3: Create addTodo() function
├── Get input value
├── If empty → return (don't add)
├── Create todo object
├── Push to todos array
├── Call renderTodos()
└── Clear input

*/

function addTodo() {
  let input = todoInput.value;

  if (input.trim() === "") return;

  const todo = { id: Date.now(), text: todoInput.value, completed: false };

  todos.push(todo);
  renderTodos();
  todoInput.value = "";
}

/*

STEP 4: Create renderTodos() function
├── Clear the todo list (innerHTML = '')
├── Loop through todos array
├── For each todo:
│   ├── Create <li> element
│   ├── Add class "todo-item"
│   ├── Create inner HTML (checkbox, text, delete button)
│   ├── Append to todo list
├── Update task count
└── Show/hide empty message

*/

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");

    if (todo.completed) li.classList.add("completed");

    li.setAttribute("data-id", todo.id);

    li.innerHTML = `
    <input type="checkbox" ${todo.completed ? "checked" : ""}>
    <span>${todo.text}</span>
    <button class="delete-btn">🗑️</button>
    `;

    todoList.appendChild(li);
  });

  const incompleteTasks = todos.filter((todo) => !todo.completed).length;
  taskCount.textContent = incompleteTasks;

  // Show/hide empty message
  if (todos.length === 0) {
    emptyMessage.classList.remove("hide");
  } else {
    emptyMessage.classList.add("hide");
  }
}

/*

STEP 5: Handle delete
├── Use event delegation on todo-list
├── Check if clicked element has class 'delete-btn'
├── Get todo id from parent's data attribute
├── Filter out from todos array
└── Re-render

STEP 6: Handle checkbox toggle
├── Check if clicked element is checkbox
├── Get todo id
├── Find todo in array and toggle completed
└── Re-render

*/

todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest(".todo-item");
    const id = Number(li.getAttribute("data-id"));
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  } else if (e.target.type === "checkbox") {
    const li = e.target.closest(".todo-item");
    const id = Number(li.getAttribute("data-id"));
    const todo = todos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    renderTodos();
  }
});

/*

STEP 7: Event Listeners
├── add-btn click → addTodo()
├── input keydown → if Enter, addTodo()
├── clear-all click → clear todos array, re-render
└── todo-list click → handle delete or checkbox

*/

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") return addTodo();
});
clearBtn.addEventListener("click", () => {
  todos =[];
  renderTodos()
});

/*

STEP 8: Initialize
└── renderTodos() on page load

*/

renderTodos();
