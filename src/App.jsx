import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import Task from "./components/Task";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";

function App() {
  const [showAddNewTask, setShowAddNewTask] = useState(false);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };

    getTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();

    return data;
  };

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    return data;
  };

  const addTask = async (task) => {
    const res = await fetch("http://localhost:5000/tasks/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();

    setTasks([...tasks, data]);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTast = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTast),
    });

    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddNewTask(!showAddNewTask)}
          showAdd={showAddNewTask}
        />
        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {showAddNewTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                "No tasks"
              )}
            </>
          )}
        />
        <Route
          path="/:id"
          exact
          render={(props) => (
            <>
              {tasks.length > 0 ? (
                <Task
                  key={props.match.params.id}
                  task={tasks[props.match.params.id]}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : null}
              <Link to="/">Go back</Link>
            </>
          )}
        />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
