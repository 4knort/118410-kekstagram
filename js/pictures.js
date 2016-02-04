'use strict';

(function() {

  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');
  var pictures = null;
  var filter = document.querySelectorAll('.filters-item');
  var fragment = document.createDocumentFragment();

  getPictures();

  // получаем данные из json
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');
    xhr.timeout = 10000;
    xhr.onload = function(evt) {
      var responseData = evt.target.response;
      pictures = JSON.parse(responseData);
      renderPictures(pictures);
      showFilters();
    };
    xhr.addEventListener('readystatechange', function() {
      if (xhr.readyState === 3) {
        container.classList.add('pictures-loading');
      } else if (xhr.readyState === 4) {
        container.classList.remove('pictures-loading');
      } else if (xhr.readyState === 0) {
        container.classList.add('pictures-failure');
      }
    });

    xhr.send();
  }

  //обрабатываем данные полученные из json
  function renderPictures(data) {
    // обнуляем содержимое контейнера
    container.innerHTML = '';

    data.forEach(function(picture) {
      addPicture(picture);
    });

    // после обработки всех изображений, запихиваем их разом в контейнер
    container.appendChild(fragment);
  }

  //работа с фильтрами
  for (var i = 0; i < filter.length; i++) {
    filter[i].addEventListener('click', function(evt) {
      var clickedElemId = evt.target.getAttribute('for');
      setActiveFilter(clickedElemId);
    });
  }

  // сортировка изображений в зависимости от активного фильтра
  function setActiveFilter(id) {
    var filteredPictures = pictures.slice(0);
    if (id === 'filter-new') {
      filteredPictures = filteredPictures.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    } else if (id === 'filter-discussed') {
      filteredPictures = filteredPictures.sort(function(a, b) {
        return b.comments - a.comments;
      });
    }
    renderPictures(filteredPictures);
  }


  //функция работы с шаблоном и изобажением
  function addPicture(picture) {
    //шаблон
    var element = template.content.children[0].cloneNode(true);
    element.querySelector('.picture-likes').textContent = picture.likes;
    element.querySelector('.picture-comments').textContent = picture.comments;
    fragment.appendChild(element);

    //изображения
    var imgTag = element.querySelector('img');
    var image = new Image(182, 182);
    var imageLoadTimeout;

    //загрузка изображения
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
  function showFilters() {
    if (container.children.length === 0) {
      filters.classList.add('hidden');
    } else {
      filters.classList.remove('hidden');
    }
  }


})();
