// import { v4 as uuidv4 } from 'uuid';

// class Note {
//   constructor(title, content, label) {
//     this.id = uuidv4();
//     this.title = title;
//     this.content = content;
//     this.label = label;
//   }

//   static addNote(notes, title, content, label) {
//     const note = new Note(title, content, label);
//     notes.push(note);
//   }

//   static updateNote(notes, noteId, updateData) {
//     const note = notes.find((note) => note.id === noteId);

//     if (note) {
//       Object.assign(note, updateData);
//     }
//   }

//   static deleteNote(notes, noteId) {
//     const noteIndex = notes.findIndex((note) => note.id === noteId);

//     if (noteIndex !== -1) {
//       notes.splice(noteIndex, 1);
//     }
//   }
// }

// export default Note;
