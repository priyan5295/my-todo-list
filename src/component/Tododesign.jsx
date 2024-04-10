import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

const Tododesign = () => {

    const [isCompleteScreen, setIsCompleteScreen] = useState(false)

    const [allTodolist, setAllTodolist] = useState([])

    const [newTitle, setNewTitle] = useState("")

    const [newDescription, setNewDescription] = useState("")

    const [editId, setEditId] = useState(null)

    const [changesMade, setChangesMade] = useState(false)


    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"))
        if (storedTasks && storedTasks.length > 0) {
            setAllTodolist(storedTasks);
            const lastTask = storedTasks[storedTasks.length - 1];
            setNewTitle(lastTask.title || "");
            setNewDescription(lastTask.description || "");
            // if (lastTask) {
            //     setNewTitle(lastTask.title || "");
            //     setNewDescription(lastTask.description || "");
            // } else {
            //     setNewTitle("");
            //     setNewDescription("");
            // }
        } else {
            setNewTitle("");
            setNewDescription("");
        }
        // if(storedTasks) {
        //     setAllTodolist(storedTasks)
        //     const lastTask = storedTasks[storedTasks.length - 1];
        //     setNewTitle(lastTask.title);
        //     setNewDescription(lastTask.description);
        // }
    }, [])

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(allTodolist));
    }, [allTodolist])



    function handleTask(event) {
        const { name, value } = event.target
        if (name === "title") {
            setNewTitle(value)
        } else if (name === 'description') {
            setNewDescription(value)
        }
        setChangesMade(true);
        // setNewTitle((oldValues) => ({
        //     ...oldValues,
        //     [name] : value
        // }))
        // console.log(newTitle);
    }

    const handleAddTask = () => {
        if (changesMade || editId === null) {
        if (newTitle.trim() !== "" && newDescription.trim() !== "") {
            // When the edit button is clicked for a task, its details are populated into the input fields, 
            //allowing the user to edit them. Pressing the "Add" button saves the changes to the task.
            if (editId !== null) {
                const updatedTasks = allTodolist.map(task =>
                    task.id === editId
                        ? { ...task, title: newTitle, description: newDescription }
                        : task
                );
                setAllTodolist(updatedTasks);
                setEditId(null);

            } else {
                const newTask = {
                    id: Date.now(),
                    title: newTitle,
                    description: newDescription,
                    completed: false
                };
                setAllTodolist([...allTodolist, newTask]);
            }
            setNewTitle("");
            setNewDescription("");

        } else {
            alert("Please enter a title and description.");
        }
    } else {
        alert("There are no changes to save.");
    }
    }

    const handleDeleteTask = (taskId) => {
        const updatedTasks = allTodolist.filter(task => task.id !== taskId);
        setAllTodolist(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    const handleCompleteTask = (taskId) => {
        const completedTasks = allTodolist.map(task => 
            task.id === taskId
            ? { ...task, completed: true, completionDate: new Date().toLocaleString() }
            : task
        //     {
        //     if (task.id === taskId) {
        //         return {
        //             ...task,
        //             completed: true,
        //             completionDate: new Date().toLocaleString()
        //         }
        //     }
        //     return task;
        // }
    )
        setAllTodolist(completedTasks)
        localStorage.setItem("tasks".JSON.stringify(completedTasks))
    }

    const handleEditTask = taskId => {
        const taskToEdit = allTodolist.find(task => task.id === taskId)
        setNewTitle(taskToEdit.title)
        setNewDescription(taskToEdit.description)
        setEditId(taskId)
        setChangesMade(false)
    }

    const filteredTasks = isCompleteScreen
        ? allTodolist.filter(task => task.completed)
        : allTodolist.filter(task => !task.completed)

    return (
        <>
            <div className="todo-wrapper">
                <div className="todo-input">
                    <div className="todo-input-item">
                        <label>Title</label>
                        <input
                            type="text"
                            value={newTitle}
                            name="title"
                            onChange={handleTask}
                            placeholder="What's the task title?" />
                    </div>
                    <div className="todo-input-item">
                        <label>Description</label>
                        <input
                            type="text"
                            value={newDescription}
                            name="description"
                            onChange={handleTask}
                            placeholder="What's the description?" />
                    </div>
                    <div className="todo-input-item">
                        <button type="submit"
                            onClick={handleAddTask}
                            className="primaryBtn"
                        >
                            {editId !== null ? <AiOutlineSave /> : "Add"}
                        </button>
                    </div>
                </div>
                <div className="btn-area">
                    <button
                        className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
                        onClick={() => setIsCompleteScreen(false)}>Todo</button>
                    <button
                        className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
                        onClick={() => setIsCompleteScreen(true)}>Completed</button>
                </div>
                <div className="todo-list">
                    {filteredTasks.map((task) => (
                        <div className="todo-list-item" key={task.id}>
                            <div>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                {task.completed && (
                                    <p>Completed On: {task.completionDate}</p>
                                )}
                            </div>
                            <div>
                                <AiOutlineDelete
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="icon"
                                />
                                {!task.completed && (
                                    <>
                                        <AiOutlineEdit
                                            onClick={() => handleEditTask(task.id)}
                                            className="icon"
                                        />
                                        <BsCheckLg className="check-icon"
                                            onClick={() => handleCompleteTask(task.id)}
                                        />
                                    </>
                                )}

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default Tododesign