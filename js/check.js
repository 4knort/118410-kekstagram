function getMessage(a, b){
  if(typeof(a) == "boolean"){
    if(a == true){
      return("Переданное GIF-изображение анимировано и содержит " + b + " кадров")
    }
    else if(a == false){
      return("Переданное GIF-изображение не анимировано")
    };
  }
  if(typeof(a) == "number"){
    return("Переданное SVG-изображение содержит " + a + " объектов и " + (b * 4) + " аттрибутов")
  }

  if(typeof(a) && typeof(b) == "object"){
    for(var i = 0; i < a.length; i++){
      var arr = [];
      arr.push(a[i] * b[i]);
      var square = 0;
      square = square + arr[i];
      return("Общая площадь артефактов сжатия: " + square +  " пикселей");
    }
  }
  if(typeof(a) == "object"){
    for(var i = 0; i < a.length; i++){
      var sum = 0;
      sum = sum + a[i];
      return("Количество красных точек во всех строчках изображения: " + sum);
    }
  }
}

