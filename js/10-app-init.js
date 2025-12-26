document.addEventListener("DOMContentLoaded", () => {
  setupYearDropdown();
  setupMonthDropdown();
  setupBanglaMonthDropdown();
  render();
updateTodayInfo();
renderFestivalList(); // 🔥 FORCE CALL
});

/* ================= STABLE SWIPE MONTH CHANGE ================= */

let startX = 0;
let startY = 0;
let isSwiping = false;

const calendar = document.getElementById("calendar");

if (calendar) {

  calendar.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    isSwiping = true;
  }, { passive: true });

  calendar.addEventListener("touchmove", e => {
    if (!isSwiping) return;

    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    /* 🔒 vertical scroll protection */
    if (Math.abs(dy) > Math.abs(dx)) {
      isSwiping = false;
    }
  }, { passive: true });
  /*

  calendar.addEventListener("touchend", e => {
    if (!isSwiping) return;
    isSwiping = false;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    /* ❌ ignore small swipe */
    /*
    if (Math.abs(dx) < 60) return;

    /* ❌ ignore diagonal swipe */
    /*
    if (Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) {
      // 👉 swipe left → next month
      cur.setMonth(cur.getMonth() + 1);
    } else {
      // 👉 swipe right → previous month
      cur.setMonth(cur.getMonth() - 1);
    }

    render();
  });
  */
  
  const lbl = document.getElementById("curLabel");
const prev = document.getElementById("prevM");
const next = document.getElementById("nextM");

function updateLabel(){
  lbl.innerText = `${MONTHS[cur.getMonth()]} ${cur.getFullYear()}`;
}

prev.onclick = ()=>{
  cur.setMonth(cur.getMonth()-1);
  render();
  updateLabel();
};

next.onclick = ()=>{
  cur.setMonth(cur.getMonth()+1);
  render();
  updateLabel();
};

updateLabel();
  
  
  
  const jumpBtn = document.getElementById("jumpToday");

if(jumpBtn){
  jumpBtn.onclick = () => {
    cur = new Date();
    render();
    updateTodayInfo();
  };
}
}