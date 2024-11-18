import { Button, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast , {Toaster} from "react-hot-toast";
import { useSelector } from "react-redux";
import Carcomponent from "./components/Carcomponent";
import axios from 'axios';
import {app} from '../firebase';
import { getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const userData = useSelector((state) => state.user.userData);
  const [Uploaded , setUploaded] = useState(true);
  const [OpenModal, setOpenModal] = useState(false);
  const [files , setFiles] = useState([]);
  const [data , setData] = useState([]);
  const userID = localStorage.getItem('userID');
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();
  const [carID , setCarID] = useState("");
  const [searchText , setSearchText] = useState("");
  const [carData , setcarData] = useState({
    userID,
    carID : "",
    title:  "", 
    description:  "",
    model:  0,
    company: "",
    images: [],
    type: "",
    dealer:  ""
  });
  const storage = getStorage(app);
  const [filteredCars, setFilteredCars] = useState(data);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const fetchCars = async() => {
    try{
      const response = await axios.get(`${BASE_URL}/list_car?userID=${userID}`);
      setData(response?.data?.data);
    }catch(e){
      toast.error("Internal server error ");
    }
  }
  const closeModal = () => {
    setFiles([]);
    setOpenModal(false);
  }
  const handleUpdateState = (key , value) => {
    setcarData((prev) => ({
      ...prev,
      [key]: value, // Update the title dynamically
    }));
  };
  
  const generateRandomCarId = () => {
    // Generate a random string of characters (6 characters in this case)
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  
    // Get the current timestamp in milliseconds
    const timestamp = Date.now().toString(36).toUpperCase();
  
    // Combine the random part and timestamp
    const carId = `CAR-${randomPart}-${timestamp}`;
  
    return carId;
  }

  const AddCar = async() => {
    if(!carID || !carData.title || !carData.description || !carData.model || !carData.type || !carData.images || !carData.company || !carData.dealer){
      toast.error("All fields are compulsary");
      return;
    }else{
      const response = await axios.post(`${BASE_URL}/add_car` , carData, {
        'content-Type': 'multipart/form-data'
      });
      if(response.data.status === 1){
          toast.success("Car Added successfully");
          closeModal();
          fetchCars();
      }else{
        toast.error("Car not added");
        closeModal();
      }
    }
  }
 


  const Uploadfiles = async() => {
    if(!carID)  return;
    const toastID = toast.loading("Uploading Files...");

    let i = 0;
    while(i < files.length){
        if(carID && files[i]){
            const metadata = {
              contentType: files[i].type
            };
            const refer = ref(storage, `SpyneCarImages/${carID}/` + files[i]?.name);
            const uploadTask = await uploadBytesResumable(refer, files[i], metadata);
        }
        i++;
    }
    getImageUrls(toastID);
}

const getImageUrls = async(toastID) => {
    const listRef = ref(storage , `SpyneCarImages/${carID}`);

    try {
      const res = await listAll(listRef);

      if (res.items.length === 0) {
          throw new Error("No files found in the specified directory");
      }

      const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef)) // Fetch URLs
      );

      handleUpdateState("images", urls);

      // Success toast
      toast.success("Files Uploaded Successfully");
  } catch (error) {
      console.error("Error fetching image URLs:", error);

      // Error toast
      toast.error("Something went wrong while fetching image URLs");
  } finally {
      toast.dismiss(toastID);
      setUploaded(false);
  }
}

const handelLogout = () => {
  localStorage.setItem('token' , "");
  localStorage.setItem('userID',  "");
  localStorage.setItem('userName',  "");
  navigate('/Login');
}

const handleSearch = () => {
  if(!searchText){
    toast.error("Please Enter the text first");
    return;
  }
  const handleSearch = () => {
    const lowercasedSearchText = searchText.toLowerCase();

    const filtered = carData.filter((car) =>
      Object.keys(car).some((key) => {
        const value = car[key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowercasedSearchText);
        } else if (typeof value === "number") {
          return value.toString().includes(lowercasedSearchText);
        } else if (Array.isArray(value)) {
          return value.some((item) =>
            item.toString().toLowerCase().includes(lowercasedSearchText)
          );
        }
        return false;
      })
    );

    setFilteredCars(filtered);
  };

  
};

const handelAddCar = () => {
  const ID = generateRandomCarId();
    setCarID(ID);
    handleUpdateState("carID" , ID);
    setOpenModal(true)
}

useEffect(() => {
  fetchCars();
} , []);
 
  const handelchange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 10) {
      toast.error("You can only upload up to 10 files.");
      return;
    } else {
      setFiles(selectedFiles); 
    }
  }
  return (
    <div className="bg-black h-screen w-screen text-white p-12">
      <Modal
        open={OpenModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <div className="flex gap-4">
          <div className="shadow-lg h-80 w-[500px] rounded-lg bg-white p-12 flex flex-col items-center gap-2">
            <Typography variant="h6">ADD CAR</Typography>
            <div className="flex gap-2">
              <TextField label="Car Title" onChange={(e) => (handleUpdateState('title' , e.target.value))} variant="outlined" />
              <TextField label="Car description" onChange={(e) => (handleUpdateState('description' , e.target.value))} variant="outlined" />
            </div>
            <div className="flex gap-2">
              <TextField type="number" onChange={(e) => (handleUpdateState('model' , e.target.value))} label="Car Model" variant="outlined" />
              <TextField label="Car Dealer" onChange={(e) => (handleUpdateState('dealer' , e.target.value))} variant="outlined" />
            </div>
            <div className="flex gap-2">
              <TextField label="Car Type" onChange={(e) => (handleUpdateState('type' , e.target.value))} variant="outlined" />
              <TextField label="Car Company" onChange={(e) => (handleUpdateState('company' , e.target.value))} variant="outlined" />
            </div>
            <div className="flex gap-4 mt-6">
              <Button style={{cursor: `${Uploaded ? "not-allowed" : "pointer"}`}} onClick={AddCar} variant="contained">
                ADD CAR
              </Button>
              <Button
                onClick={closeModal}
                style={{ backgroundColor: "RED" }}
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          </div>
          <div className="shadow-lg h-full w-[600px] rounded-lg bg-white p-4 flex flex-col items-center gap-1">
            <Typography variant="h6">Images (Max: 10 Images)</Typography>
            <input onChange={handelchange} className="border border-black p-3" type="file" multiple />
            {
              files && files.map((file) => {
                  return (<p className="font-bold text-left">{file.name}</p>)
                })
            }
            <Button variant="contained" onClick={Uploadfiles}>Upload Images</Button>
          </div>
        </div>
      </Modal>




      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5">Welcome, {userName}</Typography>
          <span className="text-xl font-bold">Explore Your cars</span>
        </div>
        <div className="overflow-hidden w-96 flex items-center justify-center gap-2">
            <input onChange={(e) => setSearchText(e.target.value)} className="outline-none h-9 p-3 border border-white rounded-md bg-black text-white" type="text" placeholder="Search by title"/>
            <Button onClick={handleSearch} variant="contained">Search</Button>
        </div>
        <div className="flex gap-2 max-md:hidden">
          <Button onClick={handelLogout} variant="contained" style={{backgroundColor: "RED"}}>
            Logout
          </Button>
          <Button onClick={handelAddCar} variant="contained">
            Add New Car
          </Button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        {
          data && data.map((item) => {
            return <Carcomponent data={item} />
          })
        }
      </div>
      <Toaster/>
    </div>
  );
};

export default Dashboard;
