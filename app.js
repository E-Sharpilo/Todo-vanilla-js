let todos = JSON.parse(localStorage.getItem('todos')) || [];

function creator(el, content, htmlClass) {
  const container = document.createElement(el)
  if (htmlClass) {
    container.classList.add(htmlClass);
  }
  container.innerText = content
  return container
};
function filterTodo(todos, bool) {
  const filteredTodo = todos.filter(todo => todo.completed === bool)

  return filteredTodo;
}

class Header {
  constructor(onSubmit) {
    this.header = creator('header', null, 'header')
    this.title = creator('h1', 'todos');
    this.form = creator('form', null, 'todo-form');
    this.input = creator('input', null, 'new-todo');
    this.onSubmit = onSubmit
    this.header.appendChild(this.title)
    this.header.appendChild(this.form)
    this.input.setAttribute('placeholder', 'What needs to be done?')
    this.form.addEventListener('submit', this.onSubmit);
    this.form.appendChild(this.input)
  }
  render() {
    return this.header;
  }
}

class toggleAllStatus {
  constructor(handleToggleAll) {
    this.handleToggleAll = handleToggleAll
    this.wrapper = creator('div', null)
    this.toggleAllInput = creator('input', null, 'toggle-all')
    this.toggleAllLabel = creator('label', 'Mark all as complete');
    this.arrowContainer = creator('div', null, 'arrow-container');
    this.arrowImg = creator('img', null, 'arrow');
    this.toggleAllInput.setAttribute('type', 'checkbox');
    this.toggleAllInput.id = 'toggle-all';
    this.arrowImg.setAttribute('src', './arrow-grey.svg')
    this.arrowContainer.appendChild(this.arrowImg)
    this.toggleAllLabel.setAttribute('for', 'toggle-all')
    this.toggleAllLabel.addEventListener('click', this.handleToggleAll)
    this.wrapper.appendChild(this.toggleAllInput)
    this.wrapper.appendChild(this.toggleAllLabel)
    this.wrapper.appendChild(this.arrowContainer)
  }



  toggleAllComplete() {
    if (todos.filter(todo => !todo.completed).length === 0) {
      todos.forEach(todo => todo.completed = false);
      this.toggleAllInput.setAttribute('checked', true)
      this.arrowImg.setAttribute('src', './arrow-black.svg');
    } else {
      todos.forEach(todo => todo.completed = true);
      this.toggleAllInput.setAttribute('checked', true)
      this.arrowImg.setAttribute('src', './arrow-black.svg');
    }

    if (todos.filter(todo => todo.completed === false).length !== 0) {
      this.toggleAllInput.removeAttribute('checked')
      this.arrowImg.setAttribute('src', './arrow-grey.svg');
    }
  }


  arrowRender() {
    this.arrowContainer.classList.remove('hidden')
    if (todos.filter(todo => todo.completed === false).length === 0) {
      this.toggleAllInput.setAttribute('checked', true)
      this.arrowImg.setAttribute('src', './arrow-black.svg');
    } else {
      this.toggleAllInput.removeAttribute('checked')
      this.arrowImg.setAttribute('src', './arrow-grey.svg');
    }
  }

