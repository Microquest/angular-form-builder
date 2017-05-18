(function() {
  var copyObjectToScope;

  copyObjectToScope = function(object, scope) {

    /*
    Copy object (ng-repeat="object in objects") to scope without `hashKey`.
     */
    var key, value;
    for (key in object) {
      value = object[key];
      if (key !== '$$hashKey') {
        scope[key] = value;
      }
    }
  };

  angular.module('builder.controller', ['builder.provider']).controller('fbFormObjectEditableController', [
    '$scope', '$injector', '$document', 'Upload', function($scope, $injector, $document, Upload) {
      var $builder, $filter, $modal;
      $builder = $injector.get('$builder');
      $modal = $injector.get('$modal');
      $filter = $injector.get('$filter');
      if ($scope.formObject.id === void 0) {
        $scope.formObject.id = $builder.config.max_id;
        $builder.config.max_id = $builder.config.max_id + 1;
      }
      $scope.cancel = function() {
        return $scope.modalInstance.dismiss('cancel');
      };
      $scope.save = function(text) {
        $scope.placeholder = text;
        CKEDITOR.instances.modal_ckeditor.focusManager.blur(true);
        if (CKEDITOR.instances.modal_ckeditor) {
          CKEDITOR.instances.modal_ckeditor.destroy(false);
        }
        return $scope.modalInstance.close();
      };
      $scope.openRichTextEditor = function() {
        $scope.editorText = $scope.placeholder;
        return $scope.modalInstance = $modal.open({
          controller: function($scope, $modalInstance) {
            return $scope.options = {
              language: 'en',
              allowedContent: true,
              entities: false
            };
          },
          template: '<div class="modal-header">\n    <button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>\n    <h4 class="modal-title">Edit Rich Content</div>\n</div>\n<div class="modal-body">\n  <div ckeditor="options" ng-model="editorText" id="modal_ckeditor"></div>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-white pull-left" ng-click="cancel()">Cancel</button>\n    <button class="btn btn-primary pull-right" ng-click="save(editorText)">Apply</button>\n</div> ',
          scope: $scope
        });
      };
      $scope.convertFileToData = function(file, invalid, scope) {
        return Upload.dataUrl(file, true).then(function(url) {
          return $scope.backgroundImage = url;
        });
      };
      $scope.date = Date.now();
      $scope.keys = Object.keys($builder.forms);
      $scope.setupScope = function(formObject) {

        /*
        1. Copy origin formObject (ng-repeat="object in formObjects") to scope.
        2. Setup optionsText with formObject.options.
        3. Watch scope.label, .description, .placeholder, .required, .options then copy to origin formObject.
        4. Watch scope.optionsText then convert to scope.options.
        5. setup validationOptions
         */
        var component;
        copyObjectToScope(formObject, $scope);
        $scope.optionsText = formObject.options.join('\n');
        $scope.$watch('[label,label_visible, label_inline, description, placeholder, backgroundImage, required, options, validation, multiple, minLength, maxLength, dateRangeStart, dateRangeEnd, disableWeekends, maxDate, requireConfirmation, readOnly, minRange, maxRange, nextXDays]', function() {
          formObject.label = $scope.label;
          formObject.label_visible = $scope.label_visible;
          formObject.label_inline = $scope.label_inline;
          formObject.description = $scope.description;
          formObject.placeholder = $scope.placeholder;
          formObject.backgroundImage = $scope.backgroundImage;
          formObject.required = $scope.required;
          formObject.options = $scope.options;
          formObject.multiple = $scope.multiple;
          formObject.validation = $scope.validation;
          formObject.minLength = $scope.minLength;
          formObject.maxLength = $scope.maxLength;
          formObject.dateRangeStart = $scope.dateRangeStart;
          formObject.dateRangeEnd = $scope.dateRangeEnd;
          formObject.disableWeekends = $scope.disableWeekends;
          formObject.maxDate = $scope.maxDate;
          formObject.requireConfirmation = $scope.requireConfirmation;
          formObject.readOnly = $scope.readOnly;
          formObject.minRange = $scope.minRange;
          formObject.maxRange = $scope.maxRange;
          return formObject.nextXDays = $scope.nextXDays;
        }, true);
        $scope.$watch('optionsText', function(text) {
          var x;
          $scope.options = (function() {
            var _i, _len, _ref, _results;
            _ref = text.split('\n');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              x = _ref[_i];
              if (x.length > 0) {
                _results.push(x);
              }
            }
            return _results;
          })();
          return $scope.inputText = $scope.options[0];
        });
        component = $builder.components[formObject.component];
        return $scope.validationOptions = component.validationOptions;
      };
      return $scope.data = {
        model: null,
        backup: function() {

          /*
          Backup input value.
           */
          return this.model = {
            label: $scope.label,
            label_inline: $scope.label_inline,
            label_visible: $scope.label_visible,
            description: $scope.description,
            placeholder: $scope.placeholder,
            backgroundImage: $scope.backgroundImage,
            required: $scope.required,
            optionsText: $scope.optionsText,
            validation: $scope.validation,
            multiple: $scope.multiple,
            minLength: $scope.minLength,
            maxLength: $scope.maxLength,
            dateRangeStart: $scope.dateRangeStart,
            dateRangeEnd: $scope.dateRangeEnd,
            disableWeekends: $scope.disableWeekends,
            maxDate: $scope.maxDate,
            requireConfirmation: $scope.requireConfirmation,
            readOnly: $scope.readOnly,
            minRange: $scope.minRange,
            maxRange: $scope.maxRange,
            nextXDays: $scope.nextXDays
          };
        },
        rollback: function() {

          /*
          Rollback input value.
           */
          if (!this.model) {
            return;
          }
          $scope.label = this.model.label;
          $scope.label_inline = this.model.label_inline;
          $scope.label_visible = this.model.label_visible;
          $scope.description = this.model.description;
          $scope.placeholder = this.model.placeholder;
          $scope.backgroundImage = this.model.backgroundImage;
          $scope.required = this.model.required;
          $scope.optionsText = this.model.optionsText;
          $scope.validation = this.model.validation;
          $scope.multiple = this.model.multiple;
          $scope.minLength = this.model.minLength;
          $scope.maxLength = this.model.maxLength;
          $scope.dateRangeStart = this.model.dateRangeStart;
          $scope.dateRangeEnd = this.model.dateRangeEnd;
          $scope.disableWeekends = this.model.disableWeekends;
          $scope.maxDate = this.model.maxDate;
          $scope.requireConfirmation = this.model.requireConfirmation;
          $scope.readOnly = this.model.readOnly;
          $scope.minRange = this.model.minRange;
          $scope.maxRange = this.model.maxRange;
          return $scope.nextXDays = this.model.nextXDays;
        }
      };
    }
  ]).controller('fbComponentsController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.selectGroup = function($event, group) {
        var component, name, _ref, _results;
        if ($event != null) {
          $event.preventDefault();
        }
        $scope.activeGroup = group;
        $scope.components = [];
        _ref = $builder.components;
        _results = [];
        for (name in _ref) {
          component = _ref[name];
          if (component.group === group) {
            _results.push($scope.components.push(component));
          }
        }
        return _results;
      };
      $scope.groups = $builder.groups;
      $scope.activeGroup = $scope.groups[0];
      $scope.allComponents = $builder.components;
      return $scope.$watch('allComponents', function() {
        return $scope.selectGroup(null, $scope.activeGroup);
      });
    }
  ]).controller('fbComponentController', [
    '$scope', function($scope) {
      return $scope.copyObjectToScope = function(object) {
        return copyObjectToScope(object, $scope);
      };
    }
  ]).controller('fbFormController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder, $rootScope, $timeout;
      $builder = $injector.get('$builder');
      $timeout = $injector.get('$timeout');
      $rootScope = $injector.get('$rootScope');
      $rootScope.fields = $builder.forms;
      if ($scope.input == null) {
        $scope.input = [];
      }
      $scope.$watch('form', function() {
        if ($scope.input.length > $scope.form.length) {
          $scope.input.splice($scope.form.length);
        }
        return $timeout(function() {
          return $scope.$broadcast($builder.broadcastChannel.updateInput);
        });
      }, true);
      $scope.$watch('input', function() {
        return $timeout(function() {
          return $scope.$broadcast($builder.broadcastChannel.loadInput, $scope.input);
        });
      });
      $scope.broadcastMessage = function(message) {
        return $rootScope.$broadcast(message);
      };
      return $scope.updateCanvasValue = function(id) {
        var canvas, url;
        canvas = document.getElementById(id);
        if (canvas) {
          url = canvas.toDataURL();
          return url;
        }
        return '';
      };
    }
  ]).controller('fbFormRowController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder, $rootScope, $timeout;
      $builder = $injector.get('$builder');
      $timeout = $injector.get('$timeout');
      $rootScope = $injector.get('$rootScope');
      return $scope.$watch('formRow.formObjects.length', function() {
        return $scope.width = $scope.formRow.formObjects.length === 0 ? 12 : 12 / $scope.formRow.formObjects.length;
      });
    }
  ]).controller('fbFormObjectController', [
    '$scope', '$injector', function($scope, $injector) {
      var $builder;
      $builder = $injector.get('$builder');
      $scope.copyObjectToScope = function(object) {
        return copyObjectToScope(object, $scope);
      };
      return $scope.updateInput = function(value) {

        /*
        Copy current scope.input[X] to $parent.input.
        @param value: The input value.
         */
        var input;
        input = {
          id: $scope.formObject.id,
          label: $scope.formObject.label,
          value: value != null ? value : ''
        };
        return $scope.$parent.input.splice($scope.$index, 1, input);
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('builder.directive', ['builder.provider', 'builder.controller', 'builder.drag', 'validator', 'ngFileUpload', 'ckeditor']).directive('richText', [
    '$injector', function($injector) {
      return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
          scope.text = scope.placeholder;
          scope.$watch('placeholder', function() {
            return scope.text = scope.placeholder;
          });
          return scope.$watch('text', function() {
            if (scope.text !== 'Rich Content') {
              return elem[0].innerHTML = scope.text;
            }
          });
        }
      };
    }
  ]).filter('nospace', function() {
    return function(input) {
      if ((input != null) && angular.isString(input)) {
        return input.replace(/[^A-Z0-9]/ig, "");
      }
    };
  }).filter('predicate', function() {
    return function(input) {
      switch (input) {
        case 'eq':
          input = 'Equals';
          break;
        case 'not_eq':
          input = 'Does not equal';
          break;
        case 'matches':
          input = 'Matches';
          break;
        case 'does_not_match':
          input = 'Does not match';
          break;
        case 'contains':
          input = 'Contains';
          break;
        case 'does_not_contain':
          input = 'Does not contain';
          break;
        case 'lt':
          input = 'Less than';
          break;
        case 'lteq':
          input = 'Less than or equal to';
          break;
        case 'gt':
          input = 'Greater than';
          break;
        case 'gteq':
          input = 'Greater than or equal to';
          break;
        case 'not_in':
          input = 'Not in';
          break;
        case 'not_null':
          input = 'is Not Empty';
          break;
        case 'null':
          input = 'is Empty';
      }
      return input;
    };
  }).directive('uiDate', [
    '$injector', function($injector) {
      return {
        restrict: 'E',
        template: "<p class=\"input-group\">\n  <input type=\"text\" class=\"form-control\" max-date=\"maxDate\" datepicker-popup=\"{{format}}\" ng-model=\"inputText\" is-open=\"opened\" min-date=\"minDate\" datepicker-options=\"dateOptions\" date-disabled=\"disabled(date, mode)\" close-text=\"Close\"  validator-required=\"{{required}}\" validator-group=\"{{required}}\" id=\"{{formName+index}}\" disabled/>\n  <span class=\"input-group-btn\">\n    <button ng-disabled=\"readOnly\" type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"glyphicons glyphicons-calendar\"></i></button>\n  </span>\n</p>",
        link: function(scope, element, attrs) {
          var extendPastWeekend;
          scope.inputText = '';
          scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            return scope.opened = true;
          };
          extendPastWeekend = function(from, daysOffset) {
            var count, dayInRange, i, _i;
            dayInRange = moment();
            count = 0;
            for (i = _i = 0; 0 <= daysOffset ? _i <= daysOffset : _i >= daysOffset; i = 0 <= daysOffset ? ++_i : --_i) {
              if (dayInRange.isoWeekday() === 6 || dayInRange.isoWeekday() === 7) {
                count++;
              }
              dayInRange.add(1, 'days');
            }
            return moment(from).add(count, 'days').format('YYYY-MM-DD');
          };
          if (scope.dateRangeStart) {
            scope.minDate = moment().add(scope.dateRangeStart, 'days').format('YYYY-MM-DD');
          } else {
            scope.minDate = moment().format('YYYY-MM-DD');
          }
          if (scope.dateRangeEnd) {
            scope.maxDate = moment().add(scope.dateRangeEnd, 'days').format('YYYY-MM-DD');
          }
          if (scope.disableWeekends) {
            if (scope.dateRangeStart) {
              scope.minDate = extendPastWeekend(scope.minDate, scope.dateRangeStart);
            }
            if (scope.dateRangeEnd) {
              scope.maxDate = extendPastWeekend(scope.maxDate, scope.dateRangeEnd);
            }
            return scope.disabled = function(date, mode) {
              return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            };
          } else {
            return scope.disabled = function(date, mode) {};
          }
        }
      };
    }
  ]).directive('fbBuilder', [
    '$injector', function($injector) {
      var $builder, $drag;
      $builder = $injector.get('$builder');
      $drag = $injector.get('$drag');
      return {
        restrict: 'A',
        scope: {
          fbBuilder: '@'
        },
        template: "<div class='form-horizontal'>\n    <div class='row fb-form-row-editable' ng-repeat=\"row in formRows\"\n        fb-form-row-editable=\"row\" fb-form-row-index='{{$index}}'></div>\n    <div ng-show='formRows.length === 0' class='row'>\n        <div class='col-sm-12' style='text-align: center'>\n            <h4> Form is empty </h4>\n            <p> Add a new row to start building your form </p>\n            <button type=\"button\" class=\"btn btn-md btn-default add-row\" style=''>\n              <i class=\"glyphicon glyphicon-plus\"></i> Add Row\n            </button>\n        </div>\n    </div>\n</div>",
        link: function(scope, element, attrs) {
          var beginMove, _base, _name;
          scope.formName = attrs.fbBuilder;
          if ((_base = $builder.forms)[_name = scope.formName] == null) {
            _base[_name] = [];
          }
          scope.formRows = $builder.forms[scope.formName];
          $builder.addFormRow(scope.formName);
          beginMove = true;
          $(element).find('.add-row').click(function() {
            $builder.addFormRow(scope.formName);
            return scope.$apply();
          });
          $(element).addClass('fb-builder');
          return $drag.droppable($(element), {
            move: function(e) {
              if (beginMove) {
                $("div.fb-form-object-editable").popover('hide');
                return beginMove = false;
              }
            },
            up: function(e, isHover, draggable) {
              beginMove = true;
              if (!$drag.isMouseMoved()) {
                $(element).find('.empty').remove();
              }
            }
          });
        }
      };
    }
  ]).directive('fbFormRowEditable', [
    '$injector', function($injector) {
      var $builder, $drag;
      $builder = $injector.get('$builder');
      $drag = $injector.get('$drag');
      return {
        restrict: 'A',
        scope: {
          fbFormRowEditable: '@',
          fbFormRowIndex: '@'
        },
        template: "<div class='col col-sm-{{width}} fb-form-object-editable' ng-repeat=\"object in formObjects\"\n    fb-form-object-editable=\"object\"></div>\n<div class=\"col col-sm-12 notify fb-form-row-empty\" ng-show='formObjects.length === 0' style='text-align: center; vertical-align: middle;'>\n    <button type=\"button\" class=\"btn btn-xs btn-default delete-row pull-right\" style='margin-top:10px'>\n      <i class=\"glyphicon glyphicon-remove\"></i>\n    </button>\n    <h4>Empty Row</h4>\n    <p> Drag and drop components here </p>\n</div>\n",
        link: function(scope, element, attrs) {
          var beginMove;
          scope.width = 12;
          scope.formName = scope.$parent.formName;
          scope.formObjects = $builder.forms[scope.formName][scope.fbFormRowIndex].formObjects;
          beginMove = true;
          $(element).find('.delete-row').click(function() {
            $builder.removeFormRow(scope.formName, scope.fbFormRowIndex);
            return scope.$apply();
          });
          $(element).addClass('fb-form-row-editable');
          $drag.droppable($(element), {
            move: function(e) {
              var $empty, $formObject, $formObjects, index, offset, positions, width, _i, _j, _ref, _ref1;
              $formObjects = $(element).find('.fb-form-object-editable:not(.empty,.dragging)');
              if ($formObjects.length === 0) {
                if ($(element).find('.fb-form-object-editable.empty').length === 0) {
                  $(element).find('.notify').hide();
                  $(element).prepend($("<div class='col col-sm-" + scope.width + " fb-form-object-editable empty'></div>"));
                }
                return;
              }
              scope.width = 12 / ($formObjects.length + 1);
              positions = [];
              positions.push(-1000);
              for (index = _i = 0, _ref = $formObjects.length; _i < _ref; index = _i += 1) {
                $formObject = $($formObjects[index]);
                offset = $formObject.offset();
                width = $formObject.width();
                positions.push(offset.left + width / 2);
              }
              positions.push(positions[positions.length - 1] + 1000);
              for (index = _j = 1, _ref1 = positions.length; _j < _ref1; index = _j += 1) {
                if (e.pageX > positions[index - 1] && e.pageX <= positions[index]) {
                  $(element).find('.empty').remove();
                  $empty = $("<div class='col col-sm-" + (scope.width - 1) + " fb-form-object-editable empty'></div>");
                  if (index - 1 < $formObjects.length) {
                    $empty.insertBefore($($formObjects[index - 1]));
                  } else {
                    $empty.insertAfter($($formObjects[index - 2]));
                  }
                  break;
                }
              }
            },
            out: function() {
              var $formObjects;
              $formObjects = $(element).find('.fb-form-object-editable:not(.empty,.dragging)');
              scope.width = 12 / $formObjects.length;
              if (beginMove) {
                $("div.fb-form-object-editable").popover('hide');
                beginMove = false;
              }
              $(element).find('.notify').show();
              return $(element).find('.empty').remove();
            },
            up: function(e, isHover, draggable) {
              var newIndex, newRow, oldIndex, oldRow;
              beginMove = true;
              if (!$drag.isMouseMoved()) {
                $(element).find('.empty').remove();
                return;
              }
              if (isHover) {
                if (draggable.mode === 'mirror') {
                  $builder.insertFormObject(scope.formName, scope.fbFormRowIndex, $(element).find('.empty').index('.fb-form-object-editable'), {
                    component: draggable.object.componentName
                  });
                }
                if (draggable.mode === 'drag') {
                  oldIndex = draggable.object.formObject.index;
                  newIndex = $(element).find('.empty').index('.fb-form-object-editable');
                  if (oldIndex < newIndex) {
                    newIndex--;
                  }
                  newRow = scope.fbFormRowIndex;
                  oldRow = draggable.object.formObject.row;
                  $builder.updateFormObjectIndex(scope.formName, oldRow, newRow, oldIndex, newIndex);
                }
              }
              return $(element).find('.empty').remove();
            }
          });
          return scope.$on("formBuilder:formObjectRemoved", function() {
            var $formObjects;
            $formObjects = $(element).find('.fb-form-object-editable:not(.empty,.dragging)');
            return scope.width = 12 / ($formObjects.length - 1);
          });
        }
      };
    }
  ]).directive('fbFormObjectEditable', [
    '$injector', function($injector) {
      var $builder, $compile, $drag, $validator;
      $builder = $injector.get('$builder');
      $drag = $injector.get('$drag');
      $compile = $injector.get('$compile');
      $validator = $injector.get('$validator');
      return {
        restrict: 'A',
        controller: 'fbFormObjectEditableController',
        scope: {
          formObject: '=fbFormObjectEditable'
        },
        link: function(scope, element) {
          var popover;
          scope.inputArray = [];
          scope.$component = $builder.components[scope.formObject.component];
          scope.setupScope(scope.formObject);
          scope.$watch('$component.template', function(template) {
            var complete, view;
            if (!template) {
              return;
            }
            complete = "<div class='row'>\n  <div class=\"col-sm-10\" style='pointer-events: none;'>" + template + "  </div>\n  <div class=\"col-sm-2\" style='vertical-align: middle'>\n      <div class='row' style='margin:5px; margin-top: 10px'>\n          <button type=\"button\" ng-click=\"\" class=\"btn btn-xs btn-danger delete-item\">\n            </i><i class=\"glyphicon glyphicon-remove\"></i>\n          </button>\n      </div>\n      <div class='row' style='margin:5px'>\n          <button type=\"button\" class=\"btn btn-xs btn-info modify-item\">\n            <i class=\"glyphicons glyphicons-edit\"></i><i class=\"glyphicon glyphicon-edit\"></i>\n          </button>\n      </div>\n  </div>\n</div>";
            view = $compile(complete)(scope);
            $(element).html(view);
            $(element).find('.modify-item').click(function() {
              return $(element).popover('toggle');
            });
            return $(element).find('.delete-item').click(function() {
              $builder.removeFormObject(scope.$parent.$parent.formName, scope.$parent.$parent.$parent.$index, scope.$parent.$index);
              scope.$emit("formBuilder:formObjectRemoved");
              return $(element).popover('hide');
            });
          });
          $drag.draggable($(element), {
            object: {
              formObject: scope.formObject
            }
          });
          if (!scope.formObject.editable) {
            return;
          }
          popover = {};
          scope.$watch('$component.popoverTemplate', function(template) {
            if (!template) {
              return;
            }
            $(element).removeClass(popover.id);
            popover = {
              id: "fb-" + (Math.random().toString().substr(2)),
              isClickedSave: false,
              view: null,
              html: template
            };
            popover.html = $(popover.html).addClass(popover.id);
            popover.view = $compile(popover.html)(scope);
            $(element).addClass(popover.id);
            return $(element).popover({
              html: true,
              title: scope.$component.label,
              content: popover.view,
              container: 'body',
              placement: $builder.config.popoverPlacement,
              trigger: 'manual'
            });
          });
          scope.popover = {
            save: function($event) {

              /*
              The save event of the popover.
               */
              $event.preventDefault();
              $validator.validate(scope).success(function() {
                popover.isClickedSave = true;
                return $(element).popover('hide');
              });
            },
            remove: function($event) {

              /*
              The delete event of the popover.
               */
              $event.preventDefault();
              $builder.removeFormObject(scope.$parent.formName, scope.$parent.$index);
              $(element).popover('hide');
            },
            shown: function() {

              /*
              The shown event of the popover.
               */
              scope.data.backup();
              return popover.isClickedSave = false;
            },
            cancel: function($event) {

              /*
              The cancel event of the popover.
               */
              scope.data.rollback();
              if ($event) {
                $event.preventDefault();
                $(element).popover('hide');
              }
            }
          };
          $(element).on('show.bs.popover', function() {
            var $popover, elementOrigin, popoverTop;
            if ($drag.isMouseMoved()) {
              return false;
            }
            $("div.fb-form-object-editable:not(." + popover.id + ")").popover('hide');
            $popover = $("form." + popover.id).closest('.popover');
            if ($popover.length > 0) {
              elementOrigin = $(element).offset().top + $(element).height() / 2;
              popoverTop = elementOrigin - $popover.height() / 2;
              $popover.css({
                position: 'absolute',
                top: popoverTop
              });
              $popover.show();
              setTimeout(function() {
                $popover.addClass('in');
                return $(element).triggerHandler('shown.bs.popover');
              }, 0);
              return false;
            }
          });
          $(element).on('shown.bs.popover', function() {
            $(".popover ." + popover.id + " input:first").select();
            scope.$apply(function() {
              return scope.popover.shown();
            });
          });
          return $(element).on('hide.bs.popover', function() {
            var $popover;
            $popover = $("form." + popover.id).closest('.popover');
            if (!popover.isClickedSave) {
              if (scope.$$phase || scope.$root.$$phase) {
                scope.popover.cancel();
              } else {
                scope.$apply(function() {
                  return scope.popover.cancel();
                });
              }
            }
            $popover.removeClass('in');
            setTimeout(function() {
              return $popover.hide();
            }, 300);
            return false;
          });
        }
      };
    }
  ]).directive('componentSelector', [
    '$injector', function($injector) {
      var $builder;
      $builder = $injector.get('$builder');
      return {
        restrict: 'E',
        template: "<select ng-model=\"formObject.logic.component\" class=\"form-control custom-m-b\">\n  <optgroup ng-repeat=\"(groupName, items) in fields()\" label=\"{{'Page: ' + groupName}}\">\n      <option ng-selected=\"item.id === componentize(formObject.logic.component)\" ng-if=\"keys.indexOf(groupName) < keys.indexOf(currentForm) || (keys.indexOf(groupName) === keys.indexOf(currentForm) && item.index < formObject.index)\" ng-repeat=\"item in fields()[groupName]\" value=\"{{item}}\">{{item.component}} - {{item.label}}</option>\n  </optgroup>\n</select>",
        link: function(scope, elem, attrs) {
          scope.fields = function() {
            if (elem.parent().parent().parent().parent().parent().is(':visible') === true) {
              return $builder.forms;
            } else {
              return [];
            }
          };
          return scope.componentize = function(component) {
            if (component != null) {
              return angular.fromJson(component).id;
            }
          };
        }
      };
    }
  ]).directive('fbComponents', function() {
    return {
      restrict: 'A',
      template: "<ul ng-if=\"groups.length > 1\" class=\"nav nav-tabs nav-justified\" style='margin-top:10px'>\n    <li ng-repeat=\"group in groups\" ng-class=\"{active:activeGroup==group}\">\n        <a href='#' ng-click=\"selectGroup($event, group)\">{{group}}</a>\n    </li>\n</ul>\n<div class='form-horizontal' style='margin:10px'>\n    <div class='fb-component' ng-repeat=\"component in components\"\n        fb-component=\"component\"></div>\n</div>",
      controller: 'fbComponentsController'
    };
  }).directive('fbComponent', [
    '$injector', function($injector) {
      var $builder, $compile, $drag;
      $builder = $injector.get('$builder');
      $drag = $injector.get('$drag');
      $compile = $injector.get('$compile');
      return {
        restrict: 'A',
        scope: {
          component: '=fbComponent'
        },
        controller: 'fbComponentController',
        link: function(scope, element) {
          scope.copyObjectToScope(scope.component);
          $drag.draggable($(element), {
            mode: 'mirror',
            defer: false,
            object: {
              componentName: scope.component.name
            }
          });
          return scope.$watch('component.template', function(template) {
            var view;
            if (!template) {
              return;
            }
            view = $compile(template)(scope);
            return $(element).html(view);
          });
        }
      };
    }
  ]).directive('fbMultiple', [
    '$injector', function($injector) {
      var $builder;
      $builder = $injector.get('$builder');
      return {
        restrict: 'E',
        scope: {
          array: '='
        },
        templateUrl: 'src/ngMultiple.html',
        link: function(scope, element, attrs) {
          scope.seeForms = function() {
            return console.log($builder.forms);
          };
          scope.select = function(item) {
            return scope.selected = item;
          };
          return scope.addPage = function() {
            return scope.array.push(scope.array.length + 1);
          };
        }
      };
    }
  ]).directive('fbForm', [
    '$injector', function($injector) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          formName: '@fbForm',
          input: '=ngModel',
          "default": '=fbDefault'
        },
        template: "<div class='form-horizontal'>\n  <div class='fb-form-row' ng-repeat=\"row in form\" fb-form-row form-row=\"row\"></div>\n  <div ng-if='form.length === 0'>\n      <h4> This form is empty </h4>\n  </div>\n</div>",
        controller: 'fbFormController',
        link: function(scope, element, attrs) {
          var $builder, _base, _name;
          $builder = $injector.get('$builder');
          if ((_base = $builder.forms)[_name = scope.formName] == null) {
            _base[_name] = [];
          }
          return scope.form = $builder.forms[scope.formName];
        }
      };
    }
  ]).directive('fbFormRow', [
    '$injector', function($injector) {
      var $builder, $compile, $parse;
      $builder = $injector.get('$builder');
      $compile = $injector.get('$compile');
      $parse = $injector.get('$parse');
      return {
        restrict: 'A',
        scope: {
          formRow: '='
        },
        template: "<div class='row fb-form-row'>\n  <div class='col col-sm-{{width}} fb-form-object' ng-repeat=\"object in formRow.formObjects\" fb-form-object=\"object\"></div>\n  <div ng-if='form.length === 0'>\n      <h4> This row is empty </h4>\n  </div>\n</div>",
        controller: 'fbFormRowController',
        link: function(scope, element, attrs) {
          scope.input = [];
          scope.width = scope.formRow.formObjects.length === 0 ? 12 : 12 / scope.formRow.formObjects.length;
          return scope.$parent.input.splice(scope.formRow.index, 1, scope.input);
        }
      };
    }
  ]).directive('fbFormObject', [
    '$injector', function($injector) {
      var $builder, $compile, $parse;
      $builder = $injector.get('$builder');
      $compile = $injector.get('$compile');
      $parse = $injector.get('$parse');
      return {
        restrict: 'A',
        controller: 'fbFormObjectController',
        link: function(scope, element, attrs) {
          scope.formObject = $parse(attrs.fbFormObject)(scope);
          scope.$component = $builder.components[scope.formObject.component];
          scope.formName = scope.$parent.$parent.formName;
          scope.$on($builder.broadcastChannel.updateInput, function() {
            return scope.updateInput(scope.inputText);
          });
          scope.$on($builder.broadcastChannel.loadInput, function(event, values) {
            var itemIndex, row;
            row = scope.$parent.$parent.$index;
            itemIndex = _.findIndex(values[row], function(o) {
              return o.id === scope.formObject.id;
            });
            return scope.inputText = values[row][itemIndex].value;
          });
          if (scope.$component.arrayToText) {
            scope.inputArray = [];
            scope.$watch('inputArray', function(newValue, oldValue) {
              var checked, index, _ref;
              if (newValue === oldValue) {
                return;
              }
              checked = [];
              for (index in scope.inputArray) {
                if (scope.inputArray[index]) {
                  if (index !== 'diff') {
                    checked.push((_ref = scope.options[index]) != null ? _ref : scope.inputArray[index]);
                  }
                }
              }
              return scope.inputText = checked.join(', ');
            }, true);
          }
          scope.$watch('inputText', function() {
            return scope.updateInput(scope.inputText);
          });
          scope.$watch(attrs.fbFormObject, function() {
            return scope.copyObjectToScope(scope.formObject);
          }, true);
          scope.$watch('$component.template', function(template) {
            var $input, $template, view;
            if (!template) {
              return;
            }
            $template = $(template);
            $input = $template.find("[ng-model='inputText']");
            $input.attr({
              validator: '{{validation}}'
            });
            view = $compile($template)(scope);
            return $(element).html(view);
          });
          if (!scope.$component.arrayToText && scope.formObject.options.length > 0) {
            scope.inputText = scope.formObject.options[0];
          }
          return scope.$watch("default['" + scope.formObject.id + "']", function(value) {
            if (!value) {
              return;
            }
            if (scope.$component.arrayToText) {
              return scope.inputArray = value;
            } else {
              return scope.inputText = value;
            }
          });
        }
      };
    }
  ]).directive('uploadPhoto', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return angular.element('#uploadBtn').onchange = function() {
          return angular.element('#uploadFile').value = this.value;
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('builder.drag', []).provider('$drag', function() {
    var $injector, $rootScope, delay;
    $injector = null;
    $rootScope = null;
    this.data = {
      draggables: {},
      droppables: {}
    };
    this.mouseMoved = false;
    this.mx = 0;
    this.my = 0;
    this.isMouseMoved = (function(_this) {
      return function() {
        return _this.mouseMoved;
      };
    })(this);
    this.hooks = {
      down: {},
      move: {},
      up: {}
    };
    this.eventMouseMove = function() {};
    this.eventMouseUp = function() {};
    $((function(_this) {
      return function() {
        $(document).on('mousedown', function(e) {
          var func, key, _ref;
          _this.mouseMoved = false;
          _ref = _this.hooks.down;
          for (key in _ref) {
            func = _ref[key];
            func(e);
          }
        });
        $(document).on('mousemove', function(e) {
          var func, key, _ref;
          if (e.pageX === _this.mx && e.pageY === _this.my) {
            return;
          }
          _this.mx = e.pageX;
          _this.my = e.pageY;
          _this.mouseMoved = true;
          _ref = _this.hooks.move;
          for (key in _ref) {
            func = _ref[key];
            func(e);
          }
        });
        return $(document).on('mouseup', function(e) {
          var func, key, _ref;
          _ref = _this.hooks.up;
          for (key in _ref) {
            func = _ref[key];
            func(e);
          }
        });
      };
    })(this));
    this.currentId = 0;
    this.getNewId = (function(_this) {
      return function() {
        return "" + (_this.currentId++);
      };
    })(this);
    this.setupEasing = function() {
      return jQuery.extend(jQuery.easing, {
        easeOutQuad: function(x, t, b, c, d) {
          return -c * (t /= d) * (t - 2) + b;
        }
      });
    };
    this.setupProviders = function(injector) {

      /*
      Setup providers.
       */
      $injector = injector;
      return $rootScope = $injector.get('$rootScope');
    };
    this.isHover = (function(_this) {
      return function($elementA, $elementB) {

        /*
        Is element A hover on element B?
        @param $elementA: jQuery object
        @param $elementB: jQuery object
         */
        var isHover, offsetA, offsetB, sizeA, sizeB;
        offsetA = $elementA.offset();
        offsetB = $elementB.offset();
        sizeA = {
          width: $elementA.width(),
          height: $elementA.height()
        };
        sizeB = {
          width: $elementB.width(),
          height: $elementB.height()
        };
        isHover = {
          x: false,
          y: false
        };
        isHover.x = offsetA.left > offsetB.left && offsetA.left < offsetB.left + sizeB.width;
        isHover.x = isHover.x || offsetA.left + sizeA.width > offsetB.left && offsetA.left + sizeA.width < offsetB.left + sizeB.width;
        if (!isHover) {
          return false;
        }
        isHover.y = offsetA.top > offsetB.top && offsetA.top < offsetB.top + sizeB.height;
        isHover.y = isHover.y || offsetA.top + sizeA.height > offsetB.top && offsetA.top + sizeA.height < offsetB.top + sizeB.height;
        return isHover.x && isHover.y;
      };
    })(this);
    delay = function(ms, func) {
      return setTimeout(function() {
        return func();
      }, ms);
    };
    this.autoScroll = {
      up: false,
      down: false,
      scrolling: false,
      scroll: (function(_this) {
        return function() {
          _this.autoScroll.scrolling = true;
          if (_this.autoScroll.up) {
            $('html, body').dequeue().animate({
              scrollTop: $(window).scrollTop() - 50
            }, 100, 'easeOutQuad');
            return delay(100, function() {
              return _this.autoScroll.scroll();
            });
          } else if (_this.autoScroll.down) {
            $('html, body').dequeue().animate({
              scrollTop: $(window).scrollTop() + 50
            }, 100, 'easeOutQuad');
            return delay(100, function() {
              return _this.autoScroll.scroll();
            });
          } else {
            return _this.autoScroll.scrolling = false;
          }
        };
      })(this),
      start: (function(_this) {
        return function(e) {
          if (e.clientY < 50) {
            _this.autoScroll.up = true;
            _this.autoScroll.down = false;
            if (!_this.autoScroll.scrolling) {
              return _this.autoScroll.scroll();
            }
          } else if (e.clientY > $(window).innerHeight() - 50) {
            _this.autoScroll.up = false;
            _this.autoScroll.down = true;
            if (!_this.autoScroll.scrolling) {
              return _this.autoScroll.scroll();
            }
          } else {
            _this.autoScroll.up = false;
            return _this.autoScroll.down = false;
          }
        };
      })(this),
      stop: (function(_this) {
        return function() {
          _this.autoScroll.up = false;
          return _this.autoScroll.down = false;
        };
      })(this)
    };
    this.dragMirrorMode = (function(_this) {
      return function($element, defer, object) {
        var result;
        if (defer == null) {
          defer = true;
        }
        result = {
          id: _this.getNewId(),
          mode: 'mirror',
          maternal: $element[0],
          element: null,
          object: object
        };
        $element.on('mousedown', function(e) {
          var $clone;
          e.preventDefault();
          $clone = $element.clone();
          result.element = $clone[0];
          $clone.addClass("fb-draggable form-horizontal prepare-dragging");
          _this.hooks.move.drag = function(e, defer) {
            var droppable, id, _ref, _results;
            if ($clone.hasClass('prepare-dragging')) {
              $clone.css({
                width: $element.width(),
                height: $element.height()
              });
              $clone.removeClass('prepare-dragging');
              $clone.addClass('dragging');
              if (defer) {
                return;
              }
            }
            $clone.offset({
              left: e.pageX - $clone.width() / 2,
              top: e.pageY - $clone.height() / 2
            });
            _this.autoScroll.start(e);
            _ref = _this.data.droppables;
            _results = [];
            for (id in _ref) {
              droppable = _ref[id];
              if (_this.isHover($clone, $(droppable.element))) {
                _results.push(droppable.move(e, result));
              } else {
                _results.push(droppable.out(e, result));
              }
            }
            return _results;
          };
          _this.hooks.up.drag = function(e) {
            var droppable, id, isHover, _ref;
            _ref = _this.data.droppables;
            for (id in _ref) {
              droppable = _ref[id];
              isHover = _this.isHover($clone, $(droppable.element));
              droppable.up(e, isHover, result);
            }
            delete _this.hooks.move.drag;
            delete _this.hooks.up.drag;
            result.element = null;
            $clone.remove();
            return _this.autoScroll.stop();
          };
          $('body').append($clone);
          if (!defer) {
            return _this.hooks.move.drag(e, defer);
          }
        });
        return result;
      };
    })(this);
    this.dragDragMode = (function(_this) {
      return function($element, defer, object) {
        var result;
        if (defer == null) {
          defer = true;
        }
        result = {
          id: _this.getNewId(),
          mode: 'drag',
          maternal: null,
          element: $element[0],
          object: object
        };
        $element.addClass('fb-draggable');
        $element.on('mousedown', function(e) {
          e.preventDefault();
          if ($element.hasClass('dragging')) {
            return;
          }
          $element.addClass('prepare-dragging');
          _this.hooks.move.drag = function(e, defer) {
            var droppable, id, _ref;
            if ($element.hasClass('prepare-dragging')) {
              $element.css({
                width: $element.width(),
                height: $element.height()
              });
              $element.removeClass('prepare-dragging');
              $element.addClass('dragging');
              if (defer) {
                return;
              }
            }
            $element.offset({
              left: e.pageX - $element.width() / 2,
              top: e.pageY - $element.height() / 2
            });
            _this.autoScroll.start(e);
            _ref = _this.data.droppables;
            for (id in _ref) {
              droppable = _ref[id];
              if (_this.isHover($element, $(droppable.element))) {
                droppable.move(e, result);
              } else {
                droppable.out(e, result);
              }
            }
          };
          _this.hooks.up.drag = function(e) {
            var droppable, id, isHover, _ref;
            _ref = _this.data.droppables;
            for (id in _ref) {
              droppable = _ref[id];
              isHover = _this.isHover($element, $(droppable.element));
              droppable.up(e, isHover, result);
            }
            delete _this.hooks.move.drag;
            delete _this.hooks.up.drag;
            $element.css({
              width: '',
              height: '',
              left: '',
              top: ''
            });
            $element.removeClass('dragging defer-dragging');
            return _this.autoScroll.stop();
          };
          if (!defer) {
            return _this.hooks.move.drag(e, defer);
          }
        });
        return result;
      };
    })(this);
    this.dropMode = (function(_this) {
      return function($element, options) {
        var result;
        result = {
          id: _this.getNewId(),
          element: $element[0],
          move: function(e, draggable) {
            return $rootScope.$apply(function() {
              return typeof options.move === "function" ? options.move(e, draggable) : void 0;
            });
          },
          up: function(e, isHover, draggable) {
            return $rootScope.$apply(function() {
              return typeof options.up === "function" ? options.up(e, isHover, draggable) : void 0;
            });
          },
          out: function(e, draggable) {
            return $rootScope.$apply(function() {
              return typeof options.out === "function" ? options.out(e, draggable) : void 0;
            });
          }
        };
        return result;
      };
    })(this);
    this.draggable = (function(_this) {
      return function($element, options) {
        var draggable, element, result, _i, _j, _len, _len1;
        if (options == null) {
          options = {};
        }

        /*
        Make the element could be drag.
        @param element: The jQuery element.
        @param options: Options
            mode: 'drag' [default], 'mirror'
            defer: yes/no. defer dragging
            object: custom information
         */
        result = [];
        if (options.mode === 'mirror') {
          for (_i = 0, _len = $element.length; _i < _len; _i++) {
            element = $element[_i];
            draggable = _this.dragMirrorMode($(element), options.defer, options.object);
            result.push(draggable.id);
            _this.data.draggables[draggable.id] = draggable;
          }
        } else {
          for (_j = 0, _len1 = $element.length; _j < _len1; _j++) {
            element = $element[_j];
            draggable = _this.dragDragMode($(element), options.defer, options.object);
            result.push(draggable.id);
            _this.data.draggables[draggable.id] = draggable;
          }
        }
        return result;
      };
    })(this);
    this.droppable = (function(_this) {
      return function($element, options) {
        var droppable, element, result, _i, _len;
        if (options == null) {
          options = {};
        }

        /*
        Make the element coulde be drop.
        @param $element: The jQuery element.
        @param options: The droppable options.
            move: The custom mouse move callback. (e, draggable)->
            up: The custom mouse up callback. (e, isHover, draggable)->
            out: The custom mouse out callback. (e, draggable)->
         */
        result = [];
        for (_i = 0, _len = $element.length; _i < _len; _i++) {
          element = $element[_i];
          droppable = _this.dropMode($(element), options);
          result.push(droppable);
          _this.data.droppables[droppable.id] = droppable;
        }
        return result;
      };
    })(this);
    this.get = function($injector) {
      this.setupEasing();
      this.setupProviders($injector);
      return {
        isMouseMoved: this.isMouseMoved,
        data: this.data,
        draggable: this.draggable,
        droppable: this.droppable
      };
    };
    this.get.$inject = ['$injector'];
    this.$get = this.get;
  });

}).call(this);

