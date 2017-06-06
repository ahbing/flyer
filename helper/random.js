exports.rangeNum = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.string = function(len) {
　　len = len || 6;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

exports.number = function(len) {
  len = len || 3;
  return +(Date.now()+'').slice(-len);
}