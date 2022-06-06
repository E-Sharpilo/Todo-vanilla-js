const root = document.getElementById('root')

const todos = [];


function creator(el, content, htmlClass = null) {
  const container = document.createElement(el)
  if (htmlClass !== null) {
    container.classList.add(htmlClass);
  }
  container.innerHTML = content
  return container
};


//#region Create HTML

const container = creator('section', null, 'todoapp');



const header = creator('header', null, 'header');
container.appendChild(header);



const title = creator('h1', 'todos');
header.appendChild(title);


const form = creator('form', null, 'todo-form');
header.appendChild(form);


const inputTodo = creator('input', null, 'new-todo');
inputTodo.setAttribute('placeholder', 'What needs to be done?')
form.appendChild(inputTodo);


const mainSection = creator('section', null, 'main');
container.appendChild(mainSection);

const toggleAllInput = creator('input', null, 'toggle-all');
toggleAllInput.setAttribute('type', 'checkbox');
toggleAllInput.id = 'toggle-all';
mainSection.appendChild(toggleAllInput);


const toggleAllLabel = creator('label', 'Mark all as complete');
toggleAllLabel.setAttribute('for', 'toggle-all');
mainSection.appendChild(toggleAllLabel);

const todoList = document.createElement('ul')
todoList.classList.add('todo-list')
mainSection.appendChild(todoList)

const footer = creator('footer', null, 'footer')
container.appendChild(footer)

const todoCount = creator('span', '3 items left', 'todo-count')
footer.appendChild(todoCount)

const filters = creator('ul', null, 'filters')
footer.appendChild(filters)

const all = creator('li', '<a href=#/ class ="selected">All</a>')
filters.appendChild(all)
const active = creator('li', '<a href=#/active">Active</a>')
filters.appendChild(active)
const completed = creator('li', '<a href=#/completed">Completed</a>')
filters.appendChild(completed)

const clearCompleted = creator('button', 'Clear Completed', 'clear-completed')
footer.appendChild(clearCompleted)

root.appendChild(container);

//#endregion Create HTML

function renderList(todo) {
  const listItem = document.querySelector(`[data-key = '${todo.id}']`)
  const isCompleted = todo.completed ? 'completed' : '';
  const li = document.createElement('li');
  li.classList = `${isCompleted}`;

  li.setAttribute('data-key', todo.id)

  li.innerHTML = `
  <div class="view">
    <input type="checkbox" class="toggle" id="${todo.id} checked = ${todo.completed}" />
    <label for="${todo.id}" class="item-label">${todo.title}</label>
    <button type="button" class="destroy" />
  </div>
  <input type="text" class="edit" />
  `;

  if (listItem) {
    todoList.replaceChild(li, listItem)
  } else {
    todoList.append(li)
  }
  
}

function addTodo(todo) {
  const todoItem = {
    title: todo,
    completed: false,
    id: Date.now()
  }

  todos.push(todoItem)
  renderList(todoItem)
}

function toggleStatus(key) {
  const index = todos.findIndex(item => item.id === Number(key))

  todos[index].completed = !todos[index].completed;
  renderList(todos[index])
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const inputValue = inputTodo.value.trim()
  if (inputValue !== '') {
    addTodo(inputValue)
    inputTodo.value = ''
    inputTodo.focus();
  }
})

todoList.addEventListener('click', event => {
  if (event.target.classList.contains('toggle') || event.target.classList.contains('item-label')) {
    const todoId = event.target.parentElement.parentElement.dataset.key
    toggleStatus(todoId)
  }
})

