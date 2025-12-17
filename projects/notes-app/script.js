/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: DATA & STATE MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEFINE notes array (will hold all notes)
DEFINE currentEditId (null = adding new, number = editing)
DEFINE STORAGE_KEY constant for localStorage

*/

const STORAGE_KEY = "notes";
let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentEditId = null;

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: ELEMENT REFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GET references to:
  - Notes grid container
  - Empty state element
  - Search input
  - Add button (FAB)
  - Modal overlay
  - Modal title (changes between "Add" and "Edit")
  - Note title input
  - Note content textarea
  - Save button
  - Cancel button
  - Close modal button (X)

*/

let notesList = document.getElementById("notesGrid");
let emptyState = document.getElementById("emptyState");
let searchInput = document.getElementById("searchInput");
let addBtn = document.getElementById("addBtn");
let modalOverlay = document.getElementById("modalOverlay");
let modalTitle = document.getElementById("modalTitle");
let noteTitle = document.getElementById("noteTitle");
let contentTextArea = document.getElementById("noteContent");
let saveBtn = document.getElementById("saveBtn");
let cancelBtn = document.getElementById("cancelBtn");
let closeBtn = document.getElementById("closeModal");

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: LOCAL STORAGE FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCTION loadNotes:
    GET data from localStorage using STORAGE_KEY
    IF data exists:
        PARSE JSON and assign to notes array
    ELSE:
        SET notes to empty array
    RETURN notes

FUNCTION saveNotes:
    CONVERT notes array to JSON string
    STORE in localStorage with STORAGE_KEY

*/

