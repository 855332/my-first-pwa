// ===== 立绘路径配置（图片都在根目录，同名替换即可）=====
const PORTRAITS = {
  susu: {
    lengong:    "./susu_lengong.png",
    pingmin:    "./susu_pingmin.png",
    pin:        "./susu_pin.png",
    fei:        "./susu_fei.png",
    guifei:     "./susu_guifei.png",
    huangguifei:"./susu_huangguifei.png",
  },
  haiyan: {
    lengong:    "./haiyan_lengong.png",
    pingmin:    "./haiyan_pingmin.png",
    pin:        "./haiyan_pin.png",
    fei:        "./haiyan_fei.png",
    guifei:     "./haiyan_guifei.png",
    huangguifei:"./haiyan_huangguifei.png",
  },
  dazhuang: {
    lengong:    "./dazhuang_lengong.png",
    pingmin:    "./dazhuang_pingmin.png",
    pin:        "./dazhuang_pin.png",
    fei:        "./dazhuang_fei.png",
    guifei:     "./dazhuang_guifei.png",
    huangguifei:"./dazhuang_huangguifei.png",
  },
};

// 根据好感度返回对应立绘 key
function getPortraitKey(favor) {
  if (favor <= -20) return "lengong";      // 冷宫
  if (favor >= 100) return "huangguifei";  // 皇贵妃
  if (favor >= 80)  return "guifei";       // 贵妃
  if (favor >= 60)  return "fei";          // 妃
  if (favor >= 40)  return "pin";          // 嫔
  if (favor >= 20)  return "pingmin";      // 贵人（复用平民图）
  return "pingmin";                         // -19~19 无封号，显示平民
}

// 封号文字
function getTitle(favor) {
  if (favor <= -20) return "冷宫";
  if (favor >= 100) return "皇贵妃";
  if (favor >= 80)  return "贵妃";
  if (favor >= 60)  return "妃";
  if (favor >= 40)  return "嫔";
  if (favor >= 20)  return "贵人";
  return "";
}
