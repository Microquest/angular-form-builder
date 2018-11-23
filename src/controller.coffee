# ----------------------------------------
# Shared functions
# ----------------------------------------
copyObjectToScope = (object, scope) ->
    ###
    Copy object (ng-repeat="object in objects") to scope without `hashKey`.
    ###
    for key, value of object when key isnt '$$hashKey'
        # copy object.{} to scope.{}
        scope[key] = value
    return


# ----------------------------------------
# builder.controller
# ----------------------------------------
angular.module 'builder.controller', ['builder.provider']

# ----------------------------------------
# fbFormObjectEditableController
# ----------------------------------------
.controller 'fbFormObjectEditableController', ['$scope', '$injector', '$document', 'Upload', ($scope, $injector, $document, Upload) ->
    $builder = $injector.get '$builder'
    $uibModal = $injector.get '$uibModal'
    $filter = $injector.get '$filter'

    # initialize formObject id
    if $scope.formObject.id is undefined
      $scope.formObject.id = $builder.config.max_id
      $builder.config.max_id = $builder.config.max_id + 1

    $scope.cancel = ->
      $scope.modalInstance.dismiss('cancel')

    $scope.save = (text) ->
      $scope.placeholder = text
      $scope.modalInstance.close()

    $scope.openRichTextEditor = ->
      $scope.editorText = $scope.placeholder;
      $scope.modalInstance = $uibModal.open({
        controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) ->
            $scope.options =
            {
              language: 'en',
              allowedContent: true,
              entities: false
            }
        ],
        template: '''
          <div class="modal-header">
              <button type="button" class="close" ng-click="cancel()"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
              <h4 class="modal-title">Edit Rich Content</div>
          </div>
          <div class="modal-body">
            <div ckeditor="options" ng-model="editorText" id="modal_ckeditor"></div>
          </div>
          <div class="modal-footer">
              <button class="btn btn-white pull-left" ng-click="cancel()">Cancel</button>
              <button class="btn btn-primary pull-right" ng-click="save(editorText)">Apply</button>
          </div> ''',
        scope: $scope
      })

    $scope.convertFileToData = (file, invalid, scope) ->
      Upload.dataUrl(file, true).then((url) ->
          $scope.backgroundImage = url;
      )

    $scope.date = Date.now()

    # old canSee func, moved to inline
    $scope.keys = Object.keys $builder.forms

    $scope.setupScope = (formObject) ->
        ###
        1. Copy origin formObject (ng-repeat="object in formObjects") to scope.
        2. Setup optionsText with formObject.options.
        3. Watch scope.label, .description, .placeholder, .required, .options then copy to origin formObject.
        4. Watch scope.optionsText then convert to scope.options.
        5. setup validationOptions
        ###
        copyObjectToScope formObject, $scope

        $scope.optionsText = formObject.options.join '\n'

        $scope.$watch '[label,label_visible, label_inline, description, placeholder, backgroundImage, required, options, validation, multiple, minLength, maxLength, dateRangeStart, dateRangeEnd, disableWeekends, maxDate, restrictRange, requireConfirmation, readOnly, minRange, maxRange, nextXDays]', ->
            formObject.label = $scope.label
            formObject.label_visible = $scope.label_visible
            formObject.label_inline = $scope.label_inline
            formObject.description = $scope.description
            formObject.placeholder = $scope.placeholder
            formObject.backgroundImage = $scope.backgroundImage
            formObject.required = $scope.required
            formObject.options = $scope.options
            formObject.multiple = $scope.multiple
            formObject.validation = $scope.validation
            formObject.minLength = $scope.minLength
            formObject.maxLength = $scope.maxLength
            formObject.dateRangeStart = $scope.dateRangeStart
            formObject.dateRangeEnd = $scope.dateRangeEnd
            formObject.disableWeekends = $scope.disableWeekends
            formObject.maxDate = $scope.maxDate
            formObject.minDate = $scope.minDate
            formObject.requireConfirmation = $scope.requireConfirmation
            formObject.readOnly = $scope.readOnly
            formObject.minRange = $scope.minRange
            formObject.maxRange = $scope.maxRange
            formObject.nextXDays = $scope.nextXDays
            formObject.restrictRange = $scope.restrictRange

        , yes

        $scope.$watch 'optionsText', (text) ->
            $scope.options = (x for x in text.split('\n') when x.length > 0)
            $scope.inputText = $scope.options[0]

        component = $builder.components[formObject.component]
        $scope.validationOptions = component.validationOptions

    $scope.data =
        model: null
        backup: ->
            ###
            Backup input value.
            ###
            @model =
                label: $scope.label
                label_inline: $scope.label_inline
                label_visible: $scope.label_visible
                description: $scope.description
                placeholder: $scope.placeholder
                backgroundImage: $scope.backgroundImage
                required: $scope.required
                optionsText: $scope.optionsText
                validation: $scope.validation
                multiple: $scope.multiple
                minLength: $scope.minLength
                maxLength: $scope.maxLength
                dateRangeStart: $scope.dateRangeStart
                dateRangeEnd: $scope.dateRangeEnd
                disableWeekends: $scope.disableWeekends
                maxDate: $scope.maxDate
                minDate: $scope.minDate
                requireConfirmation: $scope.requireConfirmation
                readOnly: $scope.readOnly
                minRange: $scope.minRange
                maxRange: $scope.maxRange
                nextXDays: $scope.nextXDays
                restrictRange: $scope.restrictRange
        rollback: ->
            ###
            Rollback input value.
            ###
            return if not @model
            $scope.label = @model.label
            $scope.label_inline = @model.label_inline
            $scope.label_visible = @model.label_visible
            $scope.description = @model.description
            $scope.placeholder = @model.placeholder
            $scope.backgroundImage = @model.backgroundImage
            $scope.required = @model.required
            $scope.optionsText = @model.optionsText
            $scope.validation = @model.validation
            $scope.multiple = @model.multiple
            $scope.minLength = @model.minLength
            $scope.maxLength = @model.maxLength
            $scope.dateRangeStart = @model.dateRangeStart
            $scope.dateRangeEnd = @model.dateRangeEnd
            $scope.disableWeekends = @model.disableWeekends
            $scope.maxDate = @model.maxDate
            $scope.minDate = @model.minDate
            $scope.requireConfirmation = @model.requireConfirmation
            $scope.readOnly = @model.readOnly
            $scope.minRange = @model.minRange
            $scope.maxRange = @model.maxRange
            $scope.nextXDays = @model.nextXDays
            $scope.restrictRange = @model.restrictRange
]

