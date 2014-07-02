/**
 * ownCloud - Calendar App
 *
 * @author Raghu Nayyar
 * @author Georg Ehrke
 * @copyright 2014 Raghu Nayyar <beingminimal@gmail.com>
 * @copyright 2014 Georg Ehrke <oc.list@georgehrke.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

 app.controller('SubscriptionController', ['$scope', 'SubscriptionModel', 'CalendarModel', 'Restangular',
	function ($scope,SubscriptionModel,CalendarModel,Restangular) {
		
		$scope.subscriptions = SubscriptionModel.getAll();
		$scope.calendars = CalendarModel.getAll();
		
		var subscriptionResource = Restangular.all('subscriptions');
		subscriptionResource.getList().then(function (subscriptions) {
			SubscriptionModel.addAll(subscriptions);
		});

		var calendarResource = Restangular.all('calendars');
		// Gets All Calendars.
		calendarResource.getList().then(function (calendars) {
			CalendarModel.addAll(calendars);
		});
		
		var backendResource = Restangular.all('backends-enabled');
		backendResource.getList().then(function (backendsobject) {
			$scope.subscriptiontypeSelect = SubscriptionModel.getsubscriptionnames(backendsobject);
			$scope.selectedsubscriptionbackendmodel = $scope.subscriptiontypeSelect[0]; // to remove the empty model.
		});

		$scope.newSubscriptionUrl = '';

		$scope.create = function(newSubscriptionInputVal) {
			var newSubscription = {
				"type": $scope.selectedsubscriptionbackendmodel.type,
				"url": $scope.newSubscriptionUrl,
			};
			subscriptionResource.post(newSubscription).then(function (newSubscription) {
				SubscriptionModel.create(newSubscription);
			});
		};

		$scope.calendarFilter = function() {
			return function(item) {
				return (
					item.cruds.create === true ||
					item.cruds.update === true ||
					item.cruds.delete === true
				);
			};
		};

		// Take the filters to the filters directory, else duplication will happen.
		$scope.subscriptionFilter = function() {
			return function(item) {
				return (
					item.cruds.create === false &&
					item.cruds.update === false &&
					item.cruds.delete === false
				);
			};
		};
	}
]);