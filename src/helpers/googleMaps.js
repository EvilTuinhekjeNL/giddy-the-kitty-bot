import { GOOGLE_KEY } from "../../api_key.js";

export const calculateDistance = async (from, to) =>{

    const fromLoc = await getCoordinates(from);
    const toLoc = await getCoordinates(to);

    const distance = distanceCalculation(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng);
    return distance.toFixed(1)+" km";  
}

async function getCoordinates(country){
    let response = await fetchCall(`https://maps.googleapis.com/maps/api/geocode/json?address=${country}&key=${GOOGLE_KEY}`);
    if(response.status === "OK"){
        const { lat, lng } = response.results[0].geometry.location;
        return {lat, lng} 
    }else{
        return {};
    }
}

async function fetchCall(apiString){
    try{
        let response = await fetch(apiString);
        let responseJson = await response.json();
        return responseJson;
    }catch(error){
        console.error(error);
    }
}

function distanceCalculation(lat1, lon1, lat2, lon2){
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg){
    return deg * (Math.PI/180)

}