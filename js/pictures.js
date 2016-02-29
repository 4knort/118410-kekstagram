'use strict';

define([
  'photo',
  'gallery'
], function(Photo, Gallery) {

  var bodyCoordinates = document.querySelector('body').getBoundingClientRect();
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var pictures = [];
  var filteredPictures = [];
  var renderedElements = [];
  var fragment = document.createDocumentFragment();
  var gallery = new Gallery();
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
      gallery.setPictures(pictures);
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
      //удаляем обработчики событий
      var el;
      while ((el = renderedElements.shift())) {
        container.removeChild(el.element);
        el.onClick = null;
        el.remove();
      }

      // обнуляем содержимое контейнера
      // container.innerHTML = '';
    }
    if (bodyCoordinates.width >= 1380) {
      // если большое  разрешение

      from = pageNumber * PAGE_SIZE_BIG;
      to = from + PAGE_SIZE_BIG;
      pagePictures = data.slice(from, to);

    } else {

      //определяем сколько будет отображаться изображений на странице
      from = pageNumber * PAGE_SIZE;
      to = from + PAGE_SIZE;
      pagePictures = data.slice(from, to);

    }

    renderedElements = renderedElements.concat(pagePictures.map(function(picture) {
      var pictureElement = new Photo(picture);
      pictureElement.render();
      fragment.appendChild(pictureElement.element);

      pictureElement.onClick = function() {
        gallery.data = pictureElement._picture;
        gallery.getPictureNumber(picture.url);
        gallery.render();

      };
      return pictureElement;
    }));

    // после обработки всех изображений, запихиваем их разом в контейнер
    container.appendChild(fragment);
  }

  //работа с фильтрами
  filters.addEventListener('click', function(event) {
    var clickedElement = event.target;
    if (clickedElement.classList.contains('filters-item')) {
      setActiveFilter(clickedElement.getAttribute('for'));
    }
  });

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
    renderPictures(filteredPictures, currentPage, true);
  }

  //проверяем есть ли в обертке с изображениями какие-то блоки
  function showFilters() {
    if (container.children.length === 0) {
      filters.classList.add('hidden');
    } else {
      filters.classList.remove('hidden');
    }
  }

});
