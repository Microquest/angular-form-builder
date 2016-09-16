angular.module 'builder.components', ['builder', 'validator.rules', 'ngMask', 'pw.canvas-painter', 'ngFileUpload']

.config ['$builderProvider', ($builderProvider) ->

    # ----------------------------------------
    # static text field
    # ----------------------------------------
    $builderProvider.registerComponent 'message',
        group: 'Basic'
        placeholder: 'Rich Content'
        label: 'Rich Content'
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label class="col-sm-2 control-label" for="{{formName+index}}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i>
                </label>
                 <div class="col-sm-10 form-group text-left">
                  <rich-text><strong>Text Message</strong></rich-text>
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
                        <li role="presentation" class="disabled"><a>Validations</a></li>
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation" class="disabled"><a>Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Placeholder</label>
                                <input type='text' ng-model="placeholder" class='form-control'/>
                            </div>
                            <div class="form-group m-t">
                              <a class="btn btn-success btn-block" ng-click="openSummerNote()">Open Rich Text Editor</a>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control custom-m-b" ng-model="formObject.logic.action" ng-options="action for action in actions"></select><p> this element if</p>
                                <component-selector></component-selector>

                                <select class="form-control custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'points' + date + index}}">
                        </div>
                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """

    # ----------------------------------------
    # date picker
    # ----------------------------------------
    $builderProvider.registerComponent 'date',
        group: 'Basic'
        label: 'Date Picker'
        description: ''
        required: no
        disableWeekends: no
        readOnly: no
        # minDate: '2000-01-01'
        # maxDate: '2100-01-01'
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                  <label class="col-sm-2 control-label" for="{{formName+index}}" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                  <div class="col-sm-10">
                    <input type="date" class="form-control" required="{'fb-required':required}" ng-model='inputText'\>
                  </div>
                <div class="col-sm-10 col-sm-offset-2">
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
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation"><a href="{{'#points' + date + index}}" aria-controls="{{'points' + date + index}}" role="tab" data-toggle="tab">Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Description</label>
                                <input type='text' ng-model="description" class='form-control'/>
                            </div>
                            <div class='checkbox icheck-label'>
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                              <label for="{{'required' + date + index}}">Required</label>
                            </div>

                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'disableweekends' + date + index}}" ng-model="disableWeekends">
                              <label for="{{'disableweekends' + date + index}}">Disable Weekends</label>
                            </div>

                            <div class="form-group" ng-if="validationOptions.length > 0">
                                <label class='control-label'>Validation</label>
                                <select ng-model="$parent.validation" class='form-control' ng-options="option.rule as option.label for option in validationOptions"></select>
                            </div>
                            <div class="form-group m-t">
                                <div class="row">
                                    <p class="col-sm-12">
                                        <strong>Enable Selection</strong>
                                    </p>
                                    <div class="col-sm-6">
                                        <div class="input-group">
                                            <span class="input-group-addon">From</span>
                                            <select class="form-control" ng-model="dateRangeStart" ng-options="value for value in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]">
                                                <option value="">---</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="input-group">
                                            <span class="input-group-addon">To</span>
                                            <select class="form-control" ng-model="dateRangeEnd" ng-options="value for value in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]">
                                                <option value="">---</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control custom-m-b" ng-model="formObject.logic.action" ng-options="action for action in actions"></select><p> this element if</p>
                                <component-selector></component-selector>

                                <select class="form-control custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane p-t-n" id="{{'points' + date + index}}">

                          <div class="form-group" ng-if="formObject.pointRules.length > 0">
                            <label class="control-label m-t-c--5">Active Rules</label>
                            <div class="m-t-xs" ng-repeat="rule in formObject.pointRules">
                              Add <span class="label label-primary">{{rule.points}}</span> points if this field <span class="label label-primary">{{rule.predicate | predicate}}</span>&nbsp;<span class="label label-primary" ng-if="rule.predicate !== 'null' && rule.predicate !== 'not_null'">{{rule.value}}</span> <a ng-click="removeRule(rule)" class="pull-right btn btn-sm btn-link hover-dark-grey-link btn-xs"><i class="fa fa-times-circle"></i></a>
                            </div>
                          </div>
                          <div class="form-group custom-m-b">
                              <div class="input-group">
                                <span class="input-group-addon add-points">Add</span>
                                <input type="text" class="form-control" ng-model="newRule.points">
                                <span class="input-group-addon add-points">points</span>
                              </div>
                          </div>

                          <div class="form-group custom-m-b">
                            <div class="input-group">
                              <span class="input-group-addon add-points">if this field</span>
                              <select ng-model="newRule.predicate" ng-options="predicate.value as predicate.label for predicate in predicates" class="form-control"></select>
                            </div>
                          </div>

                          <div class="input-group">
                            <input ng-readonly="newRule.predicate === 'null' || newRule.predicate === 'not_null'" ng-model="newRule.value" type="text" class="form-control" placeholder="value">
                            <span class="input-group-btn">
                              <button ng-click="addRule()" class="btn btn-primary" type="button">+</button>
                            </span>
                          </div>
                          <p class="text-danger">{{rulesErrorMessage}}</p>

                        </div>

                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """

    # ----------------------------------------
    # Phone Input
    # ----------------------------------------
    $builderProvider.registerComponent 'phone',
        group: 'Basic'
        label: 'Phone Number'
        description: ''
        required: no
        readOnly: no
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                  <label class="col-sm-2 control-label" for="{{formName+index}}" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                  <input type="hidden" class="form-control" required="{'fb-required':required}" ng-model='inputText' value="{{inputText=type + ': ' + number + ' ext.' + extension}}"\>
                  <div class="col-sm-3">
                    <select ng-show="!multiple" ng-readonly="readOnly" class="form-control m-b"
                        ng-model="type" ng-init="type='Home'">
                        <option value="Home">Home</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="col-sm-4">
                    <input type="text" class="form-control" required="{'fb-required':required}" ng-model='number' mask='(999) 999-9999' clean='true' placeholder='#'\>
                  </div>
                  <div class='col-sm-2'>
                    <input type="text" class="form-control" required="{'fb-required':required}" ng-model='extension' mask='999' clean='true' placeholder='ext.'\>
                  </div>
                <div class="col-sm-10 col-sm-offset-2">
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
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation"><a href="{{'#points' + date + index}}" aria-controls="{{'points' + date + index}}" role="tab" data-toggle="tab">Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Description</label>
                                <input type='text' ng-model="description" class='form-control'/>
                            </div>
                            <div class='checkbox icheck-label'>
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                              <label for="{{'required' + date + index}}">Required</label>
                            </div>

                            <div class="form-group" ng-if="validationOptions.length > 0">
                                <label class='control-label'>Validation</label>
                                <select ng-model="$parent.validation" class='form-control' ng-options="option.rule as option.label for option in validationOptions"></select>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control custom-m-b" ng-model="formObject.logic.action" ng-options="action for action in actions"></select><p> this element if</p>
                                <component-selector></component-selector>

                                <select class="form-control custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane p-t-n" id="{{'points' + date + index}}">

                          <div class="form-group" ng-if="formObject.pointRules.length > 0">
                            <label class="control-label m-t-c--5">Active Rules</label>
                            <div class="m-t-xs" ng-repeat="rule in formObject.pointRules">
                              Add <span class="label label-primary">{{rule.points}}</span> points if this field <span class="label label-primary">{{rule.predicate | predicate}}</span>&nbsp;<span class="label label-primary" ng-if="rule.predicate !== 'null' && rule.predicate !== 'not_null'">{{rule.value}}</span> <a ng-click="removeRule(rule)" class="pull-right btn btn-sm btn-link hover-dark-grey-link btn-xs"><i class="fa fa-times-circle"></i></a>
                            </div>
                          </div>
                          <div class="form-group custom-m-b">
                              <div class="input-group">
                                <span class="input-group-addon add-points">Add</span>
                                <input type="text" class="form-control" ng-model="newRule.points">
                                <span class="input-group-addon add-points">points</span>
                              </div>
                          </div>

                          <div class="form-group custom-m-b">
                            <div class="input-group">
                              <span class="input-group-addon add-points">if this field</span>
                              <select ng-model="newRule.predicate" ng-options="predicate.value as predicate.label for predicate in predicates" class="form-control"></select>
                            </div>
                          </div>

                          <div class="input-group">
                            <input ng-readonly="newRule.predicate === 'null' || newRule.predicate === 'not_null'" ng-model="newRule.value" type="text" class="form-control" placeholder="value">
                            <span class="input-group-btn">
                              <button ng-click="addRule()" class="btn btn-primary" type="button">+</button>
                            </span>
                          </div>
                          <p class="text-danger">{{rulesErrorMessage}}</p>

                        </div>

                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """


  # ----------------------------------------
    # text input
    # ----------------------------------------
    $builderProvider.registerComponent 'text',
        group: 'Basic'
        label: 'Text Input'
        description: ''
        placeholder: 'placeholder'
        readOnly: no
        minLength: 0
        maxLength: 999
        minRange: 0
        maxRange: 99999
        required: no
        validationOptions: [
            {label: 'None', rule: '/.*/'}
            {label: 'Text', rule: '[text]'}
            {label: 'Number', rule: '[numberRange]'}
            {label: 'Email', rule: '[email]'}
        ]
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label class="col-sm-2 control-label" for="{{formName+index}}" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                <div class="col-sm-10">
                    <input type="text" ng-show="validation != '[numberRange]'" ng-readonly="readOnly" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" class="form-control m-b" placeholder="{{placeholder}}"/>
                    <input type="tel" ng-show="validation === '[numberRange]'" ng-readonly="readOnly" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" class="form-control m-b" placeholder="{{placeholder}}"/>
                </div>
              <div class="col-sm-10 col-sm-offset-2">
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
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation"><a href="{{'#points' + date + index}}" aria-controls="{{'points' + date + index}}" role="tab" data-toggle="tab">Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
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
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                              <label for="{{'required' + date + index}}">Required</label>
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
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control custom-m-b" ng-model="formObject.logic.action" ng-options="action for action in actions"></select><p> this element if</p>
                                <component-selector></component-selector>

                                <select class="form-control custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane p-t-n" id="{{'points' + date + index}}">

                          <div class="form-group" ng-if="formObject.pointRules.length > 0">
                            <label class="control-label m-t-c--5">Active Rules</label>
                            <div class="m-t-xs" ng-repeat="rule in formObject.pointRules">
                              Add <span class="label label-primary">{{rule.points}}</span> points if this field <span class="label label-primary">{{rule.predicate | predicate}}</span>&nbsp;<span class="label label-primary" ng-if="rule.predicate !== 'null' && rule.predicate !== 'not_null'">{{rule.value}}</span> <a ng-click="removeRule(rule)" class="pull-right btn btn-sm btn-link hover-dark-grey-link btn-xs"><i class="fa fa-times-circle"></i></a>
                            </div>
                          </div>
                          <div class="form-group custom-m-b">
                              <div class="input-group">
                                <span class="input-group-addon add-points">Add</span>
                                <input type="text" class="form-control" ng-model="newRule.points">
                                <span class="input-group-addon add-points">points</span>
                              </div>
                          </div>

                          <div class="form-group custom-m-b">
                            <div class="input-group">
                              <span class="input-group-addon add-points">if this field</span>
                              <select ng-model="newRule.predicate" ng-options="predicate.value as predicate.label for predicate in predicates" class="form-control"></select>
                            </div>
                          </div>

                          <div class="input-group">
                            <input ng-readonly="newRule.predicate === 'null' || newRule.predicate === 'not_null'" ng-model="newRule.value" type="text" class="form-control" placeholder="value">
                            <span class="input-group-btn">
                              <button ng-click="addRule()" class="btn btn-primary" type="button">+</button>
                            </span>
                          </div>
                          <p class="text-danger">{{rulesErrorMessage}}</p>

                        </div>
                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """

    # ----------------------------------------
    # Text area
    # ----------------------------------------
    $builderProvider.registerComponent 'area',
        group: 'Basic'
        label: 'Text Area'
        description: ''
        placeholder: 'placeholder'
        required: no
        readOnly: no
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label class="col-sm-2 control-label" for="{{formName+index}}" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                <div class="col-sm-10">
                    <textarea type="text" ng-readonly="readOnly" ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}" class="form-control m-b" rows='6' placeholder="{{placeholder}}"/>
                </div>
                <div class="col-sm-10 col-sm-offset-2">
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
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation"><a href="{{'#points' + date + index}}" aria-controls="{{'points' + date + index}}" role="tab" data-toggle="tab">Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
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
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                              <label for="{{'required' + date + index}}">Required</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control custom-m-b" ng-model="formObject.logic.action" ng-options="action for action in actions"></select><p> this element if</p>
                                <component-selector></component-selector>
                                <select class="form-control custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane p-t-n" id="{{'points' + date + index}}">

                          <div class="form-group" ng-if="formObject.pointRules.length > 0">
                            <label class="control-label m-t-c--5">Active Rules</label>
                            <div class="m-t-xs" ng-repeat="rule in formObject.pointRules">
                              Add <span class="label label-primary">{{rule.points}}</span> points if this field <span class="label label-primary">{{rule.predicate | predicate}}</span>&nbsp;<span class="label label-primary" ng-if="rule.predicate !== 'null' && rule.predicate !== 'not_null'">{{rule.value}}</span> <a ng-click="removeRule(rule)" class="pull-right btn btn-sm btn-link hover-dark-grey-link btn-xs"><i class="fa fa-times-circle"></i></a>
                            </div>
                          </div>
                          <div class="form-group custom-m-b">
                              <div class="input-group">
                                <span class="input-group-addon add-points">Add</span>
                                <input type="text" class="form-control" ng-model="newRule.points">
                                <span class="input-group-addon add-points">points</span>
                              </div>
                          </div>

                          <div class="form-group custom-m-b">
                            <div class="input-group">
                              <span class="input-group-addon add-points">if this field</span>
                              <select ng-model="newRule.predicate" ng-options="predicate.value as predicate.label for predicate in predicates" class="form-control"></select>
                            </div>
                          </div>

                          <div class="input-group">
                            <input ng-readonly="newRule.predicate === 'null' || newRule.predicate === 'not_null'" ng-model="newRule.value" type="text" class="form-control" placeholder="value">
                            <span class="input-group-btn">
                              <button ng-click="addRule()" class="btn btn-primary" type="button">+</button>
                            </span>
                          </div>
                          <p class="text-danger">{{rulesErrorMessage}}</p>

                        </div>
                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """

    # ----------------------------------------
    # checkbox
    # ----------------------------------------
    $builderProvider.registerComponent 'checkbox',
        group: 'Choice'
        label: 'Checkbox'
        description: ''
        placeholder: 'placeholder'
        required: no
        options: ['value one', 'value two']
        arrayToText: yes
        readOnly: no
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label for="{{formName+index}}" class="col-sm-2 control-label" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                <div class="col-sm-10">
                    <input type='hidden' ng-model="inputText" validator-required="{{required}}" validator-group="{{formName}}"/>
                    <div class='checkbox icheck-label' ng-repeat="item in options track by $index">
                      <input id="{{formName+index+$index | nospace}}" ng-model="inputArray[$index]" ng-value='item' ng-disabled="readOnly" type="checkbox" checked="">
                      <label for="{{formName+index+$index | nospace}}">{{item}}</label>
                    </div>
                </div>
                <div class="col-sm-10 col-sm-offset-2">
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
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation"><a href="{{'#points' + date + index}}" aria-controls="{{'points' + date + index}}" role="tab" data-toggle="tab">Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Description</label>
                                <input type='text' ng-model="description" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Options</label>
                                <textarea class="form-control" rows="3" ng-model="optionsText"/>
                            </div>
                            <div class='checkbox icheck-label'>
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                              <label for="{{'required' + date + index}}">Required</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control custom-m-b" ng-model="formObject.logic.action" ng-options="action for action in actions"></select><p> this element if</p>
                                <component-selector></component-selector>

                                <select class="form-control custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane p-t-n" id="{{'points' + date + index}}">

                          <div class="form-group" ng-if="formObject.pointRules.length > 0">
                            <label class="control-label m-t-c--5">Active Rules</label>
                            <div class="m-t-xs" ng-repeat="rule in formObject.pointRules">
                              Add <span class="label label-primary">{{rule.points}}</span> points if this field <span class="label label-primary">{{rule.predicate | predicate}}</span>&nbsp;<span class="label label-primary" ng-if="rule.predicate !== 'null' && rule.predicate !== 'not_null'">{{rule.value}}</span> <a ng-click="removeRule(rule)" class="pull-right btn btn-sm btn-link hover-dark-grey-link btn-xs"><i class="fa fa-times-circle"></i></a>
                            </div>
                          </div>
                          <div class="form-group custom-m-b">
                              <div class="input-group">
                                <span class="input-group-addon add-points">Add</span>
                                <input type="text" class="form-control" ng-model="newRule.points">
                                <span class="input-group-addon add-points">points</span>
                              </div>
                          </div>

                          <div class="form-group custom-m-b">
                            <div class="input-group">
                              <span class="input-group-addon add-points">if this field</span>
                              <select ng-model="newRule.predicate" ng-options="predicate.value as predicate.label for predicate in predicates" class="form-control"></select>
                            </div>
                          </div>

                          <div class="input-group">
                            <input ng-readonly="newRule.predicate === 'null' || newRule.predicate === 'not_null'" ng-model="newRule.value" type="text" class="form-control" placeholder="value">
                            <span class="input-group-btn">
                              <button ng-click="addRule()" class="btn btn-primary" type="button">+</button>
                            </span>
                          </div>
                          <p class="text-danger">{{rulesErrorMessage}}</p>

                        </div>
                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """

    # ----------------------------------------
    # radio
    # ----------------------------------------
    $builderProvider.registerComponent 'radio',
        group: 'Choice'
        label: 'Radio'
        description: ''
        placeholder: 'placeholder'
        required: no
        readOnly: no
        options: ['value one', 'value two']
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label for="{{formName+index}}" class="col-sm-2 control-label" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                <div class="col-sm-10">
                    <div class='radio icheck-label' ng-repeat="item in options track by $index">

                        <input id="{{formName+index+$index | nospace}}" type="radio" ng-disabled="readOnly" name='{{formName+index}}' ng-model="$parent.inputText" validator-group="{{formName}}" ng-value='item'>
                        <label for="{{formName+index+$index | nospace}}">{{item}}</label>

                    </div>
                </div>
                <div class="col-sm-10 col-sm-offset-2">
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
                        <li role="presentation" class="disabled"><a>Validations</a></li>
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation"><a href="{{'#points' + date + index}}" aria-controls="{{'points' + date + index}}" role="tab" data-toggle="tab">Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Description</label>
                                <input type='text' ng-model="description" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Options</label>
                                <textarea class="form-control" rows="3" ng-model="optionsText"/>
                            </div>
                            <div class='checkbox icheck-label'>
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class="checkbox m-t">
                                <label>
                                    <input type='checkbox'  ng-model="required" />
                                    Required
                                </label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control" ng-model="formObject.logic.action" ng-options="action for action in ['Hide', 'Show']"></select><p> this element if</p>
                                <component-selector></component-selector>

                                <select class="form-control  custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>

                        <div role="tabpanel" class="tab-pane p-t-n" id="{{'points' + date + index}}">

                          <div class="form-group" ng-if="formObject.pointRules.length > 0">
                            <label class="control-label m-t-c--5">Active Rules</label>
                            <div class="m-t-xs" ng-repeat="rule in formObject.pointRules">
                              Add <span class="label label-primary">{{rule.points}}</span> points if this field <span class="label label-primary">{{rule.predicate | predicate}}</span>&nbsp;<span class="label label-primary" ng-if="rule.predicate !== 'null' && rule.predicate !== 'not_null'">{{rule.value}}</span> <a ng-click="removeRule(rule)" class="pull-right btn btn-sm btn-link hover-dark-grey-link btn-xs"><i class="fa fa-times-circle"></i></a>
                            </div>
                          </div>
                          <div class="form-group custom-m-b">
                              <div class="input-group">
                                <span class="input-group-addon add-points">Add</span>
                                <input type="text" class="form-control" ng-model="newRule.points">
                                <span class="input-group-addon add-points">points</span>
                              </div>
                          </div>

                          <div class="form-group custom-m-b">
                            <div class="input-group">
                              <span class="input-group-addon add-points">if this field</span>
                              <select ng-model="newRule.predicate" ng-options="predicate.value as predicate.label for predicate in predicates" class="form-control"></select>
                            </div>
                          </div>

                          <div class="input-group">
                            <input ng-readonly="newRule.predicate === 'null' || newRule.predicate === 'not_null'" ng-model="newRule.value" type="text" class="form-control" placeholder="value">
                            <span class="input-group-btn">
                              <button ng-click="addRule()" class="btn btn-primary" type="button">+</button>
                            </span>
                          </div>
                          <p class="text-danger">{{rulesErrorMessage}}</p>

                        </div>
                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """

    # ----------------------------------------
    # select
    # ----------------------------------------
    $builderProvider.registerComponent 'select',
        group: 'Choice'
        label: 'Select'
        description: ''
        placeholder: 'Choose..'
        required: no
        readOnly: no
        options: ['value one', 'value two']
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label class="col-sm-2 control-label" for="{{formName+index}}" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                <div class="col-sm-10 dropdown">
                    <select ng-show="!multiple" ng-readonly="readOnly" ng-options="value for value in options" class="form-control m-b"
                        ng-model="inputText" ng-init="inputText = ''">
                        <option value="">{{placeholder}}</option>
                    </select>
                </div>
                <div class="col-sm-10 col-sm-offset-2">
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
                        <li role="presentation"><a href="{{'#logic' + date + index}}" aria-controls="{{'logic' + date + index}}" role="tab" data-toggle="tab">Logic</a></li>
                        <li role="presentation"><a href="{{'#points' + date + index}}" aria-controls="{{'points' + date + index}}" role="tab" data-toggle="tab">Points</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="{{'properties' + date + index}}">
                            <div class="form-group m-t-sm">
                                <label class='control-label'>Label</label>
                                <input type='text' ng-model="label" validator="[required]" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Description</label>
                                <input type='text' ng-model="description" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Placeholder</label>
                                <input type='text' ng-model="placeholder" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Options</label>
                                <textarea class="form-control" rows="3" ng-model="optionsText"/>
                            </div>
                            <div class='checkbox icheck-label'>
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                              <label for="{{'required' + date + index}}">Required</label>
                            </div>
                            <div class="form-group" ng-if="validationOptions.length > 0">
                                <label class='control-label'>Validation</label>
                                <select ng-model="$parent.validation" class='form-control' ng-options="option.rule as option.label for option in validationOptions"></select>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'logic' + date + index}}">
                            <div class="form-group m-t">
                                <select class="form-control custom-m-b" ng-model="formObject.logic.action" ng-options="action for action in actions"></select><p> this element if</p>
                                <component-selector></component-selector>

                                <select class="form-control custom-m-b" ng-model="formObject.logic.comparator" ng-options="comparator for comparator in comparatorChoices">
                                </select>
                                <input type="text" ng-model="formObject.logic.value" class="form-control" placeholder="Value">
                                <button type="button" ng-click="resetLogic()" class="btn btn-default pull-right">Reset</button>
                                <br>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane p-t-n" id="{{'points' + date + index}}">

                          <div class="form-group" ng-if="formObject.pointRules.length > 0">
                            <label class="control-label m-t-c--5">Active Rules</label>
                            <div class="m-t-xs" ng-repeat="rule in formObject.pointRules">
                              Add <span class="label label-primary">{{rule.points}}</span> points if this field <span class="label label-primary">{{rule.predicate | predicate}}</span>&nbsp;<span class="label label-primary" ng-if="rule.predicate !== 'null' && rule.predicate !== 'not_null'">{{rule.value}}</span> <a ng-click="removeRule(rule)" class="pull-right btn btn-sm btn-link hover-dark-grey-link btn-xs"><i class="fa fa-times-circle"></i></a>
                            </div>
                          </div>
                          <div class="form-group custom-m-b">
                              <div class="input-group">
                                <span class="input-group-addon add-points">Add</span>
                                <input type="text" class="form-control" ng-model="newRule.points">
                                <span class="input-group-addon add-points">points</span>
                              </div>
                          </div>

                          <div class="form-group custom-m-b">
                            <div class="input-group">
                              <span class="input-group-addon add-points">if this field</span>
                              <select ng-model="newRule.predicate" ng-options="predicate.value as predicate.label for predicate in predicates" class="form-control"></select>
                            </div>
                          </div>

                          <div class="input-group">
                            <input ng-readonly="newRule.predicate === 'null' || newRule.predicate === 'not_null'" ng-model="newRule.value" type="text" class="form-control" placeholder="value">
                            <span class="input-group-btn">
                              <button ng-click="addRule()" class="btn btn-primary" type="button">+</button>
                            </span>
                          </div>
                          <p class="text-danger">{{rulesErrorMessage}}</p>

                        </div>
                    </div>
                </div>

                <hr/>
                <div class='form-group'>
                    <input type='button' ng-click="popover.remove($event)" class='btn btn-danger fa h-c-34 pull-right m-b m-l-xs' value='&#xf1f8'/>
                    <input type='submit' ng-click="popover.save($event)" class='btn btn-primary h-c-34 pull-right m-b fa' value='&#xf0c7'/>
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """

    # ----------------------------------------
    # Drawing component
    # ----------------------------------------
    $builderProvider.registerComponent 'draw',
        group: 'Drawing'
        label: 'Draw'
        description: ''
        readOnly: no
        template:
            """
            <div class="row" id="{{formName+index | nospace}}">
                <label class="col-sm-2 control-label" for="{{formName+index}}" ng-class="{'fb-required':required}"><i ng-if ="formObject.logic.component" id="hasLogic" class="fa fa-random label-logic"></i> {{label}} <span style='color:red' ng-if='required'>*</span></label>
                <div class="col-sm-10" ng-style="{'background-image':'url('+formObject.backgroundImage+')', 'background-size':'cover', 'width': '400px', 'height': '300px'}" >
                    <div pw-canvas options="{undo: true, width: 400, height: 300, color: '#a52a2a', backgroundColor: '#000', lineWidth: 3}" version="formObject.drawVersion" imageSrc="formObject.backgroundImage"></div>
                </div>
              <div class="col-sm-10 col-sm-offset-2">
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
                            <div class="form-group">
                                <label class='control-label'>Description</label>
                                <input type='text' ng-model="description" class='form-control'/>
                            </div>
                            <div class="form-group">
                                <label class='control-label'>Placeholder</label>
                                <input type='text' ng-model="placeholder" class='form-control'/>
                            </div>
                            <div class='checkbox icheck-label'>
                              <input type="checkbox" id="{{'readonly' + date + index}}" ng-model="readOnly">
                              <label for="{{'readonly' + date + index}}">Read Only</label>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="{{'validations' + date + index}}">
                            <div class='checkbox icheck-label m-t'>
                              <input type="checkbox" id="{{'required' + date + index}}" ng-model="required">
                              <label for="{{'required' + date + index}}">Required</label>
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
                    <input type='button' ng-click="popover.cancel($event)" class='btn btn-white h-c-34 pull-left m-b' value='Cancel'/>
                </div>
            </form>
            """
]