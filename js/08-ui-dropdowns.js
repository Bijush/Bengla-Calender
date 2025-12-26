function setupYearDropdown(){
  const sel = document.getElementById("yearSelect");
  sel.innerHTML = "";

  for(let y = MIN_YEAR; y <= MAX_YEAR; y++){
    sel.add(new Option(y, y));
  }

  // ✅ CURRENT YEAR SELECT
  sel.value = cur.getFullYear();

  sel.onchange = () => {
    cur.setFullYear(+sel.value);
    render();
  };
}

function setupMonthDropdown(){
  const sel = document.getElementById("monthSelect");
  sel.innerHTML = "";

  MONTHS.forEach((m, i) => {
    sel.add(new Option(m, i));
  });

  // ✅ CURRENT MONTH SELECT
  sel.value = cur.getMonth();

  sel.onchange = () => {
    cur.setMonth(+sel.value);
    render();
  };
}
/*
function setupBanglaMonthDropdown(){
  const sel = document.getElementById("banglaMonthSelect");
  sel.innerHTML = "";

  BANGLA_MONTHS.forEach((m, i) => {
    sel.add(new Option(m, i));
  });
}
*/
function setupBanglaMonthDropdown(){
  const sel = document.getElementById("banglaMonthSelect");
  sel.innerHTML = "";

  BANGLA_MONTHS.forEach((m, i) => {
    sel.add(new Option(m, i));
  });

  sel.disabled = true; // 🔒 display only
}

const locSel = document.getElementById("locationSelect");

if(locSel){
  locSel.addEventListener("change", () => {
    const [lat, lon] = locSel.value.split(",").map(Number);
    setLocation(lat, lon);
    updateTodayInfo();
    render();
  });

  // initial load
  const [lat, lon] = locSel.value.split(",").map(Number);
  setLocation(lat, lon);
}