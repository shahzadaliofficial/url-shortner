export default function tryCatchWrapAsync(fn){
    return function (req, res, next){
        fn(req, res, next).catch(next);
    };
};