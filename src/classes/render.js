import { format, parseISO, isToday, isFuture, isPast } from 'date-fns';
import { updateData } from './storage';
import {
  clearTaskContainer,
  updateTaskCount,
  handleTaskForm,
  editProject,
  filterTasksByLabel,
} from '../components/utils';

const select = (selector) => document.querySelector(selector);
const newElm = (type) => document.createElement(type);

function renderIndividualTask(app, task) {
  const project = app.projects.find((p) => p.id === task.projectId);

  const taskElm = newElm('div');
  const headingElm = newElm('div');
  const checkboxElm = newElm('input');
  const titleElm = newElm('h2');
  const updateElm = newElm('div');
  const editBtnElm = newElm('button');
  const deleteBtnElm = newElm('button');
  const editImg = newElm('img');
  const deleteImg = newElm('img');
  const descriptionElm = newElm('p');
  const taskFilterElm = newElm('div');

  const dueDateElmDiv = newElm('div');
  const dueDateElm = newElm('p');
  const priorityElmDiv = newElm('div');
  const priorityElm = newElm('p');
  const labelElmDiv = newElm('div');
  const labelElm = newElm('p');

  taskElm.className = 'task';
  headingElm.className = 'taskHeading';
  headingElm.appendChild(checkboxElm);
  checkboxElm.setAttribute('type', 'checkbox');
  checkboxElm.setAttribute('name', 'taskCheck');
  checkboxElm.checked = task.status === 'finished';
  titleElm.textContent = task.title;
  titleElm.setAttribute('id', 'task-title');
  updateElm.className = 'update';
  editImg.src = 'assets/edit.svg';
  deleteImg.src = 'assets/delete.svg';
  descriptionElm.textContent = task.description;
  taskFilterElm.className = 'taskFilter';

  const dueDate =
    typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
  dueDateElm.textContent = `Due: ${format(dueDate, 'dd MMM, yy')}`;
  priorityElm.textContent = `Prio: ${task.priority
    .charAt(0)
    .toUpperCase()}${task.priority.slice(1)}`;
  labelElm.textContent = `#${task.label}`;

  taskElm.appendChild(headingElm);
  headingElm.appendChild(titleElm);
  headingElm.appendChild(updateElm);
  updateElm.appendChild(editBtnElm);
  updateElm.appendChild(deleteBtnElm);
  editBtnElm.appendChild(editImg);
  deleteBtnElm.appendChild(deleteImg);
  taskElm.appendChild(descriptionElm);
  taskElm.appendChild(taskFilterElm);
  if (project) {
    const projectElmDiv = newElm('div');
    const colorIndicatorElm = newElm('span');
    const projectElm = newElm('p');
    colorIndicatorElm.className = 'color-indicator';
    projectElm.textContent = project ? project.title : '';
    taskFilterElm.appendChild(projectElmDiv);
    projectElmDiv.appendChild(colorIndicatorElm);
    if (project) {
      colorIndicatorElm.style.backgroundColor = project.color;
    }
    projectElmDiv.appendChild(projectElm);
  }
  taskFilterElm.appendChild(dueDateElmDiv);
  dueDateElmDiv.appendChild(dueDateElm);
  taskFilterElm.appendChild(priorityElmDiv);
  priorityElmDiv.appendChild(priorityElm);
  taskFilterElm.appendChild(labelElmDiv);
  labelElmDiv.appendChild(labelElm);

  checkboxElm.addEventListener('click', () => {
    app.toggleTaskStatus(task.id);

    checkboxElm.checked = !checkboxElm.checked;

    renderFilteredTasks(app, { name: app.currentSection, tasks: app.tasks });
    updateData(app);
  });

  editBtnElm.addEventListener('click', () => {
    const template = select('#task-form-template');
    const taskForm = template.content.cloneNode(true);
    taskElm.replaceWith(taskForm);

    const taskFormElement = select('.task-form');

    handleTaskForm(
      app,
      taskFormElement,
      task,
      renderFilteredTasks,
      renderIndividualTask,
      renderProjects
    );
    updateData(app);
  });

  deleteBtnElm.addEventListener('click', () => {
    app.deleteTask(task.id);
    updateData(app);
    renderFilteredTasks(app, { name: app.currentSection, tasks: app.tasks });
    renderProjects(app);
  });

  select('.tasks').appendChild(taskElm);
}

