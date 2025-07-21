import { useEffect, useState, type JSX } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { setLocalStorage } from "../utils/local_storage.ts";
import { getLocalStorage } from "../utils/local_storage.ts";
import TaskList from "../components/TaskList";
import TaskLoader from "../components/TaskLoader";
import Sort from "../utils/Sort.ts";

interface Task {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface FormError {
  isError: boolean;
  errorMessage: string | null;
}

const task_local_storage = import.meta.env.VITE_TASK_LOCAL_STORAGE_NAME;

function TaskDashboard(): JSX.Element {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const [formError, setFormError] = useState<FormError>({
    isError: false,
    errorMessage: null,
  });
  const [taskIdToUpdate, setTaskIdToUpdate] = useState<string | null>(null);

  // Show message
  const showMessage = (title: string): void => {
    setTimeout(() => {}, 3000);
  };

  const charLong = (): void => {
    let timerInterval: NodeJS.Timeout;
    Swal.fire({
      title: "Task is too long. Consider it breaking down!",
      html: "This will close in <b></b> milliseconds.",
      timer: 4000,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector("b");
        timerInterval = setInterval(() => {
          if (b) {
            b.textContent = String(Swal.getTimerLeft());
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result: any) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  };

  const _create_todo_ = (e: React.FormEvent): void => {
    e.preventDefault();
    if (taskInput.length > 30) {
      charLong();
      return;
    }
    try {
      if (!taskInput) {
        setFormError({
          isError: true,
          errorMessage: "Hey yo!! Can't add empty task, can you?",
        });

        setTimeout(() => {
          setFormError({
            isError: false,
            errorMessage: null,
          });
        }, 3000);
        return;
      }

      const _new_todo_: Task = {
        id: uuidv4(),
        title: taskInput,
        description: "",
        created_at: new Date().toLocaleDateString(),
      };

      if (!task_local_storage) return;

      let _todos_: Task[] = getLocalStorage(task_local_storage); // Default values... check to get, or get empty Array

      _todos_.unshift(_new_todo_);

      setLocalStorage(task_local_storage, _todos_); // set updated back to local storage

      fetchTodos();
      setTaskInput("");
    } catch (error) {
      // show error message
      console.error("Error creating todo:", error);
    }
  };

  // Delete Task
  const handleDelete = (id: string | number): void => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (!task_local_storage) return;
        // get todo
        const todo_db: Task[] = getLocalStorage(task_local_storage);
        const _new_todo_db_: Task[] = todo_db.filter(
          (todo: Task) => todo.id !== id
        );
        setLocalStorage(task_local_storage, _new_todo_db_);
        fetchTodos();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        return;
      }
    });
  };

  // fetch Tasks
  const fetchTodos = (): void => {
    if (!task_local_storage) return;

    const _todos_: Task[] = getLocalStorage(task_local_storage);
    const sorted = Sort(_todos_);

    setTasks(_todos_);
    setTimeout(() => {
      setLoadingTasks(false);
    }, 5000);
  };

  const _handle_edit_mode_ = (id: string | number): void => {
    setIsEditMode(true);
    setTaskIdToUpdate(String(id));

    if (!task_local_storage) return;
    // get todo
    const todo_db: Task[] = getLocalStorage(task_local_storage);
    const _todo_to_update_ = todo_db.find((todo: Task) => todo.id === id);
    if (!_todo_to_update_) {
      return;
    }
    setTaskInput(_todo_to_update_.title);
  };

  // Update the Task DB
  const _update_todo_ = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!taskInput) {
      return setFormError({
        isError: true,
        errorMessage: "Yo!! Can't update empty Task, can you?",
      });
    }

    if (!task_local_storage || !taskIdToUpdate) return;

    const todo_db: Task[] = getLocalStorage(task_local_storage);
    const _updated_todo_db_: Task[] = todo_db.map((todo: Task) => {
      if (todo.id === taskIdToUpdate) {
        return { ...todo, title: taskInput };
      } else {
        return todo;
      }
    });

    setLocalStorage(task_local_storage, _updated_todo_db_);
    fetchTodos();
    setTaskInput("");

    setIsEditMode(false);
  };

  const removeCancelEdit = (): void => {
    setTaskInput("");
    setIsEditMode(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <header className="px-5 py-4 mx-auto max-w-lg">
        <h1
          className="lg:text-3xl md:text-3xl text-xl text-slate-700 font-medium"
          id="greetUser"
        >
          Hello buddy!
        </h1>
      </header>
      <main className="px-5 mt-10 max-w-lg mx-auto border-l border-b border-r border-slate-400 rounded-md">
        <form
          action="#"
          className="flex flex-col items-center sm:flex-row gap-2"
        >
          <input
            type="text"
            placeholder="What's gonna be for today"
            className="p-2 rounded-lg border border-slate-200 w-full"
            value={taskInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTaskInput(e.target.value)
            }
          />

          {/* Check if in Edit Mode */}
          {isEditMode ? (
            <div className="flex items-center gap-3">
              <button
                className=" bg-yellow-500 rounded-lg px-4 sm:px-2.5 py-3 text-sm text-white w-[100px] whitespace-nowrap hover:bg-yellow-600 border-0 border-slate-400"
                onClick={_update_todo_}
                type="submit"
                id="update_task_btn"
              >
                Update Task
              </button>
              <button
                onClick={removeCancelEdit}
                id="cancelEdit"
                className=" cursor-pointer text-red-500 border-2 p-1 bg-gray-300 rounded-full "
                type="button"
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
            </div>
          ) : (
            <button
              className="bg-green-500 rounded-lg px-4 sm:px-2.5 py-3 text-sm text-white w-[100px] whitespace-nowrap hover:bg-green-600"
              onClick={_create_todo_}
              type="submit"
              id="add_task_btn"
            >
              Add Task
            </button>
          )}
        </form>
        {formError.isError && (
          <span className="text-center justify-center text-red-400 mt-10">
            {formError.errorMessage}
          </span>
        )}
        {!loadingTasks && tasks.length === 0 && (
          <p className="text-center pb-2 text-slate-500 mt-3">
            No task was found buddy!!
          </p>
        )}
        {loadingTasks ? (
          <TaskLoader />
        ) : (
          <section className="mt-5">
            {tasks.map(({ title, id, created_at, description }: Task) => {
              return (
                <TaskList
                  title={title}
                  id={id}
                  created_at={created_at}
                  description={description}
                  key={`task-list-${id}`}
                  handleDelete={handleDelete}
                  handleEditMode={_handle_edit_mode_}
                />
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default TaskDashboard;
