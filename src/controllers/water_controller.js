const {
    getWater,
    updateWater,
} = require('../services/water_service')

const getWaterController = async (req, res) => {
    try {
        const data = await getWater(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateWaterController = async (req, res) => {
    try {
        const data = await updateWater(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getWaterController,
    updateWaterController,
};