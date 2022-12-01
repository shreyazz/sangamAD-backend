import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { Container } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ManageTemple = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [templeName, setTempleName] = useState("")
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [templeData, setTempleData] = useState({
    name: "",
    price: "",
    imageLink: "",
  });
  const getImgURL = (ev) => {
    setSelectedImage(ev.target.files[0]);
    const formdata = new FormData();
    formdata.append("image", ev.target.files[0]);
    setLoading(true);
    fetch("https://api.imgur.com/3/image", {
      method: "post",
      headers: {
        Authorization: "Client-ID 1e4107b48d3e3b7",
      },
      body: formdata,
    })
      .then((data) => data.json())
      .then((data) => {
        setImageLink(data.data.link);
        setLoading(false);
      });
  };
  const [temps, setTemps] = useState([])
  const handleChange = (event) => {
    setTempleData({ ...templeData, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    setTempleData({ ...templeData, imageLink: imageLink });
    const fetchTemps = async () => {
      const getTemples = await axios("https://sangamapi.vercel.app/getTemples");
      setTemps(getTemples.data.temples)
    }

    fetchTemps();

  }, [imageLink]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const addTemple = await axios({
      method: "post",
      url: ` https://sangamapi.vercel.app/addTemples`,
      data: {
        name: templeData.name,
        price: templeData.price,
        imageLink: templeData.imageLink,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (addTemple.status == 201) {
      toast("Temple Added", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    console.log(addTemple.status);
  };


  const refreshTemples = async () => {
    const getTemples = await axios("https://sangamapi.vercel.app/getTemples");
    setTemps(getTemples.data.temples)
  }

  const deleteTemple = async (name) => {
    const deleteTemp = await axios.post("https://sangamapi.vercel.app/deleteTemple", { name: name });
    console.log(deleteTemp)
    if (deleteTemp.status == 200 || deleteTemp.status == 201) {
      toast("Temple Deleted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  const updateTemple = async (temp) => {
    setIsEditing(true)
    setTempleData({
      name: temp.name,
      price: temp.price,
      imageLink: temp.imageLink
    })
    setTempleName(temp.name);
  }

  const sendUpdatedData = async (event) => {
    event.preventDefault()
    const upTemp = await axios.post("https://sangamapi.vercel.app/updateTemple", { name: templeName, price: templeData.price, imageLink: templeData.imageLink, newName: templeData.name });
    console.log(upTemp.data)
    if (upTemp.status == 200 || upTemp.status == 201) {
      toast("Temple Updated", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return (
    <>
      <Container className="mt-3">
        <ToastContainer />
        <Form>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Name of the Temple</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name of the Temple"
              value={templeData.name}
              name="name"
              onChange={(event) => handleChange(event)}
            />
          </Form.Group>

          <Form.Group className="mt-3" controlId="formGridDescription">
            <Form.Label>Price of the Temple</Form.Label>
            <Form.Control
              placeholder="Price of the Temple"
              name="price"
              value={templeData.price}
              onChange={(event) => handleChange(event)}
            />
          </Form.Group>

          <Form.Group controlId="formFile" className="mt-3">
            <Form.Label>Upload the image of the Temple</Form.Label>
            <Form.Control
              type="file"
              onChange={(ev) => {
                getImgURL(ev);
              }}
            />
          </Form.Group>
          {loading && (
            <Spinner animation="border" variant="secondary" className="mt-3" />
          )}

          <Form.Group controlId="formFile" className="mt-3">
            <Form.Label>Image URL: {imageLink}</Form.Label>
          </Form.Group>

          {!isEditing ? <><Button
            variant="success"
            type="submit"
            className="mt-3"
            onClick={(event) => handleSubmit(event)}
          >
            Upload
          </Button></> : <><Button
            variant="success"
            type="submit"
            className="mt-3"
            onClick={(event) => sendUpdatedData(event)}
          >
            Update
          </Button></>}
        </Form>
      </Container>

      <Container className="mt-5">
        <Row>
          <Col>
            <h3>Preview Image</h3>
            {selectedImage && (
              <img
                alt="not fount"
                className="prev-img"
                src={URL.createObjectURL(selectedImage)}
              />
            )}
            <br />
          </Col>

          <Col>
            <h3>Uploaded Image</h3>
            {selectedImage && (
              <img alt="loading..." className="prev-img" src={imageLink} />
            )}
            <br />
          </Col>
        </Row>
        <Button
          onClick={() => {
            setSelectedImage(null);
            setImageLink("");
          }}
          variant="danger"
          className="mt-3"
        >
          Remove Image
        </Button>
      </Container>
      <hr />
      <div className="pb-3">
        <ToastContainer />

        <h1>All Temples</h1>
        <Button variant="success" onClick={refreshTemples}>Refresh</Button>
        <div className="nameplate-cards">
          {temps.map((temp) => {
            return (
              <div className="nameplate-card" key={temp.name}>
                <img src={temp.imageLink} />
                <h5>{temp.name}</h5>
                <p>{temp.price}</p>
                <Button
                  variant="danger"
                  onClick={() => deleteTemple(temp.name)}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => updateTemple(temp)}
                  style={{ marginLeft: "2rem" }}
                >
                  Edit
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ManageTemple;
