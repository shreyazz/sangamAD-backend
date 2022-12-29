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
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [imageLink2, setImageLink2] = useState("");
  const [loading, setLoading] = useState(false);
  const [templeData, setTempleData] = useState({
    name: "",
    price: "",
    imageLink: "",
    imageLink2: "",
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

  const getImgURL2 = (ev) => {
    setSelectedImage2(ev.target.files[0]);
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
        setImageLink2(data.data.link);
        setLoading(false);
      });
  };

  const [temps, setTemps] = useState([])
  const handleChange = (event) => {
    setTempleData({ ...templeData, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    setTempleData({ ...templeData, imageLink: imageLink, imageLink2: imageLink2 });
    const fetchTemps = async () => {
      const getTemples = await axios("https://sangamapi.vercel.app/getTemples");
      setTemps(getTemples.data.temples)
    }

    fetchTemps();

  }, [imageLink, imageLink2]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const addTemple = await axios({
      method: "post",
      url: `https://sangamapi.vercel.app/addTemples`,
      data: {
        name: templeData.name,
        price: templeData.price,
        imageLink: templeData.imageLink,
        images: templeData.imageLink2 === "" ? [] : templeData.imageLink2,
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
      imageLink: temp.imageLink,
      images: temp.images
    })
    setTempleName(temp.name);
  }

  const sendUpdatedData = async (event) => {
    event.preventDefault()
    if (templeData.imageLink2 !== "") {
      templeData.images.push(templeData.imageLink2)
    }
    const upTemp = await axios.post("https://sangamapi.vercel.app/updateTemple", { name: templeName, price: templeData.price, imageLink: templeData.imageLink, newName: templeData.name, images: templeData.images });
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

  const handleRemove = async (index) => {
    templeData.images.pop(index);
    const upTemp = await axios.post("https://sangamapi.vercel.app/updateTemple", { name: templeName, price: templeData.price, imageLink: templeData.imageLink, newName: templeData.name, images: templeData.images });
    console.log(upTemp.data)
    if (upTemp.status == 200 || upTemp.status == 201) {
      toast("Image Deleted", {
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

  console.log(temps);

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

      {/* new uploader */}

      <Container className="mt-3">
        <Form>
          <Form.Group controlId="formFile" className="mt-3">
            <Form.Label>Upload the image of the Temple Array</Form.Label>
            <Form.Control
              type="file"
              onChange={(ev) => {
                getImgURL2(ev);
              }}
            />
          </Form.Group>
          {loading && (
            <Spinner animation="border" variant="secondary" className="mt-3" />
          )}

          <Form.Group controlId="formFile" className="mt-3">
            <Form.Label>Image URL: {imageLink2}</Form.Label>
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
            {selectedImage2 && (
              <img
                alt="not fount"
                className="prev-img"
                src={URL.createObjectURL(selectedImage2)}
              />
            )}
            <br />
          </Col>

          <Col>
            <h3>Uploaded Image</h3>
            {selectedImage2 && (
              <img alt="loading..." className="prev-img" src={imageLink2} />
            )}
            <br />
          </Col>
        </Row>
        <Button
          onClick={() => {
            setSelectedImage2(null);
            setImageLink2("");
          }}
          variant="danger"
          className="mt-3"
        >
          Remove Image
        </Button>
      </Container>
      <Container className="mt-5">
        <h5>List of Images:</h5>
        <Container className="p-3" style={{ background: "lightgrey", borderRadius: "5px" }}>
          {
            templeData.images === undefined ?
              <p>No Image List</p>
              : templeData.images.map((elem, index) => {
                return (
                  <Container key={index} className="d-flex"><a href={elem} style={{ textDecoration: "none", marginRight: "1rem" }} target="_blank" rel="noopener noreferrer">Image {index + 1}</a> <div style={{ cursor: "pointer" }} className="cross_btn" onClick={() => { handleRemove(index) }}>X</div></Container>
                )
              })
          }
        </Container>
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
