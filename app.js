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
    this.header.appendChild(this.title)
    this.header.appendChild(this.form)
    this.input.setAttribute('placeholder', 'What needs to be done?')
    this.form.addEventListener('submit', onSubmit);
    this.form.appendChild(this.input)
  }
  render() {
    return this.header;
  }
}

class ToggleAllStatus {
  constructor(handleToggleAll) {
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
    this.toggleAllLabel.addEventListener('click', handleToggleAll)
    this.wrapper.appendChild(this.toggleAllInput)
    this.wrapper.appendChild(this.toggleAllLabel)
    this.wrapper.appendChild(this.arrowContainer)
  }



  toggleAllComplete() {
    if (todos.filter(todo => !todo.completed).length === 0) {
      todos.map(todo => todo.completed = false);
      localStorage.setItem('todos', JSON.stringify(todos))
      this.toggleAllInput.setAttribute('checked', true)
      this.arrowImg.setAttribute('src', './arrow-black.svg');
    } else {
      todos.map(todo => todo.completed = true);
      localStorage.setItem('todos', JSON.stringify(todos))
      this.toggleAllInput.setAttribute('checked', true)
      this.arrowImg.setAttribute('src', './arrow-black.svg');
    }

    if (todos.some(todo => !todo.completed)) {
      this.toggleAllInput.removeAttribute('checked')
      this.arrowImg.setAttribute('src', './arrow-grey.svg');
    }
  }


  arrowRender() {
    this.arrowContainer.classList.remove('hidden')
    if (!todos.filter(todo => !todo.completed).length) {
      this.toggleAllInput.setAttribute('checked', true)
      this.arrowImg.setAttribute('src', './arrow-black.svg');
    } else {
      this.toggleAllInput.removeAttribute('checked')
      this.arrowImg.setAttribute('src', './arrow-grey.svg');
    }
  }

