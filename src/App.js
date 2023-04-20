// import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Accordion, Container, Row } from 'react-bootstrap';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import CardHeader from 'react-bootstrap/esm/CardHeader';

const firebaseConfig = {
  apiKey: "AIzaSyD7nFp2QH8A_Od9Tqpca4-I-10rjwrKhq0",
  authDomain: "todo-94236.firebaseapp.com",
  projectId: "todo-94236",
  storageBucket: "todo-94236.appspot.com",
  messagingSenderId: "93666693500",
  appId: "1:93666693500:web:4949701a4aa485800bd4f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {

  const [todoName, setTodoName] = useState("")
  const [todoDesc, setTodoDesc] = useState("")
  const [todoAssignee, setTodoAssignee] = useState("")
  const [todoPriority, setTodoPriority] = useState(0)
  const [todoList, setTodoList] = useState([])
  const [progressList, setProgressList] = useState([])
  const [doneList, setDoneList] = useState([])

  useEffect(() => {
    console.log(todoName, todoAssignee, todoPriority)
  }, [todoPriority])


  let getData = async () => {
    const todoRef = collection(db, "ToDoList");

    let data = []
    const docsSnap = await getDocs(todoRef);
    docsSnap.forEach(doc => {
      data.push({ ...doc.data(), id: doc.id })
    })

    setTodoList(data.filter((i) => i.status === 1).sort((a, b) => a.priority - b.priority))
    setProgressList(data.filter((i) => i.status === 2).sort((a, b) => a.priority - b.priority))
    setDoneList(data.filter((i) => i.status === 3).sort((a, b) => a.priority - b.priority))
  }

  useEffect(() => {
    getData()
  }, [])

  let addToDo = (e) => {
    e.preventDefault()
    addDoc(collection(db, 'ToDoList'), {
      name: todoName,
      desc: todoDesc,
      assignee: todoAssignee,
      priority: parseInt(todoPriority),
      status: 1
    }).then(() => {
      getData()
      setTodoName("")
      setTodoDesc("")
      setTodoPriority(0)
      setTodoAssignee("")
    })
  }

  let increment = async (todo) => {
    const docRef = doc(db, "ToDoList", todo.id)
    await updateDoc(docRef, { status: todo.status + 1 })
    getData()
  }

  let decrement = async (todo) => {
    const docRef = doc(db, "ToDoList", todo.id)
    await updateDoc(docRef, { status: todo.status - 1 })
    getData()
  }

  return (
    <div className="App">
      <Form onSubmit={addToDo} className='d-flex flex-row justify-content-between align-items-center p-4 border-bottom'>
        <Form.Group className="mb-3" controlId="todoName">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter todo"
            value={todoName}
            onChange={e => setTodoName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="todoDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Enter Description"
            value={todoDesc}
            onChange={e => setTodoDesc(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="todoAssignee">
          <Form.Label>Assignee</Form.Label>
          <Form.Control type="text" placeholder="Enter Assignee"
            value={todoAssignee}
            onChange={e => setTodoAssignee(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="todoPriority">
          <Form.Label>Priority</Form.Label>
          <Form.Select aria-label="Default select example"
            className='text-dark'
            value={todoPriority}
            onChange={e => setTodoPriority(e.target.value)}>
            <option
              className='text-dark'>Select Priority (1 Highest)</option>
            <option
              className='text-light bg-danger' value="1">1</option>
            <option
              className='text-dark bg-warning' value="2">2</option>
            <option
              className='text-dark bg-info' value="3">3</option>
          </Form.Select>
        </Form.Group>

        <Button variant="success" type="submit">
          Add
        </Button>
      </Form>
      <Stack direction="horizontal" gap={3} className="h-full align-items-start">
        <Container>
          <div className='fs-4 p-2'>
            ToDo
          </div>
          <Accordion defaultActiveKey="">
            {todoList?.map((i) => (
              <Accordion.Item eventKey={i.id} className='overflow-hidden mt-1'>
                <div className={`top-0 left-0 p-1 ${i.priority === 1
                  ? "bg-danger"
                  : i.priority === 2
                    ? "bg-warning"
                    : "bg-info"}`
                }></div>
                <Accordion.Header>{i.name} - {i.assignee}</Accordion.Header>
                <Accordion.Body className='text-dark'>
                  {i.desc}
                  <Stack direction='horizontal' className='justify-content-end'>
                    <Button variant="success" onClick={() => increment(i)}>In Progress</Button>
                  </Stack>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
        <Container>
          <div className='fs-4 p-2'>
            In Progress
          </div>
          <Accordion defaultActiveKey="">
            {progressList?.map((i) => (
              <Accordion.Item eventKey={i.id} className='overflow-hidden mt-1'>
                <div className={`top-0 left-0 p-1 ${i.priority === 1
                  ? "bg-danger"
                  : i.priority === 2
                    ? "bg-warning"
                    : "bg-info"}`
                }></div>
                <Accordion.Header>{i.name} - {i.assignee}</Accordion.Header>
                <Accordion.Body className='text-dark'>
                  {i.desc}
                  <Stack direction='horizontal' className='justify-content-between'>
                    <Button variant="dark" onClick={() => decrement(i)}>Todo</Button>
                    <Button variant="success" onClick={() => increment(i)}>Done</Button>
                  </Stack>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
        <Container>
          <div className='fs-4 p-2'>
            Done
          </div>
          <Accordion defaultActiveKey="">
            {doneList.length !== 0
              ? doneList.map((i) => (
                <Accordion.Item eventKey={i.id} className='overflow-hidden mt-1'>
                  <div className={`top-0 left-0 p-1 ${i.priority === 1
                    ? "bg-danger"
                    : i.priority === 2
                      ? "bg-warning"
                      : "bg-info"}`
                  }></div>
                  <Accordion.Header>{i.name} - {i.assignee}</Accordion.Header>
                  <Accordion.Body className='text-dark'>
                    {i.desc}
                    <Stack direction='horizontal' className='justify-content-start'>
                      <Button variant="dark" onClick={() => decrement(i)}>In Progress</Button>
                    </Stack>
                  </Accordion.Body>
                </Accordion.Item>
              ))
              : "Looks empty, lets get some work done!"}
          </Accordion>
        </Container>
      </Stack>
    </div>
  );
}

export default App;
