
// import {AppError} from "../errors/AppError"


export class AppError extends Error{
    statusCode;
    isOperational;
    constructor(message, statusCode=500, isOperational =true){
        super(message)
        this.statusCode=statusCode;
        this.isOperational=isOperational;
        Error.captureStackTrace(this, this.constructor)
    }
}

export class NotFoundError extends AppError{
    constructor(message="Resource not Found"){
        super(message, 404)
    }
}





export class ConflictError extends AppError{
    constructor(message="Conflict Occured"){
        super(message, 409)
    }
}

export class BadRequestError extends AppError{
    constructor(message="Bad Request"){
        super(message, 400)
    }
}
export class UnauthorizedError extends AppError{
    constructor(message="Unauthorized"){
        super(message, 401)
    }
}

export const errorHandler=(err, req, res, next)=>{
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    //Fallback unhandled errors
    console.error(err);
    res.status(500).json({
        success:false,
        message: err.message || "Internal Server Error"
    });
    
}
