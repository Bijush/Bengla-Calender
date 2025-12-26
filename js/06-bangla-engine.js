const BANGLA_CACHE = {};

function getBangla(date){
  const key = iso(date);
  if(BANGLA_CACHE[key]) return BANGLA_CACHE[key];

  const y = date.getFullYear();
  const m = date.getMonth();
  const list = (m < 3) ? ASSAM_MONTH_START[y-1] : ASSAM_MONTH_START[y];
  if(!list) return null;

  for(let i=list.length-1;i>=0;i--){
    if(key >= list[i][1]){
      const [yy,mm,dd] = list[i][1].split("-");
      const start = new Date(yy,mm-1,dd);
      const diff = Math.floor((date-start)/86400000);
      const year = date >= new Date(y,3,14) ? y-593 : y-594;

      return BANGLA_CACHE[key] = {
        day: diff+1,
        month: list[i][0],
        year
      };
    }
  }
  return null;
}