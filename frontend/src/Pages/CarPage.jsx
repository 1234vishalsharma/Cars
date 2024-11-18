import { Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { async } from "@firebase/util";

const CarPage = () => {
  const { carID } = useParams();
  const [data, setData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [index, setIndex] = useState(0);
  const [imgs , setImages] = useState([]);
  const storage = getStorage(app);
  const [updatedData , setUpdatedData] = useState({
    carID: carID || "",
    title: data?.title || "",
    description: data?.description || "",
    model: data?.model || 0,
    images: data?.images || [],
    company: data?.company || "",
    dealer: data?.dealer || ""
  });
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const fetchCarData = () => {
    fetch(`${BASE_URL}/list_car?${carID}`, { method: "GET" })
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        if(res.status === 1){
          setData(res.data[0]);
          setUpdatedData(res.data[0]);
        }else{
          navigate('/');
        }
      })
      .catch(() => toast.error("Unable to load data"));
  };
  const goBack = () => {
    window.history.back();
  };
  const previousImage = () => {
    if (data.images.length) {
      if (index == 0) {
        setIndex(data.images.length - 1);
      } else {
        setIndex(index - 1);
      }
    } else {
      toast.error("Cannot load image");
    }
  };
  const nexIamge = () => {
    if (data.images.length) {
      if (index == data.images.length - 1) {
        setIndex(0);
      } else {
        setIndex(index + 1);
      }
    } else {
      toast.error("Cannot load image");
    }
  };
  const UpdateCarData = () => {
    setOpenUpdate(!openUpdate);
  };
  const handelUpdateData = async() => {
    // call api here 
    try{
      const response = await axios.put(`${BASE_URL}/edit_car?${carID}` , updatedData , {
        headers : {
          "content-type": "application/json"
        }
      });
      if(response.data.status === 1){
        toast.success("Car Details Updated");
        fetchCarData();
        UpdateCarData(!openUpdate);
      }
    }catch(e){
      toast.error("Internal server Erorr");
    }
  }
  const handleUpdateState = (key , value) => {
    setUpdatedData((prev) => ({
      ...prev,
      [key]: value, // Update the title dynamically
    }));
  };
  useEffect(() => {
    fetchCarData();
  }, []);

  const Uploadfiles = async(toastID) => {
    if(!carID)  return;

    let i = 0;
    while(i < imgs.length){
        if(carID && imgs[i]){
            const metadata = {
              contentType: imgs[i].type
            };
            const refer = ref(storage, `SpyneCarImages/${carID}/` + imgs[i]?.name);
            const uploadTask = await uploadBytesResumable(refer, imgs[i], metadata);
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
}
}

  const AddImages = async() => {
    document.getElementById("inputFiles").click();
  }

  const SaveImages = async() => {
    if(imgs.length > 0){
      const toastID = toast.loading("Removing old images and Uploading new Files");
      const folderRef = ref(storage, `SpyneCarImages/${carID}`);

      try {
        // Step 1: List all files in the folder
        const folderContents = await listAll(folderRef);

        // Step 2: Delete each file in the folder
        const deletePromises = folderContents.items.map((itemRef) => deleteObject(itemRef));
        const isDeleted = await Promise.all(deletePromises);
        if(isDeleted) console.log("All old files deleted successfully. " , isDeleted);

        Uploadfiles(toastID)
      }catch(e){
        conosle.errro("Unwanted error occured : " , e);
      }
    }else{
      toast.error("Please Select at least one Image");
    }
  }

  const handelDelete = () => {
    let confirmation = prompt("Please enter 'Delete Car' to delete this Car");

    if (confirmation === "Delete Car") {
        fetch(`${BASE_URL}/delete_car?${carID}` , {method : "DELETE"}).then((resp) => {
          return resp.json();
        }).then((res) => {
          if(res.status === 1){
            toast.success("Car deleted successfully");
            setTimeout(() => {
              window.history.back();
            }, 2000);
          }
        }).catch((e) => {
          toast.error("Internal Server Error");
        })
    }else{
      toast.error("Cannot delete Your Car");
    }  
  }

  return (
    <div className="flex h-screen w-screen bg-black">

           <Modal
                open={openUpdate}
                onClose={UpdateCarData}
          
                style={{height:"100%", width:"100%", display:"flex" , justifyContent: "center" , alignItems:"center", gap:"2px"}}>
            
            <div className="flex gap-4">
                <div className="shadow-lg h-80 w-[500px] rounded-lg bg-white p-12 flex flex-col items-center gap-2">
                <Typography variant="h6">EDIT CAR</Typography>
                    <div className="flex gap-2">
                        <TextField value={updatedData?.title} label="Car Title" onChange={(e) => (handleUpdateState('title' , e.target.value))} variant="filled"/>
                        <TextField value={updatedData?.description} label="Car description"  onChange={(e) => (handleUpdateState('description' , e.target.value))}  variant="filled"/>
                    </div>
                    <div className="flex gap-2">
                        <TextField value={updatedData?.model} type="number" label="Car Model" onChange={(e) => (handleUpdateState('model' , e.target.value))}  variant="filled"/>
                        <TextField value={updatedData?.dealer} label="Car Dealer"  onChange={(e) => (handleUpdateState('dealer' , e.target.value))}  variant="filled"/>
                    </div>
                    <div className="flex gap-2">
                        <TextField value={updatedData?.type} label="Car Type" onChange={(e) => (handleUpdateState('type' , e.target.value))}  variant="filled"/>
                        <TextField value={updatedData?.company} label="Car Company"  onChange={(e) => (handleUpdateState('company' , e.target.value))}  variant="filled"/>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <Button onClick={handelUpdateData} variant="contained">Update</Button>
                        <Button onClick={UpdateCarData} style={{backgroundColor: "RED"}} variant="contained">Cancel</Button>
                    </div>
                </div>
                <div className="shadow-lg h-[500px] w-[600px] rounded-lg  bg-white p-4 flex flex-col items-center gap-1">
                <Typography variant="h6">Images (Max: 10 Images)</Typography>
                <div className="grid grid-cols-2 gap-2 height-[350px] w-[500px] overflow-auto">
                    {
                        updatedData?.images.map((image) => {
                            return <img className="h-56 w-56" src={image} alt="loading..."/>
                        })
                    }
                </div>
                    <div className="flex gap-2">
                    <input id="inputFiles" onChange={(e) => setImages(e.target.files)} type="file" multiple hidden/>
                    <Button onClick={AddImages} style={{backgroundColor: "Green"}} variant="contained">Select New Images</Button>
                    <Button onClick={SaveImages} variant="contained">Upload Images</Button>
                    </div>
                </div>
            </div>
        </Modal>
        

      <div className="w-2/4 h-full text-white flex flex-col justify-start">
        <div className="flex justify-between pl-12 pr-12">
          <button
            onClick={goBack}
            className="w-12 h-12 p-3 m-3 bg-transparent rounded-full border border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>

          <button
            onClick={UpdateCarData}
            className=" p-3 m-3 bg-transparent flex gap-2 items-center justify-center border rounded-xl  border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-pencil"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit Car
          </button>
        </div>
        <div className="-rotate-90 text-xl absolute left-8 top-32">
          <span className="font-bold text-3xl text-red-500">{data?.model}</span>
          <p>{data?.title}</p>
        </div>
        <div className="relative top-80 p-12">
          <p className="text-6xl text-yellow-500 mb-4 font-extrabold">{data?.title}</p>
          <p className="text-justify">{data?.description}</p>
          <p className="text-justify">Dealer - {data?.dealer}</p>
        </div>
      </div>
      <div className="w-2/4 h-full">
        {data?.images && (
          <img
            className="object-cover h-full w-full"
            src={data?.images[index]}
            alt="Loading..."
          />
        )}
        <div className="fixed flex justify-between items-center bottom-4 w-2/4 p-10">
          <button
            onClick={previousImage}
            className=" bg-transparent rounded-full p-6 border border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <button
            onClick={nexIamge}
            className="bg-transparent rounded-full p-6 border border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
        <button onClick={handelDelete} className="fixed bottom-12 left-[47%]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default CarPage;
