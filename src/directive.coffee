# ----------------------------------------
# builder.directive
# ----------------------------------------
angular.module 'builder.directive', [
    'builder.provider'
    'builder.controller'
    'builder.drag'
    'validator'
    'ngFileUpload'
    'ckeditor'
]

# ----------------------------------------
# rich text directive
# ----------------------------------------
.directive 'richText', ['$injector', ($injector) ->
  restrict: 'E',
  link: (scope, elem, attrs) ->
    scope.text = scope.placeholder
    scope.$watch('placeholder', ->
        scope.text = scope.placeholder
      )

    scope.$watch('text', ->
      unless scope.text is 'Rich Content'
        elem[0].innerHTML = scope.text
      )
]

.filter 'nospace', ->
  (input) ->
    if input? and angular.isString(input)
      input.replace(/[^A-Z0-9]/ig, "")

.filter 'predicate', ->
  (input) ->
    switch input
      when 'eq'
        input = 'Equals'
      when 'not_eq'
        input = 'Does not equal'
      when 'matches'
        input = 'Matches'
      when 'does_not_match'
        input = 'Does not match'
      when 'contains'
        input = 'Contains'
      when 'does_not_contain'
        input = 'Does not contain'
      when 'lt'
        input = 'Less than'
      when 'lteq'
        input = 'Less than or equal to'
      when 'gt'
        input = 'Greater than'
      when 'gteq'
        input = 'Greater than or equal to'
      when 'not_in'
        input = 'Not in'
      when 'not_null'
        input = 'is Not Empty'
      when 'null'
        input = 'is Empty'
    return input

# ----------------------------------------
# date picker directive
# ----------------------------------------
.directive 'uiDate', ['$injector', ($injector) ->
    restrict: 'E'
    template:
        """
        <p class="input-group">
          <input type="text" class="form-control" max-date="maxDate" datepicker-popup="{{format}}" ng-model="inputText" is-open="opened" min-date="minDate" datepicker-options="dateOptions" date-disabled="disabled(date, mode)" close-text="Close"  validator-required="{{required}}" validator-group="{{required}}" id="{{formName+index}}" disabled/>
          <span class="input-group-btn">
            <button ng-disabled="readOnly" type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicons glyphicons-calendar"></i></button>
          </span>
        </p>
        """
    link: (scope, element, attrs) ->

        scope.inputText = ''

        scope.open = ($event) ->
            $event.preventDefault()
            $event.stopPropagation()
            scope.opened = yes

        extendPastWeekend = (from, daysOffset) ->
            dayInRange = moment();
            count = 0;
            for i in [0..daysOffset]
                if dayInRange.isoWeekday() == 6 || dayInRange.isoWeekday() == 7
                    count++;
                dayInRange.add(1, 'days');
            moment(from).add(count, 'days').format('YYYY-MM-DD')

        if scope.dateRangeStart
            scope.minDate = moment().add(scope.dateRangeStart, 'days').format('YYYY-MM-DD')
        else
            scope.minDate = moment().format('YYYY-MM-DD')

        if scope.dateRangeEnd
            scope.maxDate = moment().add(scope.dateRangeEnd, 'days').format('YYYY-MM-DD')

        if scope.disableWeekends
            if scope.dateRangeStart
                scope.minDate = extendPastWeekend(scope.minDate, scope.dateRangeStart);
            if scope.dateRangeEnd
                scope.maxDate = extendPastWeekend(scope.maxDate, scope.dateRangeEnd);
            scope.disabled = (date, mode) ->
                mode is 'day' && ( date.getDay() is 0 || date.getDay() is 6 )
        else
            scope.disabled = (date, mode) ->
]