// --------------------renderFilteredTasks---------------------

function renderFilteredTasks(
  app,
  section,
  sortValue = 'default',
  searchValue = ''
) {
  select('.contentHead .header h1').textContent = section.name;

  let filteredTasks;
  if (app.currentSection === 'project') {
    filteredTasks = app.tasks.filter(
      (task) => task.projectId === app.currentProjectId
    );

    select('.contentHead .header h1').textContent = app.currentProjectName;
  } else {
    filteredTasks = app.tasks.filter((task) => {
      if (app.currentSection === 'inbox') {
        return app.tasks;
      }
      if (app.currentSection === 'today' && task.status !== 'finished') {
        return isToday(parseISO(task.dueDate));
      }
      if (
        app.currentSection === 'due' &&
        task.status !== 'finished' &&
        !isToday(parseISO(task.dueDate))
      ) {
        return isPast(parseISO(task.dueDate));
      }
      if (app.currentSection === 'upcoming' && task.status !== 'finished') {
        return isFuture(parseISO(task.dueDate));
      }
      if (app.currentSection === 'finished') {
        return task.status === 'finished';
      }
      return false;
    });
  }

  if (sortValue !== 'default') {
    filteredTasks = filteredTasks.filter((task) => task.priority === sortValue);
    filteredTasks.sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate));
  }

  if (searchValue) {
    filteredTasks = filterTasksByLabel(app, searchValue);
  }

  const textTask = filteredTasks.length < 1 ? 'Task' : 'Tasks';

  select(
    '.contentHead .filter .view p'
  ).textContent = `${filteredTasks.length} ${textTask}`;

  clearTaskContainer();
  updateTaskCount(app);

  filteredTasks.forEach((task) => {
    renderIndividualTask(app, task);
  });
}

function renderProjects(app) {
  const projectList = select('.project-list');
  while (projectList.firstChild) {
    projectList.removeChild(projectList.firstChild);
  }

  app.projects.forEach((project) => {
    const projectDiv = newElm('div');
    projectDiv.classList.add('project');
    projectDiv.dataset.id = project.id;
    projectDiv.dataset.title = project.title;

    const projectColor = newElm('input');
    projectColor.type = 'color';
    projectColor.name = 'color';
    projectColor.classList.add('color');
    projectColor.value = project.color;
    projectColor.disabled = true;

    const projectTitle = newElm('p');
    projectTitle.textContent = project.title;

    const projectTaskCount = newElm('p');
    const taskInProject = app.tasks.filter(
      (task) => task.projectId === projectDiv.dataset.id
    );
    projectTaskCount.textContent = taskInProject.length;

    const editProjectBtn = newElm('button');
    const editImg = newElm('img');
    editImg.src = 'assets/edit.svg';
    editProjectBtn.appendChild(editImg);

    const deleteProjectBtn = newElm('button');
    const deleteImg = newElm('img');
    deleteImg.src = 'assets/delete.svg';
    deleteProjectBtn.appendChild(deleteImg);

    projectDiv.appendChild(projectColor);
    projectDiv.appendChild(projectTitle);
    projectDiv.appendChild(projectTaskCount);
    projectDiv.appendChild(editProjectBtn);
    projectDiv.appendChild(deleteProjectBtn);

    projectColor.style.gridArea = 'color';
    projectTitle.style.gridArea = 'title';
    projectTaskCount.style.gridArea = 'count';
    editProjectBtn.style.gridArea = 'edit';
    editProject(
      editProjectBtn,
      projectDiv,
      project,
      app,
      renderProjects,
      renderFilteredTasks
    );
    deleteProjectBtn.style.gridArea = 'delete';
    deleteProjectBtn.addEventListener('click', () => {
      app.deleteProject(project.id);
      updateData(app);
      renderProjects(app);
    });

    projectList.appendChild(projectDiv);
  });
}

export { renderFilteredTasks, renderProjects };
