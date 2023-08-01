import { format, isToday, isFuture, parseISO, isPast } from 'date-fns';
import { updateData } from '../classes/storage';

const select = (selector) => document.querySelector(selector);
const newElm = (type) => document.createElement(type);

function clearTaskContainer() {
  const taskContainer = document.querySelector('.tasks');
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);
  }
}

function updateTaskCount(app) {
  select('.main-filter .inbox p').textContent = app.tasks.length;

  select('.main-filter .today p').textContent = app.tasks.filter(
    (task) => task.status === 'unfinished' && isToday(parseISO(task.dueDate))
  ).length;

  select('.main-filter .due p').textContent = app.tasks.filter(
    (task) =>
      task.status === 'unfinished' &&
      !isToday(parseISO(task.dueDate)) &&
      isPast(parseISO(task.dueDate))
  ).length;

  select('.main-filter .upcoming p').textContent = app.tasks.filter(
    (task) => task.status === 'unfinished' && isFuture(parseISO(task.dueDate))
  ).length;

  select('.main-filter .finished p').textContent = app.tasks.filter(
    (task) => task.status === 'finished'
  ).length;
}

function populateProjectDropdown(formElement, projects) {
  const projectDropdown = formElement.querySelector('#task-project');
  projects.forEach((project) => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.title;
    projectDropdown.appendChild(option);
  });
}

function filterTasksByDate(app, date) {
  const filteredTasks = [];

  filteredTasks.push(
    ...app.tasks.filter((task) => {
      if (
        task.status !== 'finished' &&
        ((date === 'today' && isToday(parseISO(task.dueDate))) ||
          (date === 'upcoming' && isFuture(parseISO(task.dueDate))) ||
          (date === 'due' &&
            !isToday(parseISO(task.dueDate)) &&
            isPast(parseISO(task.dueDate))))
      ) {
        return true;
      }
      return false;
    })
  );

  return filteredTasks;
}

function filterTasksByStatus(app, status) {
  const filteredTasks = [];

  filteredTasks.push(...app.tasks.filter((task) => task.status === status));

  return filteredTasks;
}

function handleTaskForm(
  app,
  taskFormElement,
  task,
  renderFilteredTasks,
  renderIndividualTask,
  renderProjects
) {
  const taskElmSelector = (selector) => taskFormElement.querySelector(selector);

  populateProjectDropdown(taskFormElement, app.projects);

  if (task) {
    const dueDate = parseISO(task.dueDate);
    taskElmSelector('#task-title').value = task.title;
    taskElmSelector('#task-description').value = task.description;
    taskElmSelector('#task-dueDate').value = format(dueDate, 'yyyy-MM-dd');
    taskElmSelector('#task-priority').value = task.priority;
    taskElmSelector('#task-project').value = task.projectId;
    taskElmSelector('#task-label').value = task.label;
  }

  taskFormElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = taskElmSelector('#task-title').value;
    const description = taskElmSelector('#task-description').value;
    // const dueDate = new Date(taskElmSelector('#task-dueDate').value);
    const dueDate = parseISO(taskElmSelector('#task-dueDate').value);

    const priority = taskElmSelector('#task-priority').value;
    const projectId = taskElmSelector('#task-project').value;
    const label = taskElmSelector('#task-label').value;

    if (!title.trim() || !dueDate || !priority) {
      alert('Title, Due Date, and Priority are required!');
      return;
    }

    if (task) {
      app.updateTask(task.id, {
        title,
        description,
        dueDate,
        priority,
        projectId,
        label,
      });

      const taskElm = renderIndividualTask(app, task);
      taskFormElement.replaceWith(taskElm);
    } else {
      app.addTask(title, description, dueDate, priority, projectId, label);
    }
    renderProjects(app);
    updateData(app);

    renderFilteredTasks(app, { name: app.currentSection, tasks: app.tasks });
    taskFormElement.remove();
  });

  taskElmSelector('.cancel-task').addEventListener('click', () => {
    if (task) {
      const taskElm = renderIndividualTask(app, task);
      taskFormElement.replaceWith(taskElm);
    } else {
      taskFormElement.remove();
    }
  });
}

function editProject(
  editProjectBtn,
  projectDiv,
  project,
  app,
  renderProjects,
  renderFilteredTasks
) {
  editProjectBtn.addEventListener('click', () => {
    const form = newElm('form');
    form.id = 'projectUpdateForm';

    const inputDiv = newElm('div');

    const titleInput = newElm('input');
    inputDiv.appendChild(titleInput);
    titleInput.type = 'text';
    titleInput.id = 'project-title';
    titleInput.value = project.title;

    const wrapperDiv = newElm('div');

    const colorInput = newElm('input');
    wrapperDiv.appendChild(colorInput);
    colorInput.type = 'color';
    colorInput.id = 'project-color';
    colorInput.value = project.color;

    const projectBtnWrapper = newElm('div');
    wrapperDiv.appendChild(projectBtnWrapper);
    projectBtnWrapper.classList.add('project-form-btns');

    const cancelButton = newElm('button');
    projectBtnWrapper.appendChild(cancelButton);
    cancelButton.type = 'button';
    cancelButton.className = 'cancel-project';

    const cancelIcon = newElm('img');
    cancelButton.appendChild(cancelIcon);
    cancelIcon.src = '/assets/close.svg';

    const saveButton = newElm('button');
    projectBtnWrapper.appendChild(saveButton);
    saveButton.type = 'submit';

    const saveIcon = newElm('img');
    saveButton.appendChild(saveIcon);
    saveIcon.src = '/assets/done.svg';

    form.appendChild(inputDiv);
    form.appendChild(wrapperDiv);

    projectDiv.replaceWith(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const newTitle = titleInput.value;
      const newColor = colorInput.value;

      app.updateProject(project.id, { title: newTitle, color: newColor });

      renderFilteredTasks(app, { name: app.currentSection, tasks: app.tasks });
      form.replaceWith(projectDiv);
      updateData(app);
      renderProjects(app);
    });

    cancelButton.addEventListener('click', () => {
      form.replaceWith(projectDiv);
    });
  });
}

function filterTasksByLabel(app, searchValue) {
  const filteredTasks = [];

  filteredTasks.push(
    ...app.tasks.filter((task) => {
      if (!searchValue) return true;

      if (task.label.toLowerCase().startsWith(searchValue.toLowerCase()))
        return true;

      return false;
    })
  );
  return filteredTasks;
}

export {
  populateProjectDropdown,
  filterTasksByDate,
  filterTasksByStatus,
  clearTaskContainer,
  updateTaskCount,
  handleTaskForm,
  editProject,
  filterTasksByLabel,
};
