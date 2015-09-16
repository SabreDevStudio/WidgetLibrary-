define([
          'util/LodashExtensions'
        , 'moment'
        , 'angular'
        , 'angular_bootstrap'
        , 'widgets/SDSWidgets'
        , 'text!view-templates/InputSortBy.tpl.html'
    ],
    function (
          _
        , moment
        , angular
        , angular_bootstrap
        , SDSWidgets
        , InputSortByTemplate
    ) {
        'use strict';

        return angular.module('sdsWidgets')
            .directive('inputSortBy', function () {
                return {
                    restrict: 'EA',
                    replace: true,
                    transclude: true,
                    scope: {
                        /* Input argument: label that will be displayed before the dropdown button. For example 'Sort by' */
                          label: '@'

                        /**
                         * Input argument:
                         * array of all available for criteria, to be displayed (and be selectable) on the dropdown.
                         * Array elements must be object and have fields: label, propertyName, reverse.
                         * These objects will come from ItinerariesListSortCriteria.availableSortCriteria
                         */
                        , availableSortCriteria: '='

                        /**
                         * Output argument.
                         * On selection on the dropdown, the directive will set this to the selected value from the availableSortCriteria.
                         * So the return value here will be the specific element from availableSortCriteria
                         */
                        , selectedFirstSortCriterion: '='

                        /**
                         * Callback that will be called on every sorting criteria changed (when value on dropdown is selected).
                         */
                        , onSortingCriteriaChanged: '&'
                    },
                    template: InputSortByTemplate,
                    link: function (scope, element) {

                        var lastSelectedValueIdx;

                        function setSelectDropdownValue(dropdownMenuElement, selectedValueLabel, selectedValueIdx) {
                            var buttonLabelTextSelector = "button span.SDSDropdownLabelText";
                            var buttonLabelElement = angular.element(dropdownMenuElement.parentNode.querySelectorAll(buttonLabelTextSelector));

                            buttonLabelElement.text(selectedValueLabel);
                            buttonLabelElement.val(selectedValueLabel);

                            var buttonScope = buttonLabelElement.scope();
                            //buttonScope.$apply(function () {
                                scope.selectedFirstSortCriterion.selected = scope.availableSortCriteria[selectedValueIdx];
                                scope.onSortingCriteriaChanged();
                            //});
                        };

                        function isAlreadySelectedValue(selectedValueIdx) {
                            return (selectedValueIdx === lastSelectedValueIdx);
                        }

                        element[0].querySelector('.dropdown-menu').addEventListener('click', function(event) {
                            var clickedElement = event.target;
                            var selectedValueLabel = clickedElement.textContent;
                            var selectedValueIdx = parseInt(clickedElement.getAttribute('data-criterion-index'));
                            if (isAlreadySelectedValue(selectedValueIdx)) {
                                return;
                            }
                            var dropdownMenuElement = this;
                            setSelectDropdownValue(dropdownMenuElement, selectedValueLabel, selectedValueIdx);
                            lastSelectedValueIdx = selectedValueIdx;
                        }, true);

                    }
                };
            });
    });
