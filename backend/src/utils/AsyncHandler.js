const asyncHandler = (requestHandler) => async(req,res,next) =>{
    try {
        return await requestHandler(res,req,next)
    } catch (error) {
        res.status(error.code || 500).json({
            suucess:false,
            message:error.message
        })
    }
}

export default asyncHandler