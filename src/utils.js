export const ladderApi = (process.env.NODE_ENV === 'production') 
? 'http://server.asynciot.com/' : 'http://server.asynciot.com/'
// 			? 'http://lengxia.natapp1.cc/'
// 			: 'http://lengxia.natapp1.cc/'
export const api = (process.env.NODE_ENV === 'production') 
? 'http://server.asynciot.com/' : 'http://server.asynciot.com/'
// 			? 'http://lengxia.natapp1.cc/'
// 			: 'http://lengxia.natapp1.cc/'
export const formatDate=(time, format)=> {
	if (!time) {
		return ''
	}
  var t = new Date(time);
  var tf = function (i) {
      return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}
export const array2obj = (arr, key = null) => {
  const obj = {};
  obj.updateTime = 0;
  arr.forEach((item) => {
    if (key) {
      obj[item[key]] = item;
    } else {
      obj[item.propertyName] = item;
      if (item.updateTime>obj.updateTime) {
        obj.updateTime = item.updateTime
      }
    }
  });
  return obj;
}
export const buffer2hex = (buffer) => {
  const unit16array = [];
  buffer.forEach((e) => {
    const num = e.toString(16);
    unit16array.push(num.length === 1
      ? `0${num}`
      : num);
  });
  return unit16array;
}
export const parseBuffer = (val) => {
  if (val && val != 0) {
    let bit = (+val).toString(2);
    while (bit.length < 8) {
      bit = `0${bit}`;
    }
    return bit.split('');
  } else {
    return '00000000'.split('');
  }
}
export const parseEvent = (event) => {
  const name = [
    'openIn',
    'closeIn',
    'openTo',
    'closeTo',
    'openSlow',
    'closeSlow',
    'openToOut',
    'closeToOut',
    'door',
    'open',
    'close',
    'openKeep',
    'closeKeep',
    'stop',
    'inHigh',
    'inLow',
    'outHigh',
    'motorHigh',
    'flySafe',
    'closeStop',
  ];
  const obj = {};
  let position = '';
  let current = '';
  let speed = '';
  event.forEach((item, index) => {
    if (name[index]) {
      obj[name[index]] = parseInt(item);
    } else if (index > 19 && index <= 31) {
      position += `${item}`;
    } else if (index > 31 && index <= 47) {
      current += `${item}`;
    } else if (index > 47 && index <= 63) {
      speed += `${item}`;
    }
  });
  obj.position = parseInt(position, 2);
  obj.current = (parseInt(current, 2) / 1000).toFixed(3);
  obj.speed = ((parseInt(speed, 2) << 16 >> 16) / 1000).toFixed(3);
  return obj;
}
export const parseInfo = (event, floors = []) => {
  const name = [
    'closeBtn',
    'openBtn',
    'close',
    'open',
    'lock',
    'run',
    'toDown',
    'toUp',
    'group',
    'parallel',
    'single',
    'full',
    'over',
    'error',
    'lockbd',
    'fire',
    'driver',
    'check',
    'auto',
    'floor',
    'lastCode',
    'lastFloor',
    'lastTime',
  ];
  const obj = {};
  const model = { '01': '单梯', '10': '并联', '100': '群控', '000': '无' };
  const status = ['自动', '检修', '司机', '消防', '锁体', '故障', '超载', '满载'];
  const btn = { '00': '无', '01': '开门', 10: '关门' };
  let floor = '', lastCode = '', lastFloor = '', lastTime= '';
  event.forEach((item, index) => {
    if (index <= 7) {
      obj[name[index]] = parseInt(item);
    }
    if (index > 12 && index <= 23) {
      obj[name[index - 5]] = parseInt(item);
    }
    if (index>=24 && index<=31) {
      floor += `${item}`;
    }
    if (index>=32 && index<=39) {
      lastCode += `${item}`;
    }
    if (index>=40 && index<=47) {
      lastFloor += `${item}`;
    }
    if (index>=48 && index<=79) {
      lastTime += `${item}`;
    }
  });
  const statusBit = [obj.auto, obj.check, obj.driver, obj.fire, obj.lockbd, obj.error, obj.over, obj.full];
  obj.status = statusBit.map((item, index) => (item === 1 ? status[index] : '')).filter(item => item).toString();
  obj.model = model[`0${obj.single}`] || model[`${obj.parallel}0`] || model[`${obj.group}00`];
  obj.btn = btn[`${obj.closeBtn}${obj.openBtn}`];
  obj.floor = floors.length ? floors[floors.length-parseInt( floor, 2)-2]:parseInt( floor, 2);
  obj.lastCode = parseInt( floor, 2);
  obj.lastFloor = parseInt( floor, 2);
  obj.lastTime = parseInt( floor, 2);
  obj.upCall = []
  obj.downCall = []
  return obj;
}
export const parseMsg = (event, floors = []) => {
  const name = [
    'closeBtn',
    'openBtn',
    'close',
    'open',
    'lock',
    'run',
    'toDown',
    'toUp',
    'group',
    'parallel',
    'single',
    'full',
    'over',
    'error',
    'lockbd',
    'fire',
    'driver',
    'check',
    'auto',
    'upCall',
    'downCall',
    'register',
    'floor',
    'height',
    'speed'
  ];
  const obj = {};
  const model = { '01': '单梯', '10': '并联', '100': '群控', '000': '无' };
  const status = ['自动', '检修', '司机', '消防', '锁体', '故障', '超载', '满载'];
  const btn = { '00': '无', '01': '开门', 10: '关门' };
  let upCall = [], downCall = [], register = [], real = '',height='', speed = '';

  event.forEach((item, index) => {
    if (index <= 7) {
      obj[name[index]] = parseInt(item);
    }
    if (index > 12 && index <= 23) {
      obj[name[index - 5]] = parseInt(item);
    }
    if (index>=24 && index<=87) {
      const idx = index - 24
      upCall[parseInt(idx/8)*8 + Math.abs(idx%8-8) -1] = item
    }
    if (index>=88 && index<=151) {
      const idx = index - 88
      downCall[parseInt(idx/8)*8 + Math.abs(idx%8-8) -1] = item
    }
    if (index>=152 && index<=215) {
      const idx = index - 152
      register[parseInt(idx/8)*8 + Math.abs(idx%8-8) -1] = item
    }
    if (index>=216 && index<=223) {
      real += String(item)
    }
    if (index>=224 && index<=247) {
      height += String(item)
    }
    if (index>=248 && index<=263) {
      speed += String(item)
    }
  });
  const statusBit = [obj.auto, obj.check, obj.driver, obj.fire, obj.lockbd, obj.error, obj.over, obj.full];
  obj.status = statusBit.map((item, index) => (item === 1 ? status[index] : '')).filter(item => item).toString();
  obj.model = model[`0${obj.single}`] || model[`${obj.parallel}0`] || model[`${obj.group}00`];
  obj.btn = btn[`${obj.closeBtn}${obj.openBtn}`];
  obj.upCall = upCall.map((item, index) => parseInt(item) == 1 ? index : null).filter(item=>item!=null).map(item=>floors[item-1]||'').filter(val=>val != '')
  obj.downCall = downCall.map((item, index) => parseInt(item) == 1 ? index : null).filter(item=>item!=null).map(item=>floors[item-1]||'').filter(val=>val != '')
  obj.register = register.map((item, index) => parseInt(item) == 1 ? index : null).filter(item=>item!=null).map(item=>floors[item-1]||'').filter(val=>val != '')
  obj.floor = floors[floors.length - parseInt(real, 2)]
  obj.height = (parseInt(height, 2)/1000).toFixed(2)
  obj.speed = (parseInt(speed, 2)/1000).toFixed(2)
  return obj;
}
