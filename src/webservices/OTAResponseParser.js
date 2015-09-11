define([
          'lodash'
        , 'webservices/AbstractOTAResponseParser'
    ],
    function (
          _
        , AbstractOTAResponseParser
    ) {
        'use strict';

        function OTAResponseParser() {

            AbstractOTAResponseParser.apply(this, arguments);

            this.getPricedItinerariesArray = function(response) {
                return response.OTA_AirLowFareSearchRS.PricedItineraries.PricedItinerary;
            };

            this.itinerariesFound = function (response) {
                return _.has(response, 'OTA_AirLowFareSearchRS', 'Success');
            };

            this.getAirItineraryPricingInfo = function(itin) {
                return itin.AirItineraryPricingInfo[0];
            };

            this.parseEquipment = function(segment) {
                return segment.Equipment[0].AirEquipType;
            };

            this.getBusinessErrorMessages = function (message) {
                var skippedErrorTypes = ['WORKERTHREAD', 'SERVER', 'DEFAULT', 'DRE', 'IF2', 'DSFCLIENT', 'JRCHILD'];
                try {
                    var responseJSON = JSON.parse(message);
                    //if (_.has(responseJSON, 'OTA_AirLowFareSearchRS', 'Errors', 'Error')) {
                        var errorMessages = JSON.parse(message).OTA_AirLowFareSearchRS.Errors.Error
                                .filter(function (error) {
                                    return !_.contains(skippedErrorTypes, error.Type);
                                })
                                .map(function (error) {
                                    return error.ShortText;
                                }) || [];
                        return _.unique(errorMessages);
                    //}
                } catch(e) {
                    return [message];
                }
            };

            this.parsePricingSource = function(itinerary) {
                return 'BFM';
                // or more detailed parsing:
                //var pricingInfo = itinerary.AirItineraryPricingInfo[0];
                //if (pricingInfo.PricingSource === 'ADVJR1' && pricingInfo.PricingSubSource === 'MIP') {
                //    return 'BFM_MIP';
                //}
            };
        }

        OTAResponseParser.prototype = Object.create(AbstractOTAResponseParser.prototype);
        OTAResponseParser.prototype.constructor = OTAResponseParser;

        return OTAResponseParser;
    });