/* ================= LOCATION ================= */

let LATITUDE = 24.8333;
let LONGITUDE = 92.7789;

function setLocation(lat, lon){
  LATITUDE = lat;
  LONGITUDE = lon;
}

/* ================= FORMAT ================= */

function fmt(t){
  if(!t) return "—";
  return t.toLocaleTimeString("en-IN",{
    hour:"2-digit",
    minute:"2-digit"
  });
}

/* ================= SUN & MOON ENGINE ================= */

function getSunMoonTime(date){
  const sun = SunCalc.getTimes(date, LATITUDE, LONGITUDE);
  const moon = SunCalc.getMoonTimes(date, LATITUDE, LONGITUDE);

  return {
    sunrise: fmt(sun.sunrise),
    sunset: fmt(sun.sunset),
    moonrise: moon.rise ? fmt(moon.rise) : "—",
    moonset: moon.set ? fmt(moon.set) : "—"
  };
}

/* ================= TODAY BOX ================= */

function updateTodayInfo(){
  const t = new Date();
  const b = getBangla(t);

  document.getElementById("todayDate").innerText =
    t.toLocaleDateString("en-IN",{
      weekday:"long",
      day:"numeric",
      month:"long",
      year:"numeric"
    });
    
    
if(b){
  document.getElementById("banglaYear").innerText =
    `বাংলা সাল: ${b.year}`;
}

  const s = getSunMoonTime(t);
  sunrise.innerText = s.sunrise;
  sunset.innerText = s.sunset;
}