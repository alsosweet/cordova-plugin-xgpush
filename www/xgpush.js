var exec = require('cordova/exec');
var cordova = require('cordova');
var channel = require('cordova/channel');
var utils = require('cordova/utils');

channel.createSticky('onCordovaXGPushReady');
channel.waitForInitialization('onCordovaXGPushReady');

function XGPush() {

    var context = this;

    this.channels = {
        'click': channel.create('click'),
        'message': channel.create('message'),
        'register': channel.create('register'),
        'unRegister': channel.create('unRegister'),
        'show': channel.create('show'),
        'deleteTag': channel.create('deleteTag'),
        'setTag': channel.create('setTag')
    };

    this.on = function (type, func) {
        if (type in context.channels) {
            context.channels[type].subscribe(func);
        }
    };

    this.un = function (type, func) {
        if (type in this.channels) {
            context.channels[type].unsubscribe(func);
        }
    };

    this.registerPush = function (account, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "registerPush", [account]);
    };

    this.unRegisterPush = function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "unRegisterPush", []);
    };

    this.setTag = function (tagName, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "setTag", [tagName]);
    };

    this.deleteTag = function (tagName, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "deleteTag", [tagName]);
    };

    this.addLocalNotification = function (type, title, content, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "addLocalNotification", [type, title, content]);
    };

    this.enableDebug = function (debugMode, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "enableDebug", [debugMode]);
    };

    this.getLaunchInfo = function (successCallback) {
        exec(successCallback, null, "XGPush", "getLaunchInfo", []);
    };

    this.getToken = function (successCallback) {
        exec(successCallback, null, "XGPush", "getToken", []);
    };

    this.setAccessInfo = function (accessId, accessKey, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "setAccessInfo", [accessId, accessKey]);
    };

    channel.onCordovaReady.subscribe(function () {
        exec(
            function (event) {
                console.log("[XGPush] Event：" + JSON.stringify(event));
                if (event && (event.type in context.channels)) {
                    context.channels[event.type].fire(event);
                }
            },
            function (e) {
                console.error("[ERROR] addListener: " + JSON.stringify(e));
            },
            "XGPush",
            "addListener",
            []
        );

        context.registerPush(
            null,
            function (info) {
                console.log("[XGPush] RegisterPush: " + JSON.stringify(info));
                channel.onCordovaXGPushReady.fire();
            },
            function (e) {
                console.error("[ERROR] RegisterPush: " + JSON.stringify(e));
            });
    });
}

module.exports = new XGPush();
