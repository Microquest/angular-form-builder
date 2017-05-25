angular.module 'app', ['builder', 'builder.components', 'validator.rules', 'ui.bootstrap', 'ngFileUpload', 'ckeditor']

.run ['$builder', ($builder) ->
    # $builder.registerComponent 'sampleInput',
    #     group: 'from html'
    #     label: 'Sample'
    #     description: 'From html template'
    #     placeholder: 'placeholder'
    #     required: no
    #     validationOptions: [
    #         {label: 'none', rule: '/.*/'}
    #         {label: 'number', rule: '[number]'}
    #         {label: 'email', rule: '[email]'}
    #         {label: 'url', rule: '[url]'}
    #     ]
    #     templateUrl: 'example/template.html'
    #     popoverTemplateUrl: 'example/popoverTemplate.html'

    # ----------------------------------------
    # datepicker
    # ----------------------------------------
    # $builder.registerComponent 'dateInput',
    #     group: 'Default'
    #     label: 'Date'
    #     description: 'Date picker'
    #     placeholder: 'placeholder'
    #     required: no
    #     validationOptions: [
    #         {label: 'none', rule: '/.*/'}
    #         {label: 'number', rule: '[number]'}
    #         {label: 'email', rule: '[email]'}
    #         {label: 'url', rule: '[url]'}
    #     ]
    #     templateUrl: 'example/datepickertemplate.html'
    #     popoverTemplateUrl: 'example/popoverTemplate.html'

    # ----------------------------------------
    # two text input
    # ----------------------------------------
    # $builder.registerComponent 'name',
    #     group: 'Default'
    #     label: 'Name'
    #     required: no
    #     arrayToText: yes
    #     template:
    #         """
    #         <div class="form-group">
    #             <label for="{{formName+index}}" class="col-md-4 control-label" ng-class="{'fb-required':required}">{{label}}</label>
    #             <div class="col-md-8">
    #                 <input type='hidden' ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}"/>
    #                 <div class="col-sm-6" style="padding-left: 0;">
    #                     <input type="text"
    #                         ng-model="inputArray[0]"
    #                         class="form-control" id="{{formName+index}}-0"/>
    #                     <p class='help-block'>First name</p>
    #                 </div>
    #                 <div class="col-sm-6" style="padding-left: 0;">
    #                     <input type="text"
    #                         ng-model="inputArray[1]"
    #                         class="form-control" id="{{formName+index}}-1"/>
    #                     <p class='help-block'>Last name</p>
    #                 </div>
    #             </div>
    #         </div>
    #         """
        popoverTemplate:
            """
            <form>
                <div class="form-group">
                    <label class='control-label'>Label</label>
                    <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                </div>
                <div class="checkbox">
                    <label>
                        <input type='checkbox' ng-model="required" />
                        Required
                    </label>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary' value='Save'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-default' value='Cancel'/>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger' value='Delete'/>
                </div>
            </form>
            """
]


.controller 'DemoController', ['$scope', '$builder', '$validator', ($scope, $builder, $validator) ->
    #----------------------------------------
    #builder
    #----------------------------------------
    # textbox = $builder.addFormObject 'default',
    #     id: 'textbox'
    #     component: 'textInput'
    #     label: 'Name'
    #     description: 'Your name'
    #     placeholder: 'Your name'
    #     required: yes
    #     editable: no
    # checkbox = $builder.addFormObject 'default',
    #     id: 'checkbox'
    #     component: 'checkbox'
    #     label: 'Pets'
    #     description: 'Do you have any pets?'
    #     options: ['Dog', 'Cat']
    # $builder.addFormObject 'default',
    #     component: 'sampleInput'
    # formObjects
    # $scope.form = $builder.forms['default']

    # ----------------------------------------
    # form
    # ----------------------------------------
    # user input value
    $scope.pages = ['1', '2']
    $scope.select = (page) ->
        $scope.selected = page
    $scope.input = []
    $scope.testInput = []
    $scope.defaultValue = {}
    # formObjectId: default value
    # $scope.defaultValue[textbox.id] = 'default value'
    # $scope.defaultValue[checkbox.id] = [yes, yes]

    $scope.submit = ->
        $validator.validate $scope, 'default'
        .success -> console.log 'success'
        .error -> console.log 'error'

    $scope.testLoad = ->
        json = [{"index":0,"formObjects":[{"id":3,"component":"text","editable":true,"index":0,"row":0,"label":"Text Input","label_inline":false,"label_visible":true,"description":"","placeholder":"placeholder","options":[],"required":false,"validation":"/.*/"}]},{"index":1,"formObjects":[{"id":0,"component":"phone","editable":true,"index":0,"row":1,"label":"Phone Number","label_inline":false,"label_visible":true,"description":"","placeholder":"","options":[],"required":false,"validation":"/.*/"}]},{"index":2,"formObjects":[]}]
        $builder.loadFromArray 'default', json
        $scope.form = $builder.forms['default']

    $scope.testData = ->
        data = [[{"id":3,"label":"Text Input","value":"asdf"}],[{"id":0,"label":"Phone Number","value":"{\"type\":\"Mobile\",\"number\":\"1234567890\",\"extension\":\"999\"}"}],[]]
        _.merge($scope.input, data)
        #$scope.$broadcast $builder.broadcastChannel.loadInput, $scope.input

    $scope.clearData = ->
        $builder.clearForm 'default'
        $builder.clearForm 'testForm'

    $scope.loadViewer = ->
        $scope.testForm = _.cloneDeep $builder.forms['default']
        $builder.loadFromArray 'testForm', $scope.testForm
        _.merge($scope.testInput, $scope.input)
        #$scope.$broadcast $builder.broadcastChannel.loadInput, $scope.testInput, data

]