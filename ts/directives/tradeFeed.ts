/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
import m = require('model/model')

declare var Parse:any;
declare var humaneDate:(date:Date)=>string;

export interface ITradeFeedScope extends ng.IScope {
    usersActivity:m.IUserActivity[]
    closeWidget:()=>void
    message:string
    beforeNow:(date:Date)=>string
}

export function init(errors:any) {
    return {
        restrict: 'A',
        scope: {
            closeWidget: '='
        },
        link: function(scope:ITradeFeedScope, element) {},
        controller: function($scope:ITradeFeedScope) {
            Parse.initialize('clCmPyaT4LfjGsGjKuxGcF7Wt1CD6aE6urucljPA', 'cnAXZ6Gae05VR2kzZk5sQtN0HRJwM9Y90Mk2LFBt');

            $scope.usersActivity = [];

            var capitaliseFirstLetter = (string)=>{
                return string.charAt(0).toUpperCase() + string.slice(1);
            };

            var converToUserActivity = (item:any):m.IUserActivity =>{
                var name = capitaliseFirstLetter(item.user.attributes.firsname) + ' ' + capitaliseFirstLetter(item.user.attributes.lastname);
                return {
                    user: {
                        name: name,
                        pictureUrl: item.user.attributes.pictureUrl
                    },
                    action: item.action,
                    amount: item.amount,
                    currency: item.currency,
                    price: item.price,
                    company: item.company,
                    date: new Date(item.date)
                };
            };

            Parse.Cloud.run('GetUserActivities', {
                limit: 10
            }, {
                success: (result)=>{

                    $scope.usersActivity = _.map(result, (item:any)=> {
                        return converToUserActivity(item);
                    });

                    $scope.$apply();
                },
                error: (result)=> {
                    $scope.message = errors.requestError;
                    $scope.$apply();
                }
            });

            var intervalIdUserUpdates = setInterval(()=> {
                Parse.Cloud.run('GetNewUserActivityUpdates', {
                    since: new Date(),
                    chance: 0.01
                }, {
                    success: (result)=>{
                        $scope.message = null;

                        if(_.isEmpty(result)){
                            return;
                        }
                        var newUsersActivity = _.map(result, (item)=>{
                            return converToUserActivity(item);
                        });
                        $scope.usersActivity = _.union(newUsersActivity, $scope.usersActivity);
                        $scope.$apply();
                    },
                    error: (result)=>{ /* Show error */ }
                });
            }, 50000);

            var intervalIdTimeUpdates = setInterval(()=>{
                $scope.$apply();
            }, 60000);

            $scope.$on('$destroy', ()=>{
                clearInterval(intervalIdTimeUpdates);
                clearInterval(intervalIdUserUpdates);
            });

            $scope.beforeNow = (date)=>{
                return humaneDate(date).toLowerCase();
            };
        },
        templateUrl: 'templates/tradeFeed.html'
    };
}