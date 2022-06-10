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

class Header {
  constructor(onSubmit) {
    this.header = creator('header', null, 'header')
    this.title = creator('h1', 'todos');
    this.form = creator('form', null, 'todo-form');
    this.input = creator('input', null, 'new-todo');
    this.onSubmit = onSubmit
  }
  render() {
    this.header.appendChild(this.title)
    this.header.appendChild(this.form)
    this.input.setAttribute('placeholder', 'What needs to be done?')
    this.form.addEventListener('submit', this.onSubmit);
    this.form.appendChild(this.input)
    return this.header;
  }
}

class TodoList {
  constructor(onDelete) {
    this.section = creator('section', null, 'main')
    this.toggleAllInput = creator('input', null, 'toggle-all')
    this.toggleAllLabel = creator('label', 'Mark all as complete');
    this.arrowContainer = creator('div', null, 'arrow-container');
    this.arrowImg = creator('img', null);
    this.todoList = creator('ul', null, 'todo-list');
    this.onDelete = onDelete
  }

  createLi(todo) {
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

  renderList() {
    this.todoList.innerHTML = ''
    const listTodo = [...todos]
    listTodo.map(todo => {
      this.todoList.append(this.createLi(todo))
    })
  }

  render() {
    this.toggleAllInput.setAttribute('type', 'checkbox');
    this.toggleAllInput.id = 'toggle-all';
    this.arrowImg.setAttribute('src', './arrow-grey.svg')
    this.arrowContainer.appendChild(this.arrowImg)
    this.toggleAllLabel.setAttribute('for', 'toggle-all')
    this.section.appendChild(this.toggleAllInput)
    this.section.appendChild(this.toggleAllLabel)
    this.section.appendChild(this.arrowContainer)
    this.section.appendChild(this.todoList)
    this.todoList.addEventListener('click', this.onDelete)
    this.renderList()
    return this.section
  }
}

class Link {
  constructor(href, className, text, selected) {
    this.li = document.createElement('li')
    this.tag = document.createElement('a')
    this.text = text
    this.href = href,
      this.className = className
    this.selected = selected;
  }

  render() {
    this.tag.innerText = this.text
    this.tag.setAttribute('href', `${this.href}`)
    this.tag.classList = `${this.className}`
    if (this.selected === true) {
      this.li.classList.add('selected')
    }
    this.li.appendChild(this.tag)
    return this.li
  }
}

class Count {
  constructor() {
    this.todoCount = creator('span', `${this.countTodo(todos)} items left`, 'todo-count')
  }

  countTodo(todos) {
    const count = todos.filter(todo => todo.completed === false).length
    return count
  }

  renderCount() {
    this.todoCount.innerHTML = ''
    return this.todoCount = creator('span', `${this.countTodo(todos)} items left`, 'todo-count');
  }

  render() {
    return this.todoCount
  }
}


class Footer {
  constructor() {
    this.footer = creator('footer', null, 'footer');
    this.todoCount = new Count();
    this.filters = creator('ul', null, 'filters')
    this.all = new Link('#/', 'all', 'All', true)
    this.active = new Link('#/active', 'active', 'Active')
    this.completed = new Link('#/completed', 'completed', 'Completed')
    this.clearCompleted = creator('button', 'Clear Completed', 'clear-completed')
  }

  renderCount() {
    this.footer.removeChild(this.footer.firstChild)
    this.todoCount.renderCount()
    this.footer.insertBefore(this.todoCount.renderCount(), this.footer.firstChild)
  }

  render() {
    this.footer.appendChild(this.todoCount.render())
    this.filters.append(
      this.all.render(),
      this.active.render(),
      this.completed.render()
    )
    this.footer.appendChild(this.filters)
    this.footer.appendChild(this.clearCompleted)
    return this.footer
  }
}

class App {
  constructor() {
    this.onSubmit = (event) => {
      event.preventDefault();
      const inputValue = event.target.querySelector('.new-todo');
      if (inputValue.value !== '') {
        this.addTodo(inputValue.value)
        inputValue.value = ''
        inputValue.focus();
      }
    }
    this.onDelete = (event) => {
      if (event.target.classList.contains('destroy')) {
        const todoId = event.target.closest('li').dataset.key
        this.deleteTodo(todoId)
        console.log(todoId, 'deleted');
      }
    }
    this.root = document.getElementById('root')
    this.container = creator('section', null, 'todoapp')
    this.header = new Header(this.onSubmit)
    this.todoList = new TodoList(this.onDelete)
    this.footer = new Footer()
  }

  addTodo(text) {
    const todo = {
      title: text,
      completed: false,
      id: Date.now()
    }

    todos.push(todo)
    this.todoList.renderList(todos)
    this.footer.renderCount()
    this.root.querySelector('footer').classList = 'footer'
  }

  deleteTodo(todoId) {
    todos = todos.filter(el => el.id !== +todoId)
    this.todoList.renderList(todos)
    this.footer.renderCount()
    if (todos.length === 0) {
      console.log(this.footer);
      this.root.querySelector('footer').classList = 'hidden'
    }
  }

  render() {
    this.container.append(
      this.header.render(),
      this.todoList.render(),
      this.footer.render()
    )

    root.appendChild(this.container);
  }
}

const app = new App();
app.render()
