"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getTodo,
  createTodo,
  updateStatus,
  updateTodo,
  deleteTodo,
} from "../service/tudo_api";

interface Todo {
  id: number;
  todo: string;
  isCompleted: boolean;
}

interface TodoFormInput {
  todo: string;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [filter, setFilter] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TodoFormInput>();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodo();
        setTodos(response.todos);
        console.log(response);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) =>
    todo.todo.toLowerCase().includes(filter.toLowerCase())
  );

  const onSubmit = async (data: TodoFormInput) => {
    const trimmed = data.todo.trim();
    if (!trimmed) {
      setError("todo", { message: "Todo cannot be empty" });
      return;
    }

    const duplicate = todos.some(
      (item) => item.todo.toLowerCase() === trimmed.toLowerCase()
    );

    if (duplicate) {
      setError("todo", { message: "This todo already exists" });
      return;
    }

    try {
      const response = await createTodo({ todo: trimmed });
      setTodos((prev) => [...prev, response.todos]);
      console.log(response);
      reset();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.todo);
    reset();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleEditSubmit = async () => {
    const trimmed = editingValue.trim();
    if (!trimmed) {
      alert("Todo cannot be empty");
      return;
    }

    const duplicate = todos.some(
      (item) =>
        item.todo.toLowerCase() === trimmed.toLowerCase() &&
        item.id !== editingId
    );

    if (duplicate) {
      alert("This todo already exists");
      return;
    }

    if (editingId !== null) {
      try {
        const response = await updateTodo(editingId, { todo: trimmed });
        setTodos((prev) =>
          prev.map((item) => (item.id === editingId ? response.todos : item))
        );
        setEditingId(null);
        setEditingValue("");
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleUpdateStatus = async (id: number) => {
    try {
      const response = await updateStatus(id);
      console.log(response);
      setTodos((prev) =>
        prev.map((item) => (item.id === id ? response.todos : item))
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) cancelEdit();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div>
      <h1 className="text-xl mb-4">Todo List</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Add new task"
          className="border px-2 py-1"
          {...register("todo", { required: "Todo is required" })}
          disabled={editingId !== null}
        />
        <button
          type="submit"
          disabled={editingId !== null}
          className="border px-3 py-1 bg-blue-500 text-white"
        >
          Add
        </button>
      </form>
      {errors.todo && (
        <p className="text-red-600 mt-1">{errors.todo.message}</p>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1"
        />
      </div>

      <div className="space-y-2">
        {todos.length === 0 && <p>empty</p>}

        {todos.length > 0 && filteredTodos.length === 0 && (
          <p>No result. Create a new one instead!</p>
        )}
        {filteredTodos.map((item) =>
          editingId === item.id ? (
            <div key={item.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="border px-2 py-1 flex-grow"
                autoFocus
              />
              <button
                onClick={handleEditSubmit}
                className="border px-2 py-1 bg-green-100"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="border px-2 py-1 bg-gray-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              key={item.id}
              className="flex justify-between items-center px-3 group"
            >
              <div>
                <p
                  onClick={() => handleUpdateStatus(item.id)}
                  className="cursor-pointer flex-grow"
                >
                  {item.todo}
                </p>

                <p>Status: {item.isCompleted ? "Completed" : "Incomplete"}</p>
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(item.id)}
                  className="underline text-blue-600 text-sm"
                >
                  {item.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button
                  onClick={() => startEditing(item)}
                  className="underline text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="underline text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
