import Alert from "../models/Alert.js";

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAlert = async (req, res) => {
  const { type, timestamp, location } = req.body;

  try {
    const alert = new Alert({ type, timestamp, location });
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};