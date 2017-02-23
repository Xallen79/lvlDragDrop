var module = angular.module('lvl.directives.dragdrop', ['lvl.services']);

module.directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs, controller) {
            angular.element(el).attr('draggable', 'true');

            var id = angular.element(el).attr('id');

            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }

            el.bind('dragstart', function(e) {
                var oe = e.originalEvent || e;
                oe.dataTransfer.setData('text/plain', id);
                $rootScope.$emit('LVL-DRAG-START');
            });

            el.bind('dragend', function(e) {
                $rootScope.$emit('LVL-DRAG-END');
            });
        }
    };
}]);

module.directive('lvlDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function(scope, el, attrs, controller) {
            var id = angular.element(el).attr('id');
            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }

            el.bind('dragover', function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                var oe = e.originalEvent || e;
                oe.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
                return false;
            });

            el.bind('dragenter', function(e) {
                // this / e.target is the current hover target.
                angular.element(e.target).closest('#' + id).addClass('lvl-over');
                //angular.element(document.getElementById(id)).addClass('lvl-over');
            });

            el.bind('dragleave', function(e) {
                // this / e.target is previous target element.
                var el = angular.element(e.target);
                if (el.attr('id') === id) {
                    el.removeClass('lvl-over');
                }
            });

            el.bind('drop', function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropagation) {
                    e.stopPropagation(); // Necessary. Allows us to drop.
                }
                var oe = e.originalEvent || e;
                var data = oe.dataTransfer.getData('text/plain');
                var dest = document.getElementById(id);
                var targetOffset = angular.element(dest).offset();
                scope.onDrop({ dragId: data, dropId: id, relativePos: { x: e.clientX - targetOffset.left, y: e.clientY - targetOffset.top } });
            });

            $rootScope.$on('LVL-DRAG-START', function() {
                var el = document.getElementById(id);
                angular.element(el).addClass('lvl-target');
            });

            $rootScope.$on('LVL-DRAG-END', function() {
                var el = document.getElementById(id);
                angular.element(el).removeClass('lvl-target');
                angular.element(el).removeClass('lvl-over');
            });
        }
    };
}]);
