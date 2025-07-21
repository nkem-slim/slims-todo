import { Link, useParams } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../utils/local_storage.ts";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

const SingleTaskPreview: React.FC = () => {
  const { task_id } = useParams<{ task_id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDes, setTaskDes] = useState<string>("");
  const [taskIdToUpdate, setTaskIdToUpdate] = useState<string | null>(null);

  useEffect(() => {
    const getTaskById = (): void => {
      const task_local_storage = import.meta.env.VITE_TASK_LOCAL_STORAGE_NAME;
      if (!task_local_storage) return;

      const todo_db: Task[] = getLocalStorage(task_local_storage);
      const currentTodo = todo_db.find((todo: Task) => todo.id === task_id);
      setTask(currentTodo || null);
    };
    if (task_id) {
      getTaskById();
    }
  }, [task_id]);

  const fetchTask = (): void => {
    const task_local_storage = import.meta.env.VITE_TASK_LOCAL_STORAGE_NAME;
    if (!task_local_storage || !task_id) return;

    const todo_db: Task[] = getLocalStorage(task_local_storage);
    const currentTodo = todo_db.find((todo: Task) => todo.id === task_id);
    if (currentTodo) {
      setTaskTitle(currentTodo.title);
      setTaskDes(currentTodo.description || "");
    }
  };

  const _handle_edit_mode_ = (): void => {
    setEditMode(true);
    const task_local_storage = import.meta.env.VITE_TASK_LOCAL_STORAGE_NAME;
    if (!task_local_storage || !task_id) return;

    const todo_db: Task[] = getLocalStorage(task_local_storage);
    const currentTodo = todo_db.find((todo: Task) => todo.id === task_id);
    if (currentTodo) {
      setTaskTitle(currentTodo.title);
      setTaskDes(currentTodo.description || "");
      setTaskIdToUpdate(currentTodo.id);
    }
  };

  const _update_todo_ = (e: React.FormEvent): void => {
    e.preventDefault();
    const task_local_storage = import.meta.env.VITE_TASK_LOCAL_STORAGE_NAME;
    if (!task_local_storage || !taskIdToUpdate) return;

    const todo_db: Task[] = getLocalStorage(task_local_storage);
    const _updated_todo_db_: Task[] = todo_db.map((todo: Task) => {
      if (todo.id === taskIdToUpdate) {
        return { ...todo, title: taskTitle, description: taskDes };
      } else {
        return todo;
      }
    });
    setLocalStorage(task_local_storage, _updated_todo_db_);
    setTaskDes("");
    setTaskTitle("");
    setEditMode(false);
    console.log(_updated_todo_db_);
    fetchTask();
  };

  const _cancelEdit_ = (): void => {
    setEditMode(false);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (!task) {
    return <p>Loading</p>;
  }

  return (
    <>
      <header className="px-5 py-4 mx-auto max-w-lg flex items-center justify-between">
        <h1 className="lg:text-3xl md:text-3xl text-xl text-slate-700 font-medium">
          Task Details!
        </h1>
        <Link
          to="/"
          className="border flex items-center gap-2 text-gray-500 hover:text-blue-800 rounded-lg px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
          <span className="text-sm">Back to all Task</span>
        </Link>
      </header>
      <main className="px-5 mt-10 pb-3 max-w-lg mx-auto border-l border-b border-r border-slate-400 rounded-md">
        <section id="todo_preview_container">
          <div>
            {!editMode ? (
              <section className="flex justify-between">
                <section className="flex items-center gap-2">
                  {/* <input
                    type="checkbox"
                    className="cursor-pointer"
                    id="checkBox"
                    // onclick="checkBox()"
                  /> */}
                  <h3 className="text-xl font-semibold" id="titleHead">
                    {task.title}
                  </h3>
                </section>
                <div className="flex items-center">
                  <button
                    className="border rounded-full p-1 hover:border-2 hover:border-yellow-500"
                    onClick={_handle_edit_mode_}
                    id="editIcon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </div>
              </section>
            ) : (
              ""
            )}
            {!editMode ? (
              <section className="mt-3 text-gray-600" id="editDescription">
                {!taskDes ? (
                  <p>Click edit icon to enter description...</p>
                ) : (
                  <p className="mt-3 text-gray-600">{taskDes}</p>
                )}
              </section>
            ) : (
              ""
            )}
            {editMode && (
              <p className="lg:text-2xl md:text-2xl text-xl text-slate-600 font-semibold">
                Edit Task and Description
              </p>
            )}
            {editMode ? (
              <section
                className=" items-center justify-between mt-4"
                id="newTodoPreviewSection"
              >
                <section className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTaskTitle(e.target.value)
                    }
                    className="px-2 py-2 border border-gray-800 rounded-md inline-flex"
                    id="newTodoPreview"
                  />
                  <textarea
                    value={taskDes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setTaskDes(e.target.value)
                    }
                    className="px-2 py-2 border border-gray-800 rounded-md inline-flex"
                    id="newTodoPreviewDes"
                  />
                </section>
                <section className="flex items-center gap-1 justify-between mt-2">
                  <button
                    className="bg-yellow-500 rounded-lg px-4 sm:px-1.5 py-2 text-sm text-white w-[100px] whitespace-nowrap hover:bg-yellow-600 border border-none"
                    onClick={_update_todo_}
                    type="button"
                    id="update_task_btn"
                  >
                    Update Task
                  </button>
                  <button
                    id="cancelEdit"
                    className="cursor-pointer text-red-500 border-2 p-2 bg-gray-300 rounded-full"
                    onClick={_cancelEdit_}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </section>
              </section>
            ) : (
              ""
            )}
            <section className="mt-4">
              <span className="text-sm">Created at</span>
              <span className="text-sm ml-2"> {task.created_at}</span>
              {/* <span className="mx-1">↦</span>
              <span
                className="bg-gray-500 text-sm px-1 py-1 rounded-full text-white"
                id="currentState"
              >
                pending
              </span> */}
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default SingleTaskPreview;
