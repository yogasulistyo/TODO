import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

const App = () => {
  // penampung
  const [todo, setTodo] = useState([]);

  const [input, setInput] = useState({ id: "", nama: "", umur: "" });

  const [edit, setEdit] = useState(false);

  const getApi = async () => {
    await axios
      .get("http://localhost:3004/results")
      .then((respon) => {
        setTodo(respon.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // input data
  const handleChange = (e) => {
    let newInput = { ...input };
    if (!edit) {
      newInput["id"] = Date.now();
    }
    newInput[e.target.name] = e.target.value;
    setInput(newInput);
    console.log(input);
  };

  // submit data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!edit) {
      axios.post("http://localhost:3004/results/", input).then(() => {
        handleClear();
        getApi();
      });
    } else {
      axios.put(`http://localhost:3004/results/${input.id}`, input).then(() => {
        handleClear();
        setEdit(false);
        getApi();
      });
    }
  };

  // clear input
  const handleClear = () => {
    setInput({
      nama: "",
      umur: "",
    });
  };

  // submit data
  useEffect(() => {
    getApi();
  }, []);

  // delete data
  const handleDelete = ({ id }) => {
    axios.delete(`http://localhost:3004/results/${id}`).then(() => getApi());
  };
  // edit data
  const handleEdit = ({ id }) => {
    axios.get(`http://localhost:3004/results/${id}`).then((respon) => {
      setInput(respon.data);
      setEdit(true);
    });
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nama</Form.Label>
          <Form.Control value={input.nama} onChange={handleChange} name="nama" type="text" placeholder="Masukan Nama" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Umur</Form.Label>
          <Form.Control value={input.umur} onChange={handleChange} name="umur" type="text" placeholder="Masukan Umur" />
        </Form.Group>

        <Button variant="primary" type="submit">
          {edit ? "Edit Data" : "Create"}
        </Button>
      </Form>
      {todo.map((todo, index) => {
        return (
          <div key={index}>
            <p>{todo.nama}</p>
            <p>{todo.umur}</p>
            <p>{todo.id}</p>

            <div>
              <Button onClick={() => handleDelete(todo)}>Delete</Button>
            </div>
            <br></br>
            <div>
              <Button onClick={() => handleEdit(todo)}>Edit</Button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default App;
