define([
        'widgets/WidgetGlobalCallbacks'
    ],
    function (
          WidgetGlobalCallbacks
    ) {
        'use strict';

        function TilesThemedDestinationFinderWidgetDirective() {
            return {
                scope: {
                    closestAirport: '@?',
                    searchOfferClicked: '&?'
                },
                templateUrl: '../widgets/view-templates/widgets/TilesThemedDestinationFinderWidget.tpl.html',
                controller: 'TilesThemedDestinationFinderWidgetController',
                link: function (scope, element) {
                    WidgetGlobalCallbacks.linkComplete(scope, element);
                }
            }
        }
        return TilesThemedDestinationFinderWidgetDirective;
});
