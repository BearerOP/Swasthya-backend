const reminder_model = require("../models/reminder_model");

const user_model = require("../models/user_model");

exports. create_reminder = async(req,res)=>
    {
        const user = req.user;
        if(user)
            {
                const title = req.body.title;

            }
    }

exports. delete_reminders = async(req,res)=>
    {
        const user = req.user;
    }

exports. update_reminder = async(req,res)=>
    {
        const user = req.user;

    }
exports. get_reminders = async(req,res)=>
    {
        const user = req.user;
    }