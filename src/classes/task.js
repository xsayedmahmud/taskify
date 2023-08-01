// import { v4 as uuidv4 } from 'uuid';
// import { saveData } from './storage';

// class Task {
//   constructor(title, description, dueDate, priority, status, projectId, label) {
//     this.id = uuidv4();
//     this.title = title;
//     this.description = description;
//     this.dueDate = dueDate;
//     this.priority = priority;
//     this.status = status;
//     this.projectId = projectId;
//     this.label = label;
//   }

//   static addTask(app, title, description, dueDate, priority, projectId, label) {
//     const task = new Task(
//       title,
//       description,
//       dueDate,
//       priority,
//       'unfinished',
//       projectId,
//       label
//     );

//     const project = app.projects.find((project) => project.id === projectId);
//     if (project) {
//       project.tasks.push(task);
//     }
//     saveData(app);
//     return task;
//   }

//   static updateTask(app, taskId, updateData) {
//     const appTask = app.tasks.find((t) => t.id === taskId);
//     if (appTask) {
//       Object.assign(appTask, updateData);
//     }

//     app.projects.some((project) => {
//       const task = project.tasks.find((t) => t.id === taskId);
//       if (task) {
//         Object.assign(task, updateData);
//         return true;
//       }
//       return false;
//     });
//   }

//   static deleteTask(app, taskId) {
//     const appTaskIndex = app.tasks.findIndex((t) => t.id === taskId);
//     if (appTaskIndex !== -1) {
//       app.tasks.splice(appTaskIndex, 1);
//     }

//     app.projects.some((project) => {
//       const taskIndex = project.tasks.findIndex((task) => task.id === taskId);
//       if (taskIndex !== -1) {
//         project.tasks.splice(taskIndex, 1);
//         return true;
//       }
//       return false;
//     });
//   }

//   static toggleTaskStatus(app, taskId) {
//     const appTask = app.tasks.find((t) => t.id === taskId);
//     if (appTask) {
//       appTask.status =
//         appTask.status === 'unfinished' ? 'finished' : 'unfinished';
//     }

//     app.projects.some((project) => {
//       const task = project.tasks.find((task) => task.id === taskId);
//       if (task) {
//         task.status = appTask.status;
//         return true;
//       }
//       return false;
//     });
//   }
// }

// export default Task;