# ----------------------------------------
# fbComponentsController
# ----------------------------------------
.controller 'fbComponentsController', ['$scope', '$injector', ($scope, $injector) ->
    # providers
    $builder = $injector.get '$builder'

    # action
    $scope.selectGroup = ($event, group) ->
        $event?.preventDefault()
        $scope.activeGroup = group
        $scope.components = []
        for name, component of $builder.components when component.group is group
            $scope.components.push component

    $scope.groups = $builder.groups
    $scope.activeGroup = $scope.groups[0]
    $scope.allComponents = $builder.components
    $scope.$watch 'allComponents', -> $scope.selectGroup null, $scope.activeGroup
]


# ----------------------------------------
# fbComponentController
# ----------------------------------------
.controller 'fbComponentController', ['$scope', ($scope) ->
    $scope.copyObjectToScope = (object) -> copyObjectToScope object, $scope
]


# ----------------------------------------
# fbFormController
# ----------------------------------------
.controller 'fbFormController', ['$scope', '$injector', ($scope, $injector) ->
    # providers
    $builder = $injector.get '$builder'
    $timeout = $injector.get '$timeout'
    $rootScope = $injector.get '$rootScope'

    $rootScope.fields = $builder.forms

    # set default for input
    $scope.input ?= []
    $scope.$watch 'form', ->
        # remove superfluous input
        if $scope.input.length > $scope.form.length
            $scope.input.splice $scope.form.length
        # tell children to update input value.
        # ! use $timeout for waiting $scope updated.
        $timeout ->
            $scope.$broadcast $builder.broadcastChannel.updateInput
    , yes

    $scope.$watchCollection 'input', ->
      $timeout ->
        $scope.$broadcast $builder.broadcastChannel.loadInput, $scope.input

    $scope.broadcastMessage = (message) ->
      $rootScope.$broadcast(message)

    $scope.updateCanvasValue = (id) ->
      canvas = document.getElementById(id)
      if(canvas)
        url = canvas.toDataURL()
        return url
      return ''
]


# ----------------------------------------
# fbFormRowController
# ----------------------------------------
.controller 'fbFormRowController', ['$scope', '$injector', ($scope, $injector) ->
  # providers
  # TODO: There's probably stuff that needs to happen here
  $builder = $injector.get '$builder'
  $timeout = $injector.get '$timeout'
  $rootScope = $injector.get '$rootScope'

  $scope.$watch 'formRow.formObjects.length', ->
    $scope.width = if $scope.formRow.formObjects.length == 0 then 12 else 12/$scope.formRow.formObjects.length
]


# ----------------------------------------
# fbFormObjectController
# ----------------------------------------
.controller 'fbFormObjectController', ['$scope', '$injector', ($scope, $injector) ->
    # providers
    $builder = $injector.get '$builder'

    $scope.copyObjectToScope = (object) -> copyObjectToScope object, $scope

    $scope.updateInput = (value) ->
        ###
        Copy current scope.input[X] to $parent.input.
        @param value: The input value.
        ###
        input =
            id: $scope.formObject.id
            label: $scope.formObject.label
            value: value ? ''
        $scope.$parent.input.splice $scope.$index, 1, input
]


# ----------------------------------------
# fbFormController
# ----------------------------------------
.controller 'fbFormViewerController', ['$scope', '$injector', ($scope, $injector) ->
# providers
  $builder = $injector.get '$builder'
  $timeout = $injector.get '$timeout'
  $rootScope = $injector.get '$rootScope'

  $scope.$watch 'input', ->
      $timeout ->
          $scope.$broadcast $builder.broadcastChannel.loadInput, $scope.input
  , true

  $rootScope.fields = $builder.forms
]


# ----------------------------------------
# fbFormRowController
# ----------------------------------------
.controller 'fbFormRowViewerController', ['$scope', '$injector', ($scope, $injector) ->
# providers
  $builder = $injector.get '$builder'
  $timeout = $injector.get '$timeout'
  $rootScope = $injector.get '$rootScope'
]


# ----------------------------------------
# fbFormObjectController
# ----------------------------------------
.controller 'fbFormObjectViewerController', ['$scope', '$injector', ($scope, $injector) ->
# providers
  $builder = $injector.get '$builder'

  $scope.copyObjectToScope = (object) -> copyObjectToScope object, $scope

  $scope.updateInput = (value) ->
    ###
    Copy current scope.input[X] to $parent.input.
    @param value: The input value.
    ###
    input =
      id: $scope.formObject.id
      label: $scope.formObject.label
      value: value ? ''
    $scope.$parent.input.splice $scope.$index, 1, input
]
