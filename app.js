const CHARACTERS = [
  { id:"susu",     name:"素素", desc:"温婉坚韧，身陷深宫而心向自由。" },
  { id:"haiyan",   name:"海燕", desc:"灵动洒脱，心怀江湖与远方。" },
  { id:"dazhuang", name:"大壮", desc:"憨厚质朴，粗中有细的贴心人。" },
];

const INITIAL = {
  susu:     { hp:3,  favor:70, money:0 },
  haiyan:   { hp:5,  favor:40, money:0 },
  dazhuang: { hp:9,  favor:0,  money:0 },
};

const STORE_KEY = "zqys_save_v1";
const UNLOCK_KEY = "zqys_unlock_v1";
const AUCTION = [
  {name:"琉璃盏", price:3000,  rank:"SSS"},
  {name:"夜明珠", price:5000,  rank:"SSS"},
  {name:"金丝甲", price:2800,  rank:"SS"},
  {name:"紫玉簪", price:2200,  rank:"SS"},
  {name:"雪莲膏", price:1800,  rank:"S"},
  {name:"龙泉剑", price:1600,  rank:"S"},
  {name:"沉香扇", price:1200,  rank:"S"},
  {name:"翡翠镯", price:1000,  rank:"A"},
  {name:"云锦缎", price:900,   rank:"A"},
  {name:"青瓷瓶", price:700,   rank:"A"},
  {name:"檀木盒", price:600,   rank:"B"},
  {name:"桃花酿", price:400,   rank:"B"},
  {name:"信鸽",   price:350,   rank:"B"},
  {name:"密信",   price:200,   rank:"B"},
  {name:"银票",   price:150,   rank:"B"},
  {name:"药囊",   price:120,   rank:"B"},
  {name:"香囊",   price:80,    rank:"B"},
  {name:"胭脂",   price:50,    rank:"B"},
];

let state, current = 0;

function loadState() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch(e){}
  state = {};
  CHARACTERS.forEach(c => {
    const init = INITIAL[c.id];
    state[c.id] = saved && saved[c.id] ? Object.assign({}, init, saved[c.id]) : Object.assign({}, init);
  });
  if (!state._auction) state._auction = AUCTION.map(()=>"");
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function fmtMoney(n){ return Number(n).toLocaleString("zh-CN"); }

function render() {
  const c = CHARACTERS[current];
  const s = state[c.id];
  document.getElementById("charName").textContent = c.name;
  document.getElementById("charDesc").textContent = c.desc;

  document.getElementById("hpValue").textContent = s.hp;
  document.getElementById("favorValue").textContent = s.favor;
  document.getElementById("moneyValue").textContent = fmtMoney(s.money);

  const titleEl = document.getElementById("charTitle");
  const title = getTitle(s.favor);
  if (title) { titleEl.textContent = title; titleEl.style.display = "inline-block"; }
  else { titleEl.textContent = ""; titleEl.style.display = "none"; }

  const img = document.getElementById("portrait");
  const key = getPortraitKey(s.favor);
  const newSrc = PORTRAITS[c.id][key];
  if (img.getAttribute("src") !== newSrc) {
    img.style.opacity = "0";
    setTimeout(function(){ img.src = newSrc; img.style.opacity = "1"; }, 60);
  }

  const dots = document.getElementById("dots");
  dots.innerHTML = CHARACTERS.map(function(_,i){ return '<span class="dot '+(i===current?"active":"")+'"></span>'; }).join("");
}

function adjust(stat, delta) {
  const c = CHARACTERS[current].id;
  state[c][stat] = (state[c][stat] || 0) + delta;
  if (stat === "hp" && state[c].hp < 0) state[c].hp = 0;
  saveState(); render();
}

function promptEdit(stat) {
  const c = CHARACTERS[current].id;
  const v = prompt("请输入数值：", state[c][stat]);
  if (v === null) return;
  const n = parseInt(v, 10);
  if (!isNaN(n)) { state[c][stat] = n; if (stat==="hp"&&n<0) state[c].hp=0; saveState(); render(); }
}

function switchChar(i) {
  current = (i + CHARACTERS.length) % CHARACTERS.length;
  render();
}