  render() {
    if(todos.length === 0) {
      this.arrowContainer.classList.add('hidden')
    }
    return this.wrapper
  }
}
class TodoList {
  constructor(
    onDelete,
    onChangeStatus,
    handleToggleAll,
  ) {
    this.onChangeTitle = (event) => {
      const div = event.target.closest('li')
      div.classList = 'editing'
      const input = div.querySelector('.edit');
      setTimeout(() => {
        input.focus()
      }, 0)
      const todo = todos.find(todo => todo.id === +div.dataset.key)
      input.value = todo.title
    }

    this.onblur = (event) => {
      const input = event.target;
      if (input.closest('.editing')) {
        if (input.value.trim() !== '') {
          const todoId = input.closest('li').dataset.key
          this.changeTitleTodo(todoId, input.value.trim())
        } else {
          input.closest('.editing').classList = 'view'
        }
      }
    }

    this.onKeyDown = (event) => {
      const input = event.target;
      if (input.value.trim() !== '' && event.keyCode === 13) {
        const todoId = event.target.closest('li').dataset.key
        this.changeTitleTodo(todoId, event.target.value.trim())
      }
    }

    this.handleToggleAll = handleToggleAll
    this.onDelete = onDelete
    this.onChangeStatus = onChangeStatus
    this.wrapper = new toggleAllStatus(handleToggleAll)
    this.section = creator('section', null, 'main')
    this.todoList = creator('ul', null, 'todo-list');
    this.section.appendChild(this.wrapper.render())
    this.section.appendChild(this.todoList)
    this.todoList.addEventListener('click', this.onDelete)
    this.todoList.addEventListener('click', this.onChangeStatus)
    this.todoList.addEventListener('dblclick', this.onChangeTitle)
  }
  createLi(todo, blur, keydown) {
    const li = document.createElement('li');
    const isCompleted = todo.completed ? 'done' : '';

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
    input.addEventListener('blur', blur)
    input.addEventListener('keydown', keydown)
    li.appendChild(div)
    li.appendChild(input)

    return li
  }

  changeTitleTodo(todoId, inputValue) {
    const index = todos.findIndex(item => item.id === +todoId)
    todos[index].title = inputValue;
    localStorage.setItem('todos', JSON.stringify(todos))
    this.renderList(todos)
  }

  clearList() {
    this.todoList.innerHTML = ' ';
    // this.todoList.querySelectorAll('*').forEach((n) => n.remove())
  }

  renderList(todos) {
    this.clearList()
    todos.map(todo => {
      this.todoList.append(this.createLi(todo, this.onblur, this.onKeyDown))
    })
  }

  render() {
    this.renderList(todos)
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
    this.tag.innerText = this.text
    this.tag.setAttribute('href', `${this.href}`)
    this.tag.classList = `${this.className}`
    if (this.selected === true) {
      this.li.classList.add('selected')
    }
    this.li.appendChild(this.tag)
  }

  render() {
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
  constructor(handleClearCompleted, handleFilter) {
    this.handleClearCompleted = handleClearCompleted
    this.handleFilter = handleFilter
    this.footer = creator('footer', null, 'footer');
    this.todoCount = new Count();
    this.filters = creator('ul', null, 'filters')
    this.all = new Link('#/', 'all', 'All', true)
    this.active = new Link('#/active', 'active', 'Active')
    this.completed = new Link('#/completed', 'completed', 'Completed')
    this.clearCompletedButton = creator('button', 'Clear Completed', 'clear-completed')
    this.footer.appendChild(this.todoCount.render())
    this.filters.append(
      this.all.render(),
      this.active.render(),
      this.completed.render()
    )
    this.footer.appendChild(this.filters)
    this.clearCompletedButton.addEventListener('click', this.handleClearCompleted)
    this.filters.addEventListener('click', this.handleFilter)
    this.footer.appendChild(this.clearCompletedButton)

  }

  renderCount() {
    this.footer.removeChild(this.footer.firstChild)
    this.todoCount.renderCount()
    this.footer.insertBefore(this.todoCount.renderCount(), this.footer.firstChild)
  }

  renderClearCompletedButton() {
    if (this.todoCount.countTodo(todos) === todos.length) {
      this.clearCompletedButton.classList = 'hidden'
    } else {
      this.clearCompletedButton.classList = 'clear-completed'
    }
  }

  render() {
    if(todos.length === 0) {
      this.footer.classList.add('hidden')
    }
    this.renderClearCompletedButton()
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
      }
    }

    this.onChangeStatus = (event) => {
      if (event.target.classList.contains('toggle')) {
        const todoId = event.target.closest('li').dataset.key
        this.changeStatus(todoId)
      }
    }

