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

const todoCount = creator('span', `${countTodo(todos)} items left`, 'todo-count')
footer.appendChild(todoCount)

const filters = creator('ul', null, 'filters')
footer.appendChild(filters)

const all = creator('li', null, 'all');
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

//#endregion Create HTML

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

  const todoLabel = creator('label', todo.title, 'item-label')
  todoLabel.setAttribute('for', todo.id)
  div.appendChild(todoLabel)

  const destroyButton = creator('button', null, 'destroy')
  div.appendChild(destroyButton)
  // const edditButton = creator('button', null, 'eddit')
  // div.appendChild(edditButton)



  const input = creator('input', null, 'edit')


  li.appendChild(div)
  li.appendChild(input)

  return li
}


function render(todos) {
  todos.map(todo => {
    todoList.append(createLi(todo))
  })

  todoCount.innerText = `${countTodo(todos)} ${countTodo(todos) > 1 ? 'items' : 'item'} left`;
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
  clearRender(todoList)
  render(todos)
}

function changeStatus(todoId) {
  const index = todos.findIndex(item => item.id === +todoId)
  todos[index].completed = !todos[index].completed;
  clearRender(todoList)
  render(todos)
}

function deleteTodo(todoId) {
  todos = todos.filter(el => el.id !== +todoId)
  clearRender(todoList)
  render(todos)
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
  } else {
    todos.forEach(todo => todo.completed = true);
  }

  clearRender(todoList);
  render(todos)
}

function clearComplete() {
  todos = todos.filter(todo => todo.completed === false)
  clearRender(todoList)
  render(todos)
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

  // if (event.target.classList.contains('item-label')) {
  //   console.log('edit');
  // }

  if (event.target.classList.contains('destroy')) {
    const todoId = event.target.closest('li').dataset.key
    deleteTodo(todoId)
  }
}

const handleFilter = (event) => {
  const target = event.target.innerText
  switch (target) {
    case 'Completed':
      all.classList.remove('selected')
      active.classList.remove('selected')
      completed.classList.add('selected')
      clearRender(todoList)
      render(filterTodo(todos, true))
      break;
    case 'Active':
      all.classList.remove('selected')
      completed.classList.remove('selected')
      active.classList.add('selected')
      clearRender(todoList)
      render(filterTodo(todos, false))
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
  console.log('dblclick');
}

const handleToggleAll = (event) => {
  if (event.target.closest('label')) {
    toggleAllComplete()
  }
}

// var double = function () { console.log(this.id + ' double') },
//   single = function () { console.log(this.id + ' single') };

// function makeDoubleClick(doubleClickCallback, singleClickCallback) {
//   return (function () {
//     var clicks = 0,
//       timeout;

//     return function () {
//       var me = this;
//       clicks++;
//       if (clicks == 1) {
//         timeout = setTimeout(function () {
//           singleClickCallback && singleClickCallback.apply(me, arguments);
//           clicks = 0;
//         }, 100);
//       } else {
//         clearTimeout(timeout);
//         doubleClickCallback && doubleClickCallback.apply(me, arguments);
//         clicks = 0;
//       }
//     };
//   }());
// }
// todoList.addEventListener('click', makeDoubleClick(double, single));

todoList.addEventListener('click', handleClick);
toggleAllLabel.addEventListener('click', handleToggleAll)
form.addEventListener('submit', handleSubmit);
filters.addEventListener('click', handleFilter)
clearCompleted.addEventListener('click', handleClearCompleted)


// todoList.addEventListener('dblclick', event => {
//   console.log('dblclick');
// })