function openAuction() {
  if (localStorage.getItem(UNLOCK_KEY) === "1") { showAuction(); return; }
  document.getElementById("pwdModal").classList.add("show");
  document.getElementById("pwdInput").value = "";
  document.getElementById("pwdHint").textContent = "";
}

function tryUnlock() {
  const v = document.getElementById("pwdInput").value;
  if (v === "123") {
    localStorage.setItem(UNLOCK_KEY, "1");
    document.getElementById("pwdModal").classList.remove("show");
    showAuction();
  } else {
    const hint = document.getElementById("pwdHint");
    hint.textContent = "密码错误，请重试";
    const box = document.querySelector(".modal-box.small");
    box.classList.add("shake");
    setTimeout(function(){ box.classList.remove("shake"); }, 400);
  }
}

function showAuction() {
  const modal = document.getElementById("auctionModal");
  const grid = document.getElementById("auctionGrid");
  grid.innerHTML = AUCTION.map(function(a,i){
    const st = state._auction[i] || "";
    return '<div class="auction-item '+(st==="on"?"on":"")+(st==="used"?" used":"")+'" data-i="'+i+'">'+
      '<div class="it-name">'+a.name+'</div>'+
      '<div class="it-price">'+fmtMoney(a.price)+'两</div>'+
      '<div class="it-rank rank-'+a.rank+'">'+a.rank+'</div>'+
    '</div>';
  }).join("");
  modal.classList.add("show");
  grid.querySelectorAll(".auction-item").forEach(function(el){
    el.onclick = function() {
      const i = +el.dataset.i;
      state._auction[i] = state._auction[i] === "on" ? "" : "on";
      saveState(); showAuction();
    };
    el.oncontextmenu = function(e) {
      e.preventDefault();
      const i = +el.dataset.i;
      state._auction[i] = state._auction[i] === "used" ? "" : "used";
      saveState(); showAuction();
    };
  });
}

function bindEvents() {
  document.getElementById("prevBtn").onclick = function() { switchChar(current-1); };
  document.getElementById("nextBtn").onclick = function() { switchChar(current+1); };
  document.getElementById("dots").onclick = function(e) {
    if (e.target.classList.contains("dot")) {
      const children = document.getElementById("dots").children;
      for (let i=0;i<children.length;i++){ if (children[i]===e.target){ switchChar(i); break; } }
    }
  };
  document.querySelectorAll(".stat-btns button").forEach(function(b){
    b.onclick = function() { adjust(b.dataset.stat, parseInt(b.dataset.d,10)); };
  });
  document.getElementById("hpValue").onclick = function(){ promptEdit("hp"); };
  document.getElementById("favorValue").onclick = function(){ promptEdit("favor"); };
  document.getElementById("moneyValue").onclick = function(){ promptEdit("money"); };

  document.getElementById("auctionBtn").onclick = openAuction;
  document.getElementById("closeAuction").onclick = function(){ document.getElementById("auctionModal").classList.remove("show"); };
  document.getElementById("pwdSubmit").onclick = tryUnlock;
  document.getElementById("pwdInput").onkeydown = function(e){ if(e.key==="Enter") tryUnlock(); };

  document.getElementById("lightAll").onclick = function(){ state._auction=AUCTION.map(function(){return "on";}); saveState(); showAuction(); };
  document.getElementById("dimAll").onclick = function(){ state._auction=AUCTION.map(function(){return "";}); saveState(); showAuction(); };
  document.getElementById("clearUsed").onclick = function(){ state._auction=AUCTION.map(function(){return "";}); saveState(); showAuction(); };

  document.getElementById("resetBtn").onclick = function() {
    if (confirm("确定重置全部数据？此操作不可撤销。")) {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(UNLOCK_KEY);
      location.reload();
    }
  };

  document.addEventListener("keydown", function(e){
    if (e.key==="ArrowLeft") switchChar(current-1);
    if (e.key==="ArrowRight") switchChar(current+1);
  });
}

function init() {
  loadState();
  bindEvents();
  render();
  const c = CHARACTERS[current].id;
  document.getElementById("portrait").src = PORTRAITS[c.id][getPortraitKey(state[c.id].favor)];
}

init();
