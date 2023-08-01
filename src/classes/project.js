// import { v4 as uuidv4 } from 'uuid';

// class Project {
//   constructor(title, color) {
//     this.id = uuidv4();
//     this.title = title;
//     this.color = color;
//     this.tasks = [];
//   }

//   static addProject(projects, title, color) {
//     const project = new Project(title, color);
//     projects.push(project);
//   }

//   static updateProject(projects, projectId, updateData) {
//     const project = projects.find((project) => project.id === projectId);

//     if (project) {
//       Object.assign(project, updateData);
//     }
//   }

//   static deleteProject(projects, projectId) {
//     const projectIndex = projects.findIndex(
//       (project) => project.id === projectId
//     );

//     if (projectIndex !== -1) {
//       projects[projectIndex].tasks = [];

//       projects.splice(projectIndex, 1);
//     }
//   }
// }

// export default Project;
