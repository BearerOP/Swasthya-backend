const {
  create_medication,
  delete_medication,
  update_medication,
  view_medication,
} = require("../services/medication_service.js");

exports.create_medication = async (req, res) => {
  try {
    const data = await create_medication(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(500).json(data);
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
};
exports.view_medication = async (req, res) => {
  try {
    const data = await view_medication(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(500).json(data);
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
};
