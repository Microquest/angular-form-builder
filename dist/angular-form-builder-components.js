(function() {
  angular.module('builder.components', ['builder', 'validator.rules', 'ngMask', 'pw.canvas-painter', 'ngFileUpload']).config([
    '$builderProvider', '$validatorProvider', function($builderProvider, $validatorProvider) {
      $builderProvider.registerComponent('message', {
        group: 'Basic',
        placeholder: 'Rich Content',
        label: 'Rich Content',
        template: "    <div class=\"col-sm-12 form-group text-left\" style='margin:2px'>\n      <rich-text><strong>Static <i>Rich Text</i> Component</strong></rich-text>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row\" id=\"{{formName+index | nospace}}\">\n    <div class=\"col-sm-12 form-group text-left\" style='margin:2px'>\n      <rich-text><strong>Static <i>Rich Text</i> Component</strong></rich-text>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\" class=\"disabled\"><a>Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Placeholder</label>\n                    <input type='text' ng-model=\"placeholder\" class='form-control'/>\n                </div>\n                <div class=\"form-group m-t\">\n                  <a class=\"btn btn-success btn-block\" ng-click=\"openRichTextEditor(); popover.save($event)\">Open Rich Text Editor</a>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n            </div>\n        </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>\n    </div>\n</form>"
      });
      $validatorProvider.register('dateRange', {
        invoke: 'blur',
        validator: function(value, scope, element, attrs, $injector) {
          if (value) {
            if (scope.restrictRange) {
              if (scope.minDate && scope.minDate.getTime() > value.getTime()) {
                return false;
              }
              if (scope.maxDate && scope.maxDate.getTime() < value.getTime()) {
                return false;
              }
              return true;
            } else {
              true;
            }
          }
          return true;
        },
        error: function(value, scope, element, attrs) {
          var $label, err, label, parent, _i, _len, _ref;
          err = '';
          if (scope.minDate && scope.maxDate) {
            err = "Date must be between " + scope.minDate.toDateString() + " and " + scope.maxDate.toDateString();
          } else if (scope.minDate) {
            err = "Date must be after " + scope.minDate.toDateString();
          } else if (scope.maxDate) {
            err = "Date must be before " + scope.maxDate.toDateString();
          }
          parent = element.closest('.form-group');
          if (parent.length) {
            parent.addClass('has-error');
            _ref = parent.find('label');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              label = _ref[_i];
              if ($(label).hasClass('error')) {
                $(label).remove();
              }
            }
            $label = $("<label class='control-label error'>" + err + "</label>");
            if (attrs.id) {
              $label.attr('for', attrs.id);
            }
            if (element.parent().hasClass('input-group')) {
              return element.parent().parent().append($label);
            } else {
              return element.parent().append($label);
            }
          }
        },
        success: function(value, scope, element, attrs) {
          var label, parent, _i, _len, _ref, _results;
          parent = element.parent();
          _results = [];
          while (parent.length !== 0) {
            if (parent.hasClass('has-error')) {
              parent.removeClass('has-error');
              _ref = parent.find('label');
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                label = _ref[_i];
                if ($(label).hasClass('error')) {
                  $(label).remove();
                }
              }
              break;
            }
            _results.push(parent = parent.parent());
          }
          return _results;
        }
      });
      $builderProvider.registerComponent('date', {
        group: 'Basic',
        label: 'Date Picker',
        label_inline: false,
        label_visible: true,
        description: '',
        required: false,
        disableWeekends: false,
        readOnly: false,
        restrictRange: false,
        minDate: Date.parse("1 Jan 1900"),
        maxDate: Date.now(),
        validation: '[dateRange]',
        template: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n      <label for=\"{{formName+index}}\" ng-class=\"{'fb-required':required,'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'> {{label}} </label>\n      <div ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <input type=\"date\" max=\"2999-12-31\" class=\"form-control\" ng-model='inputText' validator-required=\"{{required}}\" validator-group=\"{{formName}}\"\>\n      </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n      <label for=\"{{formName+index}}\" ng-class=\"{'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'>{{label}}</label>\n      <div class=\"form-control-static\" ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <span>{{inputText}}</span>\n        <span ng-if='!inputText'><i>No Data</i></span>\n      </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\"><a href=\"{{'#validations' + date + index}}\" aria-controls=\"{{'validations' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Label</label>\n                    <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_inline' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_inline' + date + index}}\" ng-model=\"label_inline\">\n                  Label Inline</label>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_visible' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_visible' + date + index}}\" ng-model=\"label_visible\">\n                  Show Label</label>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Description</label>\n                    <input type='text' ng-model=\"description\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'readonly' + date + index}}\"><input type=\"checkbox\" id=\"{{'readonly' + date + index}}\" ng-model=\"readOnly\">\n                  Read Only</label>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n                <div class='checkbox icheck-label m-t'>\n                  <label for=\"{{'required' + date + index}}\"><input type=\"checkbox\" id=\"{{'required' + date + index}}\" ng-model=\"required\">\n                  Required</label>\n                </div>\n\n                <div class='checkbox icheck-label m-t'>\n                  <label for=\"{{'restrict' + date + index}}\"><input type=\"checkbox\" id=\"{{'restrict' + date + index}}\" ng-model=\"restrictRange\">\n                  Restrict Range</label>\n                </div>\n\n                <div class=\"form-group m-t\">\n                    <div class=\"row\">\n                        <div class=\"col-sm-12\">\n                            <div class=\"input-group\">\n                                <span class=\"input-group-addon\">Min Date</span>\n                                <input type=\"date\" class=\"form-control\" ng-model='minDate'\>\n                            </div>\n                        </div>\n                        <div class=\"col-sm-12\">\n                            <div class=\"input-group\">\n                                <span class=\"input-group-addon\">Max Date</span>\n                                <input type=\"date\" class=\"form-control\" ng-model='maxDate'\>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>\n    </div>\n</form>"
      });
      $validatorProvider.register('phone', {
        invoke: 'blur',
        validator: function(value, scope, element, attrs, $injector) {
          var dict;
          if (value) {
            dict = JSON.parse(value);
            if (dict['number'] && dict['number'].match(/^\d{10}$/)) {
              return true;
            }
            return false;
          }
          return true;
        },
        error: 'Must be a valid phone number.'
      });
      $builderProvider.registerComponent('phone', {
        group: 'Basic',
        label: 'Phone Number',
        label_inline: false,
        label_visible: true,
        description: '',
        required: false,
        readOnly: false,
        validation: '[phone]',
        dictionaryToString: true,
        template: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n      <label for=\"{{formName+index}}\" ng-class=\"{'fb-required':required,'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'> {{label}} </label>\n      <input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/>\n      <div ng-class=\"{'col-sm-3':!label_inline || !label_visible, 'col-sm-2':label_inline && label_visible}\">\n        <select ng-show=\"!multiple\" ng-readonly=\"readOnly\" class=\"form-control m-b\"\n            ng-model=\"inputDictionary['type']\" ng-init=\"type='Home'\" >\n            <option value=\"Home\">Home</option>\n            <option value=\"Mobile\">Mobile</option>\n            <option value=\"Work\">Work</option>\n            <option value=\"Other\">Other</option>\n        </select>\n      </div>\n      <div ng-class=\"{'col-sm-5':!label_inline || !label_visible, 'col-sm-4':label_inline && label_visible}\">\n        <input type=\"text\" class=\"form-control\" ng-model=\"inputDictionary['number']\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" mask='(999) 999-9999' clean='true' placeholder='#'\>\n      </div>\n      <div ng-class=\"{'col-sm-3':!label_inline || !label_visible, 'col-sm-2':label_inline && label_visible}\">\n        <input type=\"text\" class=\"form-control\" ng-model=\"inputDictionary['extension']\" mask='999' clean='true' placeholder='ext.'\"\>\n      </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row\" id=\"{{formName+index | nospace}}\">\n      <label for=\"{{formName+index}}\" ng-class=\"{'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'> {{label}} </label>\n      <div class=\"form-control-static\" ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n         <span ng-show=\"inputDictionary['number']\"> {{inputDictionary['type']}}: {{phoneFormatter.apply(inputDictionary['number'])}}, ext. {{inputDictionary['extension']}} </span>\n         <span ng-show=\"!inputDictionary['number']\"><i>No Data</i></span>\n      </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\"><a href=\"{{'#validations' + date + index}}\" aria-controls=\"{{'validations' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Label</label>\n                    <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_inline' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_inline' + date + index}}\" ng-model=\"label_inline\">\n                  Label Inline</label>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_visible' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_visible' + date + index}}\" ng-model=\"label_visible\">\n                  Show Label</label>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Description</label>\n                    <input type='text' ng-model=\"description\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'readonly' + date + index}}\"><input type=\"checkbox\" id=\"{{'readonly' + date + index}}\" ng-model=\"readOnly\">\n                  Read Only</label>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n                <div class='checkbox icheck-label m-t'>\n                  <label for=\"{{'required' + date + index}}\"><input type=\"checkbox\" id=\"{{'required' + date + index}}\" ng-model=\"required\">\n                  Required</label>\n                </div>\n\n                <div class=\"form-group\" ng-if=\"validationOptions.length > 0\">\n                    <label class='control-label'>Validation</label>\n                    <select ng-model=\"$parent.validation\" class='form-control' ng-options=\"option.rule as option.label for option in validationOptions\"></select>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('text', {
        group: 'Basic',
        label: 'Text Input',
        label_inline: false,
        label_visible: true,
        description: '',
        placeholder: 'placeholder',
        readOnly: false,
        minLength: 0,
        maxLength: 999,
        minRange: 0,
        maxRange: 99999,
        required: false,
        validationOptions: [
          {
            label: 'None',
            rule: '/.*/'
          }, {
            label: 'Text',
            rule: '[text]'
          }, {
            label: 'Number',
            rule: '[numberRange]'
          }, {
            label: 'Email',
            rule: '[email]'
          }
        ],
        template: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'fb-required':required,'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <input type=\"text\" ng-show=\"validation != '[numberRange]'\" ng-readonly=\"readOnly\" ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" class=\"form-control m-b\" placeholder=\"{{placeholder}}\"/>\n        <input type=\"tel\" ng-show=\"validation === '[numberRange]'\" ng-readonly=\"readOnly\" ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" class=\"form-control m-b\" placeholder=\"{{placeholder}}\"/>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row\" id=\"{{formName+index | nospace}}\">\n    <label ng-class=\"{'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'>{{label}} </label>\n    <div class=\"form-control-static\" ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <span>{{inputText}}</span>\n        <span ng-if='!inputText'><i>No Data</i></span>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\"><a href=\"{{'#validations' + date + index}}\" aria-controls=\"{{'validations' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Label</label>\n                    <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n                </div>\n                <div class=\"form-group m-t-sm\">\n                    <div class='checkbox icheck-label'>\n                      <label for=\"{{'label_inline' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_inline' + date + index}}\" ng-model=\"label_inline\">\n                      Label Inline</label>\n                    </div>\n                </div>\n                <div class=\"form-group m-t-sm\">\n                    <div class='checkbox icheck-label'>\n                      <label for=\"{{'label_visible' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_visible' + date + index}}\" ng-model=\"label_visible\">\n                      Show Label</label>\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Description</label>\n                    <input type='text' ng-model=\"description\" class='form-control'/>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Placeholder</label>\n                    <input type='text' ng-model=\"placeholder\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'readonly' + date + index}}\"><input type=\"checkbox\" id=\"{{'readonly' + date + index}}\" ng-model=\"readOnly\">\n                  Read Only</label>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n                <div class='checkbox icheck-label m-t'>\n                  <label for=\"{{'required' + date + index}}\"><input type=\"checkbox\" id=\"{{'required' + date + index}}\" ng-model=\"required\">\n                  Required</label>\n                </div>\n\n                <div class=\"form-group\" ng-if=\"validationOptions.length > 0\">\n                    <label class='control-label'>Validation</label>\n                    <select ng-model=\"$parent.validation\" class='form-control' ng-options=\"option.rule as option.label for option in validationOptions\"></select>\n                </div>\n                <div class=\"row\" ng-show=\"validation==='[text]'\">\n                    <div class=\"form-group col-sm-6\">\n                        <input type=\"text\" class=\"form-control\" ng-model=\"minLength\" placeholder=\"Min Length\">\n                    </div>\n                    <div class=\"form-group col-sm-6\">\n                        <input type=\"text\" class=\"form-control\" ng-model=\"maxLength\" placeholder=\"Max Length\">\n                    </div>\n                </div>\n                <div class=\"row\" ng-show=\"validation==='[numberRange]'\">\n                    <div class=\"form-group col-sm-6\">\n                        <input type=\"text\" class=\"form-control\" ng-model=\"minRange\" placeholder=\"Min Range\">\n                    </div>\n                    <div class=\"form-group col-sm-6\">\n                        <input type=\"text\" class=\"form-control\" ng-model=\"maxRange\" placeholder=\"Max Range\">\n                    </div>\n                    <div class=\"form-group col-sm-6\">\n                        <input type=\"text\" class=\"form-control\" ng-model=\"minLength\" placeholder=\"Min Length\">\n                    </div>\n                    <div class=\"form-group col-sm-6\">\n                        <input type=\"text\" class=\"form-control\" ng-model=\"maxLength\" placeholder=\"Max Length\">\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('area', {
        group: 'Basic',
        label: 'Text Area',
        label_inline: false,
        label_visible: true,
        description: '',
        placeholder: 'placeholder',
        required: false,
        readOnly: false,
        template: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'fb-required':required,'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <textarea type=\"text\" ng-readonly=\"readOnly\" ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" class=\"form-control m-b\" rows='6' placeholder=\"{{placeholder}}\"/>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div class=\"form-control-static\" ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <p>{{inputText}}</p>\n        <span ng-if='!inputText'><i>No Data</i></span>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\"><a href=\"{{'#validations' + date + index}}\" aria-controls=\"{{'validations' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Label</label>\n                    <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_inline' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_inline' + date + index}}\" ng-model=\"label_inline\">\n                  Label Inline</label>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_visible' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_visible' + date + index}}\" ng-model=\"label_visible\">\n                  Show Label</label>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Description</label>\n                    <input type='text' ng-model=\"description\" class='form-control'/>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Placeholder</label>\n                    <input type='text' ng-model=\"placeholder\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'readonly' + date + index}}\"><input type=\"checkbox\" id=\"{{'readonly' + date + index}}\" ng-model=\"readOnly\">\n                  Read Only</label>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n                <div class='checkbox icheck-label m-t'>\n                  <label for=\"{{'required' + date + index}}\"><input type=\"checkbox\" id=\"{{'required' + date + index}}\" ng-model=\"required\">\n                  Required</label>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('checkbox', {
        group: 'Choice',
        label: 'Checkbox',
        label_inline: false,
        label_visible: true,
        description: '',
        placeholder: 'placeholder',
        required: false,
        options: ['value one', 'value two'],
        arrayToText: true,
        readOnly: false,
        template: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'fb-required':required,'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/>\n        <div class='checkbox icheck-label' ng-repeat=\"item in options track by $index\">\n          <label for=\"{{formName+index+$index | nospace}}\"><input id=\"{{formName+index+$index | nospace}}\" ng-model=\"inputArray[$index]\" ng-value='item' ng-disabled=\"readOnly\" type=\"checkbox\" checked=\"\">\n          {{item}}</label>\n        </div>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <div class='checkbox icheck-label' ng-repeat=\"item in options track by $index\">\n          <label for=\"{{formName+index+$index | nospace}}\"><input id=\"{{formName+index+$index | nospace}}\" ng-model=\"inputArray[$index]\" ng-value='item' ng-disabled=\"true\" type=\"checkbox\" checked=\"\">\n          {{item}}</label>\n        </div>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\"><a href=\"{{'#validations' + date + index}}\" aria-controls=\"{{'validations' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Label</label>\n                    <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_inline' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_inline' + date + index}}\" ng-model=\"label_inline\">\n                  Label Inline</label>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_visible' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_visible' + date + index}}\" ng-model=\"label_visible\">\n                  Show Label</label>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Description</label>\n                    <input type='text' ng-model=\"description\" class='form-control'/>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Options</label>\n                    <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'readonly' + date + index}}\"><input type=\"checkbox\" id=\"{{'readonly' + date + index}}\" ng-model=\"readOnly\">\n                  Read Only</label>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n                <div class='checkbox icheck-label m-t'>\n                  <label for=\"{{'required' + date + index}}\"><input type=\"checkbox\" id=\"{{'required' + date + index}}\" ng-model=\"required\">\n                  Required</label>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('radio', {
        group: 'Choice',
        label: 'Radio',
        label_inline: false,
        label_visible: true,
        description: '',
        placeholder: 'placeholder',
        required: false,
        readOnly: false,
        options: ['value one', 'value two'],
        template: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'fb-required':required,'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <div class='radio icheck-label' ng-repeat=\"item in options track by $index\">\n\n            <label for=\"{{formName+index+$index | nospace}}\"><input id=\"{{formName+index+$index | nospace}}\" type=\"radio\" ng-disabled=\"readOnly\" name='{{formName+index}}' ng-model=\"$parent.inputText\" validator-group=\"{{formName}}\" ng-value='item'>\n            {{item}}</label>\n\n        </div>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <div class='radio icheck-label' ng-repeat=\"item in options track by $index\">\n\n            <label for=\"{{formName+index+$index | nospace}}\"><input id=\"{{formName+index+$index | nospace}}\" type=\"radio\" ng-disabled=\"true\" name='{{formName+index}}' ng-model=\"$parent.inputText\" validator-group=\"{{formName}}\" ng-value='item'>\n            {{item}}</label>\n\n        </div>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\" class=\"disabled\"><a>Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Label</label>\n                    <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_inline' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_inline' + date + index}}\" ng-model=\"label_inline\">\n                  Label Inline</label>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_visible' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_visible' + date + index}}\" ng-model=\"label_visible\">\n                  Show Label</label>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Description</label>\n                    <input type='text' ng-model=\"description\" class='form-control'/>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Options</label>\n                    <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'readonly' + date + index}}\"><input type=\"checkbox\" id=\"{{'readonly' + date + index}}\" ng-model=\"readOnly\">\n                  Read Only</label>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n                <div class=\"checkbox m-t\">\n                    <label>\n                        <input type='checkbox'  ng-model=\"required\" />\n                        Required\n                    </label>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>\n    </div>\n</form>"
      });
      return $builderProvider.registerComponent('select', {
        group: 'Choice',
        label: 'Select',
        label_inline: false,
        label_visible: true,
        description: '',
        placeholder: 'Choose..',
        required: false,
        readOnly: false,
        options: ['value one', 'value two'],
        template: "<div class=\"row form-group\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'fb-required':required,'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div class=\"dropdown\" ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <select ng-show=\"!multiple\" ng-readonly=\"readOnly\" ng-options=\"value for value in options\" class=\"form-control m-b\"\n            ng-model=\"inputText\" ng-init=\"inputText = ''\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\">\n            <option value=\"\">{{placeholder}}</option>\n        </select>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>\n<div id=\"dashedline\" class=\"hr-line-dashed\"></div>",
        viewerTemplate: "<div class=\"row\" id=\"{{formName+index | nospace}}\">\n    <label for=\"{{formName+index}}\" ng-class=\"{'col-sm-4 control-label':label_inline, 'col-sm-12':!label_inline}\" ng-show='label_visible'><i ng-if =\"formObject.logic.component\" id=\"hasLogic\" class=\"fa fa-random label-logic\"></i> {{label}} </label>\n    <div class=\"form-control-static\" class=\"dropdown\" ng-class=\"{'col-sm-12':!label_inline || !label_visible, 'col-sm-8':label_inline && label_visible}\">\n        <span>{{inputText}}</span>\n        <span ng-if='!inputText'><i>No Data</i></span>\n    </div>\n    <div class=\"col-sm-10\">\n      <small ng-show=\"description\" class=\"help-block text-muted custom-small\">{{description}}</small>\n    </div>\n</div>",
        popoverTemplate: "<form>\n\n    <div role=\"tabpanel\">\n\n        <!-- Nav tabs -->\n        <ul class=\"nav nav-justified nav-tabs\" role=\"tablist\" style=\"margin-left:-10px\">\n            <li role=\"presentation\" class=\"active\"><a href=\"{{'#properties' + date + index}}\" aria-controls=\"{{'properties' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Properties</a></li>\n            <li role=\"presentation\"><a href=\"{{'#validations' + date + index}}\" aria-controls=\"{{'validations' + date + index}}\" role=\"tab\" data-toggle=\"tab\">Validations</a></li>\n        </ul>\n\n        <!-- Tab panes -->\n        <div class=\"tab-content\">\n            <div role=\"tabpanel\" class=\"tab-pane active\" id=\"{{'properties' + date + index}}\">\n                <div class=\"form-group m-t-sm\">\n                    <label class='control-label'>Label</label>\n                    <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_inline' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_inline' + date + index}}\" ng-model=\"label_inline\">\n                  Label Inline</label>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'label_visible' + date + index}}\"><input type=\"checkbox\" id=\"{{'label_visible' + date + index}}\" ng-model=\"label_visible\">\n                  Show Label</label>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Description</label>\n                    <input type='text' ng-model=\"description\" class='form-control'/>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Placeholder</label>\n                    <input type='text' ng-model=\"placeholder\" class='form-control'/>\n                </div>\n                <div class=\"form-group\">\n                    <label class='control-label'>Options</label>\n                    <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n                </div>\n                <div class='checkbox icheck-label'>\n                  <label for=\"{{'readonly' + date + index}}\"><input type=\"checkbox\" id=\"{{'readonly' + date + index}}\" ng-model=\"readOnly\">\n                  Read Only</label>\n                </div>\n            </div>\n            <div role=\"tabpanel\" class=\"tab-pane\" id=\"{{'validations' + date + index}}\">\n                <div class='checkbox icheck-label m-t'>\n                  <label for=\"{{'required' + date + index}}\"><input type=\"checkbox\" id=\"{{'required' + date + index}}\" ng-model=\"required\">\n                  Required</label>\n                </div>\n                <div class=\"form-group\" ng-if=\"validationOptions.length > 0\">\n                    <label class='control-label'>Validation</label>\n                    <select ng-model=\"$parent.validation\" class='form-control' ng-options=\"option.rule as option.label for option in validationOptions\"></select>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>\n    </div>\n</form>"
      });

      /*    $builderProvider.registerComponent 'draw',
              group: 'Drawing'
              label: 'Draw'
              label_inline: false
              label_visible: true
              description: ''
              readOnly: no
              imageHeight: 8
              imageWidth: 12
              template:
                  """
                  <div class="row" id="{{formName+index | nospace}}">
                      <label for="{{formName+index}}" ng-class="{'fb-required':required,'col-sm-2 control-label':label_inline, 'col-sm-12':!label_inline}" ng-show='label_visible'><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} </label>
                      <div ng-class="{'col-sm-12':!label_inline || !label_visible, 'col-sm-10':label_inline && label_visible}" >
                          <div pw-canvas options="{customCanvasId: formName+index+'_canvas', undo: true, width: $parent.$parent.width, height: imageHeight, color: '#a52a2a', backgroundColor: '#000', lineWidth: 3, imageSrc : formObject.backgroundImage}" version="formObject.drawVersion"></div>
                          <input type='hidden' ng-model='inputText' value="{{inputText=updateCanvasValue(formName+index+'_canvas')}}"/>
                      </div>
                      <div class="col-sm-10">
                          <small ng-show="description" class="help-block text-muted custom-small">{{description}}</small>
                      </div>
                  </div>
                  <div id="dashedline" class="hr-line-dashed"></div>
                  """
              viewerTemplate:
                  """
                  <div class="row" id="{{formName+index | nospace}}">
                      <label for="{{formName+index}}" ng-class="{'fb-required':required,'col-sm-2 control-label':label_inline, 'col-sm-12':!label_inline}" ng-show='label_visible'><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} </label>
                      <div ng-class="{'col-sm-12':!label_inline || !label_visible, 'col-sm-10':label_inline && label_visible}" >
                          <div pw-canvas options="{customCanvasId: formName+index+'_canvas', undo: true, width: $parent.$parent.width, height: imageHeight, color: '#a52a2a', backgroundColor: '#000', lineWidth: 3, imageSrc : formObject.backgroundImage}" version="formObject.drawVersion"></div>
                          <input type='hidden' ng-model='inputText' value="{{inputText=updateCanvasValue(formName+index+'_canvas')}}"/>
                      </div>
                      <div class="col-sm-10">
                          <small ng-show="description" class="help-block text-muted custom-small">{{description}}</small>
                      </div>
                  </div>
                  <div id="dashedline" class="hr-line-dashed"></div>
                  """
              popoverTemplate:
                  """
                  <form>
      
                      <div role="tabpanel">
      
                          <!-- Nav tabs -->
                          <ul class="nav nav-justified nav-tabs" role="tablist" style="margin-left:-10px">
                              <li role="presentation" class="active"><a href="{{'#properties' + date + index}}" aria-controls="{{'properties' + date + index}}" role="tab" data-toggle="tab">Properties</a></li>
                              <li role="presentation"><a href="{{'#validations' + date + index}}" aria-controls="{{'validations' + date + index}}" role="tab" data-toggle="tab">Validations</a></li>
                              <li role="presentation"><a href="{{'#image' + date + index}}" aria-controls="{{'image' + date + index}}" role="tab" data-toggle="tab">Image</a></li>
                          </ul>
      
                          <!-- Tab panes -->
                          <div class="tab-content">
                              <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                                  <div class="form-group m-t-sm">
                                      <label class='control-label'>Label</label>
                                      <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                                  </div>
                                  <div class='checkbox icheck-label'>
                                    <label for="{{'label_inline' + date + index}}"><input type="checkbox" id="{{'label_inline' + date + index}}" ng-model="label_inline">
                                    Label Inline</label>
                                  </div>
                                  <div class='checkbox icheck-label'>
                                    <label for="{{'label_visible' + date + index}}"><input type="checkbox" id="{{'label_visible' + date + index}}" ng-model="label_visible">
                                    Show Label</label>
                                  </div>
                                  <div class="form-group">
                                      <label class='control-label'>Description</label>
                                      <input type='text' ng-model="description" class='form-control'/>
                                  </div>
                                  <div class="form-group">
                                      <label class='control-label'>Placeholder</label>
                                      <input type='text' ng-model="placeholder" class='form-control'/>
                                  </div>
                                  <div class='checkbox icheck-label'>
                                    <label for="{{'readonly' + date + index}}"><input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                                    Read Only</label>
                                  </div>
                              </div>
                              <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                                  <div class='checkbox icheck-label m-t'>
                                    <label for="{{'required' + date + index}}"><input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                                    Required</label>
                                  </div>
      
                                  <div class="form-group" ng-if="validationOptions.length > 0">
                                      <label class='control-label'>Validation</label>
                                      <select ng-model="$parent.validation" class='form-control' ng-options="option.rule as option.label for option in validationOptions"></select>
                                  </div>
                                  <div class="row" ng-show="validation==='[text]'">
                                      <div class="form-group col-sm-6">
                                          <input type="text" class="form-control" ng-model="minLength" placeholder="Min Length">
                                      </div>
                                      <div class="form-group col-sm-6">
                                          <input type="text" class="form-control" ng-model="maxLength" placeholder="Max Length">
                                      </div>
                                  </div>
                                  <div class="row" ng-show="validation==='[numberRange]'">
                                      <div class="form-group col-sm-6">
                                          <input type="text" class="form-control" ng-model="minRange" placeholder="Min Range">
                                      </div>
                                      <div class="form-group col-sm-6">
                                          <input type="text" class="form-control" ng-model="maxRange" placeholder="Max Range">
                                      </div>
                                      <div class="form-group col-sm-6">
                                          <input type="text" class="form-control" ng-model="minLength" placeholder="Min Length">
                                      </div>
                                      <div class="form-group col-sm-6">
                                          <input type="text" class="form-control" ng-model="maxLength" placeholder="Max Length">
                                      </div>
                                  </div>
                              </div>
                              <div role="tabpanel" class="tab-pane" id="{{'image' + date + index}}">
                                  <h4>Select Background Image</h4>
                                  <button type="file" ngf-select="convertFileToData($file)"
                                          accept="image/*" ngf-max-size="2MB">
                                      Select File</button>
                                  <img ng-src="{{formObject.backgroundImage}}" style='width:150px;height:150px'/>
                              </div>
                          </div>
                      </div>
      
                      <hr/>
                      <div class='form-group'>
                          <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                          <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                          <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>
                      </div>
                  </form>
                  """
       */

      /*    $builderProvider.registerComponent 'dataRequired',
        group: 'Custom'
        label: 'Data Required'
        label_inline: false
        label_visible: true
        description: 'Additional data required'
        placeholder: 'placeholder'
        readOnly: yes
        required: no
        validationOptions: [
          {label: 'Patient', rule: '[patientRequired]'}
          {label: 'Attachment', rule: '[attachmentRequired]'}
        ]
        template :
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label for="{{formName+index}}" ng-class="{'fb-required':required,'col-sm-2 control-label':label_inline, 'col-sm-12':!label_inline}" ng-show='label_visible'> <i class="fa fa-user-circle" aria-hidden="true"></i> {{label}} </label>
                <div ng-class="{'col-sm-12':!label_inline || !label_visible, 'col-sm-10':label_inline && label_visible}" >
                    <input type="text" ng-model="inputText" validator="{{validation}}" validator-group="{{formName}}" disabled/>
                </div>
                <div class="col-sm-10">
                    <small ng-show="description" class="help-block text-muted custom-small">{{description}}</small>
                </div>
            </div>
            """
        viewerTemplate :
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label for="{{formName+index}}" ng-class="{'fb-required':required,'col-sm-2 control-label':label_inline, 'col-sm-12':!label_inline}" ng-show='label_visible'> <i class="fa fa-user-circle" aria-hidden="true"></i> {{label}} </label>
                <div ng-class="{'col-sm-12':!label_inline || !label_visible, 'col-sm-10':label_inline && label_visible}" >
                    {{inputText}}
                </div>
                <div class="col-sm-10">
                    <small ng-show="description" class="help-block text-muted custom-small">{{description}}</small>
                </div>
            </div>
            """
        popoverTemplate:
            """
            <form>
                <div role="tabpanel">
                    <!-- Nav tabs -->
                    <ul class="nav nav-justified nav-tabs" role="tablist" style="margin-left:-10px">
                        <li role="presentation" class="active"><a href="{{'#properties' + date + index}}" aria-controls="{{'properties' + date + index}}" role="tab" data-toggle="tab">Properties</a></li>
                        <li role="presentation"><a href="{{'#validations' + date + index}}" aria-controls="{{'validations' + date + index}}" role="tab" data-toggle="tab">Validations</a></li>
                    </ul>
                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                            </div>
                            <div class="form-group m-t-sm">
                                <div class='checkbox icheck-label'>
                                  <label for="{{'label_inline' + date + index}}"><input type="checkbox" id="{{'label_inline' + date + index}}" ng-model="label_inline">
                                  Label Inline</label>
                                </div>
                            </div>
                            <div class="form-group m-t-sm">
                                <div class='checkbox icheck-label'>
                                  <label for="{{'label_visible' + date + index}}"><input type="checkbox" id="{{'label_visible' + date + index}}" ng-model="label_visible">
                                  Show Label</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Description</label>
                                <input type='text' ng-model="description" class='form-control'/>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
      
                            <div class="form-group" ng-if="validationOptions.length > 0">
                                <label class='control-label'>Validation</label>
                                <select ng-model="$parent.validation" class='form-control' ng-options="option.rule as option.label for option in validationOptions"></select>
                            </div>
                        </div>
                    </div>
                </div>
      
                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel' style='margin-bottom:15px'/>
                </div>
            </form>
            """
       */
    }
  ]);

}).call(this);
