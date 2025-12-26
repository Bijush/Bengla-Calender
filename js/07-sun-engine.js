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

  const todayEl = document.getElementById("todayDate");
  const banglaEl = document.getElementById("banglaYear");
  const sunriseEl = document.getElementById("sunrise");
  const sunsetEl = document.getElementById("sunset");

  if(!todayEl) return;

  // 🔹 English date
  todayEl.innerText =
    t.toLocaleDateString("en-IN",{
      weekday:"long",
      day:"numeric",
      month:"long",
      year:"numeric"
    });

  // 🔹 Bangla date (দিন + মাস + সাল)
  if(b && banglaEl){
    banglaEl.innerText = `বাংলা: ${b.day} ${b.month} ${b.year}`;
  }

  // 🔹 Sunrise / Sunset
  const s = getSunMoonTime(t);
  if(sunriseEl) sunriseEl.innerText = s.sunrise;
  if(sunsetEl)  sunsetEl.innerText  = s.sunset;
}
// 🔒 FORCE HEADER LOAD (GUARANTEE)
try{
  updateTodayInfo();
}catch(e){
  console.error("Header load error:", e);
}