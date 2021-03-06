(function() {
  angular.module('app', ['builder', 'builder.components', 'validator.rules', 'ui.bootstrap', 'ngFileUpload', 'ckeditor']).run([
    '$builder', function($builder) {
      return {
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required\n        </label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      };
    }
  ]).controller('DemoController', [
    '$scope', '$builder', '$validator', function($scope, $builder, $validator) {
      $scope.pages = ['1', '2'];
      $scope.select = function(page) {
        return $scope.selected = page;
      };
      $scope.input = [];
      $scope.testInput = [];
      $scope.defaultValue = {};
      $scope.submit = function() {
        return $validator.validate($scope, 'default').success(function(message) {
          return console.log('success', message);
        }).error(function(message, err) {
          return console.log('error', message, err);
        });
      };
      $scope.testLoad = function() {
        var json;
        json = [
          {
            "index": 0,
            "formObjects": [
              {
                "id": 3,
                "component": "text",
                "editable": true,
                "index": 0,
                "row": 0,
                "label": "Text Input",
                "label_inline": false,
                "label_visible": true,
                "description": "",
                "placeholder": "placeholder",
                "options": [],
                "required": false,
                "validation": "/.*/"
              }, {
                "id": 5,
                "component": "phone",
                "editable": true,
                "index": 1,
                "row": 0,
                "label": "Phone Number",
                "label_inline": false,
                "label_visible": true,
                "description": "",
                "placeholder": "",
                "options": [],
                "required": false,
                "validation": "/.*/"
              }
            ]
          }, {
            "index": 1,
            "formObjects": [
              {
                "id": 1,
                "component": "date",
                "editable": true,
                "index": 1,
                "row": 0,
                "label": "Range restricted",
                "label_inline": false,
                "label_visible": true,
                "description": "",
                "placeholder": "",
                "options": [],
                "required": false,
                "validation": "[dateRange]",
                "maxDate": "2018-11-30T07:00:00.000Z",
                "restrictRange": true,
                "minDate": "2018-11-01T06:00:00.000Z"
              }, {
                "id": 2,
                "component": "text",
                "editable": true,
                "index": 0,
                "row": 0,
                "label": "Text Input",
                "label_inline": false,
                "label_visible": true,
                "description": "",
                "placeholder": "placeholder",
                "options": [],
                "required": false,
                "validation": "/.*/"
              }
            ]
          }, {
            "index": 2,
            "formObjects": []
          }
        ];
        $builder.loadFromArray('default', json);
        return $scope.form = $builder.forms['default'];
      };
      $scope.testData = function() {
        var data;
        data = [
          [
            {
              "id": 3,
              "label": "Text Input",
              "value": "asdf"
            }
          ], [
            {
              "id": 0,
              "label": "Phone Number",
              "value": "{\"type\":\"Mobile\",\"number\":\"1234567890\",\"extension\":\"999\"}"
            }
          ], []
        ];
        return _.merge($scope.input, data);
      };
      $scope.clearData = function() {
        $builder.clearForm('default');
        return $builder.clearForm('testForm');
      };
      return $scope.loadViewer = function() {
        $scope.testForm = _.cloneDeep($builder.forms['default']);
        $builder.loadFromArray('testForm', $scope.testForm);
        return _.merge($scope.testInput, $scope.input);
      };
    }
  ]);

}).call(this);
