const root = document.getElementById('root')

let todos = [
  {
    id: 1,
    title: 'bla bla',
    completed: true
  },
  {
    id: 2,
    title: 'todo something',
    completed: false
  },
  {
    id: 3,
    title: 'todo bla bla',
    completed: false
  }
];

function creator(el, content, htmlClass) {
  const container = document.createElement(el)
  if (htmlClass) {
    container.classList.add(htmlClass);
  }
  container.innerText = content
  return container
};

function createLi(todo) {
  const li = document.createElement('li');
  const isCompleted = todo.completed ? 'completed' : '';

  li.classList = `${isCompleted}`;
  li.setAttribute('data-key', todo.id)


  const div = creator('div', null, 'view')
  const inputToggle = creator('input', null, 'toggle');
  inputToggle.setAttribute('type', 'checkbox')
  inputToggle.setAttribute('id', todo.id)

  if (isCompleted) {
    inputToggle.setAttribute('checked', true)
  }
  
  div.appendChild(inputToggle)

  const todoLabel = creator('div', todo.title, 'item-label')
  div.appendChild(todoLabel)

  const destroyButton = creator('button', null, 'destroy')
  div.appendChild(destroyButton)

  const input = creator('input', null, 'edit')
  li.appendChild(div)
  li.appendChild(input)

  return li
}

//#region HTML
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
const arrowContainer = creator('div', null, 'arrow-container');
const arrow = creator('img', null)
arrow.setAttribute('src', './arrow-grey.svg');
arrowContainer.appendChild(arrow)

toggleAllLabel.setAttribute('for', 'toggle-all');

mainSection.appendChild(toggleAllLabel);
mainSection.appendChild(arrowContainer)

const todoList = document.createElement('ul')
todoList.classList.add('todo-list')
mainSection.appendChild(todoList)

const footer = creator('footer', null, 'footer')
container.appendChild(footer)

const todoCount = creator('span', `${countTodo(todos)} items left`, 'todo-count')
footer.appendChild(todoCount)

const filters = creator('ul', null, 'filters')
footer.appendChild(filters)

const all = creator('li', null, 'all');
all.classList.add('selected')
const linkAll = creator('a', 'All');
linkAll.setAttribute('href', '#/')
all.appendChild(linkAll)
filters.appendChild(all)

const active = creator('li', null, 'active')
const linkActive = creator('a', 'Active');
linkActive.setAttribute('href', '#/active')
active.appendChild(linkActive)
filters.appendChild(active)


const completed = creator('li', null, 'completed')
const linkCompleted = creator('a', 'Completed');
linkCompleted.setAttribute('href', '#/completed')
completed.appendChild(linkCompleted)
filters.appendChild(completed)

const clearCompleted = creator('button', 'Clear Completed', 'clear-completed')
footer.appendChild(clearCompleted)

root.appendChild(container);

//#endregion

function partialRender(todoId, action) {
  const dataKey = document.querySelector(`[data-key="${todoId}"]`)

  switch (action) {
    case 'changeStatus':
      dataKey.classList.toggle('completed')
      todoCount.innerText = `${countTodo(todos)} ${countTodo(todos) > 1 ? 'items' : 'item'} left`;
      if (countTodo(todos) === todos.length) {
        clearCompleted.classList = 'hidden'
      } else {
        clearCompleted.classList = 'clear-completed'
      }

      if(completed.classList.contains('selected') || active.classList.contains('selected')) {
        dataKey.remove()
      }

      break;

    case 'deleteTodo':
      dataKey.remove();
      if (countTodo(todos) === 0) {
        todoCount.innerText = ''
      } else {
        todoCount.innerText = `${countTodo(todos)} ${countTodo(todos) > 1 ? 'items' : 'item'} left`;
      }

      if (todos.length === 0) {
        footer.classList = 'hidden'
      }
      break;

    case 'addTodo':
      todoList.appendChild(createLi(todos[todoId]))
      todoCount.innerText = `${countTodo(todos)} ${countTodo(todos) > 1 ? 'items' : 'item'} left`;
      arrowContainer.classList.remove('hidden')
      break;

    case 'changeTitle':
      if (todos.find(el => el.id === +todoId).completed === true) {
        dataKey.classList = 'completed'
      } else {
        dataKey.removeAttribute('class')
      }
      dataKey.querySelector('.item-label').innerText = todos.find(el => el.id === +todoId).title;
      break;

    default:
      break;
  }
}


function render(todos) {
  const listTodo = [...todos]
  listTodo.map(todo => {
    todoList.append(createLi(todo))
  })

  if (todos.length === 0) {
    footer.classList.classList = 'hidden';
  }
}

function clearRender(node) {
  node.querySelectorAll('*').forEach((n) => n.remove())
}

function addTodo(text) {
  const todo = {
    title: text,
    completed: false,
    id: Date.now()
  }

  todos.push(todo)
  footer.classList = 'footer'
  if (completed.classList.contains('selected')){
    todoCount.innerText = `${countTodo(todos)} ${countTodo(todos) > 1 ? 'items' : 'item'} left`;
  } else {
    partialRender(todos.length - 1, 'addTodo')
  }
}

