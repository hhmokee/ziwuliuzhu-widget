// 142530取穴法（一、四、二、五、三、〇反克取穴法）
// 版本: v2 — 修正逻辑流：142530 作为纳甲法最后一步补穴（第5步）
// 生成时间: 20260723_1953
//
// 纳甲法5步流程：
//   1. 天干配脏腑，阳进阴退
//   2. 阳日开阳经井穴，按五输穴次序开阳时（返本还原 + 气纳三焦）
//   3. 阴日开阴经井穴，按五输穴次序开阴时（返本还原 + 血归包络）
//   4. 合日互用 + 阳经阳时补穴 / 阴经阴时补穴
//   5. 一、四、二、五、三、〇反克取穴法（最后兜底）
// ============================================================

// ============================================================
// 第一步：天干配脏腑（判断阴阳日）
// ============================================================
const dayGanYinYangMap = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

const zhiYinYangMap = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

const dayGanMeridianMap = {
  '甲': '胆经', '乙': '肝经', '丙': '小肠经', '丁': '心经',
  '戊': '胃经', '己': '脾经', '庚': '大肠经', '辛': '肺经',
  '壬': '膀胱经', '癸': '肾经'
};

// 合日互用（甲己合土、乙庚合金、丙辛合水、丁壬合木、戊癸合火）
const combinedDayGanMap = {
  '甲': '己', '乙': '庚', '丙': '辛', '丁': '壬', '戊': '癸',
  '己': '甲', '庚': '乙', '辛': '丙', '壬': '丁', '癸': '戊'
};