  render() {
    if (!todos.length) {
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
    filter
  ) {
    this.filter = filter
    this.toggleAll = new ToggleAllStatus(handleToggleAll)
    this.section = creator('section', null, 'main')
    this.todoList = creator('ul', null, 'todo-list');
    this.section.appendChild(this.toggleAll.render())
    this.section.appendChild(this.todoList)
    this.todoList.addEventListener('click', onDelete)
    this.todoList.addEventListener('click', onChangeStatus)
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

  onChangeTitle = (event) => {
    const div = event.target.closest('li')
    div.classList = 'editing'
    const input = div.querySelector('.edit');
    setTimeout(() => {
      input.focus()
    }, 0)
    const todo = todos.find(todo => todo.id === +div.dataset.key)
    input.value = todo.title
  }

  onBlur = (event) => {
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

  onKeyDown = (event) => {
    const input = event.target;
    if (input.value.trim() !== '' && event.keyCode === 13) {
      const todoId = event.target.closest('li').dataset.key
      this.changeTitleTodo(todoId, event.target.value.trim())
    }
  }

  changeTitleTodo(todoId, inputValue) {
    let copyTodos = JSON.parse(localStorage.getItem('todos'))
    const index = copyTodos.findIndex(item => item.id === +todoId)
    copyTodos[index].title = inputValue;
    localStorage.setItem('todos', JSON.stringify(copyTodos))
    todos = copyTodos;
    this.renderList(todos, this.filter)
  }


  clearList() {
    this.todoList.innerHTML = ' ';
    // this.todoList.querySelectorAll('*').forEach((n) => n.remove())
  }

  renderList(todos, filter) {
    this.clearList()
    switch (filter) {
      case 'All':
        todos.map(todo => {
          this.todoList.append(this.createLi(todo, this.onBlur, this.onKeyDown))
        })
        break;
      case 'Completed':
        filterTodo(todos, true).map(todo => {
          this.todoList.append(this.createLi(todo, this.onBlur, this.onKeyDown))
        })
        break
      case 'Active':
        filterTodo(todos, false).map(todo => {
          this.todoList.append(this.createLi(todo, this.onBlur, this.onKeyDown))
        })
        break;
    }
  }

  render() {
    this.renderList(todos, 'All')
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
    const count = todos.filter(todo => !todo.completed).length
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

  renderFilter(link) {
    switch (link) {
      case 'All':
        this.completed.render().classList.remove('selected')
        this.active.render().classList.remove('selected')
        this.all.render().classList.add('selected')
        break
      case 'Active':
        this.all.render().classList.remove('selected')
        this.completed.render().classList.remove('selected')
        this.active.render().classList.add('selected')
        break
      case 'Completed':
        this.all.render().classList.remove('selected')
        this.active.render().classList.remove('selected')
        this.completed.render().classList.add('selected')
        break
    }
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
    if (!todos.length) {
      this.footer.classList.add('hidden')
    }
    this.renderClearCompletedButton()
    return this.footer
  }
}

class App {
  constructor() {
    this.filter = 'All'
    this.root = document.getElementById('root')
    this.container = creator('section', null, 'todo-app')
    this.header = new Header(this.onSubmit)
    this.todoList = new TodoList(
      this.onDelete,
      this.onChangeStatus,
      this.handleToggleAll,
      this.filter
    )
    this.footer = new Footer(this.handleClearCompleted, this.handleFilter)
    this.container.append(
      this.header.render(),
      this.todoList.render(),
      this.footer.render()
    )
  }

  onSubmit = (event) => {
    event.preventDefault();
    const inputValue = event.target.querySelector('.new-todo');
    if (inputValue.value !== '') {
      this.addTodo(inputValue.value)
      inputValue.value = ''
      inputValue.focus();
    }
  }

  onDelete = (event) => {
    if (event.target.classList.contains('destroy')) {
      const todoId = event.target.closest('li').dataset.key
      this.deleteTodo(todoId)
    }
  }

  onChangeStatus = (event) => {
    if (event.target.classList.contains('toggle')) {
      const todoId = event.target.closest('li').dataset.key
      this.changeStatus(todoId)
    }
  }

  handleToggleAll = (event) => {
    if (event.target.closest('label')) {
      this.todoList.toggleAll.toggleAllComplete()
      this.todoList.renderList(todos)
      this.footer.renderCount()
      this.footer.renderClearCompletedButton()
    }
  }

  handleClearCompleted = () => {
    this.clearCompleted()
  }

  handleFilter = (event) => {
    const target = event.target.innerText
    switch (target) {
      case 'Completed':
        this.filter = 'Completed'
        this.footer.renderFilter(target)
        this.todoList.renderList(todos, this.filter)
        break;
      case 'Active':
        this.filter = 'Active'
        this.footer.renderFilter(target)
        this.todoList.renderList(todos, this.filter)
        break;

      case 'All':
        this.filter = 'All'
        this.footer.renderFilter(target)
        this.todoList.renderList(todos, this.filter)
        break;
    }
  }

  addTodo(text) {
    const todo = {
      title: text,
      completed: false,
      id: Date.now()
    }
    todos = [...todos, todo]
    localStorage.setItem('todos', JSON.stringify(todos))

    this.todoList.toggleAll.arrowRender()
    this.todoList.renderList(todos, this.filter)
    this.footer.renderCount()


    this.footer.render().classList = 'footer'
  }

  changeStatus(todoId) {
    let copyTodos = JSON.parse(localStorage.getItem('todos'))
    const index = todos.findIndex(item => item.id === +todoId)
    copyTodos[index].completed = !copyTodos[index].completed;
    todos = copyTodos
    localStorage.setItem('todos', JSON.stringify(todos))

    this.todoList.renderList(todos, this.filter)
    this.footer.renderCount()
    this.footer.renderClearCompletedButton()
    this.todoList.toggleAll.arrowRender()
  }

  deleteTodo(todoId) {
    todos = todos.filter(el => el.id !== +todoId)
    localStorage.setItem('todos', JSON.stringify(todos))
    this.todoList.renderList(todos, this.filter)
    this.footer.renderCount()
    this.todoList.toggleAll.render()
    if (todos.length === 0) {
      document.querySelector('footer').classList = 'hidden'
    }
  }

  clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    localStorage.setItem('todos', JSON.stringify(todos))
    this.todoList.renderList(todos, this.filter)

    if (!todos.length) {
      this.footer.render()
      this.todoList.toggleAll.render()
    }

    this.todoList.renderList(todos, this.filter)
    this.footer.renderCount()
    this.footer.renderClearCompletedButton()
  }

  render() {
    if (todos.length) {
      this.todoList.toggleAll.arrowRender()
    }
    root.appendChild(this.container);
  }
}

const app = new App();
app.render();
