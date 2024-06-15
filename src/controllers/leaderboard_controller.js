const {
    overall,
    relatives
} = require("../services/leaderboard_service.js")

exports.overall = async (req, res) => {
    try {
        const data = await overall(req,res);
        if(data.success){
            res.status(200).json( {
                success: data.success,
                message:data.message,
                data:data.data
            })
        }
        else{
            res.status(500).json( {
                success: data.success,
                message:data.message,
            })
        }
    } catch (error) {
        console.error("Error fetching overall leaderboard:", error);
        res.status(500).json( {
            success: false,
            message: "Error fetching overall leaderboard",
        })
    }
}
exports.relatives = async (req, res) => {
    try {
        const data = await relatives(req,res);
        if(data.success){
            res.status(200).json( {
                success: data.success,
                message:data.message,
                data
            })
        }
        else{
            res.status(500).json( {
                success: data.success,
                message:data.message,
                data
            })
        }
    } catch (error) {
        console.error("Error fetching relatives leaderboard:", error);
        res.status(500).json( {
            success: false,
            message: "Error fetching relatives leaderboard",
        })
    }
}