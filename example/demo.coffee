angular.module 'app', ['builder', 'builder.components', 'validator.rules', 'ui.bootstrap', 'ngFileUpload', 'ckeditor']

.run ['$builder', ($builder) ->

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

    $scope.submit = ->
        $validator.validate $scope, 'default'
        .success (message) -> console.log 'success', message
        .error (message, err) -> console.log 'error', message, err

    $scope.testLoad = ->
        json = [{"index":0,"formObjects":[{"id":3,"component":"text","editable":true,"index":0,"row":0,"label":"Text Input","label_inline":false,"label_visible":true,"description":"","placeholder":"placeholder","options":[],"required":false,"validation":"/.*/"},
                                          {"id":5,"component":"phone","editable":true,"index":1,"row":0,"label":"Phone Number","label_inline":false,"label_visible":true,"description":"","placeholder":"","options":[],"required":false,"validation":"/.*/"}]},
                {"index":1,"formObjects":[{"id":1,"component":"date","editable":true,"index":1,"row":0,"label":"Range restricted","label_inline":false,"label_visible":true,"description":"","placeholder":"","options":[],"required":false,"validation":"[dateRange]","maxDate":"2018-11-30T07:00:00.000Z","restrictRange":true,"minDate":"2018-11-01T06:00:00.000Z"},
                                          {"id":2,"component":"text","editable":true,"index":0,"row":0,"label":"Text Input","label_inline":false,"label_visible":true,"description":"","placeholder":"placeholder","options":[],"required":false,"validation":"/.*/"}]},{"index":2,"formObjects":[]}]
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