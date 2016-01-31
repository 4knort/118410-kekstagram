'use strict';

(function() {

  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');

  /*global pictures*/

  // перебираем массив с полученными данными из jsonp
  pictures.forEach(function(picture) {
    addPicture(picture);
  });

  //функция работы с шаблоном и изобажением
  function addPicture(picture) {
    //шаблон
    var element = template.content.children[0].cloneNode(true);
    element.querySelector('.picture-likes').textContent = picture.likes;
    element.querySelector('.picture-comments').textContent = picture.comments;
    container.appendChild(element);

    //изображения
    var imgTag = element.querySelector('img');
    var image = new Image(182, 182);
    var imageLoadTimeout;

    //после загрузи изображения
    image.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(image, imgTag);
    };

    // если произойдет ошибка загрузки изображения
    image.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    image.src = picture.url;

    //если сервер не овтечает
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);

  }
  //проверяем есть ли в обертке с изображениями какие-то блоки
  if (container.children.length === 0) {
    filters.classList.add('hidden');
  } else {
    filters.classList.remove('hidden');
  }

})();
