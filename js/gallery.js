'use strict';

(function() {
  var Gallery = function(data) {
    this.data = data;
    this._onPhotoClick = this._onPhotoClick.bind(this);

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._image = this.element.querySelector('.gallery-overlay-image');
    this._comments = this.element.querySelector('.comments-count');
    this._likes = this.element.querySelector('.likes-count');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this.currentPicture = 0;
  };

  Gallery.prototype.render = function() {
    this.show();
    this.setCurrentPicture(this.currentPicture);
    this._image.addEventListener('click', this._onPhotoClick);
  }
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  Gallery.prototype.setCurrentPicture = function(i) {
    this._image.src = this.pictures[i].url;
    this._likes.textContent = this.pictures[i].likes;
    this._comments.textContent = this.pictures[i].comments;
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
    this.hide();
    this.removeEventListener('click', _onPhotoClick);
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPicture(++this.currentPicture);
  };

  Gallery.prototype._onDocumentKeyDown = function() {
    if (event.keyCode === 27) {
      this.element.classList.add('invisible');
      this.removeEventListener('click', _onPhotoClick);
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


  window.Gallery = Gallery;

})();
