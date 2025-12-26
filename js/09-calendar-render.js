/* ================= GLOBAL ================= */

//let cur = new Date();

/* ================= HELPERS ================= */

function iso(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

/* ================= RENDER ================= */

function render(){

  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = cur.getFullYear();
  const month = cur.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  /* ===== Empty Cells ===== */
  for(let i = 0; i < firstDay; i++){
    calendar.appendChild(document.createElement("div"));
  }

  /* ===== Render Days ===== */
  for(let d = 1; d <= totalDays; d++){

    const date = new Date(year, month, d);
    const b = getBangla(date);
    if(!b) continue;

    const div = document.createElement("div");
    div.className = "day";

    const wd = date.getDay();
    if(wd === 0) div.classList.add("sun");
    if(wd === 6) div.classList.add("sat");

    if(b.day === 15) div.classList.add("purnima");
    if(b.day >= 29) div.classList.add("amavasya");

    if(
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ){
      div.classList.add("today");
    }

    div.innerHTML = `
  <strong>${d}</strong>

  <!-- English Month -->
  <small class="engMonth">${MONTHS[date.getMonth()]}</small>

  <!-- Bangla Day + Month -->
  <small class="banMonth">${b.day} ${b.month}</small>

  ${b.day === 15 ? `<span class="moonIcon">🌕</span>` : ""}
  ${b.day >= 29 ? `<span class="moonIcon">🌑</span>` : ""}

  ${FESTIVALS[iso(date)]
    ? `<div class="festText">${FESTIVALS[iso(date)]}</div>`
    : ""
  }
`;

    div.addEventListener("click", () => openPopup(date, b));
    calendar.appendChild(div);
  }

  /* ===== Scroll to Today ===== */
  setTimeout(() => {
    const t = document.querySelector(".day.today");
    if(t) t.scrollIntoView({ block:"center" });
  }, 60);

  /* ===== Sync English Select ===== */
  const ySel = document.getElementById("yearSelect");
  const mSel = document.getElementById("monthSelect");

  if(ySel) ySel.value = year;
  if(mSel) mSel.value = month;

  /* ===== Bangla Month Sync ===== */
  const bmSel = document.getElementById("banglaMonthSelect");
  if(bmSel){

    let refDate;

    if(
      year === today.getFullYear() &&
      month === today.getMonth()
    ){
      refDate = today;
    }else{
      refDate = new Date(year, month, 15);
    }

    const bRef = getBangla(refDate);
    if(bRef){
      const idx = BANGLA_MONTHS.indexOf(bRef.month);
      if(idx >= 0) bmSel.value = idx;
    }
  }

  /* 🔥 VERY IMPORTANT */
  renderFestivalList();
}

/* ================= MONTH FESTIVAL LIST ================= */

function renderFestivalList(){

  const fBox = document.getElementById("festivalList");
  if(!fBox) return;

  fBox.innerHTML = "";

  const y = cur.getFullYear();
  const m = cur.getMonth();

  const items = Object.keys(FESTIVALS)
    .filter(d=>{
      const dt = new Date(d);
      return dt.getFullYear() === y && dt.getMonth() === m;
    });

  if(items.length){
    fBox.innerHTML = `<h4>📌 এই মাসের উৎসব</h4>`;
    items.forEach(d=>{
      const dd = d.split("-")[2];
      fBox.innerHTML += `<div>• ${dd} – ${FESTIVALS[d]}</div>`;
    });
  }else{
    fBox.innerHTML = `<div style="opacity:.6">এই মাসে কোনো উৎসব নেই</div>`;
  }
}

/* ================= POPUP ================= */

const popup = document.getElementById("popup");

function openPopup(date, b){

  if(!popup) return;

  const sm = getSunMoonTime(date);

  document.getElementById("p-title").innerText =
    date.toDateString();

  document.getElementById("p-eng").innerText =
    `English: ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

  document.getElementById("p-ban").innerText =
    `বাংলা: ${b.day} ${b.month} ${b.year}`;

  document.getElementById("p-tithi").innerText =
    "তিথি: " +
    (b.day === 15 ? "পূর্ণিমা" :
     b.day >= 29 ? "অমাবস্যা" : "—");

  document.getElementById("p-sun").innerText =
    `🌅 Sunrise: ${sm.sunrise}   🌇 Sunset: ${sm.sunset}
🌙 Moonrise: ${sm.moonrise}   🌑 Moonset: ${sm.moonset}`;

  document.getElementById("p-fest").innerText =
    FESTIVALS[iso(date)]
      ? "উৎসব: " + FESTIVALS[iso(date)]
      : "";

  popup.style.display = "flex";
}

function closePopup(){
  if(popup) popup.style.display = "none";
}

/* ================= POPUP SWIPE CLOSE ================= */

let popStartY = 0;
let popCurrentY = 0;

if(popup){
  popup.addEventListener("touchstart", e=>{
    popStartY = e.touches[0].clientY;
  },{passive:true});

  popup.addEventListener("touchmove", e=>{
    popCurrentY = e.touches[0].clientY;
  },{passive:true});

  popup.addEventListener("touchend", ()=>{
    if(popCurrentY - popStartY > 80){
      closePopup();
    }
    popStartY = popCurrentY = 0;
  });
  
  
}
