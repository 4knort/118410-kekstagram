'use strict';

define(function() {
  function inherit(child, parent) {

    function EmptyCtor() {}

    EmptyCtor.prototype = parent.prototype;

    child.prototype = new EmptyCtor();
  }

  return inherit;

});
