FormCraftApp.controller('CMController', function($scope, $http) {
	$scope.addMap = function(){
		if ($scope.SelectedList=='' || $scope.SelectedColumn==''){return false;}
		if (typeof $scope.$parent.Addons.Campaign.Map=='undefined')
		{
			$scope.$parent.Addons.Campaign.Map = [];
		}
		$scope.$parent.Addons.Campaign.Map.push({
			'listID': $scope.SelectedList,
			'listName': jQuery('#cm-map .select-list option:selected').text(),
			'columnID': $scope.SelectedColumn,
			'columnName': jQuery('#cm-map .select-column option:selected').text(),
			'formField': jQuery('#cm-map .select-field').val()
		});
	}
	$scope.removeMap = function ($index)
	{
		$scope.$parent.Addons.Campaign.Map.splice($index, 1);
	}
	$scope.testKey = function(){
		if (typeof $scope.$parent.Addons.Campaign!='undefined') {
			jQuery('#cm-cover .api-key button').addClass('loading');
			let key = encodeURIComponent($scope.Addons.Campaign.api_key);
			$http.get(FC.ajaxurl+'?action=formcraft_campaign_test_api&key='+key).success(function(response){
				jQuery('#cm-cover .api-key button').removeClass('loading');
				if (response.success) {
					$scope.$parent.Addons.Campaign.validKey = $scope.Addons.Campaign.api_key;
					$scope.$parent.Addons.Campaign.clients = response.clients;
					$scope.$parent.Addons.Campaign.clients.unshift({
						ClientID: '',
						Name: '(Select Client)'
					})
					$scope.$parent.Addons.Campaign.selectedClient = '';
				} else {
					$scope.$parent.Addons.Campaign.validKey = false;
				}
			});
		}
	}
	$scope.$parent.$watch('Addons.Campaign.selectedClient', function(){
		if (typeof $scope.$parent.Addons!='undefined' && $scope.$parent.Addons.Campaign.selectedClient!='undefined' && $scope.$parent.Addons.Campaign.selectedClient!='')
		{
			jQuery('#cm-cover .api-key button').addClass('loading');
			$http.get(FC.ajaxurl+'?action=formcraft_campaign_get_lists&key='+encodeURIComponent($scope.Addons.Campaign.validKey)+'&id='+$scope.$parent.Addons.Campaign.selectedClient).success(function(response){
				jQuery('#cm-cover .api-key button').removeClass('loading');
				if (response.success)
				{
					$scope.CampaignLists = response.lists;
					$scope.SelectedList = '';
				}
			});
		}
	});
	$scope.$watch('SelectedList', function(){
		if (typeof $scope.$parent.Addons!='undefined' && $scope.SelectedList!='undefined' && $scope.SelectedList!='')
		{
			jQuery('#cm-cover .api-key button').addClass('loading');
			$http.get(FC.ajaxurl+'?action=formcraft_campaign_get_columns&key='+encodeURIComponent($scope.Addons.Campaign.validKey)+'&id='+$scope.SelectedList).success(function(response){
				jQuery('#cm-cover .api-key button').removeClass('loading');
				if (response.success)
				{
					$scope.CampaignColumns = response.columns;
					$scope.SelectedColumn = '';
				}
			});
		}
	});
	$scope.$watch('Addons.Campaign.validKey', function(){
		if (typeof $scope.$parent.Addons!='undefined')
		{
			if (typeof $scope.$parent.Addons.Campaign.validKey!='undefined' && $scope.$parent.Addons.Campaign.validKey!=false)
			{
				$scope.$parent.Addons.Campaign.showOptions = true;
			}
			else
			{
				$scope.$parent.Addons.Campaign.showOptions = false;
			}
		}
	});
});