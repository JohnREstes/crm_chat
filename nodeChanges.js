import express from 'express';
import Growatt from 'growatt';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3001; // or any port you prefer

let growatt = new Growatt({});
let isLoggedIn = false;
let lastRequestTime = Date.now();

async function loginGrowatt() {
  if (!isLoggedIn) {
    await growatt.login(process.env.GROWATT_USER, process.env.GROWATT_PASSWORD);
    isLoggedIn = true;
  }
}

async function logoutGrowatt() {
  if (isLoggedIn) {
    await growatt.logout();
    isLoggedIn = false;
  }
}

app.get('/api/data', async (req, res) => {
  try {
    lastRequestTime = Date.now();
    await loginGrowatt();
    
    let getAllPlantData = await growatt.getAllPlantData({});
    
    // Extract required data
    const yolandaData = getAllPlantData['4466']['devices']['UKDFBHG0GX']['statusData'];
    const casaMJData1 = getAllPlantData['25328']['devices']['XSK0CKS058']['statusData'];
    const casaMJData2 = getAllPlantData['25328']['devices']['XSK0CKS03A']['statusData'];
    const weatherDataYolanda = getAllPlantData['4466']['weather']['data']['HeWeather6'][0];
    const weatherDataCasaMJ = getAllPlantData['25328']['weather']['data']['HeWeather6'][0];
    
    res.json({
      yolandaData,
      casaMJData1,
      casaMJData2,
      weatherDataYolanda,
      weatherDataCasaMJ
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Periodically check if logout is needed
setInterval(async () => {
  if (Date.now() - lastRequestTime > 2 * 60 * 1000) { // 2 minutes
    await logoutGrowatt();
  }
}, 30 * 1000); // Check every 30 seconds