# ----------------------------------------
# fb-builder
# ----------------------------------------
.directive 'fbBuilder', ['$injector', ($injector) ->
    # providers
    $builder = $injector.get '$builder'
    $drag = $injector.get '$drag'

    restrict: 'A'
    scope:
        fbBuilder: '@'
    template:
        """
        <div class='form-horizontal'>
            <div class='row fb-form-row-editable' ng-repeat="row in formRows"
                fb-form-row-editable="row" fb-form-row-index='{{$index}}'></div>
            <div ng-show='formRows.length === 0' class='row'>
                <div class='col-sm-12' style='text-align: center'>
                    <h4> Form is empty </h4>
                    <p> Add a new row to start building your form </p>
                    <button type="button" class="btn btn-md btn-default add-row" style=''>
                      <i class="glyphicon glyphicon-plus"></i> Add Row
                    </button>
                </div>
            </div>
        </div>
        """
    link: (scope, element, attrs) ->
        # ----------------------------------------
        # valuables
        # ----------------------------------------
        scope.formName = attrs.fbBuilder
        $builder.forms[scope.formName] ?= []
        scope.formRows = $builder.forms[scope.formName]
        #Always have a row
        $builder.addFormRow scope.formName
        beginMove = yes

        $(element).find('.add-row').click ->
          $builder.addFormRow scope.formName
          scope.$apply()

        $(element).addClass 'fb-builder'
        #Moving drag calculations to rows.
        $drag.droppable $(element),
            move: (e) ->
                if beginMove
                    # hide all popovers
                    $("div.fb-form-object-editable").popover 'hide'
                    beginMove = no
            up: (e, isHover, draggable) ->
                beginMove = yes
                if not $drag.isMouseMoved()
                    # click event
                    $(element).find('.empty').remove()
                    return
]


# ----------------------------------------
# fb-builder-row
# ----------------------------------------
.directive 'fbFormRowEditable', ['$injector', ($injector) ->
# providers
  $builder = $injector.get '$builder'
  $drag = $injector.get '$drag'

  restrict: 'A'
  scope:
    fbFormRowEditable: '@'
    fbFormRowIndex: '@'
  template:
        """
        <div class='col col-sm-{{width}} fb-form-object-editable' ng-repeat="object in formObjects"
            fb-form-object-editable="object"></div>
        <div class="col col-sm-12 notify fb-form-row-empty" ng-show='formObjects.length === 0' style='text-align: center; vertical-align: middle;'>
            <button type="button" class="btn btn-xs btn-default delete-row pull-right" style='margin-top:10px'>
              <i class="glyphicon glyphicon-remove"></i>
            </button>
            <h4>Empty Row</h4>
            <p> Drag and drop components here </p>
        </div>

        """
  link: (scope, element, attrs) ->
    # ----------------------------------------
    # valuables
    # ----------------------------------------
    scope.width = 12
    scope.formName = scope.$parent.formName
    scope.formObjects = $builder.forms[scope.formName][scope.fbFormRowIndex].formObjects
    beginMove = yes


    $(element).find('.delete-row').click ->
        $builder.removeFormRow scope.formName, scope.fbFormRowIndex
        scope.$apply()

    $(element).addClass 'fb-form-row-editable'
    $drag.droppable $(element),
        move: (e) ->

            $formObjects = $(element).find '.fb-form-object-editable:not(.empty,.dragging)'
            if $formObjects.length is 0
                # there are no components in the row.
                if $(element).find('.fb-form-object-editable.empty').length is 0
                    $(element).find('.notify').hide()
                    $(element).prepend $("<div class='col col-sm-" + scope.width + " fb-form-object-editable empty'></div>")
                return

            #calculate the new width
            scope.width = 12/($formObjects.length + 1)
            # the positions could added .empty div.
            positions = []
            # first
            positions.push -1000
            for index in [0...$formObjects.length] by 1
                $formObject = $($formObjects[index])
                offset = $formObject.offset()
                width = $formObject.width()
                positions.push offset.left + width / 2
            positions.push positions[positions.length - 1] + 1000   # last

            # search where should I insert the .empty
            for index in [1...positions.length] by 1
                if e.pageX > positions[index - 1] and e.pageX <= positions[index]
                    # you known, this one
                    $(element).find('.empty').remove()
                    $empty = $ "<div class='col col-sm-" + (scope.width-1) + " fb-form-object-editable empty'></div>"
                    if index - 1 < $formObjects.length
                        $empty.insertBefore $($formObjects[index - 1])
                    else
                        $empty.insertAfter $($formObjects[index - 2])
                    break
            return
        out: ->
            #reset width
            $formObjects = $(element).find '.fb-form-object-editable:not(.empty,.dragging)'
            scope.width = 12/($formObjects.length)
            if beginMove
                # hide all popovers
                $("div.fb-form-object-editable").popover 'hide'
                beginMove = no
            $(element).find('.notify').show()
            $(element).find('.empty').remove()
        up: (e, isHover, draggable) ->
            beginMove = yes
            if not $drag.isMouseMoved()
                # click event
                $(element).find('.empty').remove()
                return
            if isHover
                if draggable.mode is 'mirror'
                    # insert a form object
                    $builder.insertFormObject scope.formName, scope.fbFormRowIndex, $(element).find('.empty').index('.fb-form-object-editable'),
                      component: draggable.object.componentName
                if draggable.mode is 'drag'
                    # update the index of form objects
                    oldIndex = draggable.object.formObject.index
                    newIndex = $(element).find('.empty').index('.fb-form-object-editable')
                    newIndex-- if oldIndex < newIndex
                    newRow = scope.fbFormRowIndex
                    oldRow = draggable.object.formObject.row
                    $builder.updateFormObjectIndex scope.formName, oldRow, newRow, oldIndex, newIndex
            $(element).find('.empty').remove()

    scope.$on "formBuilder:formObjectRemoved", ->
        $formObjects = $(element).find '.fb-form-object-editable:not(.empty,.dragging)'
        scope.width = 12/($formObjects.length-1)
        #scope.$apply()
]

