const mongoose = require('mongoose');
const CarSchema = require('../../models/Car');
const fs = require('fs')

// add a car
const add_car = async(req,res) => {
        try{
            console.log(req.body);
            const {userID, carID ,title, images , description, type, model, dealer, company} = req.body;
            const saveCar = new CarSchema({userID, carID , images , title, description, type, model, dealer, company});
            saveCar.save().then((savedCar) => {
                return res.status(200).json({
                    status: 1,
                    message: "New car data added",
                    data: savedCar,
                })
            }).catch((e) => {
                return res.status(500).json({
                    status : 0,
                    message: "Inside catch",
                    error: e.message,
                })
            });
        }catch(e){
            return res.status(500).json({
                status: 0,
                message: "Inside catch",
                error: e.message,
            })
        }
}
// delete car
const delete_car = async(req,res) => {
    const carID = req.query;
    if(carID){
        try{
            const isDeleted = await CarSchema.deleteOne(carID);
            if(isDeleted){
                return res.status(200).json({
                    status: 1,
                    message: "Car Data deleted"
                })
            }else{
                return res.status(400).json({
                    status: 0,
                    message: "Data not deleted (not found)",
                })
            }
        }catch(e){
            return res.status(500).json({
                status: 0,
                message: "Inside catch",
                error: e.message,
            })
        }
    }
}
// edit car
const edit_car = async(req,res) => {
    try{
        const {carID} = req.query;
        if(carID){
            const {title , description, images, type, dealer, company} = req.body;
            const isUpdated = await CarSchema.findOneAndUpdate({carID} , {title , description, images, type, dealer, company} , {new: true});
            if(isUpdated){
                return res.status(200).json({
                    status : 1,
                    message: "Car data updated",
                    data : isUpdated
                })
            }else{
                return res.status(400).json({
                    status : 0,
                    message: "Car data not updated",
                })
            }
        }else{
            return res.status(400).json({
                status: 0,
                message : "Car found in db",
            })
        }
    }catch(e){
        return res.status(500).json({
            status: 0,
            message : "Inside Catch",
            error: e.message
        })
    }
}
// get all cars
const get_car = async(req,res) => {
    const {carID , userID} = req.query;
    if(carID){
        try{
            const car = await CarSchema.find({carID}); 
            console.log(car);
            if(car.length){
                return res.status(200).json({
                    status: 1,
                    message : "Data found in db",
                    data : car,
                })
            }else{
                return res.status(400).json({
                    status: 0,
                    message : "Data not found in db",
                })
            }
        }catch(e){
            return res.status(500).json({
                status: 0,
                message : "Indise catch Error recieved",
                error: e.message,
            })
        }
    }else{
        try{
            const car = await CarSchema.find({userID});
            if(car){
                return res.status(200).json({
                    status: 1,
                    message : "Data found in db",
                    data : car,
                })
            }else{
                return res.status(400).json({
                    status: 0,
                    message : "Data found in db",
                })
            }
        }catch(e){
            return res.status(500).json({
                status: 0,
                message : "Inside catch",
                error : e.message
            })
        }
    }
}


module.exports = {add_car , delete_car , edit_car , get_car};