const ganOrder = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const zhiOrder = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// ============================================================
// 第二步 + 第三步：纳甲法主表（阳日阳经 + 阴日阴经）
// ============================================================
const acupointMantraMap = {
  '甲': {
    '戌': { acupoint: '足窍阴', type: '井', meridian: '胆经' },
    '子': { acupoint: '前谷',   type: '荥', meridian: '小肠经' },
    '寅': { acupoint: '陷谷',   type: '输', meridian: '胃经' },
    '辰': { acupoint: '阳溪',   type: '经', meridian: '大肠经' },
    '午': { acupoint: '委中',   type: '合', meridian: '膀胱经' },
    '申': { acupoint: '液门',   type: '荥', meridian: '三焦经' }
  },
  '乙': {
    '酉': { acupoint: '大敦',   type: '井', meridian: '肝经' },
    '亥': { acupoint: '少府',   type: '荥', meridian: '心经' },
    '丑': { acupoint: '太白',   type: '输', meridian: '脾经' },
    '卯': { acupoint: '经渠',   type: '经', meridian: '肺经' },
    '巳': { acupoint: '阴谷',   type: '合', meridian: '肾经' },
    '未': { acupoint: '劳宫',   type: '荥', meridian: '心包经' }
  },
  '丙': {
    '申': { acupoint: '少泽',   type: '井', meridian: '小肠经' },
    '戌': { acupoint: '内庭',   type: '荥', meridian: '胃经' },
    '子': { acupoint: '三间',   type: '输', meridian: '大肠经' },
    '寅': { acupoint: '昆仑',   type: '经', meridian: '膀胱经' },
    '辰': { acupoint: '阳陵泉', type: '合', meridian: '胆经' },
    '午': { acupoint: '中渚',   type: '输', meridian: '三焦经' }
  },
  '丁': {
    '未': { acupoint: '少冲',   type: '井', meridian: '心经' },
    '酉': { acupoint: '大都',   type: '荥', meridian: '脾经' },
    '亥': { acupoint: '太渊',   type: '输', meridian: '肺经' },
    '丑': { acupoint: '复溜',   type: '经', meridian: '肾经' },
    '卯': { acupoint: '曲泉',   type: '合', meridian: '肝经' },
    '巳': { acupoint: '大陵',   type: '输', meridian: '心包经' }
  },
  '戊': {
    '午': { acupoint: '厉兑',   type: '井', meridian: '胃经' },
    '申': { acupoint: '二间',   type: '荥', meridian: '大肠经' },
    '戌': { acupoint: '束骨',   type: '输', meridian: '膀胱经' },
    '子': { acupoint: '阳辅',   type: '经', meridian: '胆经' },
    '寅': { acupoint: '小海',   type: '合', meridian: '小肠经' },
    '辰': { acupoint: '支沟',   type: '经', meridian: '三焦经' }
  },
  '己': {
    '巳': { acupoint: '隐白',   type: '井', meridian: '脾经' },
    '未': { acupoint: '鱼际',   type: '荥', meridian: '肺经' },
    '酉': { acupoint: '太溪',   type: '输', meridian: '肾经' },
    '亥': { acupoint: '中封',   type: '经', meridian: '肝经' },
    '丑': { acupoint: '少海',   type: '合', meridian: '心经' },
    '卯': { acupoint: '间使',   type: '经', meridian: '心包经' }
  },
  '庚': {
    '辰': { acupoint: '商阳',   type: '井', meridian: '大肠经' },
    '午': { acupoint: '通谷',   type: '荥', meridian: '膀胱经' },
    '申': { acupoint: '临泣',   type: '输', meridian: '胆经' },
    '戌': { acupoint: '合谷',   type: '原', meridian: '大肠经' },
    '子': { acupoint: '足三里', type: '合', meridian: '胃经' },
    '寅': { acupoint: '天井',   type: '合', meridian: '三焦经' }
  },
  '辛': {
    '卯': { acupoint: '少商',   type: '井', meridian: '肺经' },
    '巳': { acupoint: '然谷',   type: '荥', meridian: '肾经' },
    '未': { acupoint: '太冲',   type: '输', meridian: '肝经' },
    '酉': { acupoint: '灵道',   type: '经', meridian: '心经' },
    '亥': { acupoint: '阴陵泉', type: '合', meridian: '脾经' },
    '丑': { acupoint: '曲泽',   type: '合', meridian: '心包经' }
  },
  '壬': {
    '寅': { acupoint: '至阴',   type: '井', meridian: '膀胱经' },
    '辰': { acupoint: '侠溪',   type: '荥', meridian: '胆经' },
    '午': { acupoint: '后溪',   type: '输', meridian: '小肠经' },
    '申': { acupoint: '解溪',   type: '经', meridian: '胃经' },
    '戌': { acupoint: '曲池',   type: '合', meridian: '大肠经' },
    '子': { acupoint: '关冲',   type: '井', meridian: '三焦经' }
  },
  '癸': {
    '亥': { acupoint: '涌泉',   type: '井', meridian: '肾经' },
    '丑': { acupoint: '行间',   type: '荥', meridian: '肝经' },
    '卯': { acupoint: '神门',   type: '输', meridian: '心经' },
    '巳': { acupoint: '商丘',   type: '经', meridian: '脾经' },
    '未': { acupoint: '尺泽',   type: '合', meridian: '肺经' },
    '酉': { acupoint: '中冲',   type: '井', meridian: '心包经' }
  }
};

// 值日经原穴
const meridianYuanPointMap = {
  '胆经': '丘墟', '肝经': '太冲', '小肠经': '腕骨', '心经': '神门',
  '胃经': '冲阳', '脾经': '太白', '大肠经': '合谷', '肺经': '太渊',
  '膀胱经': '京骨', '肾经': '太溪', '心包经': '大陵', '三焦经': '阳池'
};

// 十二经阴阳
const yangMeridians = ['胆经','小肠经','胃经','大肠经','膀胱经','三焦经'];
const yinMeridians  = ['肝经','心经','脾经','肺经','肾经','心包经'];

