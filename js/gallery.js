'use strict';

define(function() {
  /**
   * @oaran {Array}
   * @return {Constructor}
   */
  var Gallery = function(data) {
    this.data = data;

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._image = this.element.querySelector('.gallery-overlay-image');
    this._comments = this.element.querySelector('.comments-count');
    this._likes = this.element.querySelector('.likes-count');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this.checkHash = this.checkHash.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this.currentPicture = 0;
  };

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };


  Gallery.prototype.setCurrentPicture = function(i) {
    var picture;
    if (typeof i === 'number') {
      picture = this.pictures[i];
    } else if (typeof i === 'string') {
      picture = this.pictures[this.getPictureNumber(i)];
    }
    this._image.src = picture.url;
    this._likes.textContent = picture.likes;
    this._comments.textContent = picture.comments;
    location.hash = 'photo/' + this.pictures[this.currentPicture].url;
  };



  Gallery.prototype.checkHash = function() {
    var regExp = location.hash.match(/#photo\/(\S+)/);
    if (regExp) {
      this.setCurrentPicture(regExp[1]);
      this.show();
      this._image.addEventListener('click', this._onPhotoClick);
    } else {
      this.hide();
    }
  };

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    this._closeButton.addEventListener('click', this._onCloseClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype._onCloseClick = function() {
    this._image.removeEventListener('click', this._onPhotoClick);
    location.hash = '';
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPicture(++this.currentPicture);
  };

  Gallery.prototype._onDocumentKeyDown = function() {
    if (event.keyCode === 27) {
      this.removeEventListener('click', this._onPhotoClick);
      location.hash = '';
    }
  };

  Gallery.prototype.getPictureNumber = function(url) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (url === this.pictures[i].url) {
        this.currentPicture = i;
        return i;
      }

    }
  };

  return Gallery;
});
