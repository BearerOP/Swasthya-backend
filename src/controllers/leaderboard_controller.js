const {
    overall,
    friendsAndFamily
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
exports.friendsAndFamily = async (req, res) => {
    try {
        const data = await friendsAndFamily(req,res);
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
        console.error("Error fetching leaderboard:", error);
        res.status(500).json( {
            success: false,
            message: "Error fetching leaderboard",
        })
    }
}