# ----------------------------------------
# fb-form-object-editable
# ----------------------------------------
.directive 'fbFormObjectEditable', ['$injector', ($injector) ->
    # providers
    $builder = $injector.get '$builder'
    $drag = $injector.get '$drag'
    $compile = $injector.get '$compile'
    $validator = $injector.get '$validator'

    restrict: 'A'
    controller: 'fbFormObjectEditableController'
    scope:
        formObject: '=fbFormObjectEditable'
    link: (scope, element) ->
        scope.inputArray = [] # just for fix warning
        # get component
        scope.$component = $builder.components[scope.formObject.component]
        # setup scope
        scope.setupScope scope.formObject
        # compile formObject
        scope.$watch '$component.template', (template) ->
            return if not template
            complete =
                  """
                    <div class='row'>
                      <div class="col-sm-10" style='pointer-events: none;'>
                  """ +
                  template +
                  """
                      </div>
                      <div class="col-sm-2" style='vertical-align: middle'>
                          <div class='row' style='margin:5px; margin-top: 10px'>
                              <button type="button" ng-click="" class="btn btn-xs btn-danger delete-item">
                                </i><i class="glyphicon glyphicon-remove"></i>
                              </button>
                          </div>
                          <div class='row' style='margin:5px'>
                              <button type="button" class="btn btn-xs btn-info modify-item">
                                <i class="glyphicons glyphicons-edit"></i><i class="glyphicon glyphicon-edit"></i>
                              </button>
                          </div>
                      </div>
                    </div>
                  """
            view = $compile(complete) scope
            $(element).html view
            $(element).find('.modify-item').click ->
              $(element).popover 'toggle'

            $(element).find('.delete-item').click ->
              $builder.removeFormObject scope.$parent.$parent.formName, scope.$parent.$parent.$parent.$index, scope.$parent.$index
              scope.$emit("formBuilder:formObjectRemoved")
              $(element).popover 'hide'

        # disable click event
        #$(element).on 'click', -> no

        # draggable
        $drag.draggable $(element),
            object:
                formObject: scope.formObject

        # do not setup bootstrap popover
        return if not scope.formObject.editable

        # ----------------------------------------
        # bootstrap popover
        # ----------------------------------------
        popover = {}
        scope.$watch '$component.popoverTemplate', (template) ->
            return if not template
            $(element).removeClass popover.id
            popover =
                id: "fb-#{Math.random().toString().substr(2)}"
                isClickedSave: no # If didn't click save then rollback
                view: null
                html: template
            popover.html = $(popover.html).addClass popover.id
            # compile popover
            popover.view = $compile(popover.html) scope
            $(element).addClass popover.id
            $(element).popover
                html: yes
                title: scope.$component.label
                content: popover.view
                container: 'body'
                placement: $builder.config.popoverPlacement
                trigger: 'manual'
        scope.popover =
            save: ($event) ->
                ###
                The save event of the popover.
                ###
                $event.preventDefault()
                $validator.validate(scope).success ->
                    popover.isClickedSave = yes
                    $(element).popover 'hide'
                return
            remove: ($event) ->
                ###
                The delete event of the popover.
                ###
                $event.preventDefault()

                $builder.removeFormObject scope.$parent.formName, scope.$parent.$index
                $(element).popover 'hide'
                return
            shown: ->
                ###
                The shown event of the popover.
                ###
                scope.data.backup()
                popover.isClickedSave = no
            cancel: ($event) ->
                ###
                The cancel event of the popover.
                ###
                scope.data.rollback()
                if $event
                    # clicked cancel by user
                    $event.preventDefault()
                    $(element).popover 'hide'
                return
        # ----------------------------------------
        # popover.show
        # ----------------------------------------
        $(element).on 'show.bs.popover', ->
            return no if $drag.isMouseMoved()
            # hide other popovers
            $("div.fb-form-object-editable:not(.#{popover.id})").popover 'hide'

            $popover = $("form.#{popover.id}").closest '.popover'
            if $popover.length > 0
                # fixed offset
                elementOrigin = $(element).offset().top + $(element).height() / 2
                popoverTop = elementOrigin - $popover.height() / 2
                $popover.css
                    position: 'absolute'
                    top: popoverTop

                $popover.show()
                setTimeout ->
                    $popover.addClass 'in'
                    $(element).triggerHandler 'shown.bs.popover'
                , 0
                no
        # ----------------------------------------
        # popover.shown
        # ----------------------------------------
        $(element).on 'shown.bs.popover', ->
            # select the first input
            $(".popover .#{popover.id} input:first").select()
            scope.$apply -> scope.popover.shown()
            return
        # ----------------------------------------
        # popover.hide
        # ----------------------------------------
        $(element).on 'hide.bs.popover', ->
            # do not remove the DOM
            $popover = $("form.#{popover.id}").closest '.popover'
            if not popover.isClickedSave
                # eval the cancel event
                if scope.$$phase or scope.$root.$$phase
                    scope.popover.cancel()
                else
                    scope.$apply -> scope.popover.cancel()
            $popover.removeClass 'in'
            setTimeout ->
                $popover.hide()
            , 300
            no
]

.directive 'componentSelector', ['$injector', ($injector) ->
  $builder = $injector.get '$builder'
  restrict: 'E'
  template:
    """
    <select ng-model="formObject.logic.component" class="form-control custom-m-b">
      <optgroup ng-repeat="(groupName, items) in fields()" label="{{'Page: ' + groupName}}">
          <option ng-selected="item.id === componentize(formObject.logic.component)" ng-if="keys.indexOf(groupName) < keys.indexOf(currentForm) || (keys.indexOf(groupName) === keys.indexOf(currentForm) && item.index < formObject.index)" ng-repeat="item in fields()[groupName]" value="{{item}}">{{item.component}} - {{item.label}}</option>
      </optgroup>
    </select>
    """
  link: (scope, elem, attrs) ->
    scope.fields = () ->
      if elem.parent().parent().parent().parent().parent().is(':visible') is true
        $builder.forms
      else
        []

    scope.componentize = (component) ->
      if component?
        return angular.fromJson(component).id

]

# ----------------------------------------
# fb-components
# ----------------------------------------
.directive 'fbComponents', ->
    restrict: 'A'
    template:
        """
        <ul ng-if="groups.length > 1" class="nav nav-tabs nav-justified" style='margin-top:10px'>
            <li ng-repeat="group in groups" ng-class="{active:activeGroup==group}">
                <a href='#' ng-click="selectGroup($event, group)">{{group}}</a>
            </li>
        </ul>
        <div class='form-horizontal' style='margin:10px'>
            <div class='fb-component' ng-repeat="component in components"
                fb-component="component"></div>
        </div>
        """
    controller: 'fbComponentsController'

# ----------------------------------------
# fb-component
# ----------------------------------------
.directive 'fbComponent', ['$injector', ($injector) ->
    # providers
    $builder = $injector.get '$builder'
    $drag = $injector.get '$drag'
    $compile = $injector.get '$compile'

    restrict: 'A'
    scope:
        component: '=fbComponent'
    controller: 'fbComponentController'
    link: (scope, element) ->
        scope.copyObjectToScope scope.component

        $drag.draggable $(element),
            mode: 'mirror'
            defer: no
            object:
                componentName: scope.component.name

        scope.$watch 'component.template', (template) ->
            return if not template
            view = $compile(template) scope
            $(element).html view
]

# ----------------------------------------
# fb-multiple
# ----------------------------------------
.directive 'fbMultiple', ['$injector', ($injector) ->
    $builder = $injector.get '$builder'

    restrict: 'E'
    scope: {array: '='}
    templateUrl: 'src/ngMultiple.html'
    link: (scope, element, attrs) ->
        scope.seeForms = ->
            console.log $builder.forms
        scope.select = (item) ->
            scope.selected = item
        scope.addPage = ->
            scope.array.push(scope.array.length + 1)
]

# ----------------------------------------
# fb-form
# ----------------------------------------
.directive 'fbForm', ['$injector', ($injector) ->
    restrict: 'A'
    require: 'ngModel'  # form data (end-user input value)
    scope:
        # input model for scops in ng-repeat
        formName: '@fbForm'
        input: '=ngModel'
        default: '=fbDefault'
    template:
        """
        <div class='form-horizontal'>
          <div class='fb-form-row' ng-repeat="row in form" fb-form-row form-row="row"></div>
          <div ng-if='form.length === 0'>
              <h4> This form is empty </h4>
          </div>
        </div>
        """
    controller: 'fbFormController'
    link: (scope, element, attrs) ->
        # providers
        $builder = $injector.get '$builder'
        # get the form for controller
        $builder.forms[scope.formName] ?= []
        scope.form = $builder.forms[scope.formName]
]


# ----------------------------------------
# fb-form-row
# ----------------------------------------
.directive 'fbFormRow', ['$injector', ($injector) ->
  # providers
  $builder = $injector.get '$builder'
  $compile = $injector.get '$compile'
  $parse = $injector.get '$parse'

  restrict: 'A'
  scope:
      # input model for scopes in ng-repeat
      formRow: '='
  template:
        """
        <div class='row fb-form-row'>
          <div class='col col-sm-{{width}} fb-form-object' ng-repeat="object in formRow.formObjects" fb-form-object="object"></div>
          <div ng-if='form.length === 0'>
              <h4> This row is empty </h4>
          </div>
        </div>
        """
  controller: 'fbFormRowController'
  link: (scope, element, attrs) ->
    # ----------------------------------------
    # variables
    # ----------------------------------------
    scope.input = []
    scope.width = if scope.formRow.formObjects.length == 0 then 12 else 12/scope.formRow.formObjects.length
    scope.$parent.input.splice scope.formRow.index, 1, scope.input
]


# ----------------------------------------
# fb-form-object
# ----------------------------------------
.directive 'fbFormObject', ['$injector', ($injector) ->
    # providers
    $builder = $injector.get '$builder'
    $compile = $injector.get '$compile'
    $parse = $injector.get '$parse'

    restrict: 'A'
    controller: 'fbFormObjectController'
    link: (scope, element, attrs) ->
        # ----------------------------------------
        # variables
        # ----------------------------------------
        scope.formObject = $parse(attrs.fbFormObject) scope
        scope.$component = $builder.components[scope.formObject.component]
        scope.formName = scope.$parent.$parent.formName

        # ----------------------------------------
        # scope
        # ----------------------------------------
        # listen (formObject updated
        scope.$on $builder.broadcastChannel.updateInput, -> scope.updateInput scope.inputText
        scope.$on '$builder.$directive.valuesChanged', (event, values) ->
            scope.inputText = values[scope.index].value;
            scope.updateInput(scope.inputText);

        if scope.$component.arrayToText
            scope.inputArray = []
            # watch (end-user updated input of the form
            scope.$watch 'inputArray', (newValue, oldValue) ->
                # array input, like checkbox
                return if newValue is oldValue
                checked = []
                for index of scope.inputArray when scope.inputArray[index]
                    unless index is 'diff'
                      checked.push scope.options[index] ? scope.inputArray[index]
                scope.inputText = checked.join ', '
            , yes
        scope.$watch 'inputText', -> scope.updateInput scope.inputText
        # watch (management updated form objects
        scope.$watch attrs.fbFormObject, ->
            scope.copyObjectToScope scope.formObject
        , yes

        scope.$watch '$component.template', (template) ->
            return if not template
            $template = $(template)
            # add validator
            $input = $template.find "[ng-model='inputText']"
            $input.attr
                validator: '{{validation}}'
            # compile
            view = $compile($template) scope
            $(element).html view

        # select the first option
        if not scope.$component.arrayToText and scope.formObject.options.length > 0
            scope.inputText = scope.formObject.options[0]

        # set default value
        scope.$watch "default['#{scope.formObject.id}']", (value) ->
            return if not value
            if scope.$component.arrayToText
                scope.inputArray = value
            else
                scope.inputText = value
]

.directive 'uploadPhoto', ->
  restrict: 'A'
  link: (scope, element, attrs) ->
    angular.element('#uploadBtn').onchange = ->
      angular.element('#uploadFile').value = this.value