(function() {
  angular.module('builder', ['builder.directive']).run(function($validator) {
    $validator.register('text', {
      invoke: 'watch',
      validator: function(value, scope, element, attrs, $injector) {
        return scope.minLength === 0 || (value.length >= scope.minLength && value.length <= scope.maxLength);
      }
    });
    return $validator.register('numberRange', {
      invoke: 'watch',
      validator: function(value, scope, element, attrs, $injector) {
        return value >= scope.minRange && value <= scope.maxRange;
      }
    });
  });

}).call(this);


/*
    component:
        It is like a class.
        The base components are textInput, textArea, select, check, radio.
        User can custom the form with components.
    formObject:
        It is like an object (an instance of the component).
        User can custom the label, description, required and validation of the input.
    form:
        This is for end-user. There are form groups int the form.
        They can input the value to the form.
 */

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('builder.provider', []).provider('$builder', function() {
    var $http, $injector, $templateCache;
    $injector = null;
    $http = null;
    $templateCache = null;
    this.config = {
      popoverPlacement: 'right',
      max_id: 0
    };
    this.components = {};
    this.groups = [];
    this.broadcastChannel = {
      updateInput: '$updateInput',
      loadInput: '$loadInput',
      loadComplete: '$builder.loadCompleted'
    };
    this.forms = {};
    this.convertComponent = function(name, component) {
      var result, _ref, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      result = {
        name: name,
        group: (_ref = component.group) != null ? _ref : 'Default',
        label: (_ref1 = component.label) != null ? _ref1 : '',
        label_inline: (_ref2 = component.label_inline) != null ? _ref2 : true,
        label_visible: (_ref3 = component.label_visible) != null ? _ref3 : true,
        description: (_ref4 = component.description) != null ? _ref4 : '',
        placeholder: (_ref5 = component.placeholder) != null ? _ref5 : '',
        editable: (_ref6 = component.editable) != null ? _ref6 : true,
        required: (_ref7 = component.required) != null ? _ref7 : false,
        validation: (_ref8 = component.validation) != null ? _ref8 : '/.*/',
        validationOptions: (_ref9 = component.validationOptions) != null ? _ref9 : [],
        options: (_ref10 = component.options) != null ? _ref10 : [],
        arrayToText: (_ref11 = component.arrayToText) != null ? _ref11 : false,
        template: component.template,
        templateUrl: component.templateUrl,
        popoverTemplate: component.popoverTemplate,
        popoverTemplateUrl: component.popoverTemplateUrl
      };
      if (!result.template && !result.templateUrl) {
        console.error("The template is empty.");
      }
      if (!result.popoverTemplate && !result.popoverTemplateUrl) {
        console.error("The popoverTemplate is empty.");
      }
      return result;
    };
    this.convertFormObject = function(name, formObject) {
      var component, result, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (formObject == null) {
        formObject = {};
      }
      component = this.components[formObject.component];
      if (component == null) {
        throw "The component " + formObject.component + " was not registered.";
      }
      result = {
        id: formObject.id,
        component: formObject.component,
        editable: (_ref = formObject.editable) != null ? _ref : component.editable,
        index: (_ref1 = formObject.index) != null ? _ref1 : 0,
        row: (_ref2 = formObject.row) != null ? _ref2 : 0,
        label: (_ref3 = formObject.label) != null ? _ref3 : component.label,
        label_inline: (_ref4 = formObject.label_inline) != null ? _ref4 : component.label_inline,
        label_visible: (_ref5 = formObject.label_visible) != null ? _ref5 : component.label_visible,
        description: (_ref6 = formObject.description) != null ? _ref6 : component.description,
        placeholder: (_ref7 = formObject.placeholder) != null ? _ref7 : component.placeholder,
        options: (_ref8 = formObject.options) != null ? _ref8 : component.options,
        required: (_ref9 = formObject.required) != null ? _ref9 : component.required,
        validation: (_ref10 = formObject.validation) != null ? _ref10 : component.validation,
        multiple: (_ref11 = formObject.multiple) != null ? _ref11 : component.multiple,
        minLength: (_ref12 = formObject.minLength) != null ? _ref12 : component.minLength,
        maxLength: (_ref13 = formObject.maxLength) != null ? _ref13 : component.maxLength,
        dateRangeStart: (_ref14 = formObject.dateRangeStart) != null ? _ref14 : component.dateRangeStart,
        dateRangeEnd: (_ref15 = formObject.dateRangeEnd) != null ? _ref15 : component.dateRangeEnd,
        disableWeekends: (_ref16 = formObject.disableWeekends) != null ? _ref16 : component.disableWeekends,
        readOnly: (_ref17 = formObject.readOnly) != null ? _ref17 : component.readOnly,
        nextXDays: (_ref18 = formObject.nextXDays) != null ? _ref18 : component.nextXDays,
        maxDate: (_ref19 = formObject.maxDate) != null ? _ref19 : component.maxDate,
        requireConfirmation: (_ref20 = formObject.requireConfirmation) != null ? _ref20 : component.requireConfirmation,
        minRange: (_ref21 = formObject.minRange) != null ? _ref21 : component.minRange,
        maxRange: (_ref22 = formObject.maxRange) != null ? _ref22 : component.maxRange,
        category: (_ref23 = formObject.category) != null ? _ref23 : component.category,
        backgroundImage: (_ref24 = formObject.backgroundImage) != null ? _ref24 : component.backgroundImage,
        imageWidth: (_ref25 = formObject.imageWidth) != null ? _ref25 : component.imageWidth,
        imageHeight: (_ref26 = formObject.imageHeight) != null ? _ref26 : component.imageHeight
      };
      return result;
    };
    this.reindexFormObject = (function(_this) {
      return function(name, row) {
        var formObjects, index, _i, _ref;
        formObjects = _this.forms[name][row].formObjects;
        for (index = _i = 0, _ref = formObjects.length; _i < _ref; index = _i += 1) {
          formObjects[index].index = index;
        }
      };
    })(this);
    this.reindexFormRows = (function(_this) {
      return function(name) {
        var formRows, index, _i, _ref;
        formRows = _this.forms[name];
        for (index = _i = 0, _ref = formRows.length; _i < _ref; index = _i += 1) {
          formRows[index].index = index;
        }
      };
    })(this);
    this.setupProviders = (function(_this) {
      return function(injector) {
        var $modal;
        $injector = injector;
        $http = $injector.get('$http');
        $templateCache = $injector.get('$templateCache');
        return $modal = $injector.get('$modal');
      };
    })(this);
    this.loadTemplate = function(component) {

      /*
      Load template for components.
      @param component: {object} The component of $builder.
       */
      if (component.template == null) {
        $http.get(component.templateUrl, {
          cache: $templateCache
        }).success(function(template) {
          return component.template = template;
        });
      }
      if (component.popoverTemplate == null) {
        return $http.get(component.popoverTemplateUrl, {
          cache: $templateCache
        }).success(function(template) {
          return component.popoverTemplate = template;
        });
      }
    };
    this.registerComponent = (function(_this) {
      return function(name, component) {
        var newComponent, _ref;
        if (component == null) {
          component = {};
        }

        /*
        Register the component for form-builder.
        @param name: The component name.
        @param component: The component object.
            group: {string} The component group.
            label: {string} The label of the input.
            description: {string} The description of the input.
            placeholder: {string} The placeholder of the input.
            editable: {bool} Is the form object editable?
            required: {bool} Is the form object required?
            validation: {string} angular-validator. "/regex/" or "[rule1, rule2]". (default is RegExp(.*))
            validationOptions: {array} [{rule: angular-validator, label: 'option label'}] the options for the validation. (default is [])
            options: {array} The input options.
            arrayToText: {bool} checkbox could use this to convert input (default is no)
            template: {string} html template
            templateUrl: {string} The url of the template.
            popoverTemplate: {string} html template
            popoverTemplateUrl: {string} The url of the popover template.
         */
        if (_this.components[name] == null) {
          newComponent = _this.convertComponent(name, component);
          _this.components[name] = newComponent;
          if ($injector != null) {
            _this.loadTemplate(newComponent);
          }
          if (_ref = newComponent.group, __indexOf.call(_this.groups, _ref) < 0) {
            _this.groups.push(newComponent.group);
          }
        } else {
          console.error("The component " + name + " was registered.");
        }
      };
    })(this);
    this.addFormRow = (function(_this) {
      return function(name) {

        /*
        Insert the form row into the form at last.
         */
        var _base;
        if ((_base = _this.forms)[name] == null) {
          _base[name] = [];
        }
        return _this.insertFormRow(name, _this.forms[name].length);
      };
    })(this);
    this.removeFormRow = (function(_this) {
      return function(name, row) {

        /*
        Remove the form object by the index.
        @param name: The form name.
        @param index: The form object index.
         */
        var formRows, forms;
        forms = _this.forms;
        formRows = forms[name];
        formRows.splice(row, 1);
        return _this.reindexFormRows(name);
      };
    })(this);
    this.addFormObject = (function(_this) {
      return function(name, row, formObject) {
        var _base;
        if (formObject == null) {
          formObject = {};
        }

        /*
        Insert the form object into the form at last.
         */
        if ((_base = _this.forms)[name] == null) {
          _base[name] = [
            {
              index: 0,
              formObjects: []
            }
          ];
        }
        return _this.insertFormObject(name, row, _this.forms[name][row].formObjects.length, formObject);
      };
    })(this);
    this.insertFormObject = (function(_this) {
      return function(name, row, index, formObject) {
        var _base;
        if (formObject == null) {
          formObject = {};
        }

        /*
        Insert the form object into the form at {index}.
        @param name: The form name.
        @param index: The form object index.
        @param form: The form object.
            id: The form object id.
            component: {string} The component name
            editable: {bool} Is the form object editable? (default is yes)
            label: {string} The form object label.
            description: {string} The form object description.
            placeholder: {string} The form object placeholder.
            options: {array} The form object options.
            required: {bool} Is the form object required? (default is no)
            validation: {string} angular-validator. "/regex/" or "[rule1, rule2]".
            [index]: {int} The form object index. It will be updated by $builder.
        @return: The form object.
         */
        if ((_base = _this.forms)[name] == null) {
          _base[name] = [
            {
              index: 0,
              formObjects: []
            }
          ];
        }
        if (index > _this.forms[name][row].formObjects.length) {
          index = _this.forms[name][row].formObjects.length;
        } else if (index < 0) {
          index = 0;
        }
        formObject.row = parseInt(row);
        _this.forms[name][row].formObjects.splice(index, 0, _this.convertFormObject(name, formObject));
        if (_this.forms[name][_this.forms[name].length - 1].formObjects.length !== 0) {
          _this.addFormRow(name);
        }
        _this.reindexFormObject(name, row);
        return _this.forms[name][row].formObjects[index];
      };
    })(this);
    this.insertFormRow = (function(_this) {
      return function(name, index) {
        var _base;
        if ((_base = _this.forms)[name] == null) {
          _base[name] = [];
        }
        if (index > _this.forms[name].length) {
          index = _this.forms[name].length;
        } else if (index < 0) {
          index = 0;
        }
        _this.forms[name].splice(index, 0, {
          index: index,
          formObjects: []
        });
        _this.reindexFormRows(name);
        return _this.forms[name][index];
      };
    })(this);
    this.removeFormObject = (function(_this) {
      return function(name, row, index) {

        /*
        Remove the form object by the index.
        @param name: The form name.
        @param index: The form object index.
         */
        var formObjects, forms, reindexFormObject;
        forms = _this.forms;
        reindexFormObject = _this.reindexFormObject;
        formObjects = forms[name][row].formObjects;
        formObjects.splice(index, 1);
        return reindexFormObject(name, row);
      };
    })(this);
    this.clearForm = (function(_this) {
      return function(name) {

        /*
        Clears all components from the form object.
        @param name: The form name.
         */
        return _this.forms[name] = [
          {
            index: 0,
            formObjects: []
          }
        ];
      };
    })(this);
    this.loadFromArray = (function(_this) {
      return function(name, formRows) {

        /*
        Adds a list of objects to the specified form
        @param name: The form name.
        @param formObjects: The form compoennts to add.
         */
        var component, row, _base;
        if ((_base = _this.forms)[name] == null) {
          _base[name] = [];
        }
        for (row in formRows) {
          if (row > 0) {
            _this.forms[name].splice(row, 0, {
              index: row,
              formObjects: []
            });
          }
          for (component in formRows[row].formObjects) {
            _this.forms[name][row].formObjects.splice(component, 0, _this.convertFormObject(name, formRows[row].formObjects[component]));
          }
          _this.reindexFormObject(name, row);
        }
        for (row in formRows) {
          if (formRows[row].formObjects.length === 0) {
            _this.forms[name].splice(row, 1);
            row--;
          }
        }
        return _this.reindexFormRows(name);
      };
    })(this);
    this.updateFormObjectIndex = (function(_this) {
      return function(name, oldRow, newRow, oldIndex, newIndex) {

        /*
        Update the index of the form object.
        @param name: The form name.
        @param oldIndex: The old index.
        @param newIndex: The new index.
         */
        var formObject, formObjects, formRow, formRows, newFormObjects, newFormRow;
        if (oldIndex === newIndex && oldRow === newRow) {
          return;
        }
        formRows = _this.forms[name];
        formRow = formRows[oldRow];
        formObjects = formRow.formObjects;
        formObject = formObjects.splice(oldIndex, 1)[0];
        if (oldRow === newRow) {
          formObjects.splice(newIndex, 0, formObject);
        } else {
          newFormRow = formRows[newRow];
          newFormObjects = newFormRow.formObjects;
          newFormObjects.splice(newIndex, 0, formObject);
        }
        if (_this.forms[name][_this.forms[name].length - 1].formObjects.length !== 0) {
          _this.addFormRow(name);
        }
        _this.reindexFormObject(name, oldRow);
        return _this.reindexFormObject(name, newRow);
      };
    })(this);
    this.resetProviderData = (function(_this) {
      return function() {

        /*
        Clears the data of this provider. Resets as if forst load.
         */
        $injector = null;
        $http = null;
        $templateCache = null;
        _this.config = {
          popoverPlacement: 'right',
          max_id: 0
        };
        _this.components = {};
        _this.groups = [];
        _this.broadcastChannel = {
          updateInput: '$updateInput'
        };
        return _this.forms = {};
      };
    })(this);
    this.$get = [
      '$injector', (function(_this) {
        return function($injector) {
          var component, name, _ref;
          _this.setupProviders($injector);
          _ref = _this.components;
          for (name in _ref) {
            component = _ref[name];
            _this.loadTemplate(component);
          }
          return {
            config: _this.config,
            components: _this.components,
            groups: _this.groups,
            forms: _this.forms,
            broadcastChannel: _this.broadcastChannel,
            registerComponent: _this.registerComponent,
            addFormObject: _this.addFormObject,
            insertFormObject: _this.insertFormObject,
            removeFormObject: _this.removeFormObject,
            updateFormObjectIndex: _this.updateFormObjectIndex,
            loadFromArray: _this.loadFromArray,
            resetProviderData: _this.resetProviderData,
            clearForm: _this.clearForm,
            insertFormRow: _this.insertFormRow,
            addFormRow: _this.addFormRow,
            removeFormRow: _this.removeFormRow
          };
        };
      })(this)
    ];
  });

}).call(this);