function changeStatus(todoId) {
  const index = todos.findIndex(item => item.id === +todoId)
  todos[index].completed = !todos[index].completed;

  if (todos.filter(todo => todo.completed === false).length === 0) {
    toggleAllInput.setAttribute('checked', true)
    arrow.setAttribute('src', './arrow-black.svg');
  } else {
    toggleAllInput.removeAttribute('checked')
    arrow.setAttribute('src', './arrow-grey.svg');
  }



  partialRender(todoId, 'changeStatus')
}

function deleteTodo(todoId) {
  todos = todos.filter(el => el.id !== +todoId)
  partialRender(todoId, 'deleteTodo')
}

function countTodo(todos) {
  const count = todos.filter(todo => todo.completed === false).length
  return count
}

function filterTodo(todos, bool) {
  const filteredTodo = todos.filter(todo => todo.completed === bool)

  return filteredTodo;
}


function toggleAllComplete() {

  if (todos.filter(todo => !todo.completed).length === 0) {
    todos.forEach(todo => todo.completed = false);
    toggleAllInput.setAttribute('checked', true)
    arrow.setAttribute('src', './arrow-black.svg');
  } else {
    todos.forEach(todo => todo.completed = true);
    toggleAllInput.setAttribute('checked', true)
    arrow.setAttribute('src', './arrow-black.svg');
  }


  if (todos.filter(todo => todo.completed === false).length !== 0) {
    toggleAllInput.removeAttribute('checked')
    arrow.setAttribute('src', './arrow-grey.svg');
  }


  if (countTodo(todos) === todos.length) {
    clearCompleted.classList = 'hidden'
  } else {
    clearCompleted.classList = 'clear-completed'
  }

  todoCount.innerText = `${countTodo(todos)} ${countTodo(todos) > 1 ? 'items' : 'item'} left`;

  clearRender(todoList);
  render(todos)
}

function clearComplete() {
  arrow.setAttribute('src', './arrow-grey.svg');
  todos = todos.filter(todo => todo.completed === false)
  if (countTodo(todos) === todos.length) {
    clearCompleted.classList = 'hidden'
  } else {
    clearCompleted.classList = 'clear-completed'
  }

  if (todos.length === 0) {
    footer.classList = 'hidden';
    arrowContainer.classList.add('hidden')
  }

  clearRender(todoList)

  if (completed.classList.contains('selected')) {
    clearRender(todoList)
  } else {
    render(todos)
  }
}

function changeTitleTodo(todoId, inputValue) {
  const index = todos.findIndex(item => item.id === +todoId)
  todos[index].title = inputValue;
  partialRender(todoId, 'changeTitle');
}



render(todos);

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = inputTodo.value.trim()
  if (inputValue !== '') {
    addTodo(inputValue)
    inputTodo.value = ''
    inputTodo.focus();
  }
}

const handleClick = (event) => {
  if (event.target.classList.contains('toggle')) {
    const todoId = event.target.closest('li').dataset.key
    changeStatus(todoId)
  }

  if (event.target.classList.contains('destroy')) {
    const todoId = event.target.closest('li').dataset.key
    deleteTodo(todoId)
  }
}

const handleFilter = (event) => {
  const target = event.target.innerText
  const filteredArray = [...todos]
  switch (target) {
    case 'Completed':
      all.classList.remove('selected')
      active.classList.remove('selected')
      completed.classList.add('selected')
      clearRender(todoList)
      render(filterTodo(filteredArray, true))
      break;
    case 'Active':
      all.classList.remove('selected')
      completed.classList.remove('selected')
      active.classList.add('selected')
      clearRender(todoList)
      render(filterTodo(filteredArray, false))
      break;

    default:
      completed.classList.remove('selected')
      active.classList.remove('selected')
      all.classList.add('selected')
      clearRender(todoList)
      render(todos)
      break;
  }
}

const handleClearCompleted = () => {
  clearComplete()
}

const handleDoubleClick = (event) => {
  const div = event.target.closest('li')
  div.classList = 'editing'
  const input = div.querySelector('.edit');
  setTimeout(() => {
    input.focus()
  }, 0)
  const todo = todos.find(todo => todo.id === +div.dataset.key)
  input.value = todo.title
}

const handleToggleAll = (event) => {
  if (event.target.closest('label')) {
    toggleAllComplete()
  }
}


const handleEdit = (event) => {
  if (event.target.classList.contains('edit')) {
    const input = event.target
    input.addEventListener('blur', () => {
      if (input.closest('.editing')) {
        if (input.value.trim() !== '') {
          const todoId = input.closest('li').dataset.key
          changeTitleTodo(todoId, input.value.trim())
        } else {
          input.closest('.editing').classList = 'view'
        }
      }
    })
    event.target.addEventListener('keydown', event => {
      if (event.target.value.trim() !== '' && event.keyCode === 13) {
        const todoId = event.target.closest('li').dataset.key
        changeTitleTodo(todoId, event.target.value.trim())
      }
    })
  };
}

todoList.addEventListener('click', handleEdit);
todoList.addEventListener('dblclick', handleDoubleClick);
todoList.addEventListener('click', handleClick);
toggleAllLabel.addEventListener('click', handleToggleAll)
form.addEventListener('submit', handleSubmit);
filters.addEventListener('click', handleFilter)
clearCompleted.addEventListener('click', handleClearCompleted)
