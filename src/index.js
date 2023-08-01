import './styles/main.css';
import App from './components/app';
import { updateData, loadData } from './classes/storage';
import { renderFilteredTasks, renderProjects } from './classes/render';
import {
  filterTasksByDate,
  filterTasksByStatus,
  handleTaskForm,
} from './components/utils';
import {
  updateUiMediaQuery,
  setContentBoxMargin,
  checkMenuState,
} from './components/ui';

const app = new App();
loadData(app);
updateData(app);
const select = (selector) => document.querySelector(selector);

const logoLink = select('.logo-link');
logoLink.addEventListener('click', (e) => {
  e.preventDefault();

  app.currentSection = 'inbox';

  const section = {
    name: 'inbox',
    tasks: app.tasks,
  };

  updateData(app);
  renderFilteredTasks(app, section);
});

document.addEventListener('DOMContentLoaded', () => {
  updateUiMediaQuery();
  setContentBoxMargin();
  checkMenuState();
});

window.addEventListener('resize', () => {
  updateUiMediaQuery();
  setContentBoxMargin();
  checkMenuState();
});

document.addEventListener('DOMContentLoaded', () => {
  const projectContainer = select('.project-list');
  const filterContainer = select('.main-filter');

  function clearActiveStates() {
    document
      .querySelectorAll('.project, .main-filter > div')
      .forEach((element) => {
        element.classList.remove('active');
      });
  }

  projectContainer.addEventListener('click', (e) => {
    const project = e.target.closest('.project');
    if (project) {
      clearActiveStates();
      project.classList.add('active');
      app.currentSection = 'project';
      app.currentProjectId = project.dataset.id;
      app.currentProjectName = project.dataset.title;

      renderFilteredTasks(app, { name: app.currentProjectName, tasks: [] });
    }
  });

  filterContainer.addEventListener('click', (e) => {
    const section = e.target.closest('div');
    if (section) {
      clearActiveStates();
      section.classList.add('active');
    }
  });
});

const addTaskButton = select('.addTask');

addTaskButton.addEventListener('click', () => {
  const template = select('#task-form-template');
  const taskForm = template.content.cloneNode(true);

  select('.tasks').appendChild(taskForm);
  const taskFormElement = select('.task-form');

  handleTaskForm(
    app,
    taskFormElement,
    null,
    renderFilteredTasks,
    null,
    renderProjects
  );
  updateData(app);
});

function handleSectionClick(e) {
  e.preventDefault();

  const sectionName = e.target.closest('div[data-section]').dataset.section;

  app.currentSection = sectionName;

  const section = {
    name: sectionName,
    tasks: [],
  };

  switch (sectionName) {
    case 'inbox':
      section.tasks = app.tasks;
      break;
    case 'today':
      section.tasks = filterTasksByDate(app, 'today');
      break;
    case 'upcoming':
      section.tasks = filterTasksByDate(app, 'upcoming');
      break;
    case 'finished':
      section.tasks = filterTasksByStatus(app, 'finished');
      break;
    case 'due':
      section.tasks = filterTasksByDate(app, 'due');
      break;
    default:
      console.error('Unexpected section:', sectionName);
      return;
  }
  updateData(app);
  renderFilteredTasks(app, section);
}

document.querySelectorAll('.main-filter>div').forEach((filter) => {
  filter.addEventListener('click', handleSectionClick);
});

(function () {
  const addProjectButton = select('.addProject');
  const projectForm = select('#project-form');

  function clearProjectForm() {
    projectForm.style.display = 'none';
    select('#project-title').value = '';
    select('#project-color').value = '#000000';
  }

  addProjectButton.addEventListener('click', () => {
    projectForm.style.display = 'flex';
  });

  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = select('#project-title').value;
    const color = select('#project-color').value;

    app.addProject(title, color);
    updateData(app);
    renderProjects(app);
    clearProjectForm();
  });

  const cancelProjectButton = select('.cancel-project');

  cancelProjectButton.addEventListener('click', () => {
    clearProjectForm();
  });
})();

const sortDropDown = select('#sort');
sortDropDown.addEventListener('change', () => {
  const sortValue = sortDropDown.value;
  const section = {
    name: app.currentSection,
    tasks: app.tasks,
  };

  renderFilteredTasks(app, section, sortValue);
});

const searchBar = select('#search');

searchBar.addEventListener('input', () => {
  const searchValue = searchBar.value.toLowerCase();
  const section = {
    name: app.currentSection,
    tasks: app.tasks,
  };

  if (!searchValue) {
    renderFilteredTasks(app, { name: app.currentSection, tasks: app.tasks });
  } else {
    renderFilteredTasks(app, section, null, searchValue);
  }
});

renderFilteredTasks(app, { name: app.currentSection, tasks: app.tasks });
renderProjects(app);
