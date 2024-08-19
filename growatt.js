"use strict";
import Growatt from 'growatt';
import fs from 'fs'

const user = "johnnie321";
const passwort = "133Utica";
const options = {};
const yolanda = "4466";
const casaMJ = "25328";
const yolanda1 = "UKDFBHG0GX"
const casaMJ1 = "XSK0CKS058";
const casaMJ2 = "XSK0CKS03A";

async function test() {
  const growatt = new Growatt({});
  
  try {
    let login = await growatt.login(user, passwort);
    console.log('login:', login);

    let getAllPlantData = await growatt.getAllPlantData(options);
    
    // Write the data to a file
    fs.writeFileSync('plantData.json', JSON.stringify(getAllPlantData, null, 2));
    console.log('Data written to plantData.json');
    console.log(getAllPlantData[yolanda]["devices"][yolanda1]["statusData"])
    console.log(getAllPlantData[casaMJ]["devices"][casaMJ1]["statusData"])
    console.log(getAllPlantData[casaMJ]["devices"][casaMJ2]["statusData"])
    console.log(getAllPlantData[yolanda]["weather"]["data"]["HeWeather6"][0])
    console.log(getAllPlantData[casaMJ]["weather"]["data"]["HeWeather6"][0])
    

    let logout = await growatt.logout();
    console.log('logout:', logout);
  } catch (e) {
    console.error(e);
  }
}

test();
