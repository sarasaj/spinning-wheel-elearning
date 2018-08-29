var options = [
 "المقررات التعليمية ",
  "صندوق الملفات ",
   "التقويم",
    "المدونة",
     "البريد الإلكتروني ",
      "المحادثة",
      "مجلد التسليم  ",
      "الفصول الافتراضية ",
      "المناقشات",
      "الاختبارات الإلكترونية "
      ];
var value = [
  "مساحة مخصصة لاستعراض المقررات الدراسية المسجلة لدى كل طالب والدخول عن طريقها الى كل مقرر دراسي واستعراض محتوياته .",
    "مساحة تخزين إلكترونية تمكنك من تحميل الملفات من جهاز الكمبيوتر الخاص بك الى صندوق الملفات في النظام وثم تصفحها أو تنزيلها من النظام في أي وقت وأي مكان .",
     "عبارة عن مفكرة شخصية لاستعراض الاحداث الشخصية بالمقررات الدراسية المضافة على التقويم مثل مواعيد تسليم الواجبات والاختبارات ",
      "أداة تستخدم في إنشاء وتصفح المدونات الإلكترونية على النظام ويمكن متابعة المدونات العامة والتعليق عليها ",
       "صندوق الرسائل الالكترونية يستخدم في إرسال واستقبال الرسائل الإلكترونية داخل النظام ",
        "أداة اتصال متزامن تسمح بالتواصل مع أستاذ المادة أو زملاء المقرر عندما يكونون متصلين على النظام في نفس الوقت ",
        "مساحة تخزين الكترونية تستخدم لتسليم المستندات الخاصة بمهام الوجبات الى أستاذ المقرر الدراسي ",
        "أداة تواصل متزامن بين أستاذ المقرر و الطلبة تستخدم للتواصل والتفاعل مع الأستاذ بالصوت والصورة أو المحادثة الشخصية أو العامة ",
        "أداة اتصال غير متزامن بين الطلبة فيما بينهم تسمح بمناقشة المواضيع او الاستفسارات .",
        "هي بديل فعال للاختبارات الورقية التقليدية حيث تظهر فيها النتيجة بشكل فوري وتمكنك من إعادة الاختبار أكثر من مرة في نفس الوقت بالإضافة الى إمكانية الاطلاع على نموذج الإجابة بعد الانتهاء من الاختبار مباشرة .  "
  ];


var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;

  red   = Math.sin(frequency*item+2.3+phase) * width + center;
  green = Math.sin(frequency*item+0.4+phase) * width + center;
  blue  = Math.sin(frequency*item+4.2+phase) * width + center;

  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 250;
    var textRadius = 200;
    var insideRadius = 150;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,800,800);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.font = 'bold 14px "Changa", sans-serif';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(300, 300, outsideRadius, angle, angle + arc, false);
      ctx.arc(300, 300, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      // ctx.shadowOffsetX = -1;
      // ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(300 + Math.cos(angle + arc / 2) * textRadius,
                    300 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(300 - 4, 300 - (outsideRadius + 5));
    ctx.lineTo(300 + 4, 300 - (outsideRadius + 5));
    ctx.lineTo(300 + 4, 300 - (outsideRadius - 5));
    ctx.lineTo(300 + 9, 300 - (outsideRadius - 5));
    ctx.lineTo(300 + 0, 300 - (outsideRadius - 13));
    ctx.lineTo(300 - 9, 300 - (outsideRadius - 5));
    ctx.lineTo(300 - 4, 300 - (outsideRadius - 5));
    ctx.lineTo(300 - 4, 300 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px El Messiri, sans-serif';
  var text = options[index];
  $("#valueArea").text(value[index]);
  ctx.fillText(text, 300 - ctx.measureText(text).width / 2, 300 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();
