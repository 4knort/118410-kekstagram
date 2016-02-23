'use strict';

(function() {
  function inherit(child, parent) {

    function EmptyCtor() {}

    EmptyCtor.prototype = parent.prototype;

    child.prototype = new EmptyCtor();
  }

  window.inherit = inherit;

})();
