import { BusinessSetup } from "../models/businessModel.js";

// Controller to get business hours
exports.getBusinessHours = async (req, res) => {
  try {
    const businessHours = await BusinessHours.findOne();
    res.json(businessHours);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to set business hours
exports.setupBusiness = async (req, res) => {
  const { businessID, name,address, phoneNo,email,longitude,lattitude, openTime, closeTime, gameLength} = req.body;

    // Validate input
    if(!businessID, !name || !address || !phoneNo || !email || !longitude || !lattitude || !openTime || !closeTime || !gameLength
      ) {
    return res.status(400).json({ error: 'Missing Input' });
  }

   
  

  try {
    // Check if a document already exists in the collection
    let businessHours = await BusinessHours.findOne();

    // If a document exists, update it; otherwise, create a new one
    if (businessHours) {
      businessHours.openTime = openTime;
      businessHours.closeTime = closeTime;
      businessHours.breakStart = breakStart;
      businessHours.breakEnd = breakEnd;
      businessHours.gameTimeInMinute = 60 || null;

      await BusinessSetup.save();
    } else {
      await BusinessHours.create({
        openTime,
        closeTime,
        breakStart,
        breakEnd,
        holiday: holiday || null,
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
