'use strict';

(function() {
  function inherit = function(child, parent) {

  function emptyCtor() {}

  emptyCtor.prototype = parent.prototype;

  child.prototype = new emptyCtor;
}

  window.inherit = inherit;

})();
