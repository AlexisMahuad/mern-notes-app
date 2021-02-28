import React, { useState, useContext } from "react";
import { useUserContext } from "./userContext";
import Axios from "axios";

const notesContext = React.createContext();

function NotesProvider({ children }) {
  const { userData, setUserData } = useUserContext();
  const [notes, setNotes] = useState(null);
  const [form, setForm] = useState({
    title: "",
    text: "",
    color: "yellow",
    public: false,
  });
  const [isEditing, setIsEditing] = useState([false, null]);
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });

  // *************
  // Handle Submit
  // *************
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing[0]) {
      // const res = await Axios.put(
      //   `http://localhost:4000/api/notes/${isEditing[1]}`,
      //   { ...form, author: userData.username }
      // );
      const res = await Axios.put(`/api/notes/${isEditing[1]}`, {
        ...form,
        author: userData.username,
      });

      // Create a new note list replacing the edited note
      const newNoteList = notes.map((note, index) => {
        if (note._id === res.data.id) {
          // Merge the notes to update it
          // If a value dont change, it will be the same as before
          return { ...notes[index], ...res.data.updatedNote };
        }
        return note;
      });

      // Set an alert
      setAlert({ type: "edit", message: res.data.message });
      // Reset the state
      setNotes(newNoteList);
      setForm({ title: "", text: "", color: "yellow", public: false });
      setIsEditing([false, null]);

      // If isn't editing
      // ================
    } else {
      // const res = await Axios.post("http://localhost:4000/api/notes", {
      //   ...form,
      //   author: userData.username,
      // });
      const res = await Axios.post("/api/notes", {
        ...form,
        author: userData.username,
      });
      const { errorMessage, message, content } = res.data;

      // If there is an error
      if (errorMessage) {
        return setAlert({ type: null, message: errorMessage });
      }

      // Update the list
      setNotes([...notes, content]);
      // Reset the form and set an alert
      setForm({ title: "", text: "" });
      setAlert({ type: "success", message });
    }
  };

  // *************
  // Handle Delete
  // *************
  const handleDelete = async (id) => {
    if (id === isEditing[1]) {
      setIsEditing([false, null]);
      setForm({
        title: "",
        text: "",
      });
    }
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
    // const res = await Axios.delete(`http://localhost:4000/api/notes/${id}`);
    const res = await Axios.delete(`/api/notes/${id}`);
    setAlert({
      type: null,
      message: res.data.message,
    });
  };

  // ********
  //  Colors
  // ********
  const handleChangeNoteColor = () => {
    switch (form.color) {
      case "yellow":
        return setForm({ ...form, color: "pink" });
      case "pink":
        return setForm({ ...form, color: "green" });
      case "green":
        return setForm({ ...form, color: "blue" });
      default:
        return setForm({ ...form, color: "yellow" });
    }
  };

  const pickNoteColor = (color) => {
    if (!color) {
      switch (form.color) {
        case "green":
          return "n-green";
        case "blue":
          return "n-blue";
        case "pink":
          return "n-pink";
        default:
          return "n-yellow";
      }
    }
    switch (color) {
      case "green":
        return "n-green";
      case "blue":
        return "n-blue";
      case "pink":
        return "n-pink";
      default:
        return "n-yellow";
    }
  };

  return (
    <notesContext.Provider
      value={{
        notes,
        setNotes,
        form,
        setUserData,
        setForm,
        isEditing,
        setIsEditing,
        alert,
        setAlert,
        handleChangeNoteColor,
        pickNoteColor,
        handleDelete,
        handleSubmit,
      }}
    >
      {children}
    </notesContext.Provider>
  );
}

export const useNotesContext = () => {
  return useContext(notesContext);
};

export { notesContext, NotesProvider };
