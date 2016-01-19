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
    return("Переданное SVG-изображение содержит " + a + " объектов и " + (b * 4) + (" аттрибутов"))
  }
  if(typeof(a) == [] && typeof(b) == []){

  }
}

