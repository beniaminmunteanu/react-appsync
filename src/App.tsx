import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createTask, deleteTask, updateTask } from './graphql/mutations';
import { listTasks } from './graphql/queries';
import { onCreateTask, onDeleteTask } from './graphql/subscriptions';
import { OnCreateTaskSubscription, OnDeleteTaskSubscription } from './API';

import { GraphQLSubscription } from '@aws-amplify/api';

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  import './App.css';


  import { FaEdit, FaTrash } from 'react-icons/fa';


  import logo from './assets/craft_og.png';





  interface Task {
    id: string;
    title: string;
    description: string;
  }


function App() {

  const [taskData, setTaskData] = useState([]as Array<any>)
  const [editTaskId, setEditTaskId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');


  useEffect(()=> {
    const fetchTasks = async ()=>{
      const res: any = await API.graphql({query: listTasks});

      return res.data.listTasks.items;

    }
    fetchTasks().then(tasks=> setTaskData(tasks))

  },[])

  useEffect(()=>{
    const onCreateTaskSubscription = API.graphql<GraphQLSubscription<OnCreateTaskSubscription>>(
      graphqlOperation(onCreateTask)
    ).subscribe({
      next: ({ value, provider }) => {
        toast.success('A new task was added in the dataSource');
        setTaskData((crtTaskList) => [...crtTaskList, value.data?.onCreateTask]);
      },
      error: (e) => console.warn(e),
    });
    const onDeleteTaskSubscription = API.graphql<GraphQLSubscription<OnDeleteTaskSubscription>>(
      graphqlOperation(onDeleteTask)
    ).subscribe({
      next: ({ value, provider }) => {
        toast.warn('A task was deleted from the list');
        setTaskData((prevTaskList) => prevTaskList.filter((t) => t.id !== value.data?.onDeleteTask!.id));
      },
      error: (e) => console.warn(e),
    });

    return () => {
      onCreateTaskSubscription.unsubscribe();
      onDeleteTaskSubscription.unsubscribe();
    };
  },[])


  const handleTaskDelete = async (taskId: string) =>{
    await API.graphql({query: deleteTask, variables: {input: {id:taskId}}})
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try{
     await API.graphql({
        query: createTask,
        variables: {
          input: {
            title: formData.get('title') as string,
            description: formData.get('description') as string
          }
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });
    }catch(e){
      console.log(e);
    }
   
  }


  const handleEditClick = (task:Task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };


  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'editTitle') {
      setEditTitle(value);
    } else if (name === 'editDescription') {
      setEditDescription(value);
    }
  };

  const handleCancelEdit = () => {
    setEditTaskId('');
    setEditTitle('');
    setEditDescription('');
  };


  const handleTaskEdit = async (taskId: string) => {
    try {
      await API.graphql({
        query: updateTask,
        variables: {
          input: {
            id: taskId,
            title: editTitle,
            description: editDescription,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
      setEditTaskId('');
      setEditTitle('');
      setEditDescription('');
      toast.info('A task was modified');

    } catch (e) {
      console.log(e);
    }
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

<div className="text-center mb-4">
    <img src={logo} alt="Company Logo" className="logo" />
  </div>



      <h1 className="text-3xl text-center mt-4 mb-4">Data Synchronization - Technical Challenge</h1>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl mb-4">Create Task</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Enter the task title"
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Enter the task description"
            className="border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 ml-2">
            Submit
          </button>
        </form>


        <div className="separator"></div>

        <h1 className="text-3xl mb-4">Task List</h1>
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskData.map((task) => (
              <tr key={task.id} className="border-b">
                {editTaskId === task.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="editTitle"
                        value={editTitle}
                        onChange={handleEditInputChange}
                        placeholder="Enter the task title"
                        className="border p-2"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="editDescription"
                        value={editDescription}
                        onChange={handleEditInputChange}
                        placeholder="Enter the task description"
                        className="border p-2"
                      />
                    </td>
                    <td>
                      <button
                        className="bg-green-500 text-white py-2 px-4 mr-2"
                        onClick={() => handleTaskEdit(task.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      <button
                        className="bg-blue-500 text-white py-2 px-4 mr-2"
                        onClick={() => handleEditClick(task)}
                      >
                        <FaEdit/>
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4"
                        onClick={() => handleTaskDelete(task.id)}
                      >
                       <FaTrash/>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <ToastContainer />
      </div>
    </div>
  );

}

export default withAuthenticator(App);