function loadNotes() {
  notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  return notes;
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4: RENDER FUNCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCTION renderNotes(notesToRender):
    // notesToRender defaults to all notes if not specified

    CLEAR the notes grid HTML

    IF notesToRender is empty:
        SHOW empty state element
        HIDE notes grid (optional)
        RETURN early
    ELSE:
        HIDE empty state element

    FOR EACH note in notesToRender:
        CREATE note card HTML with:
            - Title (h3)
            - Content preview (p)
            - Formatted date
            - Edit button with note's id as data attribute
            - Delete button with note's id as data attribute

        APPEND card HTML to notes grid

*/

function renderNotes(notesToRender = notes) {
  notesList.innerHTML = "";

  if (notesToRender.length === 0) {
    emptyState.style.display = "block";
    notesList.style.display = "none";
    return;
  } else {
    emptyState.classList.add("hidden");
    notesList.style.display = "grid";
  }

  notesToRender.forEach((note) => {
    const li = document.createElement("div");
    li.dataset.id = note.id;
    li.classList.add("note-card");

    li.innerHTML = `
    <h3>${note.title}</h3>
    <p>${note.content}</p>
    <div class="note-meta">
        <span class="note-date">${formatDate(note.createdAt)}</span>
        <div class="note-actions">
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">🗑️</button>
        </div>
    </div>`;
    notesList.appendChild(li);
  });
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5: DATE FORMATTING HELPER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCTION formatDate(timestamp):
    CREATE new Date from timestamp
    RETURN formatted string like "Jan 15, 2025"
    // Hint: Use toLocaleDateString with options

*/

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6: MODAL FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCTION openModal(noteToEdit = null):
    IF noteToEdit exists (editing mode):
        SET modalTitle text to "Edit Note"
        SET currentEditId to noteToEdit's id
        FILL title input with noteToEdit's title
        FILL content textarea with noteToEdit's content
    ELSE (adding mode):
        SET modalTitle text to "Add New Note"
        SET currentEditId to null
        CLEAR title input
        CLEAR content textarea

    ADD 'active' class to modal overlay

FUNCTION closeModal:
    REMOVE 'active' class from modal overlay
    CLEAR both input fields
    RESET currentEditId to null

*/

function openModal(noteToEdit = null) {
  if (noteToEdit) {
    modalTitle.textContent = "Edit Note";
    currentEditId = noteToEdit.id;
    noteTitle.value = noteToEdit.title;
    contentTextArea.value = noteToEdit.content;
  } else {
    modalTitle.textContent = "Add New Note";
    currentEditId = null;
    noteTitle.value = "";
    contentTextArea.value = "";
  }
  modalOverlay.classList.add("active");
}

function closeModal() {
  modalOverlay.classList.remove("active");
  noteTitle.value = "";
  contentTextArea.value = "";
  currentEditId = null;
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 7: CRUD OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCTION saveNote:
    GET title value (trimmed)
    GET content value (trimmed)

    IF title OR content is empty:
        ALERT user to fill both fields
        RETURN early

    IF currentEditId is NOT null (editing):
        FIND note in array by id (currentEditId)
        UPDATE that note's title
        UPDATE that note's content
        UPDATE that note's updatedAt timestamp
    ELSE (adding new):
        CREATE new note object with:
            - id: current timestamp (Date.now())
            - title: from input
            - content: from textarea
            - createdAt: current timestamp
            - updatedAt: current timestamp
        ADD new note to BEGINNING of notes array (unshift)

    CALL saveNotes (to localStorage)
    CALL renderNotes
    CALL closeModal

FUNCTION deleteNote(noteId):
    SHOW confirmation dialog
    IF user confirms:
        FILTER notes array to REMOVE note with matching id
        CALL saveNotes
        CALL renderNotes

*/

function saveNote() {
  const title = noteTitle.value.trim();
  const content = contentTextArea.value.trim();

  if (title === "" || content === "") {
    alert("Please fill in both title and content!");
    return;
  }

  if (currentEditId !== null) {
    const noteIndex = notes.findIndex((n) => n.id === currentEditId);

    if (noteIndex !== -1) {
      notes[noteIndex].title = title;
      notes[noteIndex].content = content;
      notes[noteIndex].updatedAt = Date.now();
    }
  } else {
    const newNote = {
      id: Date.now(),
      title: title,
      content: content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    notes.unshift(newNote);
  }

  saveNotes();
  renderNotes();
  closeModal();
}

function deleteNote(noteId) {
  const confirmed = confirm("Are you sure you want to delete this note?");

  if (confirmed) {
    notes = notes.filter((note) => note.id !== noteId);
    saveNotes();
    renderNotes();
  }
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 8: SEARCH FUNCTIONALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCTION searchNotes:
    GET search query (lowercase, trimmed)

    IF query is empty:
        RENDER all notes
        RETURN

    FILTER notes where:
        title (lowercase) INCLUDES query
        OR content (lowercase) INCLUDES query

    RENDER filtered notes

*/

function searchNotes() {
  let search = searchInput.value.trim().toLowerCase();

  if (search.length === 0) return renderNotes();
  else {
    let result = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search)
    );
    renderNotes(result);
  }
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 9: EVENT LISTENERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHEN Add button clicked:
    CALL openModal with no arguments (add mode)

WHEN Close button (X) clicked:
    CALL closeModal

WHEN Cancel button clicked:
    CALL closeModal

WHEN modal overlay clicked:
    IF click was directly on overlay (not modal content):
        CALL closeModal

WHEN Save button clicked:
    CALL saveNote

WHEN notes grid is clicked (event delegation):
    IF target is edit button OR inside edit button:
        GET note id from button's data attribute
        FIND note in array by id
        CALL openModal with that note

    IF target is delete button OR inside delete button:
        GET note id from button's data attribute
        CALL deleteNote with that id

WHEN search input value changes (use 'input' event):
    CALL searchNotes

*/

addBtn.addEventListener("click", () => openModal());
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});
saveBtn.addEventListener("click", saveNote);
notesList.addEventListener("click", (ev) => {
  const noteCard = ev.target.closest(".note-card");

  if (!noteCard) return;

  const noteId = parseInt(noteCard.dataset.id);

  if (ev.target.closest(".edit-btn")) {
    const noteToEdit = notes.find((n) => n.id === noteId);
    openModal(noteToEdit);
  }

  if (ev.target.closest(".delete-btn")) {
    deleteNote(noteId);
  }
});
searchInput.addEventListener("input", searchNotes);

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 10: INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CALL loadNotes (populate notes array from storage)
CALL renderNotes (display all notes on page load)

*/

loadNotes();
renderNotes(notes);
