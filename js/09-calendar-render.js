/* ================= GLOBAL ================= */

// let cur = new Date();

/* ================= HELPERS ================= */

function iso(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function getTithiInfo(date){
  return window.TITHI_DATA?.[iso(date)] || null;
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

    /* ---- Weekday ---- */
    const wd = date.getDay();
    if(wd === 0) div.classList.add("sun");
    if(wd === 6) div.classList.add("sat");

    /* ---- Tithi (JSON FIRST, Bangla fallback) ---- */
    const tithi = getTithiInfo(date);

    if(tithi){
      if(tithi.type === "পূর্ণিমা") div.classList.add("purnima");
      if(tithi.type === "অমাবস্যা") div.classList.add("amavasya");
    }else{
      // fallback visual (approx only)
      if(b.day === 15) div.classList.add("purnima");
      if(b.day >= 29) div.classList.add("amavasya");
    }

    /* ---- Today ---- */
    if(
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ){
      div.classList.add("today");
    }

    /* ---- Cell HTML ---- */
    div.innerHTML = `
      <strong>${d}</strong>

      <small class="engMonth">${MONTHS[date.getMonth()]}</small>
      <small class="banMonth">${b.day} ${b.month}</small>

      ${tithi?.type === "পূর্ণিমা" ? `<span class="moonIcon">🌕</span>` : ""}
      ${tithi?.type === "অমাবস্যা" ? `<span class="moonIcon">🌑</span>` : ""}

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
    const refDate =
      (year === today.getFullYear() && month === today.getMonth())
        ? today
        : new Date(year, month, 15);

    const bRef = getBangla(refDate);
    if(bRef){
      const idx = BANGLA_MONTHS.indexOf(bRef.month);
      if(idx >= 0) bmSel.value = idx;
    }
  }

  renderFestivalList();
}

/* ================= POPUP ================= */

const popup = document.getElementById("popup");

function openPopup(date, b){

  if(!popup) return;

  const sm = getSunMoonTime(date);
  const tithi = getTithiInfo(date);

  document.getElementById("p-title").innerText = date.toDateString();

  document.getElementById("p-eng").innerText =
    `English: ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

  document.getElementById("p-ban").innerText =
    `বাংলা: ${b.day} ${b.month} ${b.year}`;

  if(tithi){
    document.getElementById("p-tithi").innerText =
`🌙 ${tithi.type}
শুরু: ${tithi.start}
শেষ: ${tithi.end}
📜 ${tithi.source}`;
  }else{
    document.getElementById("p-tithi").innerText = "তিথি: —";
  }

  document.getElementById("p-sun").innerText =
`🌅 Sunrise: ${sm.sunrise}   🌇 Sunset: ${sm.sunset}
🌙 Moonrise: ${sm.moonrise}   🌑 Moonset: ${sm.moonset}`;

  document.getElementById("p-fest").innerText =
    FESTIVALS[iso(date)] ? "উৎসব: " + FESTIVALS[iso(date)] : "";

  popup.style.display = "flex";
}

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

    // 🔹 Header: Month + Year
    const monthName = MONTHS[m];
    fBox.innerHTML = `
      <h4>📌 ${monthName} ${y} – এই মাসের উৎসব</h4>
    `;

    // 🔹 Festival list
    items.forEach(d=>{
      const dt = new Date(d);
      const day = dt.getDate();
      const engMonth = MONTHS[dt.getMonth()];

      // Bangla month (optional but nice)
      const b = getBangla(dt);
      const banglaMonth = b ? ` (${b.month})` : "";

      fBox.innerHTML += `
        <div>• ${day} ${engMonth}${banglaMonth} – ${FESTIVALS[d]}</div>
      `;
    });

  }else{
    fBox.innerHTML = `
      <div style="opacity:.6">
        ${MONTHS[m]} ${y} – এই মাসে কোনো উৎসব নেই
      </div>
    `;
  }
}


function closePopup(){
  if(popup) popup.style.display = "none";
}