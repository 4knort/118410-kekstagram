'use strict';
var bodyCoordinates = document.querySelector('body').getBoundingClientRect();
(function() {

  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');
  var pictures = [];
  var filteredPictures = [];
  var filter = document.querySelectorAll('.filters-item');
  var fragment = document.createDocumentFragment();
  var currentPage = 0;
  var PAGE_SIZE = 17;
  var PAGE_SIZE_BIG = 26;


  getPictures();

  // получаем данные из json
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');
    xhr.timeout = 10000;
    xhr.addEventListener('load', function(evt) {
      var responseData = evt.target.response;
      pictures = JSON.parse(responseData);
      filteredPictures = JSON.parse(responseData);
      renderPictures(pictures, 0, true);
      showFilters();
    });
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

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (bodyCoordinates.bottom - window.innerHeight <= 0) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          renderPictures(filteredPictures, ++currentPage);
        }
      }
    }, 100);
  });

  //обрабатываем данные полученные из json
  function renderPictures(data, pageNumber, replace) {
    var from; // с какого элемента режем массив
    var to; // до какого элемента режем массив
    var pagePictures; //вырезанный массив

    if (replace) {
      // обнуляем содержимое контейнера
      container.innerHTML = '';
    }
    if (bodyCoordinates.width >= 1380) {
      // если большое  разрешение

      from = pageNumber * PAGE_SIZE_BIG;
      to = from + PAGE_SIZE_BIG;
      pagePictures = data.slice(from, to);

      pagePictures.forEach(function(picture) {
        addPicture(picture);
      });

    } else {

      //определяем сколько будет отображаться изображений на странице
      from = pageNumber * PAGE_SIZE;
      to = from + PAGE_SIZE;
      pagePictures = data.slice(from, to);

      pagePictures.forEach(function(picture) {
        addPicture(picture);
      });

    }

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
    filteredPictures = pictures.slice(0);
    currentPage = 0;
    if (id === 'filter-new') {
      filteredPictures = filteredPictures.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    } else if (id === 'filter-discussed') {
      filteredPictures = filteredPictures.sort(function(a, b) {
        return b.comments - a.comments;
      });
    }
    renderPictures(filteredPictures, 0, true);
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
    image.addEventListener('load', function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(image, imgTag);
    });

    // если произойдет ошибка загрузки изображения
    image.addEventListener('error', function() {
      element.classList.add('picture-load-failure');
    });

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
