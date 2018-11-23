###
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
###

angular.module 'builder.provider', []

.provider '$builder', ->
    $injector = null
    $http = null
    $templateCache = null

    @config =
        popoverPlacement: 'right'
        max_id: 0
    # all components
    @components = {}
    # all groups of components
    @groups = []
    @broadcastChannel =
        updateInput: '$updateInput'
        loadInput: '$loadInput'
        loadComplete: '$builder.loadCompleted'


    # forms
    #   builder mode: `fb-builder` you could drag and drop to build the form.
    #   form mode: `fb-form` this is the form for end-user to input value.
    @forms = {}

    # ----------------------------------------
    # private functions
    # ----------------------------------------
    @convertComponent = (name, component) ->
        result =
            name: name
            group: component.group ? 'Default'
            label: component.label ? ''
            label_inline: component.label_inline ? yes
            label_visible: component.label_visible ? yes
            description: component.description ? ''
            placeholder: component.placeholder ? ''
            editable: component.editable ? yes
            required: component.required ? no
            validation: component.validation ? '/.*/'
            validationOptions: component.validationOptions ? []
            options: component.options ? []
            arrayToText: component.arrayToText ? no
            dictionaryToString : component.dictionaryToString ? no
            template: component.template
            templateUrl: component.templateUrl
            viewerTemplate: component.viewerTemplate
            viewerTemplateUrl: component.viewerTemplateUrl
            popoverTemplate: component.popoverTemplate
            popoverTemplateUrl: component.popoverTemplateUrl
        if not result.template and not result.templateUrl
            console.error "The template is empty."
        if not result.popoverTemplate and not result.popoverTemplateUrl
            console.error "The popoverTemplate is empty."
        result

    @convertFormObject = (name, formObject={}) ->
        component = @components[formObject.component]
        throw "The component #{formObject.component} was not registered." if not component?
        result =
            id: formObject.id
            component: formObject.component
            editable: formObject.editable ? component.editable
            index: formObject.index ? 0
            row: formObject.row ? 0
            label: formObject.label ? component.label
            label_inline: formObject.label_inline ? component.label_inline
            label_visible: formObject.label_visible ? component.label_visible
            description: formObject.description ? component.description
            placeholder: formObject.placeholder ? component.placeholder
            options: formObject.options ? component.options
            required: formObject.required ? component.required
            validation: formObject.validation ? component.validation
            multiple: formObject.multiple ? component.multiple
            minLength: formObject.minLength ? component.minLength
            maxLength: formObject.maxLength ? component.maxLength
            dateRangeStart: formObject.dateRangeStart ? component.dateRangeStart
            dateRangeEnd: formObject.dateRangeEnd ? component.dateRangeEnd
            disableWeekends: formObject.disableWeekends ? component.disableWeekends
            readOnly: formObject.readOnly ? component.readOnly
            nextXDays: formObject.nextXDays ? component.nextXDays
            maxDate: formObject.maxDate ? component.maxDate
            maxDate: formObject.minDate ? component.minDate
            requireConfirmation: formObject.requireConfirmation ? component.requireConfirmation
            minRange: formObject.minRange ? component.minRange
            maxRange: formObject.maxRange ? component.maxRange
            category: formObject.category ? component.category
            backgroundImage: formObject.backgroundImage ? component.backgroundImage
            imageWidth: formObject.imageWidth ? component.imageWidth
            imageHeight: formObject.imageHeight ? component.imageHeight
            restrictRange: formObject.restrictRange ? component.restrictRange
        result

    @reindexFormObject = (name, row) =>
        formObjects = @forms[name][row].formObjects
        for index in [0...formObjects.length] by 1
            formObjects[index].index = index
            formObjects[index].row = row
        return

    @reindexFormRows = (name) =>
      formRows = @forms[name]
      for index in [0...formRows.length] by 1
        formRows[index].index = index
      return

    @setupProviders = (injector) =>
        $injector = injector
        $http = $injector.get '$http'
        $templateCache = $injector.get '$templateCache'
        $uibModal = $injector.get '$uibModal'

    @loadTemplate = (component) ->
        ###
        Load template for components.
        @param component: {object} The component of $builder.
        ###
        if not component.template?
            $http.get component.templateUrl,
                cache: $templateCache
            .success (template) ->
                component.template = template
        if not component.popoverTemplate?
            $http.get component.popoverTemplateUrl,
                cache: $templateCache
            .success (template) ->
                component.popoverTemplate = template

    # ----------------------------------------
    # public functions
    # ----------------------------------------
    @registerComponent = (name, component={}) =>
        ###
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
        ###
        if not @components[name]?
            # regist the new component
            newComponent = @convertComponent name, component
            @components[name] = newComponent
            @loadTemplate(newComponent) if $injector?
            if newComponent.group not in @groups
                @groups.push newComponent.group
        else
            console.error "The component #{name} was registered."
        return

    @addFormRow = (name) =>
        ###
        Insert the form row into the form at last.
        ###
        @forms[name] ?= []
        @insertFormRow name, @forms[name].length

    @removeFormRow = (name, row) =>
        ###
        Remove the form object by the index.
        @param name: The form name.
        @param index: The form object index.
        ###
        forms = @forms
        formRows = forms[name]
        formRows.splice row, 1
        @reindexFormRows name

    @addFormObject = (name, row, formObject={}) =>
        ###
        Insert the form object into the form at last.
        ###
        @insertFormObject name, row, @forms[name][row].formObjects.length, formObject

    @insertFormObject = (name, row, index, formObject={}) =>
        ###
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
        ###
        @forms[name] ?= [{index: 0, formObjects: []}]
        if index > @forms[name][row].formObjects.length then index = @forms[name][row].formObjects.length
        if index < 0 then index = 0
        formObject.row = parseInt(row)
        @forms[name][row].formObjects.splice index, 0, @convertFormObject(name, formObject)
        #check if we should add a new row
        if @forms[name][@forms[name].length-1].formObjects.length != 0 then @addFormRow name
        @reindexFormObject name, row
        @forms[name][row].formObjects[index]

    @insertFormRow = (name, index) =>
        @forms[name] ?= []
        if index > @forms[name].length then index = @forms[name].length
        if index < 0 then index = 0
        @forms[name].splice index, 0, {index: index, formObjects: []}
        @reindexFormRows name
        @forms[name][index]

    @removeFormObject = (name, row, index) =>
        ###
        Remove the form object by the index.
        @param name: The form name.
        @param index: The form object index.
        ###
        forms = @forms
        formObjects = forms[name][row].formObjects
        formObjects.splice index, 1
        @reindexFormObject name, row

    @clearForm = (name) =>
        ###
        Clears all components from the form object.
        @param name: The form name.
        ###
        @forms[name] ?= []
        while @forms[name].length > 0
            #pop the collars... errr the rows
            @forms[name].pop()
        #Keep a single row for sanity
        @forms[name].push {index: 0, formObjects: []}

    @loadFromArray = (name, formRows) =>
        ###
        Adds a list of objects to the specified form
        @param name: The form name.
        @param formObjects: The form compoennts to add.
        ###
        @forms[name] ?= []
        @clearForm name
        for row of formRows
          if row > 0 then @forms[name].splice row, 0, {index: row, formObjects: []}
          for component of formRows[row].formObjects
            @forms[name][row].formObjects.splice component, 0, @convertFormObject(name, formRows[row].formObjects[component])
          @reindexFormObject name, row

        #hackily remove empty rows at the end?
        for row of formRows
          if formRows[row].formObjects.length == 0
            @forms[name].splice row, 1
            row--
        @reindexFormRows name

    @updateFormObjectIndex = (name, oldRow, newRow, oldIndex, newIndex) =>
        ###
        Update the index of the form object.
        @param name: The form name.
        @param oldIndex: The old index.
        @param newIndex: The new index.
        ###
        return if oldIndex is newIndex and oldRow is newRow
        formRows = @forms[name]
        oldFormRow = formRows[oldRow]
        oldFormObjects = oldFormRow.formObjects

        if oldRow is newRow
          #if its in the same row just move it
          formObject = oldFormObjects.splice(oldIndex, 1)[0]
          if oldIndex > newIndex
            oldFormObjects.splice newIndex, 0, formObject
          else
            oldFormObjects.splice newIndex-1, 0, formObject
        else
          #remove from old position
          formObject = oldFormObjects.splice(oldIndex, 1)[0]
          #if its in a different row get that row
          newFormRow = formRows[newRow]
          newFormObjects = newFormRow.formObjects
          #add it to the new row
          newFormObjects.splice newIndex, 0, formObject
        if @forms[name][@forms[name].length-1].formObjects.length != 0 then @addFormRow name
        @reindexFormObject name, oldRow
        @reindexFormObject name, newRow

    @resetProviderData = () =>
        ###
        Clears the data of this provider. Resets as if forst load.
        ###
        $injector = null
        $http = null
        $templateCache = null
        @config =
            popoverPlacement: 'right'
            max_id: 0
        @components = {}
        @groups = []
        @broadcastChannel =
            updateInput: '$updateInput'
        @forms = {}


    @verifyIdSanity = (name) =>
      form = @forms[name]
      ids = {}
      for row in form
        for obj in row
          if not ids[obj.id]
            ids[obj.id] = true
          else
            obj.id = @config.max_id
            @config.max_id = @config.max_id + 1

    # ----------------------------------------
    # $get
    # ----------------------------------------
    @$get = ['$injector', ($injector) =>
      @setupProviders($injector)
      for name, component of @components
        @loadTemplate component

      config: @config
      components: @components
      groups: @groups
      forms: @forms
      broadcastChannel: @broadcastChannel
      registerComponent: @registerComponent
      addFormObject: @addFormObject
      insertFormObject: @insertFormObject
      removeFormObject: @removeFormObject
      updateFormObjectIndex: @updateFormObjectIndex
      loadFromArray: @loadFromArray
      resetProviderData: @resetProviderData
      clearForm: @clearForm
      insertFormRow: @insertFormRow
      addFormRow: @addFormRow
      removeFormRow: @removeFormRow
      verifyIdSanity: @verifyIdSanity
    ]
    return