// 五输穴全集
const meridianShuPointMap = {
  '胆经':    { '阳': { '井':'足窍阴','荥':'侠溪','输':'足临泣','经':'阳辅','合':'阳陵泉' } },
  '肝经':    { '阴': { '井':'大敦','荥':'行间','输':'太冲','经':'中封','合':'曲泉' } },
  '小肠经':  { '阳': { '井':'少泽','荥':'前谷','输':'后溪','经':'阳谷','合':'小海' } },
  '心经':    { '阴': { '井':'少冲','荥':'少府','输':'神门','经':'灵道','合':'少海' } },
  '胃经':    { '阳': { '井':'厉兑','荥':'内庭','输':'陷谷','经':'解溪','合':'足三里' } },
  '脾经':    { '阴': { '井':'隐白','荥':'大都','输':'太白','经':'商丘','合':'阴陵泉' } },
  '大肠经':  { '阳': { '井':'商阳','荥':'二间','输':'三间','经':'阳溪','合':'曲池' } },
  '肺经':    { '阴': { '井':'少商','荥':'鱼际','输':'太渊','经':'经渠','合':'尺泽' } },
  '膀胱经':  { '阳': { '井':'至阴','荥':'通谷','输':'束骨','经':'昆仑','合':'委中' } },
  '肾经':    { '阴': { '井':'涌泉','荥':'然谷','输':'太溪','经':'复溜','合':'阴谷' } },
  '心包经':  { '阴': { '井':'中冲','荥':'劳宫','输':'大陵','经':'间使','合':'曲泽' } },
  '三焦经':  { '阳': { '井':'关冲','荥':'液门','输':'中渚','经':'支沟','合':'天井' } }
};

// ============================================================
// 第四步：合日互用 + 阳经阳时补穴 / 阴经阴时补穴
// ============================================================
const buXueYang = { '子':'井', '寅':'荥', '辰':'输', '午':'经', '申':'合', '戌':'纳' };
const buXueYin  = { '丑':'井', '卯':'荥', '巳':'输', '未':'经', '酉':'合', '亥':'纳' };

function getStep4BuXue(dayGanStr, shiZhiStr) {
  const dayYinYang = dayGanYinYangMap[dayGanStr];
  const meridian = dayGanMeridianMap[dayGanStr];
  if (!meridian) return null;

  const pointType = (dayYinYang === '阳') ? buXueYang[shiZhiStr] : buXueYin[shiZhiStr];
  if (!pointType) return null;

  const merYinYang = yangMeridians.includes(meridian) ? '阳' : '阴';
  const acupoint = meridianShuPointMap[meridian]?.[merYinYang]?.[pointType];
  if (acupoint && acupoint !== '不适用' && acupoint !== '穴位未收录') {
    return { acupoint: acupoint, type: pointType, meridian: meridian, source: '合日补穴' };
  }
  return null;
}

// ============================================================
// 第五步：一、四、二、五、三、〇反克取穴法（完整 60 条）
// ============================================================
const fanKeTable = {
  甲: [
    { day:'甲', timeZhi:'戌', acupoint:'窍阴',   type:'井' },
    { day:'己', timeZhi:'子', acupoint:'阳辅',   type:'经' },
    { day:'戊', timeZhi:'寅', acupoint:'侠溪',   type:'荥' },
    { day:'丁', timeZhi:'辰', acupoint:'阳陵泉', type:'合' },
    { day:'丙', timeZhi:'午', acupoint:'临泣',   type:'输' },
    { day:'乙', timeZhi:'申', acupoint:'液门',   type:'纳' }
  ],
  乙: [
    { day:'乙', timeZhi:'酉', acupoint:'大敦',   type:'井' },
    { day:'己', timeZhi:'亥', acupoint:'中封',   type:'经' },
    { day:'己', timeZhi:'丑', acupoint:'行间',   type:'荥' },
    { day:'戊', timeZhi:'卯', acupoint:'曲泉',   type:'合' },
    { day:'丁', timeZhi:'巳', acupoint:'太冲',   type:'输' },
    { day:'丙', timeZhi:'未', acupoint:'劳宫',   type:'纳' }
  ],
  丙: [
    { day:'丙', timeZhi:'申', acupoint:'少泽',   type:'井' },
    { day:'庚', timeZhi:'戌', acupoint:'阳谷',   type:'经' },
    { day:'庚', timeZhi:'子', acupoint:'前谷',   type:'荥' },
    { day:'己', timeZhi:'寅', acupoint:'小海',   type:'合' },
    { day:'戊', timeZhi:'辰', acupoint:'后溪',   type:'输' },
    { day:'丁', timeZhi:'午', acupoint:'中渚',   type:'纳' }
  ],
  丁: [
    { day:'丁', timeZhi:'未', acupoint:'少冲',   type:'井' },
    { day:'辛', timeZhi:'酉', acupoint:'灵道',   type:'经' },
    { day:'庚', timeZhi:'亥', acupoint:'少府',   type:'荥' },
    { day:'庚', timeZhi:'丑', acupoint:'少海',   type:'合' },
    { day:'己', timeZhi:'卯', acupoint:'神门',   type:'输' },
    { day:'戊', timeZhi:'巳', acupoint:'大陵',   type:'纳' }
  ],
  戊: [
    { day:'戊', timeZhi:'午', acupoint:'厉兑',   type:'井' },
    { day:'壬', timeZhi:'申', acupoint:'解溪',   type:'经' },
    { day:'辛', timeZhi:'戌', acupoint:'内庭',   type:'荥' },
    { day:'辛', timeZhi:'子', acupoint:'足三里', type:'合' },
    { day:'庚', timeZhi:'寅', acupoint:'陷谷',   type:'输' },
    { day:'己', timeZhi:'辰', acupoint:'支沟',   type:'纳' }
  ],
  己: [
    { day:'己', timeZhi:'巳', acupoint:'隐白',   type:'井' },
    { day:'癸', timeZhi:'未', acupoint:'商丘',   type:'经' },
    { day:'壬', timeZhi:'酉', acupoint:'大都',   type:'荥' },
    { day:'辛', timeZhi:'亥', acupoint:'阴陵泉', type:'合' },
    { day:'辛', timeZhi:'丑', acupoint:'太白',   type:'输' },
    { day:'庚', timeZhi:'卯', acupoint:'间使',   type:'纳' }
  ],
  庚: [
    { day:'庚', timeZhi:'辰', acupoint:'商阳',   type:'井' },
    { day:'甲', timeZhi:'午', acupoint:'阳溪',   type:'经' },
    { day:'癸', timeZhi:'申', acupoint:'二间',   type:'荥' },
    { day:'壬', timeZhi:'戌', acupoint:'曲池',   type:'合' },
    { day:'壬', timeZhi:'子', acupoint:'三间',   type:'输' },
    { day:'辛', timeZhi:'寅', acupoint:'天井',   type:'纳' }
  ],
  辛: [
    { day:'辛', timeZhi:'卯', acupoint:'少商',   type:'井' },
    { day:'乙', timeZhi:'巳', acupoint:'经渠',   type:'经' },
    { day:'甲', timeZhi:'未', acupoint:'鱼际',   type:'荥' },
    { day:'癸', timeZhi:'酉', acupoint:'尺泽',   type:'合' },
    { day:'壬', timeZhi:'亥', acupoint:'太渊',   type:'输' },
    { day:'壬', timeZhi:'丑', acupoint:'曲泽',   type:'纳' }
  ],
  壬: [
    { day:'壬', timeZhi:'寅', acupoint:'至阴',   type:'井' },
    { day:'丙', timeZhi:'辰', acupoint:'昆仑',   type:'经' },
    { day:'乙', timeZhi:'午', acupoint:'通谷',   type:'荥' },
    { day:'甲', timeZhi:'申', acupoint:'委中',   type:'合' },
    { day:'癸', timeZhi:'戌', acupoint:'束骨',   type:'输' },
    { day:'癸', timeZhi:'子', acupoint:'关冲',   type:'纳' }
  ],
  癸: [
    { day:'癸', timeZhi:'亥', acupoint:'涌泉',   type:'井' },
    { day:'戊', timeZhi:'丑', acupoint:'复溜',   type:'经' },
    { day:'丁', timeZhi:'卯', acupoint:'然谷',   type:'荥' },
    { day:'丙', timeZhi:'巳', acupoint:'阴谷',   type:'合' },
    { day:'乙', timeZhi:'未', acupoint:'太溪',   type:'输' },
    { day:'甲', timeZhi:'酉', acupoint:'中冲',   type:'纳' }
  ]
};

// 时干推算口诀: 甲己起甲子，乙庚起丙子，丙辛起戊子，丁壬起庚子，戊癸起壬子
const ziGanMap = {
  '甲':'甲', '己':'甲', '乙':'丙', '庚':'丙',
  '丙':'戊', '辛':'戊', '丁':'庚', '壬':'庚',
  '戊':'壬', '癸':'壬'
};

function calculateShiGan(dayGan, shiZhi) {
  const ziGan = ziGanMap[dayGan];
  const ziIdx = ganOrder.indexOf(ziGan);
  const zhiIdx = zhiOrder.indexOf(shiZhi);
  return ganOrder[(ziIdx + zhiIdx) % 10];
}

  const table = fanKeTable[shiGan];
  if (!table) return null;
  return table.find(e => e.day === dayGan && e.timeZhi === shiZhi) || null;
}

// ============================================================
// 统一查找函数（5步流程完整实现）
// ============================================================
function getAcupoint142530(dayGan, shiZhi) {
  const dayGanStr = dayGan.gan;
  const shiZhiStr = shiZhi.zhi;

  // 第1-3步：纳甲法主表（阳进阴退 + 阳日阳经 / 阴日阴经）
  let result = acupointMantraMap[dayGanStr]?.[shiZhiStr];
  if (result) {
    return `⚡ ${result.meridian}${result.type}穴: ${result.acupoint}`;
  }

  // 第4步前半：合日互用（夫妻互用）
  const combinedGan = combinedDayGanMap[dayGanStr];
  result = acupointMantraMap[combinedGan]?.[shiZhiStr];
  if (result) {
    return `⚡ ${result.meridian}${result.type}穴: ${result.acupoint} (夫妻互用)`;
  }

  // 第4步后半：阳经阳时补穴 / 阴经阴时补穴
  result = getStep4BuXue(dayGanStr, shiZhiStr);
  if (result) {
    return `⚡ ${result.meridian}${result.type}穴: ${result.acupoint} (合日补穴)`;
  }

  // 第5步：一、四、二、五、三、〇反克取穴法（最后兜底）
  const shiGan = calculateShiGan(dayGanStr, shiZhiStr);
  const entry = lookup142530(dayGanStr, shiGan, shiZhiStr);
  if (entry) {
    return `⚡ ${entry.acupoint} (反克取穴·${entry.type})`;
  }

  return '无开穴 (已穷尽所有补穴规则)';
}

// ============================================================
// 独立查表函数（供外部调用）

function lookup142530(dayGan, shiGan, shiZhi) {
  const table = fanKeTable[shiGan];
  if (!table) return null;
  return table.find(e => e.day === dayGan && e.timeZhi === shiZhi) || null;
}

// ============================================================
// 测试用例
// ============================================================
// console.log(getAcupoint142530({gan:'甲'}, {zhi:'戌'}));  // 纳甲法主表 → 窍阴
// console.log(getAcupoint142530({gan:'甲'}, {zhi:'丑'}));  // 夫妻互用 → 少海
// console.log(getAcupoint142530({gan:'甲'}, {zhi:'卯'}));  // 合日补穴 → 间使(脾经经穴)
// console.log(getAcupoint142530({gan:'癸'}, {zhi:'子'}));  // 反克取穴 → 关冲(纳)

// ============================================================
// 导出
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fanKeTable, lookup142530, getAcupoint142530, getStep4BuXue,
    calculateShiGan, acupointMantraMap, combinedDayGanMap
  };
}

