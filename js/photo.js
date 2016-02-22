'use strict';

(function() {

  function Photo(picture) {
    this._picture = picture;
  }

  Photo.prototype.render = function() {
    //шаблон
    var template = document.querySelector('#picture-template');
    this.element = template.content.children[0].cloneNode(true);
    this.element.querySelector('.picture-likes').textContent = this._picture.likes;
    this.element.querySelector('.picture-comments').textContent = this._picture.comments;

    //изображения
    var imgTag = this.element.querySelector('img');
    var image = new Image(182, 182);
    var imageLoadTimeout;

    //загрузка изображения
    image.addEventListener('load', function() {
      clearTimeout(imageLoadTimeout);
      this.element.replaceChild(image, imgTag);
    }.bind(this));

    // если произойдет ошибка загрузки изображения
    image.addEventListener('error', function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this));
    image.src = this._picture.url;

    //если сервер не овтечает
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      this.element.classList.add('picture-load-failure');
    }.bind(this), IMAGE_TIMEOUT);
  };

  window.Photo = Photo;
})();
