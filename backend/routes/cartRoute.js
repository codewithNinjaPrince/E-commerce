import express from 'express'
import { addToCart,getUserCart,updateCart, changeSize , saveForLater, getSavedForLater, removeSavedForLater} from '../controller/cartController.js'
import authUser from '../middleware/auth.js';

const cartRouter=express.Router();

cartRouter.post('/get',authUser,getUserCart)
cartRouter.post('/add',authUser,addToCart)
cartRouter.post('/update',authUser,updateCart)
cartRouter.post('/change-size',authUser,changeSize)
cartRouter.post('/save-for-later', authUser, saveForLater);
cartRouter.post('/save-for-later/get', authUser, getSavedForLater);
cartRouter.post('/save-for-later/remove', authUser, removeSavedForLater);



export default cartRouter