// 子午流注纳甲法择时开穴 Widget (最终优化版 - 再次修正返本还原穴及夫妻互用逻辑, 优化显示)

// --- 穴位数据 (定义移动到最前面，解决 ReferenceError) ---
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const acupointMantraMap = { // 子午流注口诀 穴位映射表 (定义提前)
    '甲': {
        '戌': { acupoint: '足窍阴', type: '井', meridian: '胆经' },
        '子': { acupoint: '前谷', type: '荥', meridian: '小肠经' },
        '寅': { acupoint: '陷谷', type: '输', meridian: '胃经' },
        '辰': { acupoint: '阳溪', type: '经', meridian: '大肠经' },
        '午': { acupoint: '委中', type: '合', meridian: '膀胱经' },
        '申': { acupoint: '液门', type: '荥', meridian: '三焦经' },
    },
    '乙': {
        '酉': { acupoint: '大敦', type: '井', meridian: '肝经' },
        '亥': { acupoint: '少府', type: '荥', meridian: '心经' },
        '丑': { acupoint: '太白', type: '输', meridian: '脾经' },
        '卯': { acupoint: '经渠', type: '经', meridian: '肺经' },
        '巳': { acupoint: '阴谷', type: '合', meridian: '肾经' },
        '未': { acupoint: '劳宫', type: '荥', meridian: '心包经' },
    },
    '丙': {
        '申': { acupoint: '少泽', type: '井', meridian: '小肠经' },
        '戌': { acupoint: '内庭', type: '荥', meridian: '胃经' },
        '子': { acupoint: '三间', type: '输', meridian: '大肠经' },
        '寅': { acupoint: '昆仑', type: '经', meridian: '膀胱经' },
        '辰': { acupoint: '阳陵泉', type: '合', meridian: '胆经' },
        '午': { acupoint: '中渚', type: '输', meridian: '三焦经' },
    },
    '丁': {
        '未': { acupoint: '少冲', type: '井', meridian: '心经' },
        '酉': { acupoint: '大都', type: '荥', meridian: '脾经' },
        '亥': { acupoint: '太渊', type: '输', meridian: '肺经' },
        '丑': { acupoint: '复溜', type: '经', meridian: '肾经' },
        '卯': { acupoint: '曲泉', type: '合', meridian: '肝经' },
        '巳': { acupoint: '大陵', type: '输', meridian: '心包经' },
    },
    '戊': {
        '午': { acupoint: '历兑', type: '井', meridian: '胃经' },
        '申': { acupoint: '二间', type: '荥', meridian: '大肠经' },
        '戌': { acupoint: '束骨', type: '输', meridian: '膀胱经' },
        '子': { acupoint: '阳辅', type: '经', meridian: '胆经' },
        '寅': { acupoint: '小海', type: '合', meridian: '小肠经' },
        '辰': { acupoint: '支沟', type: '经', meridian: '三焦经' },
    },
    '己': {
        '巳': { acupoint: '隐白', type: '井', meridian: '脾经' },
        '未': { acupoint: '鱼际', type: '荥', meridian: '肺经' },
        '酉': { acupoint: '太溪', type: '输', meridian: '肾经' },
        '亥': { acupoint: '中封', type: '经', meridian: '肝经' },
        '丑': { acupoint: '少海', type: '合', meridian: '心经' },
        '卯': { acupoint: '间使', type: '经', meridian: '心包经' },
    },
    '庚': {
        '辰': { acupoint: '商阳', type: '井', meridian: '大肠经' },
        '午': { acupoint: '通谷', type: '荥', meridian: '膀胱经' },
        '申': { acupoint: '临泣', type: '输', meridian: '胆经' },
        '戌': { acupoint: '合谷', type: '原', meridian: '大肠经' },
        '子': { acupoint: '足三里', type: '合', meridian: '胃经' },
        '寅': { acupoint: '天井', type: '合', meridian: '三焦经' },
    },
    '辛': {
        '卯': { acupoint: '少商', type: '井', meridian: '肺经' },
        '巳': { acupoint: '然谷', type: '荥', meridian: '肾经' },
        '未': { acupoint: '太冲', type: '输', meridian: '肝经' },
        '酉': { acupoint: '灵道', type: '经', meridian: '心经' },
        '亥': { acupoint: '阴陵泉', type: '合', meridian: '脾经' },
        '丑': { acupoint: '曲泽', type: '合', meridian: '心包经' },
    },
    '壬': {
        '寅': { acupoint: '至阴', type: '井', meridian: '膀胱经' },
        '辰': { acupoint: '侠溪', type: '荥', meridian: '胆经' },
        '午': { acupoint: '后溪', type: '输', meridian: '小肠经' },
        '申': { acupoint: '解溪', type: '经', meridian: '胃经' },
        '戌': { acupoint: '曲池', type: '合', meridian: '大肠经' },
        '子': { acupoint: '关冲', type: '井', meridian: '三焦经' },
    },
    '癸': {
        '亥': { acupoint: '涌泉', type: '井', meridian: '肾经' },
        '丑': { acupoint: '行间', type: '荥', meridian: '肝经' },
        '卯': { acupoint: '神门', type: '输', meridian: '心经' },
        '巳': { acupoint: '商丘', type: '经', meridian: '脾经' },
        '未': { acupoint: '尺泽', type: '合', meridian: '肺经' },
        '酉': { acupoint: '中冲', type: '井', meridian: '心包经' },
    },
};

const dayGanMeridianMap = {
    '甲': '胆经', '乙': '肝经', '丙': '小肠经', '丁': '心经',
    '戊': '胃经', '己': '脾经', '庚': '大肠经', '辛': '肺经',
    '壬': '膀胱经', '癸': '肾经'
};

const meridianShuPointMap = {
    '胆经': { '阳': { '井': '足窍阴', '荥': '侠溪', '输': '足临泣', '经': '阳辅', '合': '阳陵泉' }, '阴': { '井': '足窍阴', '荥': '侠溪', '输': '足临泣', '经': '阳辅', '合': '阳陵泉' } },
    '肝经': { '阴': { '井': '大敦', '荥': '行间', '输': '太冲', '经': '中封', '合': '曲泉' }, '阳': {} },
    '小肠经': { '阳': { '井': '少泽', '荥': '前谷', '输': '后溪', '经': '阳谷', '合': '小海' }, '阴': {} },
    '心经': { '阴': { '井': '少冲', '荥': '少府', '输': '神门', '经': '灵道', '合': '少海' }, '阳': {} },
    '胃经': { '阳': { '井': '历兑', '荥': '内庭', '输': '陷谷', '经': '解溪', '合': '足三里' }, '阴': {} },
    '脾经': { '阴': { '井': '隐白', '荥': '大都', '输': '太白', '经': '商丘', '合': '阴陵泉' }, '阳': {} },
    '大肠经': { '阳': { '井': '商阳', '荥': '二间', '输': '三间', '经': '阳溪', '合': '曲池' }, '阴': {} },
    '肺经': { '阴': { '井': '少商', '荥': '鱼际', '输': '太渊', '经': '经渠', '合': '尺泽' }, '阳': {} },
    '膀胱经': { '阳': { '井': '至阴', '荥': '通谷', '输': '束骨', '经': '昆仑', '合': '委中' }, '阴': {} },
    '肾经': { '阴': { '井': '涌泉', '荥': '然谷', '输': '太溪', '经': '复溜', '合': '阴谷' }, '阳': {} },
    '心包经': { '阴': { '井': '中冲', '荥': '劳宫', '输': '大陵', '经': '间使', '合': '曲泽' }, '阳': {} },
    '三焦经': { '阳': { '井': '关冲', '荥': '液门', '输': '中渚', '经': '支沟', '合': '天井' }, '阴': {} }
};

const meridianYuanPointMap = {
    '胆经': '丘墟', '肝经': '太冲', '小肠经': '腕骨', '心经': '神门',
    '胃经': '冲阳', '脾经': '太白', '大肠经': '合谷', '肺经': '太渊',
    '膀胱经': '京骨', '肾经': '太溪', '心包经': '大陵', '三焦经': '阳池'
};

const yangMeridians = ['胆经', '小肠经', '胃经', '大肠经', '膀胱经', '三焦经'];
const yinMeridians = ['肝经', '心经', '脾经', '肺经', '肾经', '心包经'];


const combinedDayGanMap = {
    '甲': '己', '乙': '庚', '丙': '辛', '丁': '壬', '戊': '癸',
    '己': '甲', '庚': '乙', '辛': '丙', '壬': '丁', '癸': '戊'
};


// --- 五行及颜色配置 ---
const fiveElementColors = {
    '木': '#228B22',
    '火': '#FF4500',
    '土': '#DAA520',
    '金': '#C0C0C0',
    '水': '#00A3E0'
};

const meridianFiveElements = {
    '胆经': '木', '肝经': '木',
    '小肠经': '火', '心经': '火', '心包经': '火', '三焦经': '火',
    '胃经': '土', '脾经': '土',
    '大肠经': '金', '肺经': '金',
    '膀胱经': '水', '肾经': '水'
};

function getMeridianFiveElementColor(meridian) {
    const element = meridianFiveElements[meridian];
    return fiveElementColors[element] || '#FFFFFF';
}

function getDayGanZhi(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const g = [7, 1, 2, 3, 4, 5, 6];
    const d = day;
    const m = month < 3 ? month + 12 : month;
    const y = month < 3 ? year - 1 : year;
    const c = parseInt(String(y).substring(0, 2));
    const yy = parseInt(String(y).substring(2));

    const C = Math.floor(c / 4) - 2 * c + Math.floor(yy / 4) + yy + Math.floor(13 * (m + 1) / 5) + d - 1;
    const Z = C % 60;
    const gz = Z < 0 ? Z + 60 : Z;

    const ganIndex = gz % 10;
    const zhiIndex = gz % 12;

    return { gan: gan[ganIndex > 0 ? ganIndex - 1 : 9], zhi: zhi[zhiIndex > 0 ? zhiIndex - 1 : 11] };
}


function getShichen(hour) {
    const shichenMap = {
        '子时': { start: 23, end: 0 }, '丑时': { start: 1, end: 2 }, '寅时': { start: 3, end: 4 },
        '卯时': { start: 5, end: 6 }, '辰时': { start: 7, end: 8 }, '巳时': { start: 9, end: 10 },
        '午时': { start: 11, end: 12 }, '未时': { start: 13, end: 14 }, '申时': { start: 15, end: 16 },
        '酉时': { start: 17, end: 18 }, '戌时': { start: 19, end: 20 }, '亥时': { start: 21, end: 22 }
    };
    for (const shichen in shichenMap) {
        if (hour === 23 || hour === 0 && shichen === '子时') return '子时';
        if (hour >= shichenMap[shichen].start && hour <= shichenMap[shichen].end) return shichen;
    }
    return '时辰错误';
}


function getShichenZhi(hour) {
    const shichenZhiMap = {
        '子时': '子', '丑时': '丑', '寅时': '寅', '卯时': '卯',
        '辰时': '辰', '巳时': '巳', '午时': '午', '未时': '未',
        '申时': '申', '酉时': '酉', '戌时': '戌', '亥时': '亥'
    };
    const shichen = getShichen(hour);
    return { zhi: shichenZhiMap[shichen] || '错误' };
}

function getGanZhiYinYang(ganZhi, type) {
    const targetArray = type === 'gan' ? gan : zhi;
    const index = targetArray.indexOf(ganZhi);
    return (index !== -1) ? ((index % 2 === 0) ? '阴' : '阳') : '未知';
}

function judgeYinYang(shichen) {
    const yangShichen = ['子时', '寅时', '午时', '申时', '戌时', '辰时'];
    return yangShichen.includes(shichen) ? '阳' : '阴';
}

function getMeridianYinYang(meridian) {
    return yinMeridians.includes(meridian) ? '阴' : (yangMeridians.includes(meridian) ? '阳' : '未知');
}

function getCombinedDayGan(dayGan) {
    return combinedDayGanMap[dayGan];
}

function getDayGanMeridian(dayGanStr) {
    return dayGanMeridianMap[dayGanStr] || '未找到';
}

function getMeridianShuPoint(meridian, yinYangType, pointType) {
    const meridianData = meridianShuPointMap[meridian];
    return meridianData && meridianData[yinYangType] && meridianData[yinYangType][pointType] || '穴位未收录';
}

function getMeridianYuanPoint(meridian) {
    return meridianYuanPointMap[meridian] || '原穴未收录';
}

function isNightTime() {
    const currentHour = new Date().getHours();
    return currentHour >= 23 || currentHour <= 6;
}

// --- 核心穴位计算函数 (关键修正) ---
function getShuPoint(dayGan, shiZhi) {
    const dayGanStr = dayGan.gan;
    const shiZhiStr = shiZhi.zhi;
    const nowHour = new Date().getHours();
    const shichen = getShichen(nowHour);
    let mainAcupoint = '';
    let returnAcupoint = '';

    // 1. 直接查找纳甲法穴位
    let acupointResult = acupointMantraMap[dayGanStr]?.[shiZhiStr];

    // 2. 如果找到穴位
    if (acupointResult) {
        mainAcupoint = `⚡ ${acupointResult.meridian}${acupointResult.type}穴: ${acupointResult.acupoint}`;

        // 3. 检查是否需要返本还原 (只有在找到纳甲穴位的情况下才检查)
        if (acupointResult.type === '输') {
            const currentMeridian = getDayGanMeridian(dayGanStr);
            const yuanPoint = getMeridianYuanPoint(currentMeridian);
            returnAcupoint = `${yuanPoint} (返本还原)`;
        }
    } else {
        // 4. 如果纳甲法找不到，尝试夫妻互用
        const combinedGan = getCombinedDayGan(dayGanStr);
        acupointResult = acupointMantraMap[combinedGan]?.[shiZhiStr];
        if (acupointResult) {
            mainAcupoint = `⚡ ${acupointResult.meridian}${acupointResult.type}穴: ${acupointResult.acupoint} (夫妻互用)`;
            //夫妻互用成功后不进行返本还原
        }
    }

    // 4.5 辰时特殊处理
    if (shichen === '辰时' && mainAcupoint) {
        const sanjiaoPoint = getMeridianShuPoint('三焦经', '阳', '合');
        const xinbaoPoint = getMeridianShuPoint('心包经', '阴', '合');
        mainAcupoint += `\n✨ 气纳三焦，血归包络: \n 三焦经合穴: ${sanjiaoPoint}\n 心包络经合穴: ${xinbaoPoint}`;
    }

    // 5. 如果纳甲法和夫妻互用都找不到，则尝试补充规则
    if (!mainAcupoint) {
        return [getSupplementaryAcupoint(dayGan, shiZhi), ""];
    }

    return [mainAcupoint, returnAcupoint];
}
function getSupplementaryAcupoint(dayGan, shiZhi) { // 补充规则函数 (保持不变)
    const dayGanStr = dayGan.gan;
    const shiZhiStr = shiZhi.zhi;
    const shichen = getShichen(new Date().getHours());
    const dayGanYinYang = getGanZhiYinYang(dayGanStr, 'gan');
    const shiZhiYinYang = getGanZhiYinYang(shiZhiStr, 'zhi');
    const shichenYinYang = judgeYinYang(shichen);

    if (dayGanYinYang === shichenYinYang) { // 日干时支同阴阳
        const meridian = getDayGanMeridian(dayGanStr);
        if (meridian) {
            let pointType = '荥';
            if (shichen === '子时' || shichen === '午时') pointType = '井';
            else if (shichen === '寅时' || shichen === '申时') pointType = '输'; // 更正为 输穴
            else if (shichen === '辰时' || shichen === '戌时') pointType = '经';
            else if (shichen === '丑时' || shichen === '未时') pointType = '合';

            const acupoint = getMeridianShuPoint(meridian, dayGanYinYang, pointType);
            if (acupoint && acupoint !== '不适用')
                return `⚡ ${meridian}${pointType}穴: ${acupoint} (纳甲法补)`;
        }
    } else { // 夫妻互用
        const combinedDayGan = getCombinedDayGan(dayGanStr);
        if (combinedDayGan) {
            const combinedDayGanZhi = { gan: combinedDayGan };
            const combinedAcupoint = getShuPoint(combinedDayGanZhi, shiZhi);
            if (combinedAcupoint !== '无开穴 (歌诀未收录)')
                return combinedAcupoint + ' (夫妻互用)';
        }
    }
    return '无开穴 (歌诀未收录)';
}

// --- Widget 界面显示优化 ---
function wrapText(text, maxChineseChars, widgetWidth) {
    let wrappedText = '';
    let currentLine = '';
    let currentLineWidth = 0; // 当前行累积宽度

    // 字符宽度比例（经验值，可调整）
    const charWidthRatios = {
        chinese: 1.8,  // 中文
        latin: 1,     // 拉丁字母 (英文)
        number: 1,   //数字
        punctuation: 0.8,  // 标点符号（根据实际字体调整）
        emoji: 1.8,    // Emoji
        other: 1      // 其他
    };

    // 获取字符类型
    function getCharType(char) {
        const charCode = char.charCodeAt(0);
        if (charCode >= 0x4e00 && charCode <= 0x9fff) {
            return 'chinese';
        } else if ((charCode >= 0x0041 && charCode <= 0x005A) || (charCode >= 0x0061 && charCode <= 0x007A)) {
            return 'latin';
        } else if ((charCode >= 0x0030 && charCode <= 0x0039)) {
            return 'number';
        } else if ((charCode >= 0x0021 && charCode <= 0x002F) || (charCode >= 0x003A && charCode <= 0x0040) || (charCode >= 0x005B && charCode <= 0x0060) || (charCode >= 0x007B && charCode <= 0x007E)) {
            return 'punctuation';
        } else if ((charCode >= 0x1F600 && charCode <= 0x1F64F) || (charCode >= 0x2600 && charCode <= 0x26FF) || (charCode >= 0x2700 && charCode <= 0x27BF) || (charCode >= 0x1F300 && charCode <= 0x1F5FF) || (charCode >= 0x1F900 && charCode <= 0x1F9FF) || (charCode >= 0x1FA70 && charCode <= 0x1FAFF)) {
            return 'emoji';
        }
        return 'other';
    }


    const baseWidth = widgetWidth / (maxChineseChars * charWidthRatios.chinese); //最窄的字符的宽度

    for (let char of text) {
        const charType = getCharType(char);
        const charWidth = charWidthRatios[charType] * baseWidth;

        // 累积宽度超过限制，或者中文字符数超限，则换行
        if (currentLineWidth + charWidth > widgetWidth) {
            wrappedText += currentLine + '\n';
            currentLine = '';
            currentLineWidth = 0;
        }

        currentLine += char;
        currentLineWidth += charWidth;
    }

    wrappedText += currentLine; // 加上剩余部分
    return wrappedText;
}

let widget = new ListWidget();
widget.setPadding(16, 16, 16, 16);

let nowHour = new Date().getHours();
let currentShiZhi = getShichenZhi(nowHour).zhi;
let dayGZ = getDayGanZhi(new Date());
let currentDayGan = dayGZ.gan;
let shuPointResults = getShuPoint(dayGZ, { zhi: currentShiZhi });
let mainAcupointText = shuPointResults[0];
let returnToOriginAcupointText = shuPointResults[1];

// 优化：根据实际 Widget 宽度进行换行
const widgetWidth = 300; // 根据你的 Widget 宽度调整,使用时改这里就行
mainAcupointText = wrapText(mainAcupointText, 15, widgetWidth);  // 15 个中文字符
returnToOriginAcupointText = wrapText(returnToOriginAcupointText, 15, widgetWidth);


let meridianName = mainAcupointText.match(/⚡\s*([\u4e00-\u9fa5]+经)/)?.[1] || '';
let bgColor = getMeridianFiveElementColor(meridianName);

let textColor;
if (isNightTime()) {
    widget.backgroundColor = new Color('#222222');
    textColor = new Color('#EEEEEE');
} else {
    widget.backgroundColor = new Color(bgColor, 1);
    textColor = Color.white();
    if (bgColor === '#FFFFFF') {
        textColor = new Color('#444444');
    }
}

const shadowColor = new Color('#888888', 0.5);
const shadowRadius = 1;

let row0 = widget.addStack();
row0.layoutHorizontally();

let dateTimeStack = row0.addStack();
dateTimeStack.layoutVertically();
let gregorianTimeText = dateTimeStack.addText("");
gregorianTimeText.font = Font.systemFont(13);
gregorianTimeText.textColor = textColor;
gregorianTimeText.shadowColor = shadowColor;
gregorianTimeText.shadowRadius = shadowRadius;
let dayGanZhiText = dateTimeStack.addText("");
dayGanZhiText.font = Font.boldSystemFont(15);
dayGanZhiText.textColor = textColor;
dayGanZhiText.shadowColor = shadowColor;
dayGanZhiText.shadowRadius = shadowRadius;

row0.addSpacer();

let row1 = widget.addStack();
row1.layoutHorizontally();
row1.addSpacer();
let shichenText = row1.addText("🕒 " + getShichen(nowHour));
shichenText.font = Font.boldSystemFont(17);
shichenText.textColor = textColor;
shichenText.shadowColor = shadowColor;
shichenText.shadowRadius = shadowRadius;
row1.addSpacer();

widget.addSpacer(5);

let row2 = widget.addStack();
row2.layoutHorizontally();
row2.addSpacer();

let acupointLine1 = row2.addText("");
acupointLine1.font = Font.boldSystemFont(18);
acupointLine1.textColor = textColor;
acupointLine1.lineLimit = 2;// 重新启用 lineLimit
// acupointLine1.minimumScaleFactor = 0.7; // 可以选择性启用
acupointLine1.shadowColor = shadowColor;
acupointLine1.shadowRadius = shadowRadius;

row2.addSpacer();

widget.addSpacer(5);

let row3 = widget.addStack();
row3.layoutHorizontally();
row3.addSpacer();

let acupointLine2 = row3.addText("");
acupointLine2.font = Font.boldSystemFont(18);
acupointLine2.textColor = textColor;
acupointLine2.lineLimit = 2; // 重新启用 lineLimit
// acupointLine2.minimumScaleFactor = 0.7; // 可以选择性启用
acupointLine2.shadowColor = shadowColor;
acupointLine2.shadowRadius = shadowRadius;

row3.addSpacer();

widget.addSpacer(5);

let row4 = widget.addStack();
row4.layoutHorizontally();
row4.addSpacer();
let yinYangText = row4.addText("☯️ " + judgeYinYang(getShichen(nowHour)) + "  ");
yinYangText.font = Font.systemFont(14);
yinYangText.textColor = textColor;
yinYangText.shadowColor = shadowColor;
yinYangText.shadowRadius = shadowRadius;
row4.addSpacer();

let now = new Date();
let dateString = now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
let timeString = now.toLocaleTimeString('zh-TW', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
gregorianTimeText.text = `${dateString} ${timeString}`;
dayGZ = getDayGanZhi(now);
dayGanZhiText.text = `${dayGZ.gan}${dayGZ.zhi}日`;

acupointLine1.text = mainAcupointText;
acupointLine2.text = returnToOriginAcupointText;

Script.setWidget(widget);
widget.presentMedium();
Script.complete();