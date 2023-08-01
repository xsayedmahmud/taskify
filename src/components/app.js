/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';

class Task {
  constructor(
    title,
    description,
    dueDate,
    priority,
    projectId,
    // eslint-disable-next-line default-param-last
    status = 'unfinished',
    label
  ) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
    this.label = label;
    this.projectId = projectId;
  }
}

class Project {
  constructor(title, color) {
    this.id = uuidv4();
    this.title = title;
    this.color = color;
    this.tasks = [];
  }
}

class Note {
  constructor(title, content, label) {
    this.id = uuidv4();
    this.title = title;
    this.content = content;
    this.label = label;
  }
}

class App {
  constructor() {
    this.projects = [];
    this.notes = [];
    this.tasks = [];
    this.currentSection = 'inbox';
  }

  addTask(title, description, dueDate, priority, projectId, label) {
    const newTask = new Task(
      title,
      description,
      dueDate,
      priority,
      projectId,
      'unfinished',
      label
    );

    this.tasks.push(newTask);
  }

  updateTask(taskId, updateData) {
    const appTask = this.tasks.find((t) => t.id === taskId);
    if (appTask) {
      Object.assign(appTask, updateData);
    }
  }

  deleteTask(taskId) {
    const appTaskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (appTaskIndex !== -1) {
      this.tasks.splice(appTaskIndex, 1);
    }
  }

  toggleTaskStatus(taskId) {
    const appTask = this.tasks.find((t) => t.id === taskId);
    if (appTask) {
      appTask.status =
        appTask.status === 'unfinished' ? 'finished' : 'unfinished';
    }
  }

  addProject(title, color) {
    const project = new Project(title, color);
    this.projects.push(project);
  }

  updateProject(projectId, updateData) {
    const projectIndex = this.projects.findIndex(
      (project) => project.id === projectId
    );

    if (projectIndex !== -1) {
      Object.assign(this.projects[projectIndex], updateData);
    }
  }

  deleteProject(projectId) {
    const projectIndex = this.projects.findIndex(
      (project) => project.id === projectId
    );

    if (projectIndex !== -1) {
      this.tasks = this.tasks.filter((task) => task.projectId !== projectId);

      this.projects.splice(projectIndex, 1);
    }
  }

  // addNote(title, content, label) {
  //   const note = new Note(title, content, label);
  //   this.notes.push(note);
  // }

  // updateNote(noteId, updateData) {
  //   const noteIndex = this.notes.findIndex((note) => note.id === noteId);
  //   if (noteIndex !== -1) {
  //     Object.assign(this.notes[noteIndex], updateData);
  //   }
  // }

  // deleteNote(noteId) {
  //   const noteIndex = this.notes.findIndex((note) => note.id === noteId);
  //   if (noteIndex !== -1) {
  //     this.notes.splice(noteIndex, 1);
  //   }
  // }
}

export default App;
