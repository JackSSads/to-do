import { useState, useEffect, useCallback } from "react"
import toast, { Toaster } from 'react-hot-toast';

import { Check, Trash } from "../../libs/icons";
import './index.css'
import Icon from "/public/icon.png"

export const Home = () => {

  const [toDo, setToDo] = useState({
    todo: "",
    createAtt: "",
    finallyAtt: "",
    status: false
  })

  const [listToDo, setListToDo] = useState([])
  const [openToDo, setOpenToDo] = useState([])
  const [finishedToDo, setFinishedToDo] = useState([])

  useEffect(() => {
    getAllToDo()
  }, [toDo])

  const getAllToDo = useCallback(() => {
    const todo = JSON.parse(localStorage.getItem("todo")) || [];

    const isTrue = todo.filter(item => item.status);
    const isFalse = todo.filter(item => !item.status);

    setOpenToDo(isFalse);
    setFinishedToDo(isTrue);

    setListToDo(todo);

  }, [])

  const create = () => {

    if (toDo.todo === "" || toDo.createAtt === "" || toDo.finallyAtt === "") {
      return notify("Preencha todos os campos!", "❌")
    }

    setListToDo(prev => ([...prev, toDo]))

    localStorage.setItem("todo", JSON.stringify([...listToDo, toDo]))

    setToDo(() => ({
      todo: "",
      createAtt: new Date().toLocaleDateString("pt-BR"),
      finallyAtt: "",
      status: false
    }))

    notify("Tarefa criada", "✅")
  }

  const finallyToDo = (todo) => {
    const newList = [...listToDo]

    const objEditIndex = newList.findIndex(item => item["todo"] === todo)

    if (objEditIndex !== -1) {
      let objCloned = { ...newList[objEditIndex] }
      objCloned.status = true

      listToDo[objEditIndex] = objCloned;
      setListToDo(listToDo);

      localStorage.setItem("todo", JSON.stringify(listToDo));

      getAllToDo();

      notify("Tarefa finalizada", "✅")
    }
  }

  const deleteById = (todo) => {
    const deleteItem = listToDo.filter(item => item.todo != todo)

    localStorage.setItem("todo", JSON.stringify(deleteItem))

    getAllToDo()

    notify("Tarefa excluída", "💥")
  }

  const notify = (text, icon) => {
    toast(`${text}`,
  {
    icon: `${icon}`,
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  }
);
  }

  return (
    <div id='container'>
      <Toaster/>
      <div id="logo">
        <img src={Icon} alt="to-do" />
        <h1>To-Do</h1>
      </div>


      <label className="label">
        Sua tarefa:
        <input type="text" placeholder='Sua tarefa'
          value={toDo.todo}
          onChange={(e) => setToDo(prev => ({ ...prev, todo: e.target.value }))} />
      </label>

      <label className="label">
        Começar em:
        <input type="datetime-local"
          value={toDo.createAtt}
          onChange={(e) => setToDo(prev => ({ ...prev, createAtt: e.target.value }))} />
      </label>

      <label className="label">
        Terminar até:
        <input type="datetime-local"
          value={toDo.finallyAtt}
          onChange={(e) => setToDo(prev => ({ ...prev, finallyAtt: e.target.value }))} />
      </label>

      <button id="button-plus" onClick={() => create()}>+ Adicionar</button>

      <div className='list-todo'>
        {openToDo.length > 0 ? openToDo.map((e, index) => (
          <div key={index} id="card">
            <h4>{e.todo}</h4>
            <p>De: {e.createAtt}</p>
            <p>Até: {e.finallyAtt}</p>

            <div id="card-buttons">
              <button onClick={() => deleteById(e.todo)}><Trash /></button>
              <button onClick={() => finallyToDo(e.todo)}><Check /></button>
            </div>
          </div>
        )) : (
          <div id="card">
            <h4>Você não tem novas tarefas 😉</h4>
          </div>
        )}

        {finishedToDo.length > 0 && (
          <h2>Tarefas Finalizadas:</h2>
        )}

        {finishedToDo.length > 0 && finishedToDo.map((e, index) => (
          <div key={index} id="card">
            <h4>{e.todo}</h4>
            <p>De: {e.createAtt}</p>
            <p>Até: {e.finallyAtt}</p>

            <div id="card-buttons">
              <button onClick={() => deleteById(e.todo)}>Excluir tarefa</button>
            </div>
          </div>
        ))}

        {finishedToDo > 0 && (
          <div id="card">
            <h4>Ainda não finalizou nem uma tarefa? 🙄</h4>
          </div>
        )}
      </div>
    </div>
  )
}