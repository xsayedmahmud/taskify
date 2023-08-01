/* eslint-disable no-param-reassign */

function saveData(app) {
  const projectsString = JSON.stringify(app.projects);
  const notesString = JSON.stringify(app.notes);
  const tasksString = JSON.stringify(app.tasks);

  localStorage.setItem('projects', projectsString);
  localStorage.setItem('notes', notesString);
  localStorage.setItem('tasks', tasksString);
}

function loadData(app) {
  const projectsString = localStorage.getItem('projects');
  const notesString = localStorage.getItem('notes');
  const tasksString = localStorage.getItem('tasks');

  const projects = JSON.parse(projectsString);
  const notes = JSON.parse(notesString);
  const tasks = JSON.parse(tasksString);

  app.projects = projects || [];
  app.notes = notes || [];
  app.tasks = tasks || [];

  return app;
}

function updateData(app) {
  saveData(app);
  loadData(app);
}

export { updateData, loadData };
