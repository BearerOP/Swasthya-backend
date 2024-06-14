const {
    createReminder,
    getReminder,
    updateReminder,
    deleteReminder
} = require('../services/reminder_services.js');

exports.createReminder = async (req, res) => {
    try {
        const data = await createReminder(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

exports.getReminder = async (req, res) => {
    try {
        const data = await getReminder(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

exports.updateReminder = async (req, res) => {
    try {
        const data = await updateReminder(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

exports.deleteReminder = async (req, res) => {
    try {
        const data = await deleteReminder(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