    this.handleToggleAll = (event) => {
      if (event.target.closest('label')) {
        this.todoList.wrapper.toggleAllComplete()
        this.todoList.renderList(todos)
        this.footer.renderCount()
        this.footer.renderButton()
      }
    }

    this.handleClearCompleted = () => {
      this.clearCompleted()
    }

    this.handleFilter = (event) => {
      const target = event.target.innerText
      const all = document.querySelector('.all').closest('li')
      const active = document.querySelector('.active').closest('li')
      const completed = document.querySelector('.completed').closest('li')
      switch (target) {
        case 'Completed':
          all.classList.remove('selected')
          active.classList.remove('selected')
          completed.classList.add('selected')
          this.todoList.renderList(filterTodo(todos, true))
          break;
        case 'Active':
          all.classList.remove('selected')
          completed.classList.remove('selected')
          active.classList.add('selected')
          this.todoList.renderList(filterTodo(todos, false))
          break;

        default:
          completed.classList.remove('selected')
          active.classList.remove('selected')
          all.classList.add('selected')
          this.todoList.renderList(todos)
          break;
      }
    }

    this.root = document.getElementById('root')
    this.container = creator('section', null, 'todo-app')
    this.header = new Header(this.onSubmit)
    this.todoList = new TodoList(
      this.onDelete,
      this.onChangeStatus,
      this.handleToggleAll,
    )
    this.footer = new Footer(this.handleClearCompleted, this.handleFilter)
    this.container.append(
      this.header.render(),
      this.todoList.render(),
      this.footer.render()
    )
  }

  addTodo(text) {
    const todo = {
      title: text,
      completed: false,
      id: Date.now()
    }
    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos))
    this.todoList.wrapper.arrowRender()
    if (document.querySelector('.completed').closest('li').classList.contains('selected')) {
      this.footer.renderCount()
    } else if (document.querySelector('.active').closest('li').classList.contains('selected')) {
      this.todoList.renderList(filterTodo(todos, false))
      this.footer.renderCount()
    } else {
      this.todoList.renderList(todos)
      this.footer.renderCount()
    }
    this.footer.render().classList = 'footer'
  }

  changeStatus(todoId) {
    const index = todos.findIndex(item => item.id === +todoId)
    todos[index].completed = !todos[index].completed;
    localStorage.setItem('todos', JSON.stringify(todos))

    if (document.querySelector('.completed').closest('li').classList.contains('selected')) {
      this.todoList.renderList(filterTodo(todos, true))
      this.footer.renderCount()
    } else if (document.querySelector('.active').closest('li').classList.contains('selected')) {
      this.todoList.renderList(filterTodo(todos, false))
      this.footer.renderCount()
    } else {
      this.todoList.renderList(todos)
      this.footer.renderCount()
    }

    this.footer.renderClearCompletedButton()
    this.todoList.wrapper.arrowRender()
  }

  deleteTodo(todoId) {
    todos = todos.filter(el => el.id !== +todoId)
    localStorage.setItem('todos', JSON.stringify(todos))
    this.todoList.renderList(todos)
    this.footer.renderCount()
    if (todos.length === 0) {
      document.querySelector('footer').classList = 'hidden'
    }
  }

  clearCompleted() {
    todos = todos.filter(todo => todo.completed === false);
    localStorage.setItem('todos', JSON.stringify(todos))
    this.todoList.renderList(todos)
    if (todos.length === 0) {
      this.footer.render().classList = 'hidden'
      document.querySelector('.arrow-container').classList.add('hidden')
    }
    if (document.querySelector('.completed').closest('li').classList.contains('selected')) {
      this.todoList.clearList()
    } else {
      this.todoList.renderList(todos)
      this.footer.renderCount()
    }

    this.footer.renderClearCompletedButton()

  }

  render() {
    if(todos.length !== 0) {
      this.todoList.wrapper.arrowRender()
    }
    root.appendChild(this.container);
  }
}

const app = new App();
app.render();
