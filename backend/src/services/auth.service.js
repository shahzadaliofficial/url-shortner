
import { createUser,findUserByEmail } from '../dao/user.dao.js'
import { ConflictError, NotFoundError } from '../utils/errorHandler.js';
import { signJwtToken } from '../utils/helper.utils.js';


export const registerUserService = async (name, email, password)=>{
    const user = await findUserByEmail(email)
    if (user) throw new ConflictError("User Already Exist");
    const newUser=await createUser(name, email,password)
    const token=signJwtToken({id: newUser._id})
    return token
}
export const loginUserService = async (email, password)=>{
    console.log(email,password)
    const user = await findUserByEmail(email)
    if (!user || user.password!=password) throw new NotFoundError("Email or password is invalid");
    
    const token=signJwtToken({id: user._id})
    return token
}