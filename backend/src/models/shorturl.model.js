import  mongoose  from 'mongoose';

const shortUrlModelSchema=new mongoose.Schema({
    full_url:{
        type: String,
        required:true,
    },
    short_url:{
        type: String,
        required:true,
        index:true,
        unique: true,
    },
    clicks: {
        type:Number,
        required: true,
        default:0,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const shortUrl=mongoose.model("shortUrl", shortUrlModelSchema);

export default shortUrl;