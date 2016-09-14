var ac_main =
webpackJsonpac__name_([1],{

/***/ "./node_modules/angularfire2/angularfire2.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var firebase_1 = __webpack_require__("./node_modules/firebase/firebase-browser.js");
var utils = __webpack_require__("./node_modules/angularfire2/utils.js");
var tokens_1 = __webpack_require__("./node_modules/angularfire2/tokens.js");
exports.WindowLocation = tokens_1.WindowLocation;
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var index_1 = __webpack_require__("./node_modules/angularfire2/auth/index.js");
exports.AngularFireAuth = index_1.AngularFireAuth;
exports.firebaseAuthConfig = index_1.firebaseAuthConfig;
exports.FirebaseAuth = index_1.FirebaseAuth;
exports.AuthMethods = index_1.AuthMethods;
exports.AuthProviders = index_1.AuthProviders;
var index_2 = __webpack_require__("./node_modules/angularfire2/database/index.js");
exports.FirebaseListObservable = index_2.FirebaseListObservable;
exports.FirebaseObjectObservable = index_2.FirebaseObjectObservable;
exports.FirebaseListFactory = index_2.FirebaseListFactory;
exports.FirebaseObjectFactory = index_2.FirebaseObjectFactory;
exports.AngularFireDatabase = index_2.AngularFireDatabase;
exports.FirebaseDatabase = index_2.FirebaseDatabase;
var AngularFire = (function () {
    function AngularFire(fbUrl, auth, database) {
        this.fbUrl = fbUrl;
        this.auth = auth;
        this.database = database;
    }
    AngularFire.decorators = [
        { type: core_1.Injectable },
    ];
    AngularFire.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Inject, args: [tokens_1.FirebaseConfig,] },] },
        { type: index_1.AngularFireAuth, },
        { type: index_2.AngularFireDatabase, },
    ];
    return AngularFire;
}());
exports.AngularFire = AngularFire;
function _getFirebase(config) {
    return firebase_1.initializeApp(config);
}
exports._getFirebase = _getFirebase;
function _getWindowLocation() {
    return window.location;
}
exports._getWindowLocation = _getWindowLocation;
function _getAuthBackend(app) {
    return new index_1.FirebaseSdkAuthBackend(app, false);
}
exports._getAuthBackend = _getAuthBackend;
function _getDefaultFirebase(config) {
    config.databaseURL = utils.stripTrailingSlash(config.databaseURL);
    return config;
}
exports._getDefaultFirebase = _getDefaultFirebase;
exports.COMMON_PROVIDERS = [
    { provide: index_1.FirebaseAuth,
        useExisting: index_1.AngularFireAuth
    },
    {
        provide: tokens_1.FirebaseApp,
        useFactory: _getFirebase,
        deps: [tokens_1.FirebaseConfig]
    },
    index_1.AngularFireAuth,
    AngularFire,
    index_2.AngularFireDatabase
];
exports.FIREBASE_PROVIDERS = [
    exports.COMMON_PROVIDERS,
    {
        provide: index_1.AuthBackend,
        useFactory: _getAuthBackend,
        deps: [tokens_1.FirebaseApp]
    },
    {
        provide: tokens_1.WindowLocation,
        useFactory: _getWindowLocation
    },
];
exports.defaultFirebase = function (config) {
    return [
        { provide: tokens_1.FirebaseUserConfig, useValue: config },
        { provide: tokens_1.FirebaseConfig, useFactory: _getDefaultFirebase, deps: [tokens_1.FirebaseUserConfig] }
    ];
};
var AngularFireModule = (function () {
    function AngularFireModule() {
    }
    AngularFireModule.initializeApp = function (config, authConfig) {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: tokens_1.FirebaseUserConfig, useValue: config },
                { provide: tokens_1.FirebaseConfig, useFactory: _getDefaultFirebase, deps: [tokens_1.FirebaseUserConfig] },
                { provide: tokens_1.FirebaseAuthConfig, useValue: authConfig }
            ]
        };
    };
    AngularFireModule.decorators = [
        { type: core_1.NgModule, args: [{
                    providers: exports.FIREBASE_PROVIDERS
                },] },
    ];
    return AngularFireModule;
}());
exports.AngularFireModule = AngularFireModule;
var tokens_2 = __webpack_require__("./node_modules/angularfire2/tokens.js");
exports.FirebaseConfig = tokens_2.FirebaseConfig;
exports.FirebaseApp = tokens_2.FirebaseApp;
exports.FirebaseAuthConfig = tokens_2.FirebaseAuthConfig;
exports.FirebaseRef = tokens_2.FirebaseRef;
exports.FirebaseUrl = tokens_2.FirebaseUrl;
exports.FirebaseUserConfig = tokens_2.FirebaseUserConfig;
//# sourceMappingURL=angularfire2.js.map

/***/ },

/***/ "./node_modules/angularfire2/auth/auth.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var ReplaySubject_1 = __webpack_require__("./node_modules/rxjs/ReplaySubject.js");
var tokens_1 = __webpack_require__("./node_modules/angularfire2/tokens.js");
var utils = __webpack_require__("./node_modules/angularfire2/utils.js");
var auth_backend_1 = __webpack_require__("./node_modules/angularfire2/auth/auth_backend.js");
__webpack_require__("./node_modules/rxjs/add/operator/mergeMap.js");
__webpack_require__("./node_modules/rxjs/add/operator/take.js");
__webpack_require__("./node_modules/rxjs/add/operator/concat.js");
__webpack_require__("./node_modules/rxjs/add/operator/skip.js");
__webpack_require__("./node_modules/rxjs/add/observable/of.js");
var kBufferSize = 1;
exports.firebaseAuthConfig = function (config) {
    return { provide: tokens_1.FirebaseAuthConfig, useValue: config };
};
var AngularFireAuth = (function (_super) {
    __extends(AngularFireAuth, _super);
    function AngularFireAuth(_authBackend, loc, _config) {
        var _this = this;
        _super.call(this, kBufferSize);
        this._authBackend = _authBackend;
        this._config = _config;
        this._credentialCache = {};
        var firstPass = true;
        this._authBackend.onAuth()
            .mergeMap(function (authState) {
            if (firstPass) {
                firstPass = false;
                if (['http:', 'https:'].indexOf(loc.protocol) > -1) {
                    return _this._authBackend.getRedirectResult()
                        .map(function (userCredential) {
                        if (userCredential && userCredential.credential) {
                            authState = attachCredentialToAuthState(authState, userCredential.credential, userCredential.credential.provider);
                            _this._credentialCache[userCredential.credential.provider] = userCredential.credential;
                        }
                        return authState;
                    });
                }
            }
            return Observable_1.Observable.of(authState);
        })
            .subscribe(function (authData) { return _this._emitAuthData(authData); });
    }
    AngularFireAuth.prototype.login = function (obj1, obj2) {
        var _this = this;
        var config = null;
        var credentials = null;
        if (arguments.length > 2) {
            return this._reject('Login only accepts a maximum of two arguments.');
        }
        else if (arguments.length == 2) {
            credentials = obj1;
            config = obj2;
        }
        else if (arguments.length == 1) {
            if (obj1.password && obj1.email) {
                credentials = obj1;
                config = {};
            }
            else {
                config = obj1;
            }
        }
        config = this._mergeConfigs(config);
        if (!utils.isPresent(config.method)) {
            return this._reject('You must provide a login method');
        }
        var providerMethods = [auth_backend_1.AuthMethods.Popup, auth_backend_1.AuthMethods.Redirect, auth_backend_1.AuthMethods.OAuthToken];
        if (providerMethods.indexOf(config.method) != -1) {
            if (!utils.isPresent(config.provider)) {
                return this._reject('You must include a provider to use this auth method.');
            }
        }
        var credentialsMethods = [auth_backend_1.AuthMethods.Password, auth_backend_1.AuthMethods.OAuthToken, auth_backend_1.AuthMethods.CustomToken];
        if (credentialsMethods.indexOf(config.method) != -1) {
            if (!credentials) {
                return this._reject('You must include credentials to use this auth method.');
            }
        }
        switch (config.method) {
            case auth_backend_1.AuthMethods.Popup:
                return this._authBackend.authWithOAuthPopup(config.provider, this._scrubConfig(config))
                    .then(function (userCredential) {
                    _this._credentialCache[userCredential.credential.provider] = userCredential.credential;
                    return auth_backend_1.authDataToAuthState(userCredential.user, userCredential.credential);
                });
            case auth_backend_1.AuthMethods.Redirect:
                return this._authBackend.authWithOAuthRedirect(config.provider, this._scrubConfig(config));
            case auth_backend_1.AuthMethods.Anonymous:
                return this._authBackend.authAnonymously(this._scrubConfig(config));
            case auth_backend_1.AuthMethods.Password:
                return this._authBackend.authWithPassword(credentials);
            case auth_backend_1.AuthMethods.OAuthToken:
                return this._authBackend.authWithOAuthToken(credentials, this._scrubConfig(config));
            case auth_backend_1.AuthMethods.CustomToken:
                return this._authBackend.authWithCustomToken(credentials);
        }
    };
    AngularFireAuth.prototype.logout = function () {
        this._authBackend.unauth();
    };
    AngularFireAuth.prototype.getAuth = function () {
        console.warn("WARNING: the getAuth() API has changed behavior since adding support for Firebase 3.\n    This will return null for the initial value when the page loads, even if the user is actually logged in.\n    Please observe the actual authState asynchronously by subscribing to the auth service: af.auth.subscribe().\n    The getAuth method will be removed in future releases");
        return this._authBackend.getAuth();
    };
    AngularFireAuth.prototype.createUser = function (credentials) {
        return this._authBackend.createUser(credentials);
    };
    AngularFireAuth.prototype._mergeConfigs = function (config) {
        if (this._config == null)
            return config;
        return Object.assign({}, this._config, config);
    };
    AngularFireAuth.prototype._reject = function (msg) {
        return (new Promise(function (res, rej) {
            return rej(msg);
        }));
    };
    AngularFireAuth.prototype._scrubConfig = function (config, scrubProvider) {
        if (scrubProvider === void 0) { scrubProvider = true; }
        var scrubbed = Object.assign({}, config);
        if (scrubProvider) {
            delete scrubbed.provider;
        }
        delete scrubbed.method;
        return scrubbed;
    };
    AngularFireAuth.prototype._emitAuthData = function (authData) {
        if (authData == null) {
            this.next(null);
        }
        else {
            if (authData.auth && authData.auth.providerData && authData.auth.providerData[0]) {
                var providerId = authData.auth.providerData[0].providerId;
                var providerCredential = this._credentialCache[providerId];
                if (providerCredential) {
                    authData = attachCredentialToAuthState(authData, providerCredential, providerId);
                }
            }
            this.next(authData);
        }
    };
    AngularFireAuth.decorators = [
        { type: core_1.Injectable },
    ];
    AngularFireAuth.ctorParameters = [
        { type: auth_backend_1.AuthBackend, },
        { type: undefined, decorators: [{ type: core_1.Inject, args: [tokens_1.WindowLocation,] },] },
        { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [tokens_1.FirebaseAuthConfig,] },] },
    ];
    return AngularFireAuth;
}(ReplaySubject_1.ReplaySubject));
exports.AngularFireAuth = AngularFireAuth;
function attachCredentialToAuthState(authState, credential, providerId) {
    if (!authState)
        return authState;
    authState[auth_backend_1.stripProviderId(providerId)] = credential;
    return authState;
}
var FirebaseAuth = (function (_super) {
    __extends(FirebaseAuth, _super);
    function FirebaseAuth() {
        _super.apply(this, arguments);
    }
    return FirebaseAuth;
}(AngularFireAuth));
exports.FirebaseAuth = FirebaseAuth;
//# sourceMappingURL=auth.js.map

/***/ },

/***/ "./node_modules/angularfire2/auth/auth_backend.js":
/***/ function(module, exports) {

"use strict";
"use strict";
var AuthBackend = (function () {
    function AuthBackend() {
    }
    return AuthBackend;
}());
exports.AuthBackend = AuthBackend;
(function (AuthProviders) {
    AuthProviders[AuthProviders["Github"] = 0] = "Github";
    AuthProviders[AuthProviders["Twitter"] = 1] = "Twitter";
    AuthProviders[AuthProviders["Facebook"] = 2] = "Facebook";
    AuthProviders[AuthProviders["Google"] = 3] = "Google";
    AuthProviders[AuthProviders["Password"] = 4] = "Password";
    AuthProviders[AuthProviders["Anonymous"] = 5] = "Anonymous";
    AuthProviders[AuthProviders["Custom"] = 6] = "Custom";
})(exports.AuthProviders || (exports.AuthProviders = {}));
var AuthProviders = exports.AuthProviders;
;
(function (AuthMethods) {
    AuthMethods[AuthMethods["Popup"] = 0] = "Popup";
    AuthMethods[AuthMethods["Redirect"] = 1] = "Redirect";
    AuthMethods[AuthMethods["Anonymous"] = 2] = "Anonymous";
    AuthMethods[AuthMethods["Password"] = 3] = "Password";
    AuthMethods[AuthMethods["OAuthToken"] = 4] = "OAuthToken";
    AuthMethods[AuthMethods["CustomToken"] = 5] = "CustomToken";
})(exports.AuthMethods || (exports.AuthMethods = {}));
var AuthMethods = exports.AuthMethods;
;
function authDataToAuthState(authData, providerData) {
    if (!authData)
        return null;
    var providerId;
    var uid = authData.uid;
    var authState = { auth: authData, uid: uid, provider: null };
    if (authData.isAnonymous) {
        providerId = 'anonymous';
        authState.provider = AuthProviders.Anonymous;
        authState.anonymous = true;
        return authState;
    }
    else if (authData.providerData[0] === undefined || authData.providerData[0] === null) {
        providerId = 'custom';
        authState.provider = AuthProviders.Custom;
        return authState;
    }
    else {
        providerId = authData.providerData[0].providerId;
    }
    switch (providerId) {
        case 'github.com':
            authState.github = providerData;
            authState.provider = AuthProviders.Github;
            break;
        case 'twitter.com':
            authState.twitter = providerData;
            authState.provider = AuthProviders.Twitter;
            break;
        case 'facebook.com':
            authState.facebook = providerData;
            authState.provider = AuthProviders.Facebook;
            break;
        case 'google.com':
            authState.google = providerData;
            authState.provider = AuthProviders.Google;
            break;
        case 'password':
            authState.provider = AuthProviders.Password;
            break;
        case 'custom':
            authState.provider = AuthProviders.Custom;
            break;
        default:
            throw new Error("Unsupported firebase auth provider " + providerId);
    }
    return authState;
}
exports.authDataToAuthState = authDataToAuthState;
function stripProviderId(providerId) {
    var providerStripped = /(.*)\.com$/.exec(providerId);
    if (providerStripped && providerStripped.length === 2) {
        return providerStripped[1];
    }
    return null;
}
exports.stripProviderId = stripProviderId;
//# sourceMappingURL=auth_backend.js.map

/***/ },

/***/ "./node_modules/angularfire2/auth/firebase_sdk_auth_backend.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var tokens_1 = __webpack_require__("./node_modules/angularfire2/tokens.js");
var utils_1 = __webpack_require__("./node_modules/angularfire2/utils.js");
var firebase_1 = __webpack_require__("./node_modules/firebase/firebase-browser.js");
var auth_backend_1 = __webpack_require__("./node_modules/angularfire2/auth/auth_backend.js");
var FacebookAuthProvider = firebase_1.auth.FacebookAuthProvider, GithubAuthProvider = firebase_1.auth.GithubAuthProvider, GoogleAuthProvider = firebase_1.auth.GoogleAuthProvider, TwitterAuthProvider = firebase_1.auth.TwitterAuthProvider;
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
__webpack_require__("./node_modules/rxjs/add/observable/fromPromise.js");
__webpack_require__("./node_modules/rxjs/add/operator/observeOn.js");
var FirebaseSdkAuthBackend = (function (_super) {
    __extends(FirebaseSdkAuthBackend, _super);
    function FirebaseSdkAuthBackend(_fbApp, _webWorkerMode) {
        if (_webWorkerMode === void 0) { _webWorkerMode = false; }
        _super.call(this);
        this._webWorkerMode = _webWorkerMode;
        this._fbAuth = _fbApp.auth();
    }
    FirebaseSdkAuthBackend.prototype.createUser = function (creds) {
        return Promise.resolve(this._fbAuth.createUserWithEmailAndPassword(creds.email, creds.password))
            .then(function (user) { return auth_backend_1.authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.getAuth = function () {
        return auth_backend_1.authDataToAuthState(this._fbAuth.currentUser);
    };
    FirebaseSdkAuthBackend.prototype.onAuth = function () {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            return _this._fbAuth.onAuthStateChanged(observer);
        })
            .map(function (user) {
            if (!user)
                return null;
            return auth_backend_1.authDataToAuthState(user, user.providerData[0]);
        })
            .observeOn(new utils_1.ZoneScheduler(Zone.current));
    };
    FirebaseSdkAuthBackend.prototype.unauth = function () {
        Promise.resolve(this._fbAuth.signOut());
    };
    FirebaseSdkAuthBackend.prototype.authWithCustomToken = function (token) {
        return Promise.resolve(this._fbAuth.signInWithCustomToken(token))
            .then(function (user) { return auth_backend_1.authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.authAnonymously = function () {
        return Promise.resolve(this._fbAuth.signInAnonymously())
            .then(function (user) { return auth_backend_1.authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.authWithPassword = function (creds) {
        return Promise.resolve(this._fbAuth.signInWithEmailAndPassword(creds.email, creds.password))
            .then(function (user) { return auth_backend_1.authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthPopup = function (provider, options) {
        var providerFromFirebase = this._enumToAuthProvider(provider);
        if (options.scope) {
            options.scope.forEach(function (scope) { return providerFromFirebase.addScope(scope); });
        }
        return Promise.resolve(this._fbAuth.signInWithPopup(providerFromFirebase));
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthRedirect = function (provider, options) {
        return Promise.resolve(this._fbAuth.signInWithRedirect(this._enumToAuthProvider(provider)));
    };
    FirebaseSdkAuthBackend.prototype.authWithOAuthToken = function (credential) {
        return Promise.resolve(this._fbAuth.signInWithCredential(credential))
            .then(function (user) { return auth_backend_1.authDataToAuthState(user); });
    };
    FirebaseSdkAuthBackend.prototype.getRedirectResult = function () {
        return Observable_1.Observable.fromPromise(Promise.resolve(this._fbAuth.getRedirectResult()));
    };
    FirebaseSdkAuthBackend.prototype._enumToAuthProvider = function (providerId) {
        switch (providerId) {
            case auth_backend_1.AuthProviders.Github:
                return new GithubAuthProvider();
            case auth_backend_1.AuthProviders.Twitter:
                return new TwitterAuthProvider();
            case auth_backend_1.AuthProviders.Facebook:
                return new FacebookAuthProvider();
            case auth_backend_1.AuthProviders.Google:
                return new GoogleAuthProvider();
            default:
                throw new Error("Unsupported firebase auth provider " + providerId);
        }
    };
    FirebaseSdkAuthBackend.decorators = [
        { type: core_1.Injectable },
    ];
    FirebaseSdkAuthBackend.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Inject, args: [tokens_1.FirebaseApp,] },] },
        null,
    ];
    return FirebaseSdkAuthBackend;
}(auth_backend_1.AuthBackend));
exports.FirebaseSdkAuthBackend = FirebaseSdkAuthBackend;
//# sourceMappingURL=firebase_sdk_auth_backend.js.map

/***/ },

/***/ "./node_modules/angularfire2/auth/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__("./node_modules/angularfire2/auth/auth.js"));
__export(__webpack_require__("./node_modules/angularfire2/auth/auth_backend.js"));
__export(__webpack_require__("./node_modules/angularfire2/auth/firebase_sdk_auth_backend.js"));
//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/angularfire2/database/database.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var tokens_1 = __webpack_require__("./node_modules/angularfire2/tokens.js");
var index_1 = __webpack_require__("./node_modules/angularfire2/database/index.js");
var utils = __webpack_require__("./node_modules/angularfire2/utils.js");
var index_2 = __webpack_require__("./node_modules/angularfire2/database/index.js");
var AngularFireDatabase = (function () {
    function AngularFireDatabase(fbConfig, fbApp) {
        this.fbConfig = fbConfig;
        this.fbApp = fbApp;
    }
    AngularFireDatabase.prototype.list = function (urlOrRef, opts) {
        var _this = this;
        return utils.checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function () { return index_1.FirebaseListFactory(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts); },
            isRef: function () { return index_1.FirebaseListFactory(urlOrRef); }
        });
    };
    AngularFireDatabase.prototype.object = function (urlOrRef, opts) {
        var _this = this;
        return utils.checkForUrlOrFirebaseRef(urlOrRef, {
            isUrl: function () { return index_2.FirebaseObjectFactory(_this.fbApp.database().refFromURL(getAbsUrl(_this.fbConfig, urlOrRef)), opts); },
            isRef: function () { return index_2.FirebaseObjectFactory(urlOrRef); }
        });
    };
    AngularFireDatabase.decorators = [
        { type: core_1.Injectable },
    ];
    AngularFireDatabase.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Inject, args: [tokens_1.FirebaseConfig,] },] },
        { type: undefined, decorators: [{ type: core_1.Inject, args: [tokens_1.FirebaseApp,] },] },
    ];
    return AngularFireDatabase;
}());
exports.AngularFireDatabase = AngularFireDatabase;
var FirebaseDatabase = (function (_super) {
    __extends(FirebaseDatabase, _super);
    function FirebaseDatabase() {
        _super.apply(this, arguments);
    }
    return FirebaseDatabase;
}(AngularFireDatabase));
exports.FirebaseDatabase = FirebaseDatabase;
function getAbsUrl(root, url) {
    if (!(/^[a-z]+:\/\/.*/.test(url))) {
        url = root.databaseURL + '/' + utils.stripLeadingSlash(url);
    }
    return url;
}
//# sourceMappingURL=database.js.map

/***/ },

/***/ "./node_modules/angularfire2/database/firebase_list_factory.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var firebase_list_observable_1 = __webpack_require__("./node_modules/angularfire2/database/firebase_list_observable.js");
var firebase_1 = __webpack_require__("./node_modules/firebase/firebase-browser.js");
var query_observable_1 = __webpack_require__("./node_modules/angularfire2/database/query_observable.js");
var utils = __webpack_require__("./node_modules/angularfire2/utils.js");
__webpack_require__("./node_modules/rxjs/add/operator/mergeMap.js");
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
function FirebaseListFactory(absoluteUrlOrDbRef, _a) {
    var _b = _a === void 0 ? {} : _a, preserveSnapshot = _b.preserveSnapshot, _c = _b.query, query = _c === void 0 ? {} : _c;
    var ref;
    utils.checkForUrlOrFirebaseRef(absoluteUrlOrDbRef, {
        isUrl: function () { return ref = firebase_1.database().refFromURL(absoluteUrlOrDbRef); },
        isRef: function () { return ref = absoluteUrlOrDbRef; },
        isQuery: function () { return ref = absoluteUrlOrDbRef; },
    });
    if ((utils.isFirebaseRef(absoluteUrlOrDbRef) ||
        utils.isString(absoluteUrlOrDbRef)) &&
        utils.isEmptyObject(query)) {
        return firebaseListObservable(ref, { preserveSnapshot: preserveSnapshot });
    }
    var queryObs = query_observable_1.observeQuery(query);
    return new firebase_list_observable_1.FirebaseListObservable(ref, function (subscriber) {
        var sub = queryObs.map(function (query) {
            var queried = ref;
            if (query.orderByChild) {
                queried = queried.orderByChild(query.orderByChild);
            }
            else if (query.orderByKey) {
                queried = queried.orderByKey();
            }
            else if (query.orderByPriority) {
                queried = queried.orderByPriority();
            }
            else if (query.orderByValue) {
                queried = queried.orderByValue();
            }
            if (utils.isPresent(query.equalTo)) {
                queried = queried.equalTo(query.equalTo);
                if (utils.isPresent(query.startAt) || query.endAt) {
                    throw new Error('Query Error: Cannot use startAt or endAt with equalTo.');
                }
                if (utils.isPresent(query.limitToFirst)) {
                    queried = queried.limitToFirst(query.limitToFirst);
                }
                if (utils.isPresent(query.limitToLast)) {
                    queried = queried.limitToLast(query.limitToLast);
                }
                return queried;
            }
            if (utils.isPresent(query.startAt)) {
                queried = queried.startAt(query.startAt);
            }
            if (utils.isPresent(query.endAt)) {
                queried = queried.endAt(query.endAt);
            }
            if (utils.isPresent(query.limitToFirst) && query.limitToLast) {
                throw new Error('Query Error: Cannot use limitToFirst with limitToLast.');
            }
            if (utils.isPresent(query.limitToFirst)) {
                queried = queried.limitToFirst(query.limitToFirst);
            }
            if (utils.isPresent(query.limitToLast)) {
                queried = queried.limitToLast(query.limitToLast);
            }
            return queried;
        })
            .mergeMap(function (queryRef, ix) {
            return firebaseListObservable(queryRef, { preserveSnapshot: preserveSnapshot });
        })
            .subscribe(subscriber);
        return function () { return sub.unsubscribe(); };
    });
}
exports.FirebaseListFactory = FirebaseListFactory;
function firebaseListObservable(ref, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var listObs = new firebase_list_observable_1.FirebaseListObservable(ref, function (obs) {
        var arr = [];
        var hasInitialLoad = false;
        ref.once('value', function (snap) {
            hasInitialLoad = true;
            obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
        }).catch(function (err) {
            obs.error(err);
            obs.complete();
        });
        ref.on('child_added', function (child, prevKey) {
            arr = onChildAdded(arr, child, prevKey);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        ref.on('child_removed', function (child) {
            arr = onChildRemoved(arr, child);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        ref.on('child_changed', function (child, prevKey) {
            arr = onChildChanged(arr, child, prevKey);
            if (hasInitialLoad) {
                obs.next(preserveSnapshot ? arr : arr.map(utils.unwrapMapFn));
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () { return ref.off(); };
    });
    return listObs;
}
function onChildAdded(arr, child, prevKey) {
    if (!arr.length) {
        return [child];
    }
    return arr.reduce(function (accumulator, curr, i) {
        if (!prevKey && i === 0) {
            accumulator.push(child);
        }
        accumulator.push(curr);
        if (prevKey && prevKey === curr.key) {
            accumulator.push(child);
        }
        return accumulator;
    }, []);
}
exports.onChildAdded = onChildAdded;
function onChildChanged(arr, child, prevKey) {
    return arr.reduce(function (accumulator, val, i) {
        if (!prevKey && i == 0) {
            accumulator.push(child);
            if (val.key !== child.key) {
                accumulator.push(val);
            }
        }
        else if (val.key === prevKey) {
            accumulator.push(val);
            accumulator.push(child);
        }
        else if (val.key !== child.key) {
            accumulator.push(val);
        }
        return accumulator;
    }, []);
}
exports.onChildChanged = onChildChanged;
function onChildRemoved(arr, child) {
    return arr.filter(function (c) { return c.key !== child.key; });
}
exports.onChildRemoved = onChildRemoved;
function onChildUpdated(arr, child, prevKey) {
    return arr.map(function (v, i, arr) {
        if (!prevKey && !i) {
            return child;
        }
        else if (i > 0 && arr[i - 1].key === prevKey) {
            return child;
        }
        else {
            return v;
        }
    });
}
exports.onChildUpdated = onChildUpdated;
//# sourceMappingURL=firebase_list_factory.js.map

/***/ },

/***/ "./node_modules/angularfire2/database/firebase_list_observable.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var utils = __webpack_require__("./node_modules/angularfire2/utils.js");
var FirebaseListObservable = (function (_super) {
    __extends(FirebaseListObservable, _super);
    function FirebaseListObservable(_ref, subscribe) {
        _super.call(this, subscribe);
        this._ref = _ref;
    }
    FirebaseListObservable.prototype.lift = function (operator) {
        var observable = new FirebaseListObservable(this._ref);
        observable.source = this;
        observable.operator = operator;
        observable._ref = this._ref;
        return observable;
    };
    FirebaseListObservable.prototype.push = function (val) {
        if (!this._ref) {
            throw new Error('No ref specified for this Observable!');
        }
        this._ref.ref;
        return this._ref.ref.push(val);
    };
    FirebaseListObservable.prototype.update = function (item, value) {
        var _this = this;
        return this._checkOperationCases(item, {
            stringCase: function () { return _this._ref.ref.child(item).update(value); },
            firebaseCase: function () { return item.update(value); },
            snapshotCase: function () { return item.ref.update(value); },
            unwrappedSnapshotCase: function () { return _this._ref.ref.child(item.$key).update(value); }
        });
    };
    FirebaseListObservable.prototype.remove = function (item) {
        var _this = this;
        if (!item) {
            return this._ref.ref.remove();
        }
        return this._checkOperationCases(item, {
            stringCase: function () { return _this._ref.ref.child(item).remove(); },
            firebaseCase: function () { return item.remove(); },
            snapshotCase: function () { return item.ref.remove(); },
            unwrappedSnapshotCase: function () { return _this._ref.ref.child(item.$key).remove(); }
        });
    };
    FirebaseListObservable.prototype._checkOperationCases = function (item, cases) {
        if (utils.isString(item)) {
            return cases.stringCase();
        }
        else if (utils.isFirebaseRef(item)) {
            return cases.firebaseCase();
        }
        else if (utils.isFirebaseDataSnapshot(item)) {
            return cases.snapshotCase();
        }
        else if (utils.isAFUnwrappedSnapshot(item)) {
            return cases.unwrappedSnapshotCase();
        }
        throw new Error("Method requires a key, snapshot, reference, or unwrapped snapshot. Got: " + typeof item);
    };
    return FirebaseListObservable;
}(Observable_1.Observable));
exports.FirebaseListObservable = FirebaseListObservable;
//# sourceMappingURL=firebase_list_observable.js.map

/***/ },

/***/ "./node_modules/angularfire2/database/firebase_object_factory.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var index_1 = __webpack_require__("./node_modules/angularfire2/database/index.js");
var firebase_1 = __webpack_require__("./node_modules/firebase/firebase-browser.js");
var utils = __webpack_require__("./node_modules/angularfire2/utils.js");
__webpack_require__("./node_modules/rxjs/add/operator/mergeMap.js");
function FirebaseObjectFactory(absoluteUrlOrDbRef, _a) {
    var _b = _a === void 0 ? {} : _a, preserveSnapshot = _b.preserveSnapshot, query = _b.query;
    var ref;
    utils.checkForUrlOrFirebaseRef(absoluteUrlOrDbRef, {
        isUrl: function () { return ref = firebase_1.database().refFromURL(absoluteUrlOrDbRef); },
        isRef: function () { return ref = absoluteUrlOrDbRef; }
    });
    return new index_1.FirebaseObjectObservable(function (obs) {
        ref.on('value', function (snapshot) {
            obs.next(preserveSnapshot ? snapshot : utils.unwrapMapFn(snapshot));
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () { return ref.off(); };
    }, ref);
}
exports.FirebaseObjectFactory = FirebaseObjectFactory;
//# sourceMappingURL=firebase_object_factory.js.map

/***/ },

/***/ "./node_modules/angularfire2/database/firebase_object_observable.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var FirebaseObjectObservable = (function (_super) {
    __extends(FirebaseObjectObservable, _super);
    function FirebaseObjectObservable(subscribe, _ref) {
        _super.call(this, subscribe);
        this._ref = _ref;
    }
    FirebaseObjectObservable.prototype.lift = function (operator) {
        var observable = new FirebaseObjectObservable();
        observable.source = this;
        observable.operator = operator;
        observable._ref = this._ref;
        return observable;
    };
    FirebaseObjectObservable.prototype.set = function (value) {
        if (!this._ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this._ref.set(value);
    };
    FirebaseObjectObservable.prototype.update = function (value) {
        if (!this._ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this._ref.update(value);
    };
    FirebaseObjectObservable.prototype.remove = function () {
        if (!this._ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this._ref.remove();
    };
    return FirebaseObjectObservable;
}(Observable_1.Observable));
exports.FirebaseObjectObservable = FirebaseObjectObservable;
//# sourceMappingURL=firebase_object_observable.js.map

/***/ },

/***/ "./node_modules/angularfire2/database/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__("./node_modules/angularfire2/database/database.js"));
__export(__webpack_require__("./node_modules/angularfire2/database/firebase_list_factory.js"));
__export(__webpack_require__("./node_modules/angularfire2/database/firebase_list_observable.js"));
__export(__webpack_require__("./node_modules/angularfire2/database/firebase_object_factory.js"));
__export(__webpack_require__("./node_modules/angularfire2/database/firebase_object_observable.js"));
__export(__webpack_require__("./node_modules/angularfire2/database/query_observable.js"));
//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/angularfire2/database/query_observable.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var ScalarObservable_1 = __webpack_require__("./node_modules/rxjs/observable/ScalarObservable.js");
var map_1 = __webpack_require__("./node_modules/rxjs/operator/map.js");
var interfaces_1 = __webpack_require__("./node_modules/angularfire2/interfaces.js");
__webpack_require__("./node_modules/rxjs/add/operator/merge.js");
__webpack_require__("./node_modules/rxjs/add/operator/combineLatest.js");
function observeQuery(query) {
    if (!isPresent(query)) {
        return new ScalarObservable_1.ScalarObservable(null);
    }
    return Observable_1.Observable.create(function (observer) {
        getOrderObservables(query)
            .combineLatest(getStartAtObservable(query), getEndAtObservable(query), getEqualToObservable(query), getLimitToObservables(query))
            .subscribe(function (_a) {
            var orderBy = _a[0], startAt = _a[1], endAt = _a[2], equalTo = _a[3], limitTo = _a[4];
            var serializedOrder = {};
            if (isPresent(orderBy) && isPresent(orderBy.value)) {
                switch (orderBy.key) {
                    case interfaces_1.OrderByOptions.Key:
                        serializedOrder = { orderByKey: orderBy.value };
                        break;
                    case interfaces_1.OrderByOptions.Priority:
                        serializedOrder = { orderByPriority: orderBy.value };
                        break;
                    case interfaces_1.OrderByOptions.Value:
                        serializedOrder = { orderByValue: orderBy.value };
                        break;
                    case interfaces_1.OrderByOptions.Child:
                        serializedOrder = { orderByChild: orderBy.value };
                        break;
                }
            }
            if (isPresent(limitTo) && isPresent(limitTo.value)) {
                switch (limitTo.key) {
                    case interfaces_1.LimitToOptions.First:
                        serializedOrder.limitToFirst = limitTo.value;
                        break;
                    case interfaces_1.LimitToOptions.Last: {
                        serializedOrder.limitToLast = limitTo.value;
                        break;
                    }
                }
            }
            if (isPresent(startAt)) {
                serializedOrder.startAt = startAt;
            }
            if (isPresent(endAt)) {
                serializedOrder.endAt = endAt;
            }
            if (isPresent(equalTo)) {
                serializedOrder.equalTo = equalTo;
            }
            observer.next(serializedOrder);
        });
    });
}
exports.observeQuery = observeQuery;
function getOrderObservables(query) {
    var observables = ['orderByChild', 'orderByKey', 'orderByValue', 'orderByPriority']
        .map(function (key, option) {
        return ({ key: key, option: option });
    })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return isPresent(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToOrderBySelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        return observables[0].merge(observables.slice(1));
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
exports.getOrderObservables = getOrderObservables;
function getLimitToObservables(query) {
    var observables = ['limitToFirst', 'limitToLast']
        .map(function (key, option) { return ({ key: key, option: option }); })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return isPresent(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToLimitToSelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        var mergedObs = observables[0].merge(observables.slice(1));
        return mergedObs;
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
exports.getLimitToObservables = getLimitToObservables;
function getStartAtObservable(query) {
    if (query.startAt instanceof Observable_1.Observable) {
        return query.startAt;
    }
    else if (typeof query.startAt !== 'undefined') {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(query.startAt);
        });
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
exports.getStartAtObservable = getStartAtObservable;
function getEndAtObservable(query) {
    if (query.endAt instanceof Observable_1.Observable) {
        return query.endAt;
    }
    else if (typeof query.endAt !== 'undefined') {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(query.endAt);
        });
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
exports.getEndAtObservable = getEndAtObservable;
function getEqualToObservable(query) {
    if (query.equalTo instanceof Observable_1.Observable) {
        return query.equalTo;
    }
    else if (typeof query.equalTo !== 'undefined') {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(query.equalTo);
        });
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next(null);
        });
    }
}
exports.getEqualToObservable = getEqualToObservable;
function mapToOrderBySelection(value, key) {
    if (value instanceof Observable_1.Observable) {
        return map_1.map
            .call(value, function (value) {
            return ({ value: value, key: key });
        });
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function mapToLimitToSelection(value, key) {
    if (value instanceof Observable_1.Observable) {
        return map_1.map
            .call(value, function (value) { return ({ value: value, key: key }); });
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function hasObservableProperties(query) {
    if (query.orderByKey instanceof Observable_1.Observable)
        return true;
    return false;
}
function isPresent(val) {
    return val !== undefined && val !== null;
}
//# sourceMappingURL=query_observable.js.map

/***/ },

/***/ "./node_modules/angularfire2/interfaces.js":
/***/ function(module, exports) {

"use strict";
"use strict";
(function (OrderByOptions) {
    OrderByOptions[OrderByOptions["Child"] = 0] = "Child";
    OrderByOptions[OrderByOptions["Key"] = 1] = "Key";
    OrderByOptions[OrderByOptions["Value"] = 2] = "Value";
    OrderByOptions[OrderByOptions["Priority"] = 3] = "Priority";
})(exports.OrderByOptions || (exports.OrderByOptions = {}));
var OrderByOptions = exports.OrderByOptions;
(function (LimitToOptions) {
    LimitToOptions[LimitToOptions["First"] = 0] = "First";
    LimitToOptions[LimitToOptions["Last"] = 1] = "Last";
})(exports.LimitToOptions || (exports.LimitToOptions = {}));
var LimitToOptions = exports.LimitToOptions;
(function (QueryOptions) {
    QueryOptions[QueryOptions["EqualTo"] = 0] = "EqualTo";
    QueryOptions[QueryOptions["StartAt"] = 1] = "StartAt";
    QueryOptions[QueryOptions["EndAt"] = 2] = "EndAt";
})(exports.QueryOptions || (exports.QueryOptions = {}));
var QueryOptions = exports.QueryOptions;
//# sourceMappingURL=interfaces.js.map

/***/ },

/***/ "./node_modules/angularfire2/tokens.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
exports.FirebaseConfig = new core_1.OpaqueToken('FirebaseUrl');
exports.FirebaseApp = new core_1.OpaqueToken('FirebaseApp');
exports.FirebaseAuthConfig = new core_1.OpaqueToken('FirebaseAuthConfig');
exports.FirebaseUserConfig = new core_1.OpaqueToken('FirebaseUserConfig');
exports.WindowLocation = new core_1.OpaqueToken('WindowLocation');
exports.FirebaseRef = exports.FirebaseApp;
exports.FirebaseUrl = exports.FirebaseConfig;
//# sourceMappingURL=tokens.js.map

/***/ },

/***/ "./node_modules/angularfire2/utils.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueueScheduler_1 = __webpack_require__("./node_modules/rxjs/scheduler/QueueScheduler.js");
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
exports.isPresent = isPresent;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isFirebaseRef(value) {
    return typeof value.set === 'function';
}
exports.isFirebaseRef = isFirebaseRef;
function isFirebaseDataSnapshot(value) {
    return typeof value.exportVal === 'function';
}
exports.isFirebaseDataSnapshot = isFirebaseDataSnapshot;
function isAFUnwrappedSnapshot(value) {
    return typeof value.$key === 'string';
}
exports.isAFUnwrappedSnapshot = isAFUnwrappedSnapshot;
function isFirebaseQuery(value) {
    return typeof value.orderByChild === 'function';
}
exports.isFirebaseQuery = isFirebaseQuery;
function isEmptyObject(obj) {
    if (!isPresent(obj)) {
        return false;
    }
    return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
}
exports.isEmptyObject = isEmptyObject;
function unwrapMapFn(snapshot) {
    var unwrapped = isPresent(snapshot.val()) ? snapshot.val() : { $value: null };
    if ((/string|number|boolean/).test(typeof unwrapped)) {
        unwrapped = {
            $value: unwrapped
        };
    }
    unwrapped.$key = snapshot.ref.key;
    return unwrapped;
}
exports.unwrapMapFn = unwrapMapFn;
function checkForUrlOrFirebaseRef(urlOrRef, cases) {
    if (isString(urlOrRef)) {
        return cases.isUrl();
    }
    if (isFirebaseRef(urlOrRef)) {
        return cases.isRef();
    }
    if (isFirebaseQuery(urlOrRef)) {
        return cases.isQuery();
    }
    throw new Error('Provide a url or a Firebase database reference');
}
exports.checkForUrlOrFirebaseRef = checkForUrlOrFirebaseRef;
function stripTrailingSlash(value) {
    if (value.substring(value.length - 1, value.length) === '/') {
        return value.substring(0, value.length - 1);
    }
    else {
        return value;
    }
}
exports.stripTrailingSlash = stripTrailingSlash;
function stripLeadingSlash(value) {
    if (value.substring(0, 1) === '/') {
        return value.substring(1, value.length);
    }
    else {
        return value;
    }
}
exports.stripLeadingSlash = stripLeadingSlash;
var ZoneScheduler = (function (_super) {
    __extends(ZoneScheduler, _super);
    function ZoneScheduler(zone) {
        _super.call(this);
        this.zone = zone;
    }
    ZoneScheduler.prototype.schedule = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.zone.run(function () { return _super.prototype.schedule.apply(_this, args); });
    };
    return ZoneScheduler;
}(QueueScheduler_1.QueueScheduler));
exports.ZoneScheduler = ZoneScheduler;
//# sourceMappingURL=utils.js.map

/***/ },

/***/ "./node_modules/firebase/firebase-browser.js":
/***/ function(module, exports, __webpack_require__) {

/**
 *  Firebase libraries for browser - npm package.
 *
 * Usage:
 *
 *   firebase = require('firebase');
 */
__webpack_require__("./node_modules/firebase/firebase.js");
module.exports = firebase;


/***/ },

/***/ "./node_modules/firebase/firebase.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*! @license Firebase v3.3.2
    Build: 3.3.2-rc.1
    Terms: https://developers.google.com/terms */
(function() { var aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},h="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global?global:this,k=function(){k=function(){};h.Symbol||(h.Symbol=ba)},ca=0,ba=function(a){return"jscomp_symbol_"+(a||"")+ca++},p=function(){k();var a=h.Symbol.iterator;a||(a=h.Symbol.iterator=h.Symbol("iterator"));
"function"!=typeof Array.prototype[a]&&aa(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return m(this)}});p=function(){}},m=function(a){var b=0;return da(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})},da=function(a){p();a={next:a};a[h.Symbol.iterator]=function(){return this};return a},q=this,r=function(){},u=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);
if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},v=function(a){return"function"==u(a)},ea=function(a,
b,c){return a.call.apply(a.bind,arguments)},fa=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},w=function(a,b,c){w=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa;return w.apply(null,arguments)},x=function(a,b){var c=Array.prototype.slice.call(arguments,
1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},y=function(a,b){function c(){}c.prototype=b.prototype;a.ga=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.fa=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var z;z="undefined"!==typeof window?window:"undefined"!==typeof self?self:global;function __extends(a,b){function c(){this.constructor=a}for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);a.prototype=null===b?Object.create(b):(c.prototype=b.prototype,new c)}
function __decorate(a,b,c,d){var e=arguments.length,f=3>e?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d,g;g=z.Reflect;if("object"===typeof g&&"function"===typeof g.decorate)f=g.decorate(a,b,c,d);else for(var l=a.length-1;0<=l;l--)if(g=a[l])f=(3>e?g(f):3<e?g(b,c,f):g(b,c))||f;return 3<e&&f&&Object.defineProperty(b,c,f),f}function __metadata(a,b){var c=z.Reflect;if("object"===typeof c&&"function"===typeof c.metadata)return c.metadata(a,b)}
var __param=function(a,b){return function(c,d){b(c,d,a)}},__awaiter=function(a,b,c,d){return new (c||(c=Promise))(function(e,f){function g(a){try{n(d.next(a))}catch(t){f(t)}}function l(a){try{n(d.throw(a))}catch(t){f(t)}}function n(a){a.done?e(a.value):(new c(function(b){b(a.value)})).then(g,l)}n((d=d.apply(a,b)).next())})};"undefined"!==typeof z.L&&z.L||"undefined"===typeof global||(global.ca=__extends,global.ba=__decorate,global.da=__metadata,global.ea=__param,global.aa=__awaiter);var A=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,A);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};y(A,Error);A.prototype.name="CustomError";var ga=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")};var B=function(a,b){b.unshift(a);A.call(this,ga.apply(null,b));b.shift()};y(B,A);B.prototype.name="AssertionError";var ha=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new B(""+e,f||[]);},C=function(a,b,c){a||ha("",null,b,Array.prototype.slice.call(arguments,2))},D=function(a,b,c){v(a)||ha("Expected function but got %s: %s.",[u(a),a],b,Array.prototype.slice.call(arguments,2))};var E=function(a,b,c){this.S=c;this.M=a;this.U=b;this.s=0;this.o=null};E.prototype.get=function(){var a;0<this.s?(this.s--,a=this.o,this.o=a.next,a.next=null):a=this.M();return a};E.prototype.put=function(a){this.U(a);this.s<this.S&&(this.s++,a.next=this.o,this.o=a)};var F;a:{var ia=q.navigator;if(ia){var ja=ia.userAgent;if(ja){F=ja;break a}}F=""};var ka=function(a){q.setTimeout(function(){throw a;},0)},G,la=function(){var a=q.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==F.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+
"//"+b.location.host,a=w(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==F.indexOf("Trident")&&-1==F.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.F;c.F=null;a()}};return function(a){d.next={F:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in
document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){q.setTimeout(a,0)}};var H=function(){this.v=this.f=null},ma=new E(function(){return new I},function(a){a.reset()},100);H.prototype.add=function(a,b){var c=ma.get();c.set(a,b);this.v?this.v.next=c:(C(!this.f),this.f=c);this.v=c};H.prototype.remove=function(){var a=null;this.f&&(a=this.f,this.f=this.f.next,this.f||(this.v=null),a.next=null);return a};var I=function(){this.next=this.scope=this.B=null};I.prototype.set=function(a,b){this.B=a;this.scope=b;this.next=null};
I.prototype.reset=function(){this.next=this.scope=this.B=null};var M=function(a,b){J||na();L||(J(),L=!0);oa.add(a,b)},J,na=function(){if(q.Promise&&q.Promise.resolve){var a=q.Promise.resolve(void 0);J=function(){a.then(pa)}}else J=function(){var a=pa;!v(q.setImmediate)||q.Window&&q.Window.prototype&&-1==F.indexOf("Edge")&&q.Window.prototype.setImmediate==q.setImmediate?(G||(G=la()),G(a)):q.setImmediate(a)}},L=!1,oa=new H,pa=function(){for(var a;a=oa.remove();){try{a.B.call(a.scope)}catch(b){ka(b)}ma.put(a)}L=!1};var O=function(a,b){this.b=0;this.K=void 0;this.j=this.g=this.u=null;this.m=this.A=!1;if(a!=r)try{var c=this;a.call(b,function(a){N(c,2,a)},function(a){try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(e){}N(c,3,a)})}catch(d){N(this,3,d)}},qa=function(){this.next=this.context=this.h=this.c=this.child=null;this.w=!1};qa.prototype.reset=function(){this.context=this.h=this.c=this.child=null;this.w=!1};
var ra=new E(function(){return new qa},function(a){a.reset()},100),sa=function(a,b,c){var d=ra.get();d.c=a;d.h=b;d.context=c;return d},ua=function(a,b,c){ta(a,b,c,null)||M(x(b,a))};O.prototype.then=function(a,b,c){null!=a&&D(a,"opt_onFulfilled should be a function.");null!=b&&D(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return va(this,v(a)?a:null,v(b)?b:null,c)};O.prototype.then=O.prototype.then;O.prototype.$goog_Thenable=!0;
O.prototype.X=function(a,b){return va(this,null,a,b)};var xa=function(a,b){a.g||2!=a.b&&3!=a.b||wa(a);C(null!=b.c);a.j?a.j.next=b:a.g=b;a.j=b},va=function(a,b,c,d){var e=sa(null,null,null);e.child=new O(function(a,g){e.c=b?function(c){try{var e=b.call(d,c);a(e)}catch(K){g(K)}}:a;e.h=c?function(b){try{var e=c.call(d,b);a(e)}catch(K){g(K)}}:g});e.child.u=a;xa(a,e);return e.child};O.prototype.Y=function(a){C(1==this.b);this.b=0;N(this,2,a)};O.prototype.Z=function(a){C(1==this.b);this.b=0;N(this,3,a)};
var N=function(a,b,c){0==a.b&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.b=1,ta(c,a.Y,a.Z,a)||(a.K=c,a.b=b,a.u=null,wa(a),3!=b||ya(a,c)))},ta=function(a,b,c,d){if(a instanceof O)return null!=b&&D(b,"opt_onFulfilled should be a function."),null!=c&&D(c,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),xa(a,sa(b||r,c||null,d)),!0;var e;if(a)try{e=!!a.$goog_Thenable}catch(g){e=!1}else e=!1;if(e)return a.then(b,c,d),
!0;e=typeof a;if("object"==e&&null!=a||"function"==e)try{var f=a.then;if(v(f))return za(a,f,b,c,d),!0}catch(g){return c.call(d,g),!0}return!1},za=function(a,b,c,d,e){var f=!1,g=function(a){f||(f=!0,c.call(e,a))},l=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,g,l)}catch(n){l(n)}},wa=function(a){a.A||(a.A=!0,M(a.O,a))},Aa=function(a){var b=null;a.g&&(b=a.g,a.g=b.next,b.next=null);a.g||(a.j=null);null!=b&&C(null!=b.c);return b};
O.prototype.O=function(){for(var a;a=Aa(this);){var b=this.b,c=this.K;if(3==b&&a.h&&!a.w){var d;for(d=this;d&&d.m;d=d.u)d.m=!1}if(a.child)a.child.u=null,Ba(a,b,c);else try{a.w?a.c.call(a.context):Ba(a,b,c)}catch(e){Ca.call(null,e)}ra.put(a)}this.A=!1};var Ba=function(a,b,c){2==b?a.c.call(a.context,c):a.h&&a.h.call(a.context,c)},ya=function(a,b){a.m=!0;M(function(){a.m&&Ca.call(null,b)})},Ca=ka;function P(a,b){if(!(b instanceof Object))return b;switch(b.constructor){case Date:return new Date(b.getTime());case Object:void 0===a&&(a={});break;case Array:a=[];break;default:return b}for(var c in b)b.hasOwnProperty(c)&&(a[c]=P(a[c],b[c]));return a};var Da=Error.captureStackTrace,R=function(a,b){this.code=a;this.message=b;if(Da)Da(this,Q.prototype.create);else{var c=Error.apply(this,arguments);this.name="FirebaseError";Object.defineProperty(this,"stack",{get:function(){return c.stack}})}};R.prototype=Object.create(Error.prototype);R.prototype.constructor=R;R.prototype.name="FirebaseError";var Q=function(a,b,c){this.V=a;this.W=b;this.N=c;this.pattern=/\{\$([^}]+)}/g};
Q.prototype.create=function(a,b){void 0===b&&(b={});var c=this.N[a];a=this.V+"/"+a;var c=void 0===c?"Error":c.replace(this.pattern,function(a,c){a=b[c];return void 0!==a?a.toString():"<"+c+"?>"}),c=this.W+": "+c+" ("+a+").",c=new R(a,c),d;for(d in b)b.hasOwnProperty(d)&&"_"!==d.slice(-1)&&(c[d]=b[d]);return c};O.all=function(a){return new O(function(b,c){var d=a.length,e=[];if(d)for(var f=function(a,c){d--;e[a]=c;0==d&&b(e)},g=function(a){c(a)},l=0,n;l<a.length;l++)n=a[l],ua(n,x(f,l),g);else b(e)})};O.resolve=function(a){if(a instanceof O)return a;var b=new O(r);N(b,2,a);return b};O.reject=function(a){return new O(function(b,c){c(a)})};O.prototype["catch"]=O.prototype.X;var S=O;"undefined"!==typeof Promise&&(S=Promise);var Ea=S;function Fa(a,b){a=new T(a,b);return a.subscribe.bind(a)}var T=function(a,b){var c=this;this.a=[];this.J=0;this.task=Ea.resolve();this.l=!1;this.D=b;this.task.then(function(){a(c)}).catch(function(a){c.error(a)})};T.prototype.next=function(a){U(this,function(b){b.next(a)})};T.prototype.error=function(a){U(this,function(b){b.error(a)});this.close(a)};T.prototype.complete=function(){U(this,function(a){a.complete()});this.close()};
T.prototype.subscribe=function(a,b,c){var d=this,e;if(void 0===a&&void 0===b&&void 0===c)throw Error("Missing Observer.");e=Ga(a)?a:{next:a,error:b,complete:c};void 0===e.next&&(e.next=V);void 0===e.error&&(e.error=V);void 0===e.complete&&(e.complete=V);a=this.$.bind(this,this.a.length);this.l&&this.task.then(function(){try{d.G?e.error(d.G):e.complete()}catch(f){}});this.a.push(e);return a};
T.prototype.$=function(a){void 0!==this.a&&void 0!==this.a[a]&&(delete this.a[a],--this.J,0===this.J&&void 0!==this.D&&this.D(this))};var U=function(a,b){if(!a.l)for(var c=0;c<a.a.length;c++)Ha(a,c,b)},Ha=function(a,b,c){a.task.then(function(){if(void 0!==a.a&&void 0!==a.a[b])try{c(a.a[b])}catch(d){}})};T.prototype.close=function(a){var b=this;this.l||(this.l=!0,void 0!==a&&(this.G=a),this.task.then(function(){b.a=void 0;b.D=void 0}))};
function Ga(a){if("object"!==typeof a||null===a)return!1;var b;b=["next","error","complete"];p();var c=b[Symbol.iterator];b=c?c.call(b):m(b);for(c=b.next();!c.done;c=b.next())if(c=c.value,c in a&&"function"===typeof a[c])return!0;return!1}function V(){};var W=S,X=function(a,b,c){var d=this;this.H=c;this.I=!1;this.i={};this.C=b;this.T=P(void 0,a);Object.keys(c.INTERNAL.factories).forEach(function(a){var b=c.INTERNAL.useAsService(d,a);null!==b&&(d[a]=d.R.bind(d,b))})};X.prototype.delete=function(){var a=this;return(new W(function(b){Y(a);b()})).then(function(){a.H.INTERNAL.removeApp(a.C);return W.all(Object.keys(a.i).map(function(b){return a.i[b].INTERNAL.delete()}))}).then(function(){a.I=!0;a.i={}})};
X.prototype.R=function(a){Y(this);void 0===this.i[a]&&(this.i[a]=this.H.INTERNAL.factories[a](this,this.P.bind(this)));return this.i[a]};X.prototype.P=function(a){P(this,a)};var Y=function(a){a.I&&Z(Ia("deleted",{name:a.C}))};h.Object.defineProperties(X.prototype,{name:{configurable:!0,enumerable:!0,get:function(){Y(this);return this.C}},options:{configurable:!0,enumerable:!0,get:function(){Y(this);return this.T}}});X.prototype.name&&X.prototype.options||X.prototype.delete||console.log("dc");
function Ja(){function a(a){a=a||"[DEFAULT]";var b=d[a];void 0===b&&Z("noApp",{name:a});return b}function b(a,b){Object.keys(e).forEach(function(d){d=c(a,d);if(null!==d&&f[d])f[d](b,a)})}function c(a,b){if("serverAuth"===b)return null;var c=b;a=a.options;"auth"===b&&(a.serviceAccount||a.credential)&&(c="serverAuth","serverAuth"in e||Z("serverAuthMissing"));return c}var d={},e={},f={},g={__esModule:!0,initializeApp:function(a,c){void 0===c?c="[DEFAULT]":"string"===typeof c&&""!==c||Z("bad-app-name",
{name:c+""});void 0!==d[c]&&Z("dupApp",{name:c});a=new X(a,c,g);d[c]=a;b(a,"create");void 0!=a.INTERNAL&&void 0!=a.INTERNAL.getToken||P(a,{INTERNAL:{getToken:function(){return W.resolve(null)},addAuthTokenListener:function(){},removeAuthTokenListener:function(){}}});return a},app:a,apps:null,Promise:W,SDK_VERSION:"0.0.0",INTERNAL:{registerService:function(b,c,d,t){e[b]&&Z("dupService",{name:b});e[b]=c;t&&(f[b]=t);c=function(c){void 0===c&&(c=a());return c[b]()};void 0!==d&&P(c,d);return g[b]=c},createFirebaseNamespace:Ja,
extendNamespace:function(a){P(g,a)},createSubscribe:Fa,ErrorFactory:Q,removeApp:function(a){b(d[a],"delete");delete d[a]},factories:e,useAsService:c,Promise:O,deepExtend:P}};g["default"]=g;Object.defineProperty(g,"apps",{get:function(){return Object.keys(d).map(function(a){return d[a]})}});a.App=X;return g}function Z(a,b){throw Error(Ia(a,b));}
function Ia(a,b){b=b||{};b={noApp:"No Firebase App '"+b.name+"' has been created - call Firebase App.initializeApp().","bad-app-name":"Illegal App name: '"+b.name+"'.",dupApp:"Firebase App named '"+b.name+"' already exists.",deleted:"Firebase App named '"+b.name+"' already deleted.",dupService:"Firebase Service named '"+b.name+"' already registered.",serverAuthMissing:"Initializing the Firebase SDK with a service account is only allowed in a Node.js environment. On client devices, you should instead initialize the SDK with an api key and auth domain."}[a];
return void 0===b?"Application Error: ("+a+")":b};"undefined"!==typeof window&&(window.firebase=Ja()); })();
firebase.SDK_VERSION = "3.3.2";
(function(){var h,aa=aa||{},l=this,ba=function(){},ca=function(){throw Error("unimplemented abstract method");},m=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=
typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},da=function(a){return null===a},ea=function(a){return"array"==m(a)},fa=function(a){var b=m(a);return"array"==b||"object"==b&&"number"==typeof a.length},n=function(a){return"string"==typeof a},ga=function(a){return"number"==typeof a},p=function(a){return"function"==m(a)},ha=function(a){var b=typeof a;
return"object"==b&&null!=a||"function"==b},ia=function(a,b,c){return a.call.apply(a.bind,arguments)},ja=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},r=function(a,b,c){r=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ia:ja;return r.apply(null,
arguments)},ka=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},la=Date.now||function(){return+new Date},t=function(a,b){function c(){}c.prototype=b.prototype;a.Pc=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Ne=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var u=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,u);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};t(u,Error);u.prototype.name="CustomError";var ma=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")},na=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},oa=/&/g,pa=/</g,qa=/>/g,sa=/"/g,ta=/'/g,ua=/\x00/g,va=/[\x00&<>"']/,v=function(a,b){return-1!=a.indexOf(b)},wa=function(a,b){return a<b?-1:a>b?1:0};var xa=function(a,b){b.unshift(a);u.call(this,ma.apply(null,b));b.shift()};t(xa,u);xa.prototype.name="AssertionError";
var ya=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new xa(""+e,f||[]);},w=function(a,b,c){a||ya("",null,b,Array.prototype.slice.call(arguments,2))},za=function(a,b){throw new xa("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));},Aa=function(a,b,c){ga(a)||ya("Expected number but got %s: %s.",[m(a),a],b,Array.prototype.slice.call(arguments,2));return a},Ba=function(a,b,c){n(a)||ya("Expected string but got %s: %s.",[m(a),a],b,Array.prototype.slice.call(arguments,
2))},Ca=function(a,b,c){p(a)||ya("Expected function but got %s: %s.",[m(a),a],b,Array.prototype.slice.call(arguments,2))};var Da=Array.prototype.indexOf?function(a,b,c){w(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(n(a))return n(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},x=Array.prototype.forEach?function(a,b,c){w(null!=a.length);Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=n(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Ea=function(a,b){for(var c=n(a)?
a.split(""):a,d=a.length-1;0<=d;--d)d in c&&b.call(void 0,c[d],d,a)},Fa=Array.prototype.map?function(a,b,c){w(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=n(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Ga=Array.prototype.some?function(a,b,c){w(null!=a.length);return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=n(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1},
Ia=function(a){var b;a:{b=Ha;for(var c=a.length,d=n(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:n(a)?a.charAt(b):a[b]},Ja=function(a,b){return 0<=Da(a,b)},La=function(a,b){b=Da(a,b);var c;(c=0<=b)&&Ka(a,b);return c},Ka=function(a,b){w(null!=a.length);return 1==Array.prototype.splice.call(a,b,1).length},Ma=function(a,b){var c=0;Ea(a,function(d,e){b.call(void 0,d,e,a)&&Ka(a,e)&&c++})},Na=function(a){return Array.prototype.concat.apply(Array.prototype,
arguments)},Oa=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)},Pa=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]},Qa=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(fa(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g]}else a.push(d)}};var Ra=function(a,b){for(var c in a)b.call(void 0,a[c],c,a)},Sa=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b},Ta=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b},Ua=function(a){for(var b in a)return!1;return!0},Va=function(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(c in b)if(!(c in a))return!1;return!0},Wa=function(a){var b={},c;for(c in a)b[c]=a[c];return b},Xa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
Ya=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Xa.length;f++)c=Xa[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var Za;a:{var $a=l.navigator;if($a){var ab=$a.userAgent;if(ab){Za=ab;break a}}Za=""}var y=function(a){return v(Za,a)};var bb=function(a){bb[" "](a);return a};bb[" "]=ba;var db=function(a,b){var c=cb;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)};var eb=y("Opera"),z=y("Trident")||y("MSIE"),fb=y("Edge"),gb=fb||z,hb=y("Gecko")&&!(v(Za.toLowerCase(),"webkit")&&!y("Edge"))&&!(y("Trident")||y("MSIE"))&&!y("Edge"),ib=v(Za.toLowerCase(),"webkit")&&!y("Edge"),jb=function(){var a=l.document;return a?a.documentMode:void 0},kb;
a:{var lb="",mb=function(){var a=Za;if(hb)return/rv\:([^\);]+)(\)|;)/.exec(a);if(fb)return/Edge\/([\d\.]+)/.exec(a);if(z)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(ib)return/WebKit\/(\S+)/.exec(a);if(eb)return/(?:Version)[ \/]?(\S+)/.exec(a)}();mb&&(lb=mb?mb[1]:"");if(z){var nb=jb();if(null!=nb&&nb>parseFloat(lb)){kb=String(nb);break a}}kb=lb}
var ob=kb,cb={},A=function(a){return db(a,function(){for(var b=0,c=na(String(ob)).split("."),d=na(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",k=d[f]||"";do{g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];k=/(\d*)(\D*)(.*)/.exec(k)||["","","",""];if(0==g[0].length&&0==k[0].length)break;b=wa(0==g[1].length?0:parseInt(g[1],10),0==k[1].length?0:parseInt(k[1],10))||wa(0==g[2].length,0==k[2].length)||wa(g[2],k[2]);g=g[3];k=k[3]}while(0==b)}return 0<=b})},pb=l.document,
qb=pb&&z?jb()||("CSS1Compat"==pb.compatMode?parseInt(ob,10):5):void 0;var rb=null,sb=null,ub=function(a){var b="";tb(a,function(a){b+=String.fromCharCode(a)});return b},tb=function(a,b){function c(b){for(;d<a.length;){var c=a.charAt(d++),e=sb[c];if(null!=e)return e;if(!/^[\s\xa0]*$/.test(c))throw Error("Unknown base64 encoding at char: "+c);}return b}vb();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),k=c(64);if(64===k&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=k&&b(g<<6&192|k))}},vb=function(){if(!rb){rb={};sb={};for(var a=0;65>a;a++)rb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),
sb[rb[a]]=a,62<=a&&(sb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)]=a)}};var wb=!z||9<=Number(qb),xb=z&&!A("9");!ib||A("528");hb&&A("1.9b")||z&&A("8")||eb&&A("9.5")||ib&&A("528");hb&&!A("8")||z&&A("9");var yb=function(){this.ya=this.ya;this.Tb=this.Tb};yb.prototype.ya=!1;yb.prototype.isDisposed=function(){return this.ya};yb.prototype.Oa=function(){if(this.Tb)for(;this.Tb.length;)this.Tb.shift()()};var zb=function(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.Va=!1;this.ud=!0};zb.prototype.preventDefault=function(){this.defaultPrevented=!0;this.ud=!1};var Ab=function(a,b){zb.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.lb=this.state=null;a&&this.init(a,b)};t(Ab,zb);
Ab.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.currentTarget=b;if(b=a.relatedTarget){if(hb){var e;a:{try{bb(b.nodeName);e=!0;break a}catch(f){}e=!1}e||(b=null)}}else"mouseover"==c?b=a.fromElement:"mouseout"==c&&(b=a.toElement);this.relatedTarget=b;null===d?(this.offsetX=ib||void 0!==a.offsetX?a.offsetX:a.layerX,this.offsetY=ib||void 0!==a.offsetY?a.offsetY:a.layerY,this.clientX=void 0!==a.clientX?a.clientX:
a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0):(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.lb=a;a.defaultPrevented&&
this.preventDefault()};Ab.prototype.preventDefault=function(){Ab.Pc.preventDefault.call(this);var a=this.lb;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,xb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};Ab.prototype.ce=function(){return this.lb};var Bb="closure_listenable_"+(1E6*Math.random()|0),Cb=0;var Db=function(a,b,c,d,e){this.listener=a;this.Xb=null;this.src=b;this.type=c;this.Cb=!!d;this.Kb=e;this.key=++Cb;this.$a=this.Bb=!1},Eb=function(a){a.$a=!0;a.listener=null;a.Xb=null;a.src=null;a.Kb=null};var Fb=function(a){this.src=a;this.w={};this.yb=0};Fb.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.w[f];a||(a=this.w[f]=[],this.yb++);var g=Gb(a,b,d,e);-1<g?(b=a[g],c||(b.Bb=!1)):(b=new Db(b,this.src,f,!!d,e),b.Bb=c,a.push(b));return b};Fb.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.w))return!1;var e=this.w[a];b=Gb(e,b,c,d);return-1<b?(Eb(e[b]),Ka(e,b),0==e.length&&(delete this.w[a],this.yb--),!0):!1};
var Hb=function(a,b){var c=b.type;c in a.w&&La(a.w[c],b)&&(Eb(b),0==a.w[c].length&&(delete a.w[c],a.yb--))};Fb.prototype.uc=function(a,b,c,d){a=this.w[a.toString()];var e=-1;a&&(e=Gb(a,b,c,d));return-1<e?a[e]:null};var Gb=function(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.$a&&f.listener==b&&f.Cb==!!c&&f.Kb==d)return e}return-1};var Ib="closure_lm_"+(1E6*Math.random()|0),Jb={},Kb=0,Lb=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)Lb(a,b[f],c,d,e);else c=Mb(c),a&&a[Bb]?a.listen(b,c,d,e):Nb(a,b,c,!1,d,e)},Nb=function(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=!!e,k=Ob(a);k||(a[Ib]=k=new Fb(a));c=k.add(b,c,d,e,f);if(c.Xb)return;d=Pb();c.Xb=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,g);else if(a.attachEvent)a.attachEvent(Qb(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");
Kb++},Pb=function(){var a=Rb,b=wb?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b},Sb=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)Sb(a,b[f],c,d,e);else c=Mb(c),a&&a[Bb]?Tb(a,b,c,d,e):Nb(a,b,c,!0,d,e)},Ub=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)Ub(a,b[f],c,d,e);else c=Mb(c),a&&a[Bb]?a.Y.remove(String(b),c,d,e):a&&(a=Ob(a))&&(b=a.uc(b,c,!!d,e))&&Vb(b)},Vb=function(a){if(ga(a)||!a||a.$a)return;var b=a.src;if(b&&
b[Bb]){Hb(b.Y,a);return}var c=a.type,d=a.Xb;b.removeEventListener?b.removeEventListener(c,d,a.Cb):b.detachEvent&&b.detachEvent(Qb(c),d);Kb--;(c=Ob(b))?(Hb(c,a),0==c.yb&&(c.src=null,b[Ib]=null)):Eb(a)},Qb=function(a){return a in Jb?Jb[a]:Jb[a]="on"+a},Xb=function(a,b,c,d){var e=!0;if(a=Ob(a))if(b=a.w[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.Cb==c&&!f.$a&&(f=Wb(f,d),e=e&&!1!==f)}return e},Wb=function(a,b){var c=a.listener,d=a.Kb||a.src;a.Bb&&Vb(a);return c.call(d,b)},Rb=function(a,
b){if(a.$a)return!0;if(!wb){if(!b)a:{b=["window","event"];for(var c=l,d;d=b.shift();)if(null!=c[d])c=c[d];else{b=null;break a}b=c}d=b;b=new Ab(d,this);c=!0;if(!(0>d.keyCode||void 0!=d.returnValue)){a:{var e=!1;if(0==d.keyCode)try{d.keyCode=-1;break a}catch(g){e=!0}if(e||void 0==d.returnValue)d.returnValue=!0}d=[];for(e=b.currentTarget;e;e=e.parentNode)d.push(e);a=a.type;for(e=d.length-1;!b.Va&&0<=e;e--){b.currentTarget=d[e];var f=Xb(d[e],a,!0,b),c=c&&f}for(e=0;!b.Va&&e<d.length;e++)b.currentTarget=
d[e],f=Xb(d[e],a,!1,b),c=c&&f}return c}return Wb(a,new Ab(b,this))},Ob=function(a){a=a[Ib];return a instanceof Fb?a:null},Yb="__closure_events_fn_"+(1E9*Math.random()>>>0),Mb=function(a){w(a,"Listener can not be null.");if(p(a))return a;w(a.handleEvent,"An object listener must have handleEvent method.");a[Yb]||(a[Yb]=function(b){return a.handleEvent(b)});return a[Yb]};var Zb=/^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;var ac=function(){this.fc="";this.Md=$b};ac.prototype.Nb=!0;ac.prototype.Ib=function(){return this.fc};ac.prototype.toString=function(){return"Const{"+this.fc+"}"};var bc=function(a){if(a instanceof ac&&a.constructor===ac&&a.Md===$b)return a.fc;za("expected object of type Const, got '"+a+"'");return"type_error:Const"},$b={};var B=function(){this.ja="";this.Ld=cc};B.prototype.Nb=!0;B.prototype.Ib=function(){return this.ja};B.prototype.toString=function(){return"SafeUrl{"+this.ja+"}"};
var dc=function(a){if(a instanceof B&&a.constructor===B&&a.Ld===cc)return a.ja;za("expected object of type SafeUrl, got '"+a+"' of type "+m(a));return"type_error:SafeUrl"},ec=/^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i,gc=function(a){if(a instanceof B)return a;a=a.Nb?a.Ib():String(a);ec.test(a)||(a="about:invalid#zClosurez");return fc(a)},cc={},fc=function(a){var b=new B;b.ja=a;return b};fc("about:blank");var hc=function(a){return/^\s*$/.test(a)?!1:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""))},ic=function(a){a=String(a);if(hc(a))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);},lc=function(a){var b=[];jc(new kc,a,b);return b.join("")},kc=function(){this.ac=void 0},
jc=function(a,b,c){if(null==b)c.push("null");else{if("object"==typeof b){if(ea(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),e=d[f],jc(a,a.ac?a.ac.call(d,String(f),e):e,c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");f="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(e=b[d],"function"!=typeof e&&(c.push(f),mc(d,c),c.push(":"),jc(a,a.ac?a.ac.call(b,d,e):e,c),f=","));c.push("}");return}}switch(typeof b){case "string":mc(b,
c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}},nc={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},oc=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g,mc=function(a,b){b.push('"',a.replace(oc,function(a){var b=nc[a];b||(b="\\u"+(a.charCodeAt(0)|65536).toString(16).substr(1),
nc[a]=b);return b}),'"')};var pc=function(){};pc.prototype.Tc=null;pc.prototype.kb=ca;var qc=function(a){return a.Tc||(a.Tc=a.Qb())};pc.prototype.Qb=ca;var rc,sc=function(){};t(sc,pc);sc.prototype.kb=function(){var a=tc(this);return a?new ActiveXObject(a):new XMLHttpRequest};sc.prototype.Qb=function(){var a={};tc(this)&&(a[0]=!0,a[1]=!0);return a};
var tc=function(a){if(!a.gd&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.gd=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.gd};rc=new sc;var uc=function(){};t(uc,pc);uc.prototype.kb=function(){var a=new XMLHttpRequest;if("withCredentials"in a)return a;if("undefined"!=typeof XDomainRequest)return new vc;throw Error("Unsupported browser");};uc.prototype.Qb=function(){return{}};
var vc=function(){this.oa=new XDomainRequest;this.readyState=0;this.onreadystatechange=null;this.responseText="";this.status=-1;this.statusText=this.responseXML=null;this.oa.onload=r(this.ee,this);this.oa.onerror=r(this.ed,this);this.oa.onprogress=r(this.fe,this);this.oa.ontimeout=r(this.ge,this)};h=vc.prototype;h.open=function(a,b,c){if(null!=c&&!c)throw Error("Only async requests are supported.");this.oa.open(a,b)};
h.send=function(a){if(a)if("string"==typeof a)this.oa.send(a);else throw Error("Only string data is supported");else this.oa.send()};h.abort=function(){this.oa.abort()};h.setRequestHeader=function(){};h.ee=function(){this.status=200;this.responseText=this.oa.responseText;wc(this,4)};h.ed=function(){this.status=500;this.responseText="";wc(this,4)};h.ge=function(){this.ed()};h.fe=function(){this.status=200;wc(this,1)};var wc=function(a,b){a.readyState=b;if(a.onreadystatechange)a.onreadystatechange()};var C=function(a,b){this.h=[];this.g=b;for(var c=!0,d=a.length-1;0<=d;d--){var e=a[d]|0;c&&e==b||(this.h[d]=e,c=!1)}},xc={},yc=function(a){if(-128<=a&&128>a){var b=xc[a];if(b)return b}b=new C([a|0],0>a?-1:0);-128<=a&&128>a&&(xc[a]=b);return b},F=function(a){if(isNaN(a)||!isFinite(a))return D;if(0>a)return E(F(-a));for(var b=[],c=1,d=0;a>=c;d++)b[d]=a/c|0,c*=4294967296;return new C(b,0)},zc=function(a,b){if(0==a.length)throw Error("number format error: empty string");b=b||10;if(2>b||36<b)throw Error("radix out of range: "+
b);if("-"==a.charAt(0))return E(zc(a.substring(1),b));if(0<=a.indexOf("-"))throw Error('number format error: interior "-" character');for(var c=F(Math.pow(b,8)),d=D,e=0;e<a.length;e+=8){var f=Math.min(8,a.length-e),g=parseInt(a.substring(e,e+f),b);8>f?(f=F(Math.pow(b,f)),d=d.multiply(f).add(F(g))):(d=d.multiply(c),d=d.add(F(g)))}return d},D=yc(0),Ac=yc(1),Bc=yc(16777216),Cc=function(a){if(-1==a.g)return-Cc(E(a));for(var b=0,c=1,d=0;d<a.h.length;d++)b+=Dc(a,d)*c,c*=4294967296;return b};
C.prototype.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(G(this))return"0";if(-1==this.g)return"-"+E(this).toString(a);for(var b=F(Math.pow(a,6)),c=this,d="";;){var e=Ec(c,b),c=Fc(c,e.multiply(b)),f=((0<c.h.length?c.h[0]:c.g)>>>0).toString(a),c=e;if(G(c))return f+d;for(;6>f.length;)f="0"+f;d=""+f+d}};
var H=function(a,b){return 0>b?0:b<a.h.length?a.h[b]:a.g},Dc=function(a,b){a=H(a,b);return 0<=a?a:4294967296+a},G=function(a){if(0!=a.g)return!1;for(var b=0;b<a.h.length;b++)if(0!=a.h[b])return!1;return!0};C.prototype.Eb=function(a){if(this.g!=a.g)return!1;for(var b=Math.max(this.h.length,a.h.length),c=0;c<b;c++)if(H(this,c)!=H(a,c))return!1;return!0};C.prototype.compare=function(a){a=Fc(this,a);return-1==a.g?-1:G(a)?0:1};
var E=function(a){for(var b=a.h.length,c=[],d=0;d<b;d++)c[d]=~a.h[d];return(new C(c,~a.g)).add(Ac)};C.prototype.add=function(a){for(var b=Math.max(this.h.length,a.h.length),c=[],d=0,e=0;e<=b;e++){var f=d+(H(this,e)&65535)+(H(a,e)&65535),g=(f>>>16)+(H(this,e)>>>16)+(H(a,e)>>>16),d=g>>>16,f=f&65535,g=g&65535;c[e]=g<<16|f}return new C(c,c[c.length-1]&-2147483648?-1:0)};var Fc=function(a,b){return a.add(E(b))};
C.prototype.multiply=function(a){if(G(this)||G(a))return D;if(-1==this.g)return-1==a.g?E(this).multiply(E(a)):E(E(this).multiply(a));if(-1==a.g)return E(this.multiply(E(a)));if(0>this.compare(Bc)&&0>a.compare(Bc))return F(Cc(this)*Cc(a));for(var b=this.h.length+a.h.length,c=[],d=0;d<2*b;d++)c[d]=0;for(d=0;d<this.h.length;d++)for(var e=0;e<a.h.length;e++){var f=H(this,d)>>>16,g=H(this,d)&65535,k=H(a,e)>>>16,q=H(a,e)&65535;c[2*d+2*e]+=g*q;Gc(c,2*d+2*e);c[2*d+2*e+1]+=f*q;Gc(c,2*d+2*e+1);c[2*d+2*e+1]+=
g*k;Gc(c,2*d+2*e+1);c[2*d+2*e+2]+=f*k;Gc(c,2*d+2*e+2)}for(d=0;d<b;d++)c[d]=c[2*d+1]<<16|c[2*d];for(d=b;d<2*b;d++)c[d]=0;return new C(c,0)};
var Gc=function(a,b){for(;(a[b]&65535)!=a[b];)a[b+1]+=a[b]>>>16,a[b]&=65535},Ec=function(a,b){if(G(b))throw Error("division by zero");if(G(a))return D;if(-1==a.g)return-1==b.g?Ec(E(a),E(b)):E(Ec(E(a),b));if(-1==b.g)return E(Ec(a,E(b)));if(30<a.h.length){if(-1==a.g||-1==b.g)throw Error("slowDivide_ only works with positive integers.");for(var c=Ac;0>=b.compare(a);)c=c.shiftLeft(1),b=b.shiftLeft(1);var d=Hc(c,1),e=Hc(b,1),f;b=Hc(b,2);for(c=Hc(c,2);!G(b);)f=e.add(b),0>=f.compare(a)&&(d=d.add(c),e=f),
b=Hc(b,1),c=Hc(c,1);return d}for(c=D;0<=a.compare(b);){d=Math.max(1,Math.floor(Cc(a)/Cc(b)));e=Math.ceil(Math.log(d)/Math.LN2);e=48>=e?1:Math.pow(2,e-48);f=F(d);for(var g=f.multiply(b);-1==g.g||0<g.compare(a);)d-=e,f=F(d),g=f.multiply(b);G(f)&&(f=Ac);c=c.add(f);a=Fc(a,g)}return c},Ic=function(a,b){for(var c=Math.max(a.h.length,b.h.length),d=[],e=0;e<c;e++)d[e]=H(a,e)|H(b,e);return new C(d,a.g|b.g)};
C.prototype.shiftLeft=function(a){var b=a>>5;a%=32;for(var c=this.h.length+b+(0<a?1:0),d=[],e=0;e<c;e++)d[e]=0<a?H(this,e-b)<<a|H(this,e-b-1)>>>32-a:H(this,e-b);return new C(d,this.g)};var Hc=function(a,b){var c=b>>5;b%=32;for(var d=a.h.length-c,e=[],f=0;f<d;f++)e[f]=0<b?H(a,f+c)>>>b|H(a,f+c+1)<<32-b:H(a,f+c);return new C(e,a.g)};var Jc=function(a,b){this.pb=a;this.na=b};Jc.prototype.Eb=function(a){return this.na==a.na&&this.pb.Eb(Wa(a.pb))};Jc.prototype.toString=ca;
var Mc=function(a){try{var b;if(b=0==a.lastIndexOf("[",0)){var c=a.length-1;b=0<=c&&a.indexOf("]",c)==c}return b?new Kc(a.substring(1,a.length-1)):new Lc(a)}catch(d){return null}},Lc=function(a){var b=D;if(a instanceof C){if(0!=a.g||0>a.compare(D)||0<a.compare(Nc))throw Error("The address does not look like an IPv4.");b=Wa(a)}else{if(!Oc.test(a))throw Error(a+" does not look like an IPv4 address.");var c=a.split(".");if(4!=c.length)throw Error(a+" does not look like an IPv4 address.");for(var d=0;d<
c.length;d++){var e;e=c[d];var f=Number(e);e=0==f&&/^[\s\xa0]*$/.test(e)?NaN:f;if(isNaN(e)||0>e||255<e||1!=c[d].length&&0==c[d].lastIndexOf("0",0))throw Error("In "+a+", octet "+d+" is not valid");e=F(e);b=Ic(b.shiftLeft(8),e)}}Jc.call(this,b,4)};t(Lc,Jc);var Oc=/^[0-9.]*$/,Nc=Fc(Ac.shiftLeft(32),Ac);Lc.prototype.toString=function(){if(this.Ca)return this.Ca;for(var a=Dc(this.pb,0),b=[],c=3;0<=c;c--)b[c]=String(a&255),a>>>=8;return this.Ca=b.join(".")};
var Kc=function(a){var b=D;if(a instanceof C){if(0!=a.g||0>a.compare(D)||0<a.compare(Pc))throw Error("The address does not look like a valid IPv6.");b=Wa(a)}else{if(!Qc.test(a))throw Error(a+" is not a valid IPv6 address.");var c=a.split(":");if(-1!=c[c.length-1].indexOf(".")){a=Dc(Wa((new Lc(c[c.length-1])).pb),0);var d=[];d.push((a>>>16&65535).toString(16));d.push((a&65535).toString(16));Ka(c,c.length-1);Qa(c,d);a=c.join(":")}d=a.split("::");if(2<d.length||1==d.length&&8!=c.length)throw Error(a+
" is not a valid IPv6 address.");if(1<d.length){c=d[0].split(":");d=d[1].split(":");1==c.length&&""==c[0]&&(c=[]);1==d.length&&""==d[0]&&(d=[]);var e=8-(c.length+d.length);if(1>e)c=[];else{for(var f=[],g=0;g<e;g++)f[g]="0";c=Oa(c,f,d)}}if(8!=c.length)throw Error(a+" is not a valid IPv6 address");for(d=0;d<c.length;d++){e=zc(c[d],16);if(0>e.compare(D)||0<e.compare(Rc))throw Error(c[d]+" in "+a+" is not a valid hextet.");b=Ic(b.shiftLeft(16),e)}}Jc.call(this,b,6)};t(Kc,Jc);
var Qc=/^([a-fA-F0-9]*:){2}[a-fA-F0-9:.]*$/,Rc=yc(65535),Pc=Fc(Ac.shiftLeft(128),Ac);Kc.prototype.toString=function(){if(this.Ca)return this.Ca;for(var a=[],b=3;0<=b;b--){var c=Dc(this.pb,b),d=c&65535;a.push((c>>>16).toString(16));a.push(d.toString(16))}for(var c=b=-1,e=d=0,f=0;f<a.length;f++)"0"==a[f]?(e++,-1==c&&(c=f),e>d&&(d=e,b=c)):(c=-1,e=0);0<d&&(b+d==a.length&&a.push(""),a.splice(b,d,""),0==b&&(a=[""].concat(a)));return this.Ca=a.join(":")};var Tc=function(){this.Wb="";this.Nd=Sc};Tc.prototype.Nb=!0;Tc.prototype.Ib=function(){return this.Wb};Tc.prototype.toString=function(){return"TrustedResourceUrl{"+this.Wb+"}"};var Sc={};var Vc=function(){this.ja="";this.Kd=Uc};Vc.prototype.Nb=!0;Vc.prototype.Ib=function(){return this.ja};Vc.prototype.toString=function(){return"SafeHtml{"+this.ja+"}"};var Wc=function(a){if(a instanceof Vc&&a.constructor===Vc&&a.Kd===Uc)return a.ja;za("expected object of type SafeHtml, got '"+a+"' of type "+m(a));return"type_error:SafeHtml"},Uc={};Vc.prototype.ne=function(a){this.ja=a;return this};!hb&&!z||z&&9<=Number(qb)||hb&&A("1.9.1");z&&A("9");var Yc=function(a,b){Ra(b,function(b,d){"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:Xc.hasOwnProperty(d)?a.setAttribute(Xc[d],b):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,b):a[d]=b})},Xc={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};var Zc=function(a,b,c){this.pe=c;this.Td=a;this.ye=b;this.Sb=0;this.Lb=null};Zc.prototype.get=function(){var a;0<this.Sb?(this.Sb--,a=this.Lb,this.Lb=a.next,a.next=null):a=this.Td();return a};Zc.prototype.put=function(a){this.ye(a);this.Sb<this.pe&&(this.Sb++,a.next=this.Lb,this.Lb=a)};var $c=function(a){l.setTimeout(function(){throw a;},0)},ad,bd=function(){var a=l.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!y("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,
a=r(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!y("Trident")&&!y("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Xc;c.Xc=null;a()}};return function(a){d.next={Xc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?
function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){l.setTimeout(a,0)}};var cd=function(){this.kc=this.Ja=null},ed=new Zc(function(){return new dd},function(a){a.reset()},100);cd.prototype.add=function(a,b){var c=ed.get();c.set(a,b);this.kc?this.kc.next=c:(w(!this.Ja),this.Ja=c);this.kc=c};cd.prototype.remove=function(){var a=null;this.Ja&&(a=this.Ja,this.Ja=this.Ja.next,this.Ja||(this.kc=null),a.next=null);return a};var dd=function(){this.next=this.scope=this.tc=null};dd.prototype.set=function(a,b){this.tc=a;this.scope=b;this.next=null};
dd.prototype.reset=function(){this.next=this.scope=this.tc=null};var jd=function(a,b){fd||gd();hd||(fd(),hd=!0);id.add(a,b)},fd,gd=function(){if(l.Promise&&l.Promise.resolve){var a=l.Promise.resolve(void 0);fd=function(){a.then(kd)}}else fd=function(){var a=kd;!p(l.setImmediate)||l.Window&&l.Window.prototype&&!y("Edge")&&l.Window.prototype.setImmediate==l.setImmediate?(ad||(ad=bd()),ad(a)):l.setImmediate(a)}},hd=!1,id=new cd,kd=function(){for(var a;a=id.remove();){try{a.tc.call(a.scope)}catch(b){$c(b)}ed.put(a)}hd=!1};var ld=function(a){a.prototype.then=a.prototype.then;a.prototype.$goog_Thenable=!0},md=function(a){if(!a)return!1;try{return!!a.$goog_Thenable}catch(b){return!1}};var I=function(a,b){this.F=0;this.ka=void 0;this.Ma=this.fa=this.o=null;this.Jb=this.sc=!1;if(a!=ba)try{var c=this;a.call(b,function(a){nd(c,2,a)},function(a){if(!(a instanceof od))try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(e){}nd(c,3,a)})}catch(d){nd(this,3,d)}},pd=function(){this.next=this.context=this.Sa=this.Ea=this.child=null;this.ib=!1};pd.prototype.reset=function(){this.context=this.Sa=this.Ea=this.child=null;this.ib=!1};
var qd=new Zc(function(){return new pd},function(a){a.reset()},100),rd=function(a,b,c){var d=qd.get();d.Ea=a;d.Sa=b;d.context=c;return d},J=function(a){if(a instanceof I)return a;var b=new I(ba);nd(b,2,a);return b},K=function(a){return new I(function(b,c){c(a)})},td=function(a,b,c){sd(a,b,c,null)||jd(ka(b,a))},ud=function(a){return new I(function(b){var c=a.length,d=[];if(c)for(var e=function(a,e,f){c--;d[a]=e?{be:!0,value:f}:{be:!1,reason:f};0==c&&b(d)},f=0,g;f<a.length;f++)g=a[f],td(g,ka(e,f,!0),
ka(e,f,!1));else b(d)})};I.prototype.then=function(a,b,c){null!=a&&Ca(a,"opt_onFulfilled should be a function.");null!=b&&Ca(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return vd(this,p(a)?a:null,p(b)?b:null,c)};ld(I);var xd=function(a,b){b=rd(b,b,void 0);b.ib=!0;wd(a,b);return a};I.prototype.l=function(a,b){return vd(this,null,a,b)};I.prototype.cancel=function(a){0==this.F&&jd(function(){var b=new od(a);yd(this,b)},this)};
var yd=function(a,b){if(0==a.F)if(a.o){var c=a.o;if(c.fa){for(var d=0,e=null,f=null,g=c.fa;g&&(g.ib||(d++,g.child==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(0==c.F&&1==d?yd(c,b):(f?(d=f,w(c.fa),w(null!=d),d.next==c.Ma&&(c.Ma=d),d.next=d.next.next):zd(c),Ad(c,e,3,b)))}a.o=null}else nd(a,3,b)},wd=function(a,b){a.fa||2!=a.F&&3!=a.F||Bd(a);w(null!=b.Ea);a.Ma?a.Ma.next=b:a.fa=b;a.Ma=b},vd=function(a,b,c,d){var e=rd(null,null,null);e.child=new I(function(a,g){e.Ea=b?function(c){try{var e=b.call(d,c);a(e)}catch(ra){g(ra)}}:
a;e.Sa=c?function(b){try{var e=c.call(d,b);void 0===e&&b instanceof od?g(b):a(e)}catch(ra){g(ra)}}:g});e.child.o=a;wd(a,e);return e.child};I.prototype.He=function(a){w(1==this.F);this.F=0;nd(this,2,a)};I.prototype.Ie=function(a){w(1==this.F);this.F=0;nd(this,3,a)};
var nd=function(a,b,c){0==a.F&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.F=1,sd(c,a.He,a.Ie,a)||(a.ka=c,a.F=b,a.o=null,Bd(a),3!=b||c instanceof od||Cd(a,c)))},sd=function(a,b,c,d){if(a instanceof I)return null!=b&&Ca(b,"opt_onFulfilled should be a function."),null!=c&&Ca(c,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),wd(a,rd(b||ba,c||null,d)),!0;if(md(a))return a.then(b,c,d),!0;if(ha(a))try{var e=a.then;if(p(e))return Dd(a,
e,b,c,d),!0}catch(f){return c.call(d,f),!0}return!1},Dd=function(a,b,c,d,e){var f=!1,g=function(a){f||(f=!0,c.call(e,a))},k=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,g,k)}catch(q){k(q)}},Bd=function(a){a.sc||(a.sc=!0,jd(a.Xd,a))},zd=function(a){var b=null;a.fa&&(b=a.fa,a.fa=b.next,b.next=null);a.fa||(a.Ma=null);null!=b&&w(null!=b.Ea);return b};I.prototype.Xd=function(){for(var a;a=zd(this);)Ad(this,a,this.F,this.ka);this.sc=!1};
var Ad=function(a,b,c,d){if(3==c&&b.Sa&&!b.ib)for(;a&&a.Jb;a=a.o)a.Jb=!1;if(b.child)b.child.o=null,Ed(b,c,d);else try{b.ib?b.Ea.call(b.context):Ed(b,c,d)}catch(e){Fd.call(null,e)}qd.put(b)},Ed=function(a,b,c){2==b?a.Ea.call(a.context,c):a.Sa&&a.Sa.call(a.context,c)},Cd=function(a,b){a.Jb=!0;jd(function(){a.Jb&&Fd.call(null,b)})},Fd=$c,od=function(a){u.call(this,a)};t(od,u);od.prototype.name="cancel";/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
var Gd=function(a,b){this.bc=[];this.nd=a;this.Zc=b||null;this.nb=this.Qa=!1;this.ka=void 0;this.Nc=this.Sc=this.nc=!1;this.ic=0;this.o=null;this.oc=0};Gd.prototype.cancel=function(a){if(this.Qa)this.ka instanceof Gd&&this.ka.cancel();else{if(this.o){var b=this.o;delete this.o;a?b.cancel(a):(b.oc--,0>=b.oc&&b.cancel())}this.nd?this.nd.call(this.Zc,this):this.Nc=!0;this.Qa||Hd(this,new Id)}};Gd.prototype.Yc=function(a,b){this.nc=!1;Jd(this,a,b)};
var Jd=function(a,b,c){a.Qa=!0;a.ka=c;a.nb=!b;Kd(a)},Md=function(a){if(a.Qa){if(!a.Nc)throw new Ld;a.Nc=!1}};Gd.prototype.callback=function(a){Md(this);Nd(a);Jd(this,!0,a)};
var Hd=function(a,b){Md(a);Nd(b);Jd(a,!1,b)},Nd=function(a){w(!(a instanceof Gd),"An execution sequence may not be initiated with a blocking Deferred.")},Rd=function(a){var b=Od("https://apis.google.com/js/client.js?onload="+Pd);Qd(b,null,a,void 0)},Qd=function(a,b,c,d){w(!a.Sc,"Blocking Deferreds can not be re-used");a.bc.push([b,c,d]);a.Qa&&Kd(a)};Gd.prototype.then=function(a,b,c){var d,e,f=new I(function(a,b){d=a;e=b});Qd(this,d,function(a){a instanceof Id?f.cancel():e(a)});return f.then(a,b,c)};
ld(Gd);
var Sd=function(a){return Ga(a.bc,function(a){return p(a[1])})},Kd=function(a){if(a.ic&&a.Qa&&Sd(a)){var b=a.ic,c=Td[b];c&&(l.clearTimeout(c.ob),delete Td[b]);a.ic=0}a.o&&(a.o.oc--,delete a.o);for(var b=a.ka,d=c=!1;a.bc.length&&!a.nc;){var e=a.bc.shift(),f=e[0],g=e[1],e=e[2];if(f=a.nb?g:f)try{var k=f.call(e||a.Zc,b);void 0!==k&&(a.nb=a.nb&&(k==b||k instanceof Error),a.ka=b=k);if(md(b)||"function"===typeof l.Promise&&b instanceof l.Promise)d=!0,a.nc=!0}catch(q){b=q,a.nb=!0,Sd(a)||(c=!0)}}a.ka=b;d&&
(k=r(a.Yc,a,!0),d=r(a.Yc,a,!1),b instanceof Gd?(Qd(b,k,d),b.Sc=!0):b.then(k,d));c&&(b=new Ud(b),Td[b.ob]=b,a.ic=b.ob)},Ld=function(){u.call(this)};t(Ld,u);Ld.prototype.message="Deferred has already fired";Ld.prototype.name="AlreadyCalledError";var Id=function(){u.call(this)};t(Id,u);Id.prototype.message="Deferred was canceled";Id.prototype.name="CanceledError";var Ud=function(a){this.ob=l.setTimeout(r(this.Ge,this),0);this.J=a};
Ud.prototype.Ge=function(){w(Td[this.ob],"Cannot throw an error that is not scheduled.");delete Td[this.ob];throw this.J;};var Td={};var Od=function(a){var b=new Tc;b.Wb=a;return Vd(b)},Vd=function(a){var b={},c=b.document||document,d;a instanceof Tc&&a.constructor===Tc&&a.Nd===Sc?d=a.Wb:(za("expected object of type TrustedResourceUrl, got '"+a+"' of type "+m(a)),d="type_error:TrustedResourceUrl");var e=document.createElement("SCRIPT");a={vd:e,xb:void 0};var f=new Gd(Wd,a),g=null,k=null!=b.timeout?b.timeout:5E3;0<k&&(g=window.setTimeout(function(){Xd(e,!0);Hd(f,new Yd(1,"Timeout reached for loading script "+d))},k),a.xb=g);e.onload=
e.onreadystatechange=function(){e.readyState&&"loaded"!=e.readyState&&"complete"!=e.readyState||(Xd(e,b.Oe||!1,g),f.callback(null))};e.onerror=function(){Xd(e,!0,g);Hd(f,new Yd(0,"Error while loading script "+d))};a=b.attributes||{};Ya(a,{type:"text/javascript",charset:"UTF-8",src:d});Yc(e,a);Zd(c).appendChild(e);return f},Zd=function(a){var b;return(b=(a||document).getElementsByTagName("HEAD"))&&0!=b.length?b[0]:a.documentElement},Wd=function(){if(this&&this.vd){var a=this.vd;a&&"SCRIPT"==a.tagName&&
Xd(a,!0,this.xb)}},Xd=function(a,b,c){null!=c&&l.clearTimeout(c);a.onload=ba;a.onerror=ba;a.onreadystatechange=ba;b&&window.setTimeout(function(){a&&a.parentNode&&a.parentNode.removeChild(a)},0)},Yd=function(a,b){var c="Jsloader error (code #"+a+")";b&&(c+=": "+b);u.call(this,c);this.code=a};t(Yd,u);var $d=function(){yb.call(this);this.Y=new Fb(this);this.Qd=this;this.Cc=null};t($d,yb);$d.prototype[Bb]=!0;h=$d.prototype;h.addEventListener=function(a,b,c,d){Lb(this,a,b,c,d)};h.removeEventListener=function(a,b,c,d){Ub(this,a,b,c,d)};
h.dispatchEvent=function(a){ae(this);var b,c=this.Cc;if(c){b=[];for(var d=1;c;c=c.Cc)b.push(c),w(1E3>++d,"infinite loop")}c=this.Qd;d=a.type||a;if(n(a))a=new zb(a,c);else if(a instanceof zb)a.target=a.target||c;else{var e=a;a=new zb(d,c);Ya(a,e)}var e=!0,f;if(b)for(var g=b.length-1;!a.Va&&0<=g;g--)f=a.currentTarget=b[g],e=be(f,d,!0,a)&&e;a.Va||(f=a.currentTarget=c,e=be(f,d,!0,a)&&e,a.Va||(e=be(f,d,!1,a)&&e));if(b)for(g=0;!a.Va&&g<b.length;g++)f=a.currentTarget=b[g],e=be(f,d,!1,a)&&e;return e};
h.Oa=function(){$d.Pc.Oa.call(this);if(this.Y){var a=this.Y,b=0,c;for(c in a.w){for(var d=a.w[c],e=0;e<d.length;e++)++b,Eb(d[e]);delete a.w[c];a.yb--}}this.Cc=null};h.listen=function(a,b,c,d){ae(this);return this.Y.add(String(a),b,!1,c,d)};
var Tb=function(a,b,c,d,e){a.Y.add(String(b),c,!0,d,e)},be=function(a,b,c,d){b=a.Y.w[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.$a&&g.Cb==c){var k=g.listener,q=g.Kb||g.src;g.Bb&&Hb(a.Y,g);e=!1!==k.call(q,d)&&e}}return e&&0!=d.ud};$d.prototype.uc=function(a,b,c,d){return this.Y.uc(String(a),b,c,d)};var ae=function(a){w(a.Y,"Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")};var ce="StopIteration"in l?l.StopIteration:{message:"StopIteration",stack:""},de=function(){};de.prototype.next=function(){throw ce;};de.prototype.Pd=function(){return this};var ee=function(a,b){this.Z={};this.s=[];this.na=this.i=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.addAll(a)};h=ee.prototype;h.dd=function(){return this.i};h.T=function(){fe(this);for(var a=[],b=0;b<this.s.length;b++)a.push(this.Z[this.s[b]]);return a};h.ha=function(){fe(this);return this.s.concat()};h.jb=function(a){return ge(this.Z,a)};
h.Eb=function(a,b){if(this===a)return!0;if(this.i!=a.dd())return!1;b=b||he;fe(this);for(var c,d=0;c=this.s[d];d++)if(!b(this.get(c),a.get(c)))return!1;return!0};var he=function(a,b){return a===b};ee.prototype.remove=function(a){return ge(this.Z,a)?(delete this.Z[a],this.i--,this.na++,this.s.length>2*this.i&&fe(this),!0):!1};
var fe=function(a){if(a.i!=a.s.length){for(var b=0,c=0;b<a.s.length;){var d=a.s[b];ge(a.Z,d)&&(a.s[c++]=d);b++}a.s.length=c}if(a.i!=a.s.length){for(var e={},c=b=0;b<a.s.length;)d=a.s[b],ge(e,d)||(a.s[c++]=d,e[d]=1),b++;a.s.length=c}};h=ee.prototype;h.get=function(a,b){return ge(this.Z,a)?this.Z[a]:b};h.set=function(a,b){ge(this.Z,a)||(this.i++,this.s.push(a),this.na++);this.Z[a]=b};
h.addAll=function(a){var b;a instanceof ee?(b=a.ha(),a=a.T()):(b=Ta(a),a=Sa(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};h.forEach=function(a,b){for(var c=this.ha(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};h.clone=function(){return new ee(this)};h.Pd=function(a){fe(this);var b=0,c=this.na,d=this,e=new de;e.next=function(){if(c!=d.na)throw Error("The map has changed since the iterator was created");if(b>=d.s.length)throw ce;var e=d.s[b++];return a?e:d.Z[e]};return e};
var ge=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};var ie=function(a){if(a.T&&"function"==typeof a.T)return a.T();if(n(a))return a.split("");if(fa(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Sa(a)},je=function(a){if(a.ha&&"function"==typeof a.ha)return a.ha();if(!a.T||"function"!=typeof a.T){if(fa(a)||n(a)){var b=[];a=a.length;for(var c=0;c<a;c++)b.push(c);return b}return Ta(a)}},ke=function(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(fa(a)||n(a))x(a,b,void 0);else for(var c=je(a),d=ie(a),e=
d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)};var le=function(a,b,c,d,e){this.reset(a,b,c,d,e)};le.prototype.ad=null;var me=0;le.prototype.reset=function(a,b,c,d,e){"number"==typeof e||me++;d||la();this.rb=a;this.re=b;delete this.ad};le.prototype.yd=function(a){this.rb=a};var ne=function(a){this.se=a;this.fd=this.pc=this.rb=this.o=null},oe=function(a,b){this.name=a;this.value=b};oe.prototype.toString=function(){return this.name};var pe=new oe("SEVERE",1E3),qe=new oe("CONFIG",700),re=new oe("FINE",500);ne.prototype.getParent=function(){return this.o};ne.prototype.yd=function(a){this.rb=a};var se=function(a){if(a.rb)return a.rb;if(a.o)return se(a.o);za("Root logger has no level set.");return null};
ne.prototype.log=function(a,b,c){if(a.value>=se(this).value)for(p(b)&&(b=b()),a=new le(a,String(b),this.se),c&&(a.ad=c),c="log:"+a.re,l.console&&(l.console.timeStamp?l.console.timeStamp(c):l.console.markTimeline&&l.console.markTimeline(c)),l.msWriteProfilerMark&&l.msWriteProfilerMark(c),c=this;c;){b=c;var d=a;if(b.fd)for(var e=0,f;f=b.fd[e];e++)f(d);c=c.getParent()}};
var te={},ue=null,ve=function(a){ue||(ue=new ne(""),te[""]=ue,ue.yd(qe));var b;if(!(b=te[a])){b=new ne(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=ve(a.substr(0,c));c.pc||(c.pc={});c.pc[d]=b;b.o=c;te[a]=b}return b};var L=function(a,b){a&&a.log(re,b,void 0)};var we=function(a,b,c){if(p(a))c&&(a=r(a,c));else if(a&&"function"==typeof a.handleEvent)a=r(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(b)?-1:l.setTimeout(a,b||0)},xe=function(a){var b=null;return(new I(function(c,d){b=we(function(){c(void 0)},a);-1==b&&d(Error("Failed to schedule timer."))})).l(function(a){l.clearTimeout(b);throw a;})};var ye=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,ze=function(a,b){if(a){a=a.split("&");for(var c=0;c<a.length;c++){var d=a[c].indexOf("="),e,f=null;0<=d?(e=a[c].substring(0,d),f=a[c].substring(d+1)):e=a[c];b(e,f?decodeURIComponent(f.replace(/\+/g," ")):"")}}};var M=function(a){$d.call(this);this.headers=new ee;this.mc=a||null;this.pa=!1;this.lc=this.a=null;this.qb=this.ld=this.Rb="";this.Ba=this.xc=this.Ob=this.rc=!1;this.fb=0;this.hc=null;this.td="";this.jc=this.xe=this.Gd=!1};t(M,$d);var Ae=M.prototype,Be=ve("goog.net.XhrIo");Ae.P=Be;var Ce=/^https?$/i,De=["POST","PUT"];
M.prototype.send=function(a,b,c,d){if(this.a)throw Error("[goog.net.XhrIo] Object is active with another request="+this.Rb+"; newUri="+a);b=b?b.toUpperCase():"GET";this.Rb=a;this.qb="";this.ld=b;this.rc=!1;this.pa=!0;this.a=this.mc?this.mc.kb():rc.kb();this.lc=this.mc?qc(this.mc):qc(rc);this.a.onreadystatechange=r(this.qd,this);this.xe&&"onprogress"in this.a&&(this.a.onprogress=r(function(a){this.pd(a,!0)},this),this.a.upload&&(this.a.upload.onprogress=r(this.pd,this)));try{L(this.P,Ee(this,"Opening Xhr")),
this.xc=!0,this.a.open(b,String(a),!0),this.xc=!1}catch(f){L(this.P,Ee(this,"Error opening Xhr: "+f.message));this.J(5,f);return}a=c||"";var e=this.headers.clone();d&&ke(d,function(a,b){e.set(b,a)});d=Ia(e.ha());c=l.FormData&&a instanceof l.FormData;!Ja(De,b)||d||c||e.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");e.forEach(function(a,b){this.a.setRequestHeader(b,a)},this);this.td&&(this.a.responseType=this.td);"withCredentials"in this.a&&this.a.withCredentials!==this.Gd&&(this.a.withCredentials=
this.Gd);try{Fe(this),0<this.fb&&(this.jc=Ge(this.a),L(this.P,Ee(this,"Will abort after "+this.fb+"ms if incomplete, xhr2 "+this.jc)),this.jc?(this.a.timeout=this.fb,this.a.ontimeout=r(this.xb,this)):this.hc=we(this.xb,this.fb,this)),L(this.P,Ee(this,"Sending request")),this.Ob=!0,this.a.send(a),this.Ob=!1}catch(f){L(this.P,Ee(this,"Send error: "+f.message)),this.J(5,f)}};var Ge=function(a){return z&&A(9)&&ga(a.timeout)&&void 0!==a.ontimeout},Ha=function(a){return"content-type"==a.toLowerCase()};
M.prototype.xb=function(){"undefined"!=typeof aa&&this.a&&(this.qb="Timed out after "+this.fb+"ms, aborting",L(this.P,Ee(this,this.qb)),this.dispatchEvent("timeout"),this.abort(8))};M.prototype.J=function(a,b){this.pa=!1;this.a&&(this.Ba=!0,this.a.abort(),this.Ba=!1);this.qb=b;He(this);Ie(this)};var He=function(a){a.rc||(a.rc=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))};
M.prototype.abort=function(){this.a&&this.pa&&(L(this.P,Ee(this,"Aborting")),this.pa=!1,this.Ba=!0,this.a.abort(),this.Ba=!1,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Ie(this))};M.prototype.Oa=function(){this.a&&(this.pa&&(this.pa=!1,this.Ba=!0,this.a.abort(),this.Ba=!1),Ie(this,!0));M.Pc.Oa.call(this)};M.prototype.qd=function(){this.isDisposed()||(this.xc||this.Ob||this.Ba?Je(this):this.ve())};M.prototype.ve=function(){Je(this)};
var Je=function(a){if(a.pa&&"undefined"!=typeof aa)if(a.lc[1]&&4==Ke(a)&&2==Le(a))L(a.P,Ee(a,"Local request error detected and ignored"));else if(a.Ob&&4==Ke(a))we(a.qd,0,a);else if(a.dispatchEvent("readystatechange"),4==Ke(a)){L(a.P,Ee(a,"Request complete"));a.pa=!1;try{var b=Le(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=String(a.Rb).match(ye)[1]||null;if(!f&&l.self&&l.self.location)var g=l.self.location.protocol,
f=g.substr(0,g.length-1);e=!Ce.test(f?f.toLowerCase():"")}d=e}if(d)a.dispatchEvent("complete"),a.dispatchEvent("success");else{var k;try{k=2<Ke(a)?a.a.statusText:""}catch(q){L(a.P,"Can not get status: "+q.message),k=""}a.qb=k+" ["+Le(a)+"]";He(a)}}finally{Ie(a)}}};M.prototype.pd=function(a,b){w("progress"===a.type,"goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");this.dispatchEvent(Me(a,"progress"));this.dispatchEvent(Me(a,b?"downloadprogress":"uploadprogress"))};
var Me=function(a,b){return{type:b,lengthComputable:a.lengthComputable,loaded:a.loaded,total:a.total}},Ie=function(a,b){if(a.a){Fe(a);var c=a.a,d=a.lc[0]?ba:null;a.a=null;a.lc=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(e){(a=a.P)&&a.log(pe,"Problem encountered resetting onreadystatechange: "+e.message,void 0)}}},Fe=function(a){a.a&&a.jc&&(a.a.ontimeout=null);ga(a.hc)&&(l.clearTimeout(a.hc),a.hc=null)},Ke=function(a){return a.a?a.a.readyState:0},Le=function(a){try{return 2<Ke(a)?
a.a.status:-1}catch(b){return-1}},Ne=function(a){try{return a.a?a.a.responseText:""}catch(b){return L(a.P,"Can not get responseText: "+b.message),""}},Ee=function(a,b){return b+" ["+a.ld+" "+a.Rb+" "+Le(a)+"]"};var Oe=function(a,b){this.ga=this.Ia=this.la="";this.Ua=null;this.Aa=this.ra="";this.M=this.oe=!1;var c;a instanceof Oe?(this.M=void 0!==b?b:a.M,Pe(this,a.la),c=a.Ia,N(this),this.Ia=c,Qe(this,a.ga),Re(this,a.Ua),Se(this,a.ra),Te(this,a.aa.clone()),a=a.Aa,N(this),this.Aa=a):a&&(c=String(a).match(ye))?(this.M=!!b,Pe(this,c[1]||"",!0),a=c[2]||"",N(this),this.Ia=Ue(a),Qe(this,c[3]||"",!0),Re(this,c[4]),Se(this,c[5]||"",!0),Te(this,c[6]||"",!0),a=c[7]||"",N(this),this.Aa=Ue(a)):(this.M=!!b,this.aa=new O(null,
0,this.M))};Oe.prototype.toString=function(){var a=[],b=this.la;b&&a.push(Ve(b,We,!0),":");var c=this.ga;if(c||"file"==b)a.push("//"),(b=this.Ia)&&a.push(Ve(b,We,!0),"@"),a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.Ua,null!=c&&a.push(":",String(c));if(c=this.ra)this.ga&&"/"!=c.charAt(0)&&a.push("/"),a.push(Ve(c,"/"==c.charAt(0)?Xe:Ye,!0));(c=this.aa.toString())&&a.push("?",c);(c=this.Aa)&&a.push("#",Ve(c,Ze));return a.join("")};
Oe.prototype.resolve=function(a){var b=this.clone(),c=!!a.la;c?Pe(b,a.la):c=!!a.Ia;if(c){var d=a.Ia;N(b);b.Ia=d}else c=!!a.ga;c?Qe(b,a.ga):c=null!=a.Ua;d=a.ra;if(c)Re(b,a.Ua);else if(c=!!a.ra){if("/"!=d.charAt(0))if(this.ga&&!this.ra)d="/"+d;else{var e=b.ra.lastIndexOf("/");-1!=e&&(d=b.ra.substr(0,e+1)+d)}e=d;if(".."==e||"."==e)d="";else if(v(e,"./")||v(e,"/.")){for(var d=0==e.lastIndexOf("/",0),e=e.split("/"),f=[],g=0;g<e.length;){var k=e[g++];"."==k?d&&g==e.length&&f.push(""):".."==k?((1<f.length||
1==f.length&&""!=f[0])&&f.pop(),d&&g==e.length&&f.push("")):(f.push(k),d=!0)}d=f.join("/")}else d=e}c?Se(b,d):c=""!==a.aa.toString();c?Te(b,Ue(a.aa.toString())):c=!!a.Aa;c&&(a=a.Aa,N(b),b.Aa=a);return b};Oe.prototype.clone=function(){return new Oe(this)};
var Pe=function(a,b,c){N(a);a.la=c?Ue(b,!0):b;a.la&&(a.la=a.la.replace(/:$/,""))},Qe=function(a,b,c){N(a);a.ga=c?Ue(b,!0):b},Re=function(a,b){N(a);if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.Ua=b}else a.Ua=null},Se=function(a,b,c){N(a);a.ra=c?Ue(b,!0):b},Te=function(a,b,c){N(a);b instanceof O?(a.aa=b,a.aa.Mc(a.M)):(c||(b=Ve(b,$e)),a.aa=new O(b,0,a.M))},P=function(a,b,c){N(a);a.aa.set(b,c)},N=function(a){if(a.oe)throw Error("Tried to modify a read-only Uri");};
Oe.prototype.Mc=function(a){this.M=a;this.aa&&this.aa.Mc(a);return this};
var af=function(a){return a instanceof Oe?a.clone():new Oe(a,void 0)},bf=function(a,b){var c=new Oe(null,void 0);Pe(c,"https");a&&Qe(c,a);b&&Se(c,b);return c},Ue=function(a,b){return a?b?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""},Ve=function(a,b,c){return n(a)?(a=encodeURI(a).replace(b,cf),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null},cf=function(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)},We=/[#\/\?@]/g,Ye=/[\#\?:]/g,Xe=/[\#\?]/g,$e=/[\#\?@]/g,
Ze=/#/g,O=function(a,b,c){this.i=this.j=null;this.I=a||null;this.M=!!c},df=function(a){a.j||(a.j=new ee,a.i=0,a.I&&ze(a.I,function(b,c){a.add(decodeURIComponent(b.replace(/\+/g," ")),c)}))},ff=function(a){var b=je(a);if("undefined"==typeof b)throw Error("Keys are undefined");var c=new O(null,0,void 0);a=ie(a);for(var d=0;d<b.length;d++){var e=b[d],f=a[d];ea(f)?ef(c,e,f):c.add(e,f)}return c};h=O.prototype;h.dd=function(){df(this);return this.i};
h.add=function(a,b){df(this);this.I=null;a=this.K(a);var c=this.j.get(a);c||this.j.set(a,c=[]);c.push(b);this.i=Aa(this.i)+1;return this};h.remove=function(a){df(this);a=this.K(a);return this.j.jb(a)?(this.I=null,this.i=Aa(this.i)-this.j.get(a).length,this.j.remove(a)):!1};h.jb=function(a){df(this);a=this.K(a);return this.j.jb(a)};h.ha=function(){df(this);for(var a=this.j.T(),b=this.j.ha(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};
h.T=function(a){df(this);var b=[];if(n(a))this.jb(a)&&(b=Na(b,this.j.get(this.K(a))));else{a=this.j.T();for(var c=0;c<a.length;c++)b=Na(b,a[c])}return b};h.set=function(a,b){df(this);this.I=null;a=this.K(a);this.jb(a)&&(this.i=Aa(this.i)-this.j.get(a).length);this.j.set(a,[b]);this.i=Aa(this.i)+1;return this};h.get=function(a,b){a=a?this.T(a):[];return 0<a.length?String(a[0]):b};var ef=function(a,b,c){a.remove(b);0<c.length&&(a.I=null,a.j.set(a.K(b),Pa(c)),a.i=Aa(a.i)+c.length)};
O.prototype.toString=function(){if(this.I)return this.I;if(!this.j)return"";for(var a=[],b=this.j.ha(),c=0;c<b.length;c++)for(var d=b[c],e=encodeURIComponent(String(d)),d=this.T(d),f=0;f<d.length;f++){var g=e;""!==d[f]&&(g+="="+encodeURIComponent(String(d[f])));a.push(g)}return this.I=a.join("&")};O.prototype.clone=function(){var a=new O;a.I=this.I;this.j&&(a.j=this.j.clone(),a.i=this.i);return a};O.prototype.K=function(a){a=String(a);this.M&&(a=a.toLowerCase());return a};
O.prototype.Mc=function(a){a&&!this.M&&(df(this),this.I=null,this.j.forEach(function(a,c){var b=c.toLowerCase();c!=b&&(this.remove(c),ef(this,b,a))},this));this.M=a};var hf=function(){var a=gf();return z&&!!qb&&11==qb||/Edge\/\d+/.test(a)},jf=function(){return l.window&&l.window.location.href||""},kf=function(a,b){var c=[],d;for(d in a)d in b?typeof a[d]!=typeof b[d]?c.push(d):ea(a[d])?Va(a[d],b[d])||c.push(d):"object"==typeof a[d]&&null!=a[d]&&null!=b[d]?0<kf(a[d],b[d]).length&&c.push(d):a[d]!==b[d]&&c.push(d):c.push(d);for(d in b)d in a||c.push(d);return c},mf=function(){var a;a=gf();a="Chrome"!=lf(a)?null:(a=a.match(/\sChrome\/(\d+)/i))&&2==a.length?parseInt(a[1],
10):null;return a&&30>a?!1:!z||!qb||9<qb},nf=function(a){(a||l.window).close()},of=function(a,b,c){var d=Math.floor(1E9*Math.random()).toString();b=b||500;c=c||600;var e=(window.screen.availHeight-c)/2,f=(window.screen.availWidth-b)/2;b={width:b,height:c,top:0<e?e:0,left:0<f?f:0,location:!0,resizable:!0,statusbar:!0,toolbar:!1};d&&(b.target=d);"Firefox"==lf(gf())&&(a=a||"http://localhost",b.scrollbars=!0);var g;c=a||"about:blank";(d=b)||(d={});a=window;b=c instanceof B?c:gc("undefined"!=typeof c.href?
c.href:String(c));c=d.target||c.target;e=[];for(g in d)switch(g){case "width":case "height":case "top":case "left":e.push(g+"="+d[g]);break;case "target":case "noreferrer":break;default:e.push(g+"="+(d[g]?1:0))}g=e.join(",");(y("iPhone")&&!y("iPod")&&!y("iPad")||y("iPad")||y("iPod"))&&a.navigator&&a.navigator.standalone&&c&&"_self"!=c?(g=a.document.createElement("A"),"undefined"!=typeof HTMLAnchorElement&&"undefined"!=typeof Location&&"undefined"!=typeof Element&&(e=g&&(g instanceof HTMLAnchorElement||
!(g instanceof Location||g instanceof Element)),f=ha(g)?g.constructor.displayName||g.constructor.name||Object.prototype.toString.call(g):void 0===g?"undefined":null===g?"null":typeof g,w(e,"Argument is not a HTMLAnchorElement (or a non-Element mock); got: %s",f)),b=b instanceof B?b:gc(b),g.href=dc(b),g.setAttribute("target",c),d.noreferrer&&g.setAttribute("rel","noreferrer"),d=document.createEvent("MouseEvent"),d.initMouseEvent("click",!0,!0,a,1),g.dispatchEvent(d),g={}):d.noreferrer?(g=a.open("",
c,g),d=dc(b),g&&(gb&&v(d,";")&&(d="'"+d.replace(/'/g,"%27")+"'"),g.opener=null,a=new ac,a.fc="b/12014412, meta tag with sanitized URL",va.test(d)&&(-1!=d.indexOf("&")&&(d=d.replace(oa,"&amp;")),-1!=d.indexOf("<")&&(d=d.replace(pa,"&lt;")),-1!=d.indexOf(">")&&(d=d.replace(qa,"&gt;")),-1!=d.indexOf('"')&&(d=d.replace(sa,"&quot;")),-1!=d.indexOf("'")&&(d=d.replace(ta,"&#39;")),-1!=d.indexOf("\x00")&&(d=d.replace(ua,"&#0;"))),d='<META HTTP-EQUIV="refresh" content="0; url='+d+'">',Ba(bc(a),"must provide justification"),
w(!/^[\s\xa0]*$/.test(bc(a)),"must provide non-empty justification"),g.document.write(Wc((new Vc).ne(d))),g.document.close())):g=a.open(dc(b),c,g);if(g)try{g.focus()}catch(k){}return g},pf=function(a){return new I(function(b){var c=function(){xe(2E3).then(function(){if(!a||a.closed)b();else return c()})};return c()})},qf=function(){var a=null;return(new I(function(b){"complete"==l.document.readyState?b():(a=function(){b()},Sb(window,"load",a))})).l(function(b){Ub(window,"load",a);throw b;})},rf=function(a){switch(a||
l.navigator&&l.navigator.product||""){case "ReactNative":return"ReactNative";default:return"undefined"!==typeof l.process?"Node":"Browser"}},sf=function(){var a=rf();return"ReactNative"===a||"Node"===a},lf=function(a){var b=a.toLowerCase();if(v(b,"opera/")||v(b,"opr/")||v(b,"opios/"))return"Opera";if(v(b,"iemobile"))return"IEMobile";if(v(b,"msie")||v(b,"trident/"))return"IE";if(v(b,"edge/"))return"Edge";if(v(b,"firefox/"))return"Firefox";if(v(b,"silk/"))return"Silk";if(v(b,"blackberry"))return"Blackberry";
if(v(b,"webos"))return"Webos";if(!v(b,"safari/")||v(b,"chrome/")||v(b,"crios/")||v(b,"android"))if(!v(b,"chrome/")&&!v(b,"crios/")||v(b,"edge/")){if(v(b,"android"))return"Android";if((a=a.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/))&&2==a.length)return a[1]}else return"Chrome";else return"Safari";return"Other"},tf=function(a){var b=rf(void 0);return("Browser"===b?lf(gf()):b)+"/JsCore/"+a},gf=function(){return l.navigator&&l.navigator.userAgent||""},uf=function(a){a=a.split(".");for(var b=l,c=0;c<a.length&&
"object"==typeof b&&null!=b;c++)b=b[a[c]];c!=a.length&&(b=void 0);return b},wf=function(){var a;if(!(a=!l.location||!l.location.protocol||"http:"!=l.location.protocol&&"https:"!=l.location.protocol||sf())){var b;a:{try{var c=l.localStorage,d=vf();if(c){c.setItem(d,"1");c.removeItem(d);b=hf()?!!l.indexedDB:!0;break a}}catch(e){}b=!1}a=!b}return!a},xf=function(a){a=a||gf();var b=(a||gf()).toLowerCase();return b.match(/android/)||b.match(/webos/)||b.match(/iphone|ipad|ipod/)||b.match(/blackberry/)||
b.match(/windows phone/)||b.match(/iemobile/)||"Firefox"==lf(a)?!1:!0},yf=function(a){return"undefined"===typeof a?null:lc(a)},zf=function(a){if(null!==a){var b;try{b=ic(a)}catch(c){try{b=JSON.parse(a)}catch(d){throw c;}}return b}},vf=function(a){return a?a:""+Math.floor(1E9*Math.random()).toString()},Af=function(){var a=l.___jsl;if(a&&a.H)for(var b in a.H)if(a.H[b].r=a.H[b].r||[],a.H[b].L=a.H[b].L||[],a.H[b].r=a.H[b].L.concat(),a.CP)for(var c=0;c<a.CP.length;c++)a.CP[c]=null};var Bf;try{var Cf={};Object.defineProperty(Cf,"abcd",{configurable:!0,enumerable:!0,value:1});Object.defineProperty(Cf,"abcd",{configurable:!0,enumerable:!0,value:2});Bf=2==Cf.abcd}catch(a){Bf=!1}
var Q=function(a,b,c){Bf?Object.defineProperty(a,b,{configurable:!0,enumerable:!0,value:c}):a[b]=c},Df=function(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&Q(a,c,b[c])},Ef=function(a){var b={},c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b},Ff=function(a,b){if(!b||!b.length)return!0;if(!a)return!1;for(var c=0;c<b.length;c++){var d=a[b[c]];if(void 0===d||null===d||""===d)return!1}return!0};var Gf={Hd:{ub:500,tb:600,providerId:"facebook.com"},Id:{ub:500,tb:620,providerId:"github.com"},Jd:{ub:515,tb:680,providerId:"google.com"},Od:{ub:485,tb:705,providerId:"twitter.com"}},Hf=function(a){for(var b in Gf)if(Gf[b].providerId==a)return Gf[b];return null};var R=function(a,b){this.code="auth/"+a;this.message=b||If[a]||""};t(R,Error);R.prototype.G=function(){return{name:this.code,code:this.code,message:this.message}};
var If={"argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
"email-already-in-use":"The email address is already in use by another account.","expired-action-code":"The action code has expired. ","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal error has occurred.","invalid-user-token":"The user's credential is no longer valid. The user must sign in again.","invalid-auth-event":"An internal error has occurred.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.",
"invalid-email":"The email address is badly formatted.","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-credential":"The supplied auth credential is malformed or has expired.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
"invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","missing-iframe-start":"An internal error has occurred.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","app-deleted":"This instance of FirebaseApp has been deleted.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
"network-request-failed":"A network error (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal error has occurred.","no-such-provider":"User was not linked to an account with the given provider.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http or https and web storage must be enabled.',
"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.",
"user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported."};var Jf=function(a,b,c,d,e){this.va=a;this.za=b||null;this.hb=c||null;this.cc=d||null;this.J=e||null;if(this.hb||this.J){if(this.hb&&this.J)throw new R("invalid-auth-event");if(this.hb&&!this.cc)throw new R("invalid-auth-event");}else throw new R("invalid-auth-event");};Jf.prototype.getError=function(){return this.J};Jf.prototype.G=function(){return{type:this.va,eventId:this.za,urlResponse:this.hb,sessionId:this.cc,error:this.J&&this.J.G()}};var Kf=function(a){var b="unauthorized-domain",c=void 0,d=af(a);a=d.ga;d=d.la;"http"!=d&&"https"!=d?b="operation-not-supported-in-this-environment":c=ma("This domain (%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.",a);R.call(this,b,c)};t(Kf,R);var Lf=function(a){this.qe=a.sub;la();this.Db=a.email||null};var Mf=function(a,b,c,d){var e={};ha(c)?e=c:b&&n(c)&&n(d)?e={oauthToken:c,oauthTokenSecret:d}:!b&&n(c)&&(e={accessToken:c});if(b||!e.idToken&&!e.accessToken)if(b&&e.oauthToken&&e.oauthTokenSecret)Q(this,"accessToken",e.oauthToken),Q(this,"secret",e.oauthTokenSecret);else{if(b)throw new R("argument-error","credential failed: expected 2 arguments (the OAuth access token and secret).");throw new R("argument-error","credential failed: expected 1 argument (the OAuth access token).");}else e.idToken&&Q(this,
"idToken",e.idToken),e.accessToken&&Q(this,"accessToken",e.accessToken);Q(this,"provider",a)};Mf.prototype.Gb=function(a){return Nf(a,Of(this))};Mf.prototype.md=function(a,b){var c=Of(this);c.idToken=b;return Pf(a,c)};var Of=function(a){var b={};a.idToken&&(b.id_token=a.idToken);a.accessToken&&(b.access_token=a.accessToken);a.secret&&(b.oauth_token_secret=a.secret);b.providerId=a.provider;return{postBody:ff(b).toString(),requestUri:wf()?jf():"http://localhost"}};
Mf.prototype.G=function(){var a={provider:this.provider};this.idToken&&(a.oauthIdToken=this.idToken);this.accessToken&&(a.oauthAccessToken=this.accessToken);this.secret&&(a.oauthTokenSecret=this.secret);return a};
var Qf=function(a,b){var c=!!b;b=function(){Df(this,{providerId:a,isOAuthProvider:!0});this.Lc=[];"google.com"==a&&this.addScope("profile")};c||(b.prototype.addScope=function(a){Ja(this.Lc,a)||this.Lc.push(a)});b.prototype.Hb=function(){return Pa(this.Lc)};b.credential=function(b,e){return new Mf(a,c,b,e)};Df(b,{PROVIDER_ID:a});return b},Rf=Qf("facebook.com");Rf.prototype.addScope=Rf.prototype.addScope||void 0;var Sf=Qf("github.com");Sf.prototype.addScope=Sf.prototype.addScope||void 0;var Tf=Qf("google.com");
Tf.prototype.addScope=Tf.prototype.addScope||void 0;Tf.credential=function(a,b){if(!a&&!b)throw new R("argument-error","credential failed: must provide the ID token and/or the access token.");return new Mf("google.com",!1,ha(a)?a:{idToken:a||null,accessToken:b||null})};var Uf=Qf("twitter.com",!0),Vf=function(a,b){this.Db=a;this.Dc=b;Q(this,"provider","password")};Vf.prototype.Gb=function(a){return S(a,Wf,{email:this.Db,password:this.Dc})};
Vf.prototype.md=function(a,b){return S(a,Xf,{idToken:b,email:this.Db,password:this.Dc})};Vf.prototype.G=function(){return{email:this.Db,password:this.Dc}};var Yf=function(){Df(this,{providerId:"password",isOAuthProvider:!1})};Df(Yf,{PROVIDER_ID:"password"});
var Zf={Me:Yf,Hd:Rf,Jd:Tf,Id:Sf,Od:Uf},$f=function(a){var b=a&&a.providerId;if(!b)return null;var c=a&&a.oauthAccessToken,d=a&&a.oauthTokenSecret;a=a&&a.oauthIdToken;for(var e in Zf)if(Zf[e].PROVIDER_ID==b)try{return Zf[e].credential({accessToken:c,idToken:a,oauthToken:c,oauthTokenSecret:d})}catch(f){break}return null};var ag=function(a,b,c,d){R.call(this,a,d);Q(this,"email",b);Q(this,"credential",c)};t(ag,R);ag.prototype.G=function(){var a={code:this.code,message:this.message,email:this.email},b=this.credential&&this.credential.G();b&&(Ya(a,b),a.providerId=b.provider,delete a.provider);return a};var bg=function(a){if(a.code){var b=a.code||"";0==b.indexOf("auth/")&&(b=b.substring(5));return a.email?new ag(b,a.email,$f(a),a.message):new R(b,a.message||void 0)}return null};var cg=function(a){this.Le=a};t(cg,pc);cg.prototype.kb=function(){return new this.Le};cg.prototype.Qb=function(){return{}};
var T=function(a,b,c){var d;d="Node"==rf();d=l.XMLHttpRequest||d&&firebase.INTERNAL.node&&firebase.INTERNAL.node.XMLHttpRequest;if(!d)throw new R("internal-error","The XMLHttpRequest compatibility library was not found.");this.v=a;a=b||{};this.Ae=a.secureTokenEndpoint||"https://securetoken.googleapis.com/v1/token";this.Be=a.secureTokenTimeout||1E4;this.wd=Wa(a.secureTokenHeaders||dg);this.$d=a.firebaseEndpoint||"https://www.googleapis.com/identitytoolkit/v3/relyingparty/";this.ae=a.firebaseTimeout||
1E4;this.cd=Wa(a.firebaseHeaders||eg);c&&(this.cd["X-Client-Version"]=c,this.wd["X-Client-Version"]=c);this.Sd=new uc;this.Ke=new cg(d)},fg,dg={"Content-Type":"application/x-www-form-urlencoded"},eg={"Content-Type":"application/json"},hg=function(a,b,c,d,e,f,g){mf()?a=r(a.De,a):(fg||(fg=new I(function(a,b){gg(a,b)})),a=r(a.Ce,a));a(b,c,d,e,f,g)};
T.prototype.De=function(a,b,c,d,e,f){var g="Node"==rf(),k=sf()?g?new M(this.Ke):new M:new M(this.Sd),q;f&&(k.fb=Math.max(0,f),q=setTimeout(function(){k.dispatchEvent("timeout")},f));k.listen("complete",function(){q&&clearTimeout(q);var a=null;try{var c;c=this.a?ic(this.a.responseText):void 0;a=c||null}catch(Pi){try{a=JSON.parse(Ne(this))||null}catch(Qi){a=null}}b&&b(a)});Tb(k,"ready",function(){q&&clearTimeout(q);this.ya||(this.ya=!0,this.Oa())});Tb(k,"timeout",function(){q&&clearTimeout(q);this.ya||
(this.ya=!0,this.Oa());b&&b(null)});k.send(a,c,d,e)};var Pd="__fcb"+Math.floor(1E6*Math.random()).toString(),gg=function(a,b){((window.gapi||{}).client||{}).request?a():(l[Pd]=function(){((window.gapi||{}).client||{}).request?a():b(Error("CORS_UNSUPPORTED"))},Rd(function(){b(Error("CORS_UNSUPPORTED"))}))};
T.prototype.Ce=function(a,b,c,d,e){var f=this;fg.then(function(){window.gapi.client.setApiKey(f.v);var g=window.gapi.auth.getToken();window.gapi.auth.setToken(null);window.gapi.client.request({path:a,method:c,body:d,headers:e,authType:"none",callback:function(a){window.gapi.auth.setToken(g);b&&b(a)}})}).l(function(a){b&&b({error:{message:a&&a.message||"CORS_UNSUPPORTED"}})})};
var jg=function(a,b){return new I(function(c,d){"refresh_token"==b.grant_type&&b.refresh_token||"authorization_code"==b.grant_type&&b.code?hg(a,a.Ae+"?key="+encodeURIComponent(a.v),function(a){a?a.error?d(ig(a)):a.access_token&&a.refresh_token?c(a):d(new R("internal-error")):d(new R("network-request-failed"))},"POST",ff(b).toString(),a.wd,a.Be):d(new R("internal-error"))})},kg=function(a){var b={},c;for(c in a)null!==a[c]&&void 0!==a[c]&&(b[c]=a[c]);return lc(b)},lg=function(a,b,c,d,e){var f=a.$d+
b+"?key="+encodeURIComponent(a.v);e&&(f+="&cb="+la().toString());return new I(function(b,e){hg(a,f,function(a){a?a.error?e(ig(a)):b(a):e(new R("network-request-failed"))},c,kg(d),a.cd,a.ae)})},mg=function(a){if(!Zb.test(a.email))throw new R("invalid-email");},ng=function(a){"email"in a&&mg(a)},pg=function(a,b){var c=wf()?jf():"http://localhost";return S(a,og,{identifier:b,continueUri:c}).then(function(a){return a.allProviders||[]})},rg=function(a){return S(a,qg,{}).then(function(a){return a.authorizedDomains||
[]})},sg=function(a){if(!a.idToken)throw new R("internal-error");};T.prototype.signInAnonymously=function(){return S(this,tg,{})};T.prototype.updateEmail=function(a,b){return S(this,ug,{idToken:a,email:b})};T.prototype.updatePassword=function(a,b){return S(this,Xf,{idToken:a,password:b})};var vg={displayName:"DISPLAY_NAME",photoUrl:"PHOTO_URL"};
T.prototype.updateProfile=function(a,b){var c={idToken:a},d=[];Ra(vg,function(a,f){var e=b[f];null===e?d.push(a):f in b&&(c[f]=e)});d.length&&(c.deleteAttribute=d);return S(this,ug,c)};T.prototype.sendPasswordResetEmail=function(a){return S(this,wg,{requestType:"PASSWORD_RESET",email:a})};T.prototype.sendEmailVerification=function(a){return S(this,xg,{requestType:"VERIFY_EMAIL",idToken:a})};
var zg=function(a,b,c){return S(a,yg,{idToken:b,deleteProvider:c})},Ag=function(a){if(!a.requestUri||!a.sessionId&&!a.postBody)throw new R("internal-error");},Bg=function(a){var b=null;a.needConfirmation?(a.code="account-exists-with-different-credential",b=bg(a)):"FEDERATED_USER_ID_ALREADY_LINKED"==a.errorMessage?(a.code="credential-already-in-use",b=bg(a)):"EMAIL_EXISTS"==a.errorMessage&&(a.code="email-already-in-use",b=bg(a));if(b)throw b;if(!a.idToken)throw new R("internal-error");},Nf=function(a,
b){b.returnIdpCredential=!0;return S(a,Cg,b)},Pf=function(a,b){b.returnIdpCredential=!0;return S(a,Dg,b)},Eg=function(a){if(!a.oobCode)throw new R("invalid-action-code");};T.prototype.confirmPasswordReset=function(a,b){return S(this,Fg,{oobCode:a,newPassword:b})};T.prototype.checkActionCode=function(a){return S(this,Gg,{oobCode:a})};T.prototype.applyActionCode=function(a){return S(this,Hg,{oobCode:a})};
var Hg={endpoint:"setAccountInfo",D:Eg,cb:"email"},Gg={endpoint:"resetPassword",D:Eg,ta:function(a){if(!Zb.test(a.email))throw new R("internal-error");}},Ig={endpoint:"signupNewUser",D:function(a){mg(a);if(!a.password)throw new R("weak-password");},ta:sg,ua:!0},og={endpoint:"createAuthUri"},Jg={endpoint:"deleteAccount",ab:["idToken"]},yg={endpoint:"setAccountInfo",ab:["idToken","deleteProvider"],D:function(a){if(!ea(a.deleteProvider))throw new R("internal-error");}},Kg={endpoint:"getAccountInfo"},
xg={endpoint:"getOobConfirmationCode",ab:["idToken","requestType"],D:function(a){if("VERIFY_EMAIL"!=a.requestType)throw new R("internal-error");},cb:"email"},wg={endpoint:"getOobConfirmationCode",ab:["requestType"],D:function(a){if("PASSWORD_RESET"!=a.requestType)throw new R("internal-error");mg(a)},cb:"email"},qg={Rd:!0,endpoint:"getProjectConfig",je:"GET"},Fg={endpoint:"resetPassword",D:Eg,cb:"email"},ug={endpoint:"setAccountInfo",ab:["idToken"],D:ng,ua:!0},Xf={endpoint:"setAccountInfo",ab:["idToken"],
D:function(a){ng(a);if(!a.password)throw new R("weak-password");},ta:sg,ua:!0},tg={endpoint:"signupNewUser",ta:sg,ua:!0},Cg={endpoint:"verifyAssertion",D:Ag,ta:Bg,ua:!0},Dg={endpoint:"verifyAssertion",D:function(a){Ag(a);if(!a.idToken)throw new R("internal-error");},ta:Bg,ua:!0},Lg={endpoint:"verifyCustomToken",D:function(a){if(!a.token)throw new R("invalid-custom-token");},ta:sg,ua:!0},Wf={endpoint:"verifyPassword",D:function(a){mg(a);if(!a.password)throw new R("wrong-password");},ta:sg,ua:!0},S=
function(a,b,c){if(!Ff(c,b.ab))return K(new R("internal-error"));var d=b.je||"POST",e;return J(c).then(b.D).then(function(){b.ua&&(c.returnSecureToken=!0);return lg(a,b.endpoint,d,c,b.Rd||!1)}).then(function(a){return e=a}).then(b.ta).then(function(){if(!b.cb)return e;if(!(b.cb in e))throw new R("internal-error");return e[b.cb]})},ig=function(a){var b,c;c=(a.error&&a.error.errors&&a.error.errors[0]||{}).reason||"";var d={keyInvalid:"invalid-api-key",ipRefererBlocked:"app-not-authorized"};if(c=d[c]?
new R(d[c]):null)return c;c=a.error&&a.error.message||"";d={INVALID_CUSTOM_TOKEN:"invalid-custom-token",CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_EMAIL:"invalid-email",INVALID_PASSWORD:"wrong-password",USER_DISABLED:"user-disabled",MISSING_PASSWORD:"internal-error",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",
FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",EMAIL_NOT_FOUND:"user-not-found",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",CORS_UNSUPPORTED:"cors-unsupported",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",WEAK_PASSWORD:"weak-password",OPERATION_NOT_ALLOWED:"operation-not-allowed"};
b=(b=c.match(/^[^\s]+\s*:\s*(.*)$/))&&1<b.length?b[1]:void 0;for(var e in d)if(0===c.indexOf(e))return new R(d[e],b);!b&&a&&(b=yf(a));return new R("internal-error",b)};var Mg=function(a){this.R=a};Mg.prototype.value=function(){return this.R};Mg.prototype.zd=function(a){this.R.style=a;return this};var Ng=function(a){this.R=a||{}};Ng.prototype.value=function(){return this.R};Ng.prototype.zd=function(a){this.R.style=a;return this};var Pg=function(a){this.Je=a;this.wc=null;this.od=Og(this)};Pg.prototype.Bc=function(){return this.od};
var Qg=function(a){var b=new Ng;b.R.where=document.body;b.R.url=a.Je;b.R.messageHandlersFilter=uf("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER");b.R.attributes=b.R.attributes||{};(new Mg(b.R.attributes)).zd({position:"absolute",top:"-100px",width:"1px",height:"1px"});b.R.dontclear=!0;return b},Og=function(a){return Rg().then(function(){return new I(function(b,c){uf("gapi.iframes.getContext")().open(Qg(a).value(),function(d){a.wc=d;a.wc.restyle({setHideOnLeave:!1});var e=setTimeout(function(){c(Error("Network Error"))},
5E3),f=function(){clearTimeout(e);b()};d.ping(f).then(f,function(){c(Error("Network Error"))})})})})},Sg=function(a,b){a.od.then(function(){a.wc.register("authEvent",b,uf("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"))})},Tg="__iframefcb"+Math.floor(1E6*Math.random()).toString(),Rg=function(){return new I(function(a,b){var c=function(){Af();uf("gapi.load")("gapi.iframes",{callback:a,ontimeout:function(){Af();b(Error("Network Error"))},timeout:3E3})};uf("gapi.iframes.Iframe")?a():uf("gapi.load")?c():
(l[Tg]=function(){uf("gapi.load")?c():b(Error("Network Error"))},J(Od("https://apis.google.com/js/api.js?onload="+Tg)).l(function(){b(Error("Network Error"))}))})};var Vg=function(a,b,c,d){this.X=a;this.v=b;this.ea=c;d=this.xa=d||null;a=bf(a,"/__/auth/iframe");P(a,"apiKey",b);P(a,"appName",c);d&&P(a,"v",d);this.ke=a.toString();this.hd=new Pg(this.ke);this.zb=[];Ug(this)};Vg.prototype.Bc=function(){return this.hd.Bc()};
var Wg=function(a,b,c,d,e,f,g,k,q){a=bf(a,"/__/auth/handler");P(a,"apiKey",b);P(a,"appName",c);P(a,"authType",d);P(a,"providerId",e);f&&f.length&&P(a,"scopes",f.join(","));g&&P(a,"redirectUrl",g);k&&P(a,"eventId",k);q&&P(a,"v",q);return a.toString()},Ug=function(a){Sg(a.hd,function(b){var c={};if(b&&b.authEvent){var d=!1;b=b.authEvent||{};if(b.type){if(c=b.error)var e=(c=b.error)&&(c.name||c.code),c=e?new R(e.substring(5),c.message):null;b=new Jf(b.type,b.eventId,b.urlResponse,b.sessionId,c)}else b=
null;for(c=0;c<a.zb.length;c++)d=a.zb[c](b)||d;c={};c.status=d?"ACK":"ERROR";return J(c)}c.status="ERROR";return J(c)})},Xg=function(a,b){Ma(a.zb,function(a){return a==b})};var Yg=function(a){this.u=a||firebase.INTERNAL.reactNative&&firebase.INTERNAL.reactNative.AsyncStorage;if(!this.u)throw new R("internal-error","The React Native compatibility library was not found.");};h=Yg.prototype;h.get=function(a){return J(this.u.getItem(a)).then(function(a){return a&&zf(a)})};h.set=function(a,b){return J(this.u.setItem(a,yf(b)))};h.remove=function(a){return J(this.u.removeItem(a))};h.Ka=function(){};h.Za=function(){};var Zg=function(){this.u={}};h=Zg.prototype;h.get=function(a){return J(this.u[a])};h.set=function(a,b){this.u[a]=b;return J()};h.remove=function(a){delete this.u[a];return J()};h.Ka=function(){};h.Za=function(){};var ah=function(){if(!$g()){if("Node"==rf())throw new R("internal-error","The LocalStorage compatibility library was not found.");throw new R("web-storage-unsupported");}this.u=l.localStorage||firebase.INTERNAL.node.localStorage},$g=function(){var a="Node"==rf(),a=l.localStorage||a&&firebase.INTERNAL.node&&firebase.INTERNAL.node.localStorage;if(!a)return!1;try{return a.setItem("__sak","1"),a.removeItem("__sak"),!0}catch(b){return!1}};h=ah.prototype;
h.get=function(a){var b=this;return J().then(function(){var c=b.u.getItem(a);return zf(c)})};h.set=function(a,b){var c=this;return J().then(function(){var d=yf(b);null===d?c.remove(a):c.u.setItem(a,d)})};h.remove=function(a){var b=this;return J().then(function(){b.u.removeItem(a)})};h.Ka=function(a){l.window&&Lb(l.window,"storage",a)};h.Za=function(a){l.window&&Ub(l.window,"storage",a)};var bh=function(){this.u={}};h=bh.prototype;h.get=function(){return J(null)};h.set=function(){return J()};h.remove=function(){return J()};h.Ka=function(){};h.Za=function(){};var dh=function(){if(!ch()){if("Node"==rf())throw new R("internal-error","The SessionStorage compatibility library was not found.");throw new R("web-storage-unsupported");}this.u=l.sessionStorage||firebase.INTERNAL.node.sessionStorage},ch=function(){var a="Node"==rf(),a=l.sessionStorage||a&&firebase.INTERNAL.node&&firebase.INTERNAL.node.sessionStorage;if(!a)return!1;try{return a.setItem("__sak","1"),a.removeItem("__sak"),!0}catch(b){return!1}};h=dh.prototype;
h.get=function(a){var b=this;return J().then(function(){var c=b.u.getItem(a);return zf(c)})};h.set=function(a,b){var c=this;return J().then(function(){var d=yf(b);null===d?c.remove(a):c.u.setItem(a,d)})};h.remove=function(a){var b=this;return J().then(function(){b.u.removeItem(a)})};h.Ka=function(){};h.Za=function(){};var eh=function(a,b,c,d,e,f){if(!window.indexedDB)throw new R("web-storage-unsupported");this.Ud=a;this.Ac=b;this.qc=c;this.Fd=d;this.na=e;this.O={};this.vb=[];this.sb=0;this.le=f||l.indexedDB},fh,gh=function(a){return new I(function(b,c){var d=a.le.open(a.Ud,a.na);d.onerror=function(a){c(Error(a.target.errorCode))};d.onupgradeneeded=function(b){b=b.target.result;try{b.createObjectStore(a.Ac,{keyPath:a.qc})}catch(f){c(f)}};d.onsuccess=function(a){b(a.target.result)}})},hh=function(a){a.jd||(a.jd=
gh(a));return a.jd},ih=function(a,b){return b.objectStore(a.Ac)},jh=function(a,b,c){return b.transaction([a.Ac],c?"readwrite":"readonly")},kh=function(a){return new I(function(b,c){a.onsuccess=function(a){a&&a.target?b(a.target.result):b()};a.onerror=function(a){c(Error(a.target.errorCode))}})};h=eh.prototype;
h.set=function(a,b){var c=!1,d,e=this;return xd(hh(this).then(function(b){d=b;b=ih(e,jh(e,d,!0));return kh(b.get(a))}).then(function(f){var g=ih(e,jh(e,d,!0));if(f)return f.value=b,kh(g.put(f));e.sb++;c=!0;f={};f[e.qc]=a;f[e.Fd]=b;return kh(g.add(f))}).then(function(){e.O[a]=b}),function(){c&&e.sb--})};h.get=function(a){var b=this;return hh(this).then(function(c){return kh(ih(b,jh(b,c,!1)).get(a))}).then(function(a){return a&&a.value})};
h.remove=function(a){var b=!1,c=this;return xd(hh(this).then(function(d){b=!0;c.sb++;return kh(ih(c,jh(c,d,!0))["delete"](a))}).then(function(){delete c.O[a]}),function(){b&&c.sb--})};
h.Fe=function(){var a=this;return hh(this).then(function(b){var c=ih(a,jh(a,b,!1));return c.getAll?kh(c.getAll()):new I(function(a,b){var d=[],e=c.openCursor();e.onsuccess=function(b){(b=b.target.result)?(d.push(b.value),b["continue"]()):a(d)};e.onerror=function(a){b(Error(a.target.errorCode))}})}).then(function(b){var c={},d=[];if(0==a.sb){for(d=0;d<b.length;d++)c[b[d][a.qc]]=b[d][a.Fd];d=kf(a.O,c);a.O=c}return d})};h.Ka=function(a){0==this.vb.length&&this.Oc();this.vb.push(a)};
h.Za=function(a){Ma(this.vb,function(b){return b==a});0==this.vb.length&&this.ec()};h.Oc=function(){var a=this;this.ec();var b=function(){a.Fc=xe(800).then(r(a.Fe,a)).then(function(b){0<b.length&&x(a.vb,function(a){a(b)})}).then(b).l(function(a){"STOP_EVENT"!=a.message&&b()});return a.Fc};b()};h.ec=function(){this.Fc&&this.Fc.cancel("STOP_EVENT")};var oh=function(){this.$c={Browser:lh,Node:mh,ReactNative:nh}[rf()]},ph,lh={V:ah,Qc:dh},mh={V:ah,Qc:dh},nh={V:Yg,Qc:bh};var qh="First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" "),U=function(a,b){return{name:a||"",ca:"a valid string",optional:!!b,da:n}},rh=function(a){return{name:a||"",ca:"a valid object",optional:!1,da:ha}},sh=function(a,b){return{name:a||"",ca:"a function",optional:!!b,da:p}},th=function(){return{name:"",ca:"null",optional:!1,da:da}},uh=function(){return{name:"credential",ca:"a valid credential",optional:!1,da:function(a){return!(!a||!a.Gb)}}},vh=function(){return{name:"authProvider",
ca:"a valid Auth provider",optional:!1,da:function(a){return!!(a&&a.providerId&&a.hasOwnProperty&&a.hasOwnProperty("isOAuthProvider"))}}},wh=function(a,b,c,d){return{name:c||"",ca:a.ca+" or "+b.ca,optional:!!d,da:function(c){return a.da(c)||b.da(c)}}};var yh=function(a,b){for(var c in b){var d=b[c].name;a[d]=xh(d,a[c],b[c].b)}},V=function(a,b,c,d){a[b]=xh(b,c,d)},xh=function(a,b,c){if(!c)return b;var d=zh(a);a=function(){var a=Array.prototype.slice.call(arguments),e;a:{e=Array.prototype.slice.call(a);var k;k=0;for(var q=!1,ra=0;ra<c.length;ra++)if(c[ra].optional)q=!0;else{if(q)throw new R("internal-error","Argument validator encountered a required argument after an optional argument.");k++}q=c.length;if(e.length<k||q<e.length)e="Expected "+(k==
q?1==k?"1 argument":k+" arguments":k+"-"+q+" arguments")+" but got "+e.length+".";else{for(k=0;k<e.length;k++)if(q=c[k].optional&&void 0===e[k],!c[k].da(e[k])&&!q){e=c[k];if(0>k||k>=qh.length)throw new R("internal-error","Argument validator received an unsupported number of arguments.");e=qh[k]+" argument "+(e.name?'"'+e.name+'" ':"")+"must be "+e.ca+".";break a}e=null}}if(e)throw new R("argument-error",d+" failed: "+e);return b.apply(this,a)};for(var e in b)a[e]=b[e];for(e in b.prototype)a.prototype[e]=
b.prototype[e];return a},zh=function(a){a=a.split(".");return a[a.length-1]};var Ah=function(a,b,c,d){this.te=a;this.xd=b;this.ze=c;this.eb=d;this.N={};ph||(ph=new oh);a=ph;try{var e;hf()?(fh||(fh=new eh("firebaseLocalStorageDb","firebaseLocalStorage","fbase_key","value",1)),e=fh):e=new a.$c.V;this.Ta=e}catch(f){this.Ta=new Zg,this.eb=!0}try{this.gc=new a.$c.Qc}catch(f){this.gc=new Zg}this.Ad=r(this.Bd,this);this.O={}},Bh,Ch=function(){Bh||(Bh=new Ah("firebase",":","Safari"==lf(gf())&&l.window&&l.window!=l.window.top?!0:!1,xf()));return Bh};h=Ah.prototype;
h.K=function(a,b){return this.te+this.xd+a.name+(b?this.xd+b:"")};h.get=function(a,b){return(a.V?this.Ta:this.gc).get(this.K(a,b))};h.remove=function(a,b){b=this.K(a,b);a.V&&!this.eb&&(this.O[b]=null);return(a.V?this.Ta:this.gc).remove(b)};h.set=function(a,b,c){var d=this.K(a,c),e=this,f=a.V?this.Ta:this.gc;return f.set(d,b).then(function(){return f.get(d)}).then(function(b){a.V&&!this.eb&&(e.O[d]=b)})};
h.addListener=function(a,b,c){a=this.K(a,b);this.eb||(this.O[a]=l.localStorage.getItem(a));Ua(this.N)&&this.Oc();this.N[a]||(this.N[a]=[]);this.N[a].push(c)};h.removeListener=function(a,b,c){a=this.K(a,b);this.N[a]&&(Ma(this.N[a],function(a){return a==c}),0==this.N[a].length&&delete this.N[a]);Ua(this.N)&&this.ec()};h.Oc=function(){this.Ta.Ka(this.Ad);this.eb||Dh(this)};
var Dh=function(a){Eh(a);a.zc=setInterval(function(){for(var b in a.N){var c=l.localStorage.getItem(b);c!=a.O[b]&&(a.O[b]=c,c=new Ab({type:"storage",key:b,target:window,oldValue:a.O[b],newValue:c}),a.Bd(c))}},1E3)},Eh=function(a){a.zc&&(clearInterval(a.zc),a.zc=null)};Ah.prototype.ec=function(){this.Ta.Za(this.Ad);this.eb||Eh(this)};
Ah.prototype.Bd=function(a){if(a&&a.ce){var b=a.lb.key;if(this.ze){var c=l.localStorage.getItem(b);a=a.lb.newValue;a!=c&&(a?l.localStorage.setItem(b,a):a||l.localStorage.removeItem(b))}this.O[b]=l.localStorage.getItem(b);this.Vc(b)}else x(a,r(this.Vc,this))};Ah.prototype.Vc=function(a){this.N[a]&&x(this.N[a],function(a){a()})};var Fh=function(a){this.B=a;this.A=Ch()},Gh={name:"pendingRedirect",V:!1},Hh=function(a){return a.A.set(Gh,"pending",a.B)},Ih=function(a){return a.A.remove(Gh,a.B)},Jh=function(a){return a.A.get(Gh,a.B).then(function(a){return"pending"==a})};var Mh=function(a,b,c){var d=this,e=(this.xa=firebase.SDK_VERSION||null)?tf(this.xa):null;this.f=new T(b,null,e);this.qa=null;this.X=a;this.v=b;this.ea=c;this.wb=[];this.Pb=!1;this.Rc=r(this.de,this);this.Wa=new Kh(this);this.rd=new Lh(this);this.Ec=new Fh(this.v+":"+this.ea);this.gb={};this.gb.unknown=this.Wa;this.gb.signInViaRedirect=this.Wa;this.gb.linkViaRedirect=this.Wa;this.gb.signInViaPopup=this.rd;this.gb.linkViaPopup=this.rd;this.$b=this.bb=null;this.Ub=new I(function(a,b){d.bb=a;d.$b=b})};
Mh.prototype.reset=function(){var a=this;this.qa=null;this.Ub.cancel();this.Pb=!1;this.$b=this.bb=null;this.Mb&&Xg(this.Mb,this.Rc);this.Ub=new I(function(b,c){a.bb=b;a.$b=c})};
var Nh=function(a){var b=jf();return rg(a).then(function(a){a:{for(var c=af(b).ga,e=0;e<a.length;e++){var f;var g=a[e];f=c;var k=Mc(g);k?f=(f=Mc(f))?k.Eb(f):!1:(k=g.split(".").join("\\."),f=(new RegExp("^(.+\\."+k+"|"+k+")$","i")).test(f));if(f){a=!0;break a}}a=!1}if(!a)throw new Kf(jf());})},Oh=function(a){a.Pb||(a.Pb=!0,qf().then(function(){a.Mb=new Vg(a.X,a.v,a.ea,a.xa);a.Mb.Bc().l(function(){a.$b(new R("network-request-failed"));a.reset()});a.Mb.zb.push(a.Rc)}));return a.Ub};
Mh.prototype.subscribe=function(a){Ja(this.wb,a)||this.wb.push(a);if(!this.Pb){var b=this,c=function(){var a=gf(),c;(c=xf(a))||(a=a||gf(),c="Safari"==lf(a)||a.toLowerCase().match(/iphone|ipad|ipod/)?!1:!0);c?Ph(b.Wa):Oh(b)};Jh(this.Ec).then(function(a){a?Ih(b.Ec).then(function(){Oh(b)}):c()}).l(function(){c()})}};Mh.prototype.unsubscribe=function(a){Ma(this.wb,function(b){return b==a})};
Mh.prototype.de=function(a){if(!a)throw new R("invalid-auth-event");this.bb&&(this.bb(),this.bb=null);for(var b=!1,c=0;c<this.wb.length;c++){var d=this.wb[c];if(d.Wc(a.va,a.za)){(b=this.gb[a.va])&&b.sd(a,d);b=!0;break}}Ph(this.Wa);return b};Mh.prototype.getRedirectResult=function(){return this.Wa.getRedirectResult()};
var Rh=function(a,b,c,d,e,f){if(!b)return K(new R("popup-blocked"));if(f)return Oh(a),J();a.qa||(a.qa=Nh(a.f));return a.qa.then(function(){return Oh(a)}).then(function(){Qh(d);var f=Wg(a.X,a.v,a.ea,c,d.providerId,d.Hb(),null,e,a.xa);(b||l.window).location.href=dc(gc(f))}).l(function(b){"auth/network-request-failed"==b.code&&(a.qa=null);throw b;})},Sh=function(a,b,c,d){a.qa||(a.qa=Nh(a.f));return a.qa.then(function(){Qh(c);var e=Wg(a.X,a.v,a.ea,b,c.providerId,c.Hb(),jf(),d,a.xa);Hh(a.Ec).then(function(){l.window.location.href=
dc(gc(e))})})},Th=function(a,b,c,d,e){var f=new R("popup-closed-by-user");return a.Ub.l(function(){}).then(function(){return pf(d)}).then(function(){return xe(2E3).then(function(){b.Ha(c,null,f,e)})})},Qh=function(a){if(!a.isOAuthProvider)throw new R("invalid-oauth-provider");},Uh={},Vh=function(a,b,c){var d=b+":"+c;Uh[d]||(Uh[d]=new Mh(a,b,c));return Uh[d]},Kh=function(a){this.A=a;this.Jc=this.Zb=this.Xa=this.W=null;this.Ic=!1};
Kh.prototype.sd=function(a,b){if(!a)return K(new R("invalid-auth-event"));this.Ic=!0;var c=a.va,d=a.za;"unknown"==c?(this.W||Wh(this,!1,null,null),a=J()):a=a.J?this.Gc(a,b):b.mb(c,d)?this.Hc(a,b):K(new R("invalid-auth-event"));return a};var Ph=function(a){a.Ic||(a.Ic=!0,Wh(a,!1,null,null))};Kh.prototype.Gc=function(a){this.W||Wh(this,!0,null,a.getError());return J()};
Kh.prototype.Hc=function(a,b){var c=this,d=a.va;b=b.mb(d,a.za);var e=a.hb;a=a.cc;var f="signInViaRedirect"==d||"linkViaRedirect"==d;return this.W?J():b(e,a).then(function(a){c.W||Wh(c,f,a,null)}).l(function(a){c.W||Wh(c,f,null,a)})};var Wh=function(a,b,c,d){b?d?(a.W=function(){return K(d)},a.Zb&&a.Zb(d)):(a.W=function(){return J(c)},a.Xa&&a.Xa(c)):(a.W=function(){return J({user:null})},a.Xa&&a.Xa({user:null}));a.Xa=null;a.Zb=null};
Kh.prototype.getRedirectResult=function(){var a=this;this.Uc||(this.Uc=new I(function(b,c){a.W?a.W().then(b,c):(a.Xa=b,a.Zb=c,Xh(a))}));return this.Uc};var Xh=function(a){var b=new R("timeout");a.Jc&&a.Jc.cancel();a.Jc=xe(1E4).then(function(){a.W||Wh(a,!0,null,b)})},Lh=function(a){this.A=a};Lh.prototype.sd=function(a,b){if(!a)return K(new R("invalid-auth-event"));var c=a.va,d=a.za;return a.J?this.Gc(a,b):b.mb(c,d)?this.Hc(a,b):K(new R("invalid-auth-event"))};
Lh.prototype.Gc=function(a,b){b.Ha(a.va,null,a.getError(),a.za);return J()};Lh.prototype.Hc=function(a,b){var c=a.za,d=a.va;return b.mb(d,c)(a.hb,a.cc).then(function(a){b.Ha(d,a,null,c)}).l(function(a){b.Ha(d,null,a,c)})};var Yh=function(a){this.f=a;this.wa=this.S=null;this.Pa=0};Yh.prototype.G=function(){return{apiKey:this.f.v,refreshToken:this.S,accessToken:this.wa,expirationTime:this.Pa}};
var $h=function(a,b){var c=b.idToken,d=b.refreshToken;b=Zh(b.expiresIn);a.wa=c;a.Pa=b;a.S=d},Zh=function(a){return la()+1E3*parseInt(a,10)},ai=function(a,b){return jg(a.f,b).then(function(b){a.wa=b.access_token;a.Pa=Zh(b.expires_in);a.S=b.refresh_token;return{accessToken:a.wa,expirationTime:a.Pa,refreshToken:a.S}}).l(function(b){"auth/user-token-expired"==b.code&&(a.S=null);throw b;})},bi=function(a){return!(!a.wa||a.S)};
Yh.prototype.getToken=function(a){a=!!a;return bi(this)?K(new R("user-token-expired")):a||!this.wa||la()>this.Pa-3E4?this.S?ai(this,{grant_type:"refresh_token",refresh_token:this.S}):J(null):J({accessToken:this.wa,expirationTime:this.Pa,refreshToken:this.S})};var ci=function(a,b,c,d,e){Df(this,{uid:a,displayName:d||null,photoURL:e||null,email:c||null,providerId:b})},di=function(a,b){zb.call(this,a);for(var c in b)this[c]=b[c]};t(di,zb);
var W=function(a,b,c){this.U=[];this.v=a.apiKey;this.ea=a.appName;this.X=a.authDomain||null;a=firebase.SDK_VERSION?tf(firebase.SDK_VERSION):null;this.f=new T(this.v,null,a);this.ba=new Yh(this.f);ei(this,b.idToken);$h(this.ba,b);Q(this,"refreshToken",this.ba.S);fi(this,c||{});$d.call(this);this.Vb=!1;this.X&&wf()&&(this.m=Vh(this.X,this.v,this.ea));this.dc=[]};t(W,$d);
var ei=function(a,b){a.kd=b;Q(a,"_lat",b)},gi=function(a,b){Ma(a.dc,function(a){return a==b})},hi=function(a){for(var b=[],c=0;c<a.dc.length;c++)b.push(a.dc[c](a));return ud(b).then(function(){return a})},ii=function(a){a.m&&!a.Vb&&(a.Vb=!0,a.m.subscribe(a))},fi=function(a,b){Df(a,{uid:b.uid,displayName:b.displayName||null,photoURL:b.photoURL||null,email:b.email||null,emailVerified:b.emailVerified||!1,isAnonymous:b.isAnonymous||!1,providerData:[]})};Q(W.prototype,"providerId","firebase");
var ji=function(){},ki=function(a){return J().then(function(){if(a.Vd)throw new R("app-deleted");})},li=function(a){return Fa(a.providerData,function(a){return a.providerId})},ni=function(a,b){b&&(mi(a,b.providerId),a.providerData.push(b))},mi=function(a,b){Ma(a.providerData,function(a){return a.providerId==b})},oi=function(a,b,c){("uid"!=b||c)&&a.hasOwnProperty(b)&&Q(a,b,c)};
W.prototype.copy=function(a){var b=this;b!=a&&(Df(this,{uid:a.uid,displayName:a.displayName,photoURL:a.photoURL,email:a.email,emailVerified:a.emailVerified,isAnonymous:a.isAnonymous,providerData:[]}),x(a.providerData,function(a){ni(b,a)}),this.ba=a.ba,Q(this,"refreshToken",this.ba.S))};W.prototype.reload=function(){var a=this;return ki(this).then(function(){return pi(a).then(function(){return hi(a)}).then(ji)})};
var pi=function(a){return a.getToken().then(function(b){var c=a.isAnonymous;return qi(a,b).then(function(){c||oi(a,"isAnonymous",!1);return b}).l(function(b){"auth/user-token-expired"==b.code&&(a.dispatchEvent(new di("userDeleted")),ri(a));throw b;})})};
W.prototype.getToken=function(a){var b=this,c=bi(this.ba);return ki(this).then(function(){return b.ba.getToken(a)}).then(function(a){if(!a)throw new R("internal-error");a.accessToken!=b.kd&&(ei(b,a.accessToken),b.Da());oi(b,"refreshToken",a.refreshToken);return a.accessToken}).l(function(a){if("auth/user-token-expired"==a.code&&!c)return hi(b).then(function(){oi(b,"refreshToken",null);throw a;});throw a;})};
var si=function(a,b){b.idToken&&a.kd!=b.idToken&&($h(a.ba,b),a.Da(),ei(a,b.idToken),oi(a,"refreshToken",a.ba.S))};W.prototype.Da=function(){this.dispatchEvent(new di("tokenChanged"))};var qi=function(a,b){return S(a.f,Kg,{idToken:b}).then(r(a.we,a))};
W.prototype.we=function(a){a=a.users;if(!a||!a.length)throw new R("internal-error");a=a[0];fi(this,{uid:a.localId,displayName:a.displayName,photoURL:a.photoUrl,email:a.email,emailVerified:!!a.emailVerified});for(var b=ti(a),c=0;c<b.length;c++)ni(this,b[c]);oi(this,"isAnonymous",!(this.email&&a.passwordHash)&&!(this.providerData&&this.providerData.length))};
var ti=function(a){return(a=a.providerUserInfo)&&a.length?Fa(a,function(a){return new ci(a.rawId,a.providerId,a.email,a.displayName,a.photoUrl)}):[]};W.prototype.reauthenticate=function(a){var b=this;return this.c(a.Gb(this.f).then(function(a){var c;a:{var e=a.idToken.split(".");if(3==e.length){for(var e=e[1],f=(4-e.length%4)%4,g=0;g<f;g++)e+=".";try{var k=ic(ub(e));if(k.sub&&k.iss&&k.aud&&k.exp){c=new Lf(k);break a}}catch(q){}}c=null}if(!c||b.uid!=c.qe)throw new R("user-mismatch");si(b,a);return b.reload()}))};
var ui=function(a,b){return pi(a).then(function(){if(Ja(li(a),b))return hi(a).then(function(){throw new R("provider-already-linked");})})};h=W.prototype;h.link=function(a){var b=this;return this.c(ui(this,a.provider).then(function(){return b.getToken()}).then(function(c){return a.md(b.f,c)}).then(r(this.bd,this)))};h.bd=function(a){si(this,a);var b=this;return this.reload().then(function(){return b})};
h.updateEmail=function(a){var b=this;return this.c(this.getToken().then(function(c){return b.f.updateEmail(c,a)}).then(function(a){si(b,a);return b.reload()}))};h.updatePassword=function(a){var b=this;return this.c(this.getToken().then(function(c){return b.f.updatePassword(c,a)}).then(function(a){si(b,a);return b.reload()}))};
h.updateProfile=function(a){if(void 0===a.displayName&&void 0===a.photoURL)return ki(this);var b=this;return this.c(this.getToken().then(function(c){return b.f.updateProfile(c,{displayName:a.displayName,photoUrl:a.photoURL})}).then(function(a){si(b,a);oi(b,"displayName",a.displayName||null);oi(b,"photoURL",a.photoUrl||null);return hi(b)}).then(ji))};
h.unlink=function(a){var b=this;return this.c(pi(this).then(function(c){return Ja(li(b),a)?zg(b.f,c,[a]).then(function(a){var c={};x(a.providerUserInfo||[],function(a){c[a.providerId]=!0});x(li(b),function(a){c[a]||mi(b,a)});return hi(b)}):hi(b).then(function(){throw new R("no-such-provider");})}))};h.delete=function(){var a=this;return this.c(this.getToken().then(function(b){return S(a.f,Jg,{idToken:b})}).then(function(){a.dispatchEvent(new di("userDeleted"))})).then(function(){ri(a)})};
h.Wc=function(a,b){return"linkViaPopup"==a&&(this.ia||null)==b&&this.$||"linkViaRedirect"==a&&(this.Yb||null)==b?!0:!1};h.Ha=function(a,b,c,d){"linkViaPopup"==a&&d==(this.ia||null)&&(c&&this.Fa?this.Fa(c):b&&!c&&this.$&&this.$(b),this.C&&(this.C.cancel(),this.C=null),delete this.$,delete this.Fa)};h.mb=function(a,b){return"linkViaPopup"==a&&b==(this.ia||null)||"linkViaRedirect"==a&&(this.Yb||null)==b?r(this.Yd,this):null};h.Fb=function(){return vf(this.uid+":::")};
h.linkWithPopup=function(a){if(!wf())return K(new R("operation-not-supported-in-this-environment"));var b=this,c=Hf(a.providerId),d=this.Fb(),e=null;!xf()&&this.X&&a.isOAuthProvider&&(e=Wg(this.X,this.v,this.ea,"linkViaPopup",a.providerId,a.Hb(),null,d,firebase.SDK_VERSION||null));var f=of(e,c&&c.ub,c&&c.tb),c=ui(this,a.providerId).then(function(){return hi(b)}).then(function(){vi(b);return b.getToken()}).then(function(){return Rh(b.m,f,"linkViaPopup",a,d,!!e)}).then(function(){return new I(function(a,
c){b.Ha("linkViaPopup",null,new R("cancelled-popup-request"),b.ia||null);b.$=a;b.Fa=c;b.ia=d;b.C=Th(b.m,b,"linkViaPopup",f,d)})}).then(function(a){f&&nf(f);return a}).l(function(a){f&&nf(f);throw a;});return this.c(c)};
h.linkWithRedirect=function(a){if(!wf())return K(new R("operation-not-supported-in-this-environment"));var b=this,c=null,d=this.Fb(),e=ui(this,a.providerId).then(function(){vi(b);return b.getToken()}).then(function(){b.Yb=d;return hi(b)}).then(function(a){b.Ga&&(a=b.Ga,a=a.A.set(wi,b.G(),a.B));return a}).then(function(){return Sh(b.m,"linkViaRedirect",a,d)}).l(function(a){c=a;if(b.Ga)return xi(b.Ga);throw c;}).then(function(){if(c)throw c;});return this.c(e)};
var vi=function(a){if(a.m&&a.Vb)return;if(a.m&&!a.Vb)throw new R("internal-error");throw new R("auth-domain-config-required");};W.prototype.Yd=function(a,b){var c=this;this.C&&(this.C.cancel(),this.C=null);var d=null,e=this.getToken().then(function(d){return Pf(c.f,{requestUri:a,sessionId:b,idToken:d})}).then(function(a){d=$f(a);return c.bd(a)}).then(function(a){return{user:a,credential:d}});return this.c(e)};
W.prototype.sendEmailVerification=function(){var a=this;return this.c(this.getToken().then(function(b){return a.f.sendEmailVerification(b)}).then(function(b){if(a.email!=b)return a.reload()}).then(function(){}))};var ri=function(a){for(var b=0;b<a.U.length;b++)a.U[b].cancel("app-deleted");a.U=[];a.Vd=!0;Q(a,"refreshToken",null);a.m&&a.m.unsubscribe(a)};W.prototype.c=function(a){var b=this;this.U.push(a);xd(a,function(){La(b.U,a)});return a};W.prototype.toJSON=function(){return this.G()};
W.prototype.G=function(){var a={uid:this.uid,displayName:this.displayName,photoURL:this.photoURL,email:this.email,emailVerified:this.emailVerified,isAnonymous:this.isAnonymous,providerData:[],apiKey:this.v,appName:this.ea,authDomain:this.X,stsTokenManager:this.ba.G(),redirectEventId:this.Yb||null};x(this.providerData,function(b){a.providerData.push(Ef(b))});return a};
var yi=function(a){if(!a.apiKey)return null;var b={apiKey:a.apiKey,authDomain:a.authDomain,appName:a.appName},c={};if(a.stsTokenManager&&a.stsTokenManager.accessToken&&a.stsTokenManager.expirationTime)c.idToken=a.stsTokenManager.accessToken,c.refreshToken=a.stsTokenManager.refreshToken||null,c.expiresIn=(a.stsTokenManager.expirationTime-la())/1E3;else return null;var d=new W(b,c,a);a.providerData&&x(a.providerData,function(a){if(a){var b={};Df(b,a);ni(d,b)}});a.redirectEventId&&(d.Yb=a.redirectEventId);
return d},zi=function(a,b,c){var d=new W(a,b);c&&(d.Ga=c);return d.reload().then(function(){return d})};var Ai=function(a){this.B=a;this.A=Ch()},wi={name:"redirectUser",V:!1},xi=function(a){return a.A.remove(wi,a.B)},Bi=function(a,b){return a.A.get(wi,a.B).then(function(a){a&&b&&(a.authDomain=b);return yi(a||{})})};var Ci=function(a){this.B=a;this.A=Ch()},Di={name:"authUser",V:!0},Ei=function(a,b){return a.A.set(Di,b.G(),a.B)},Fi=function(a){return a.A.remove(Di,a.B)},Gi=function(a,b){return a.A.get(Di,a.B).then(function(a){a&&b&&(a.authDomain=b);return yi(a||{})})};var Y=function(a){this.Na=!1;Q(this,"app",a);if(X(this).options&&X(this).options.apiKey)a=firebase.SDK_VERSION?tf(firebase.SDK_VERSION):null,this.f=new T(X(this).options&&X(this).options.apiKey,null,a);else throw new R("invalid-api-key");this.U=[];this.La=[];this.ue=firebase.INTERNAL.createSubscribe(r(this.me,this));Hi(this,null);this.ma=new Ci(X(this).options.apiKey+":"+X(this).name);this.Ya=new Ai(X(this).options.apiKey+":"+X(this).name);this.Ab=this.c(Ii(this));this.sa=this.c(Ji(this));this.yc=
!1;this.vc=r(this.Ee,this);this.Dd=r(this.Ra,this);this.Ed=r(this.ie,this);this.Cd=r(this.he,this);Ki(this);this.INTERNAL={};this.INTERNAL.delete=r(this.delete,this)};Y.prototype.toJSON=function(){return{apiKey:X(this).options.apiKey,authDomain:X(this).options.authDomain,appName:X(this).name,currentUser:Z(this)&&Z(this).G()}};
var Li=function(a){return a.Wd||K(new R("auth-domain-config-required"))},Ki=function(a){var b=X(a).options.authDomain,c=X(a).options.apiKey;b&&wf()&&(a.Wd=a.Ab.then(function(){if(!a.Na)return a.m=Vh(b,c,X(a).name),a.m.subscribe(a),Z(a)&&ii(Z(a)),a.Kc&&(ii(a.Kc),a.Kc=null),a.m}))};h=Y.prototype;h.Wc=function(a,b){switch(a){case "unknown":case "signInViaRedirect":return!0;case "signInViaPopup":return this.ia==b&&!!this.$;default:return!1}};
h.Ha=function(a,b,c,d){"signInViaPopup"==a&&this.ia==d&&(c&&this.Fa?this.Fa(c):b&&!c&&this.$&&this.$(b),this.C&&(this.C.cancel(),this.C=null),delete this.$,delete this.Fa)};h.mb=function(a,b){return"signInViaRedirect"==a||"signInViaPopup"==a&&this.ia==b&&this.$?r(this.Zd,this):null};
h.Zd=function(a,b){var c=this;a={requestUri:a,sessionId:b};this.C&&(this.C.cancel(),this.C=null);var d=null,e=Nf(c.f,a).then(function(a){d=$f(a);return a});a=c.Ab.then(function(){return e}).then(function(a){return Mi(c,a)}).then(function(){return{user:Z(c),credential:d}});return this.c(a)};h.Fb=function(){return vf()};
h.signInWithPopup=function(a){if(!wf())return K(new R("operation-not-supported-in-this-environment"));var b=this,c=Hf(a.providerId),d=this.Fb(),e=null;!xf()&&X(this).options.authDomain&&a.isOAuthProvider&&(e=Wg(X(this).options.authDomain,X(this).options.apiKey,X(this).name,"signInViaPopup",a.providerId,a.Hb(),null,d,firebase.SDK_VERSION||null));var f=of(e,c&&c.ub,c&&c.tb),c=Li(this).then(function(b){return Rh(b,f,"signInViaPopup",a,d,!!e)}).then(function(){return new I(function(a,c){b.Ha("signInViaPopup",
null,new R("cancelled-popup-request"),b.ia);b.$=a;b.Fa=c;b.ia=d;b.C=Th(b.m,b,"signInViaPopup",f,d)})}).then(function(a){f&&nf(f);return a}).l(function(a){f&&nf(f);throw a;});return this.c(c)};h.signInWithRedirect=function(a){if(!wf())return K(new R("operation-not-supported-in-this-environment"));var b=this,c=Li(this).then(function(){return Sh(b.m,"signInViaRedirect",a)});return this.c(c)};
h.getRedirectResult=function(){if(!wf())return K(new R("operation-not-supported-in-this-environment"));var a=this,b=Li(this).then(function(){return a.m.getRedirectResult()});return this.c(b)};
var Mi=function(a,b){var c={};c.apiKey=X(a).options.apiKey;c.authDomain=X(a).options.authDomain;c.appName=X(a).name;return a.Ab.then(function(){return zi(c,b,a.Ya)}).then(function(b){if(Z(a)&&b.uid==Z(a).uid)return Z(a).copy(b),a.Ra(b);Hi(a,b);ii(b);return a.Ra(b)}).then(function(){a.Da()})},Hi=function(a,b){Z(a)&&(gi(Z(a),a.Dd),Ub(Z(a),"tokenChanged",a.Ed),Ub(Z(a),"userDeleted",a.Cd));b&&(b.dc.push(a.Dd),Lb(b,"tokenChanged",a.Ed),Lb(b,"userDeleted",a.Cd));Q(a,"currentUser",b)};
Y.prototype.signOut=function(){var a=this,b=this.sa.then(function(){if(!Z(a))return J();Hi(a,null);return Fi(a.ma).then(function(){a.Da()})});return this.c(b)};
var Ni=function(a){var b=Bi(a.Ya,X(a).options.authDomain).then(function(b){if(a.Kc=b)b.Ga=a.Ya;return xi(a.Ya)});return a.c(b)},Ii=function(a){var b=X(a).options.authDomain,c=Ni(a).then(function(){return Gi(a.ma,b)}).then(function(b){return b?(b.Ga=a.Ya,b.reload().then(function(){return Ei(a.ma,b).then(function(){return b})}).l(function(c){return"auth/network-request-failed"==c.code?b:Fi(a.ma)})):null}).then(function(b){Hi(a,b||null)});return a.c(c)},Ji=function(a){return a.Ab.then(function(){return a.getRedirectResult()}).l(function(){}).then(function(){return a.Na?
void 0:a.vc()}).l(function(){}).then(function(){if(!a.Na){a.yc=!0;var b=a.ma;b.A.addListener(Di,b.B,a.vc)}})};Y.prototype.Ee=function(){var a=this;return Gi(this.ma,X(this).options.authDomain).then(function(b){if(!a.Na){var c;if(c=Z(a)&&b){c=Z(a).uid;var d=b.uid;c=void 0===c||null===c||""===c||void 0===d||null===d||""===d?!1:c==d}if(c)return Z(a).copy(b),Z(a).getToken();if(Z(a)||b)Hi(a,b),b&&(ii(b),b.Ga=a.Ya),a.m&&a.m.subscribe(a),a.Da()}})};Y.prototype.Ra=function(a){return Ei(this.ma,a)};
Y.prototype.ie=function(){this.Da();this.Ra(Z(this))};Y.prototype.he=function(){this.signOut()};var Oi=function(a,b){return a.c(b.then(function(b){return Mi(a,b)}).then(function(){return Z(a)}))};h=Y.prototype;h.me=function(a){var b=this;this.addAuthTokenListener(function(){a.next(Z(b))})};h.onAuthStateChanged=function(a,b,c){var d=this;this.yc&&firebase.Promise.resolve().then(function(){p(a)?a(Z(d)):p(a.next)&&a.next(Z(d))});return this.ue(a,b,c)};
h.getToken=function(a){var b=this,c=this.sa.then(function(){return Z(b)?Z(b).getToken(a).then(function(a){return{accessToken:a}}):null});return this.c(c)};h.signInWithCustomToken=function(a){var b=this;return this.sa.then(function(){return Oi(b,S(b.f,Lg,{token:a}))}).then(function(a){oi(a,"isAnonymous",!1);return b.Ra(a)}).then(function(){return Z(b)})};h.signInWithEmailAndPassword=function(a,b){var c=this;return this.sa.then(function(){return Oi(c,S(c.f,Wf,{email:a,password:b}))})};
h.createUserWithEmailAndPassword=function(a,b){var c=this;return this.sa.then(function(){return Oi(c,S(c.f,Ig,{email:a,password:b}))})};h.signInWithCredential=function(a){var b=this;return this.sa.then(function(){return Oi(b,a.Gb(b.f))})};h.signInAnonymously=function(){var a=Z(this),b=this;return a&&a.isAnonymous?J(a):this.sa.then(function(){return Oi(b,b.f.signInAnonymously())}).then(function(a){oi(a,"isAnonymous",!0);return b.Ra(a)}).then(function(){return Z(b)})};
var X=function(a){return a.app},Z=function(a){return a.currentUser};h=Y.prototype;h.Da=function(){if(this.yc)for(var a=0;a<this.La.length;a++)if(this.La[a])this.La[a](Z(this)&&Z(this)._lat||null)};h.addAuthTokenListener=function(a){var b=this;this.La.push(a);this.c(this.sa.then(function(){b.Na||Ja(b.La,a)&&a(Z(b)&&Z(b)._lat||null)}))};h.removeAuthTokenListener=function(a){Ma(this.La,function(b){return b==a})};
h.delete=function(){this.Na=!0;for(var a=0;a<this.U.length;a++)this.U[a].cancel("app-deleted");this.U=[];this.ma&&(a=this.ma,a.A.removeListener(Di,a.B,this.vc));this.m&&this.m.unsubscribe(this);return firebase.Promise.resolve()};h.c=function(a){var b=this;this.U.push(a);xd(a,function(){La(b.U,a)});return a};h.fetchProvidersForEmail=function(a){return this.c(pg(this.f,a))};h.verifyPasswordResetCode=function(a){return this.checkActionCode(a).then(function(a){return a.data.email})};
h.confirmPasswordReset=function(a,b){return this.c(this.f.confirmPasswordReset(a,b).then(function(){}))};h.checkActionCode=function(a){return this.c(this.f.checkActionCode(a).then(function(a){return{data:{email:a.email}}}))};h.applyActionCode=function(a){return this.c(this.f.applyActionCode(a).then(function(){}))};h.sendPasswordResetEmail=function(a){return this.c(this.f.sendPasswordResetEmail(a).then(function(){}))};yh(Y.prototype,{applyActionCode:{name:"applyActionCode",b:[U("code")]},checkActionCode:{name:"checkActionCode",b:[U("code")]},confirmPasswordReset:{name:"confirmPasswordReset",b:[U("code"),U("newPassword")]},createUserWithEmailAndPassword:{name:"createUserWithEmailAndPassword",b:[U("email"),U("password")]},fetchProvidersForEmail:{name:"fetchProvidersForEmail",b:[U("email")]},getRedirectResult:{name:"getRedirectResult",b:[]},onAuthStateChanged:{name:"onAuthStateChanged",b:[wh(rh(),sh(),"nextOrObserver"),
sh("opt_error",!0),sh("opt_completed",!0)]},sendPasswordResetEmail:{name:"sendPasswordResetEmail",b:[U("email")]},signInAnonymously:{name:"signInAnonymously",b:[]},signInWithCredential:{name:"signInWithCredential",b:[uh()]},signInWithCustomToken:{name:"signInWithCustomToken",b:[U("token")]},signInWithEmailAndPassword:{name:"signInWithEmailAndPassword",b:[U("email"),U("password")]},signInWithPopup:{name:"signInWithPopup",b:[vh()]},signInWithRedirect:{name:"signInWithRedirect",b:[vh()]},signOut:{name:"signOut",
b:[]},toJSON:{name:"toJSON",b:[U(null,!0)]},verifyPasswordResetCode:{name:"verifyPasswordResetCode",b:[U("code")]}});
yh(W.prototype,{"delete":{name:"delete",b:[]},getToken:{name:"getToken",b:[{name:"opt_forceRefresh",ca:"a boolean",optional:!0,da:function(a){return"boolean"==typeof a}}]},link:{name:"link",b:[uh()]},linkWithPopup:{name:"linkWithPopup",b:[vh()]},linkWithRedirect:{name:"linkWithRedirect",b:[vh()]},reauthenticate:{name:"reauthenticate",b:[uh()]},reload:{name:"reload",b:[]},sendEmailVerification:{name:"sendEmailVerification",b:[]},toJSON:{name:"toJSON",b:[U(null,!0)]},unlink:{name:"unlink",b:[U("provider")]},
updateEmail:{name:"updateEmail",b:[U("email")]},updatePassword:{name:"updatePassword",b:[U("password")]},updateProfile:{name:"updateProfile",b:[rh("profile")]}});yh(I.prototype,{l:{name:"catch"},then:{name:"then"}});V(Yf,"credential",function(a,b){return new Vf(a,b)},[U("email"),U("password")]);yh(Rf.prototype,{addScope:{name:"addScope",b:[U("scope")]}});V(Rf,"credential",Rf.credential,[wh(U(),rh(),"token")]);yh(Sf.prototype,{addScope:{name:"addScope",b:[U("scope")]}});
V(Sf,"credential",Sf.credential,[wh(U(),rh(),"token")]);yh(Tf.prototype,{addScope:{name:"addScope",b:[U("scope")]}});V(Tf,"credential",Tf.credential,[wh(U(),wh(rh(),th()),"idToken"),wh(U(),th(),"accessToken",!0)]);V(Uf,"credential",Uf.credential,[wh(U(),rh(),"token"),U("secret",!0)]);
(function(){if("undefined"!==typeof firebase&&firebase.INTERNAL&&firebase.INTERNAL.registerService){var a={Auth:Y,Error:R};V(a,"EmailAuthProvider",Yf,[]);V(a,"FacebookAuthProvider",Rf,[]);V(a,"GithubAuthProvider",Sf,[]);V(a,"GoogleAuthProvider",Tf,[]);V(a,"TwitterAuthProvider",Uf,[]);firebase.INTERNAL.registerService("auth",function(a,c){a=new Y(a);c({INTERNAL:{getToken:r(a.getToken,a),addAuthTokenListener:r(a.addAuthTokenListener,a),removeAuthTokenListener:r(a.removeAuthTokenListener,a)}});return a},
a,function(a,c){if("create"===a)try{c.auth()}catch(d){}});firebase.INTERNAL.extendNamespace({User:W})}else throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");})();})();
(function() {var h,n=this;function p(a){return void 0!==a}function aa(){}function ba(a){a.Wb=function(){return a.bf?a.bf:a.bf=new a}}
function ca(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function da(a){return"array"==ca(a)}function ea(a){var b=ca(a);return"array"==b||"object"==b&&"number"==typeof a.length}function q(a){return"string"==typeof a}function fa(a){return"number"==typeof a}function ga(a){return"function"==ca(a)}function ha(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ia(a,b,c){return a.call.apply(a.bind,arguments)}
function ja(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function r(a,b,c){r=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ia:ja;return r.apply(null,arguments)}
function ka(a,b){function c(){}c.prototype=b.prototype;a.Ig=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Eg=function(a,c,f){for(var g=Array(arguments.length-2),k=2;k<arguments.length;k++)g[k-2]=arguments[k];return b.prototype[c].apply(a,g)}};function la(){this.Ya=-1};function ma(){this.Ya=-1;this.Ya=64;this.N=[];this.Wd=[];this.Jf=[];this.zd=[];this.zd[0]=128;for(var a=1;a<this.Ya;++a)this.zd[a]=0;this.Pd=this.ac=0;this.reset()}ka(ma,la);ma.prototype.reset=function(){this.N[0]=1732584193;this.N[1]=4023233417;this.N[2]=2562383102;this.N[3]=271733878;this.N[4]=3285377520;this.Pd=this.ac=0};
function na(a,b,c){c||(c=0);var d=a.Jf;if(q(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.N[0];c=a.N[1];for(var g=a.N[2],k=a.N[3],m=a.N[4],l,e=0;80>e;e++)40>e?20>e?(f=k^c&(g^k),l=1518500249):(f=c^g^k,l=1859775393):60>e?(f=c&g|k&(c|g),l=2400959708):(f=c^g^k,l=3395469782),f=(b<<
5|b>>>27)+f+m+l+d[e]&4294967295,m=k,k=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.N[0]=a.N[0]+b&4294967295;a.N[1]=a.N[1]+c&4294967295;a.N[2]=a.N[2]+g&4294967295;a.N[3]=a.N[3]+k&4294967295;a.N[4]=a.N[4]+m&4294967295}
ma.prototype.update=function(a,b){if(null!=a){p(b)||(b=a.length);for(var c=b-this.Ya,d=0,e=this.Wd,f=this.ac;d<b;){if(0==f)for(;d<=c;)na(this,a,d),d+=this.Ya;if(q(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.Ya){na(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.Ya){na(this,e);f=0;break}}this.ac=f;this.Pd+=b}};function t(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function oa(a,b){var c={},d;for(d in a)c[d]=b.call(void 0,a[d],d,a);return c}function pa(a,b){for(var c in a)if(!b.call(void 0,a[c],c,a))return!1;return!0}function qa(a){var b=0,c;for(c in a)b++;return b}function ra(a){for(var b in a)return b}function sa(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function ta(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function ua(a,b){for(var c in a)if(a[c]==b)return!0;return!1}
function va(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d}function wa(a,b){var c=va(a,b,void 0);return c&&a[c]}function xa(a){for(var b in a)return!1;return!0}function ya(a){var b={},c;for(c in a)b[c]=a[c];return b};function za(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function Aa(){this.Fd=void 0}
function Ba(a,b,c){switch(typeof b){case "string":Ca(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(da(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],Ba(a,a.Fd?a.Fd.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),Ca(f,c),
c.push(":"),Ba(a,a.Fd?a.Fd.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var Da={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Ea=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function Ca(a,b){b.push('"',a.replace(Ea,function(a){if(a in Da)return Da[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return Da[a]=e+b.toString(16)}),'"')};var v;a:{var Fa=n.navigator;if(Fa){var Ga=Fa.userAgent;if(Ga){v=Ga;break a}}v=""};function Ha(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Ha);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}ka(Ha,Error);Ha.prototype.name="CustomError";var w=Array.prototype,Ia=w.indexOf?function(a,b,c){return w.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(q(a))return q(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Ja=w.forEach?function(a,b,c){w.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Ka=w.filter?function(a,b,c){return w.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=q(a)?
a.split(""):a,k=0;k<d;k++)if(k in g){var m=g[k];b.call(c,m,k,a)&&(e[f++]=m)}return e},La=w.map?function(a,b,c){return w.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=q(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Ma=w.reduce?function(a,b,c,d){for(var e=[],f=1,g=arguments.length;f<g;f++)e.push(arguments[f]);d&&(e[0]=r(b,d));return w.reduce.apply(a,e)}:function(a,b,c,d){var e=c;Ja(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Na=w.every?function(a,b,
c){return w.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Oa(a,b){var c=Pa(a,b,void 0);return 0>c?null:q(a)?a.charAt(c):a[c]}function Pa(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}function Qa(a,b){var c=Ia(a,b);0<=c&&w.splice.call(a,c,1)}function Ra(a,b,c){return 2>=arguments.length?w.slice.call(a,b):w.slice.call(a,b,c)}
function Sa(a,b){a.sort(b||Ta)}function Ta(a,b){return a>b?1:a<b?-1:0};var Ua=-1!=v.indexOf("Opera")||-1!=v.indexOf("OPR"),Va=-1!=v.indexOf("Trident")||-1!=v.indexOf("MSIE"),Wa=-1!=v.indexOf("Gecko")&&-1==v.toLowerCase().indexOf("webkit")&&!(-1!=v.indexOf("Trident")||-1!=v.indexOf("MSIE")),Xa=-1!=v.toLowerCase().indexOf("webkit");
(function(){var a="",b;if(Ua&&n.opera)return a=n.opera.version,ga(a)?a():a;Wa?b=/rv\:([^\);]+)(\)|;)/:Va?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Xa&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(v))?a[1]:"");return Va&&(b=(b=n.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Ya=null,Za=null,$a=null;function ab(a,b){if(!ea(a))throw Error("encodeByteArray takes an array as a parameter");bb();for(var c=b?Za:Ya,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,k=g?a[e+1]:0,m=e+2<a.length,l=m?a[e+2]:0,u=f>>2,f=(f&3)<<4|k>>4,k=(k&15)<<2|l>>6,l=l&63;m||(l=64,g||(k=64));d.push(c[u],c[f],c[k],c[l])}return d.join("")}
function bb(){if(!Ya){Ya={};Za={};$a={};for(var a=0;65>a;a++)Ya[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),Za[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a),$a[Za[a]]=a,62<=a&&($a["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)]=a)}};function cb(a){n.setTimeout(function(){throw a;},0)}var db;
function eb(){var a=n.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==v.indexOf("Presto")&&(a=function(){var a=document.createElement("iframe");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=r(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==v.indexOf("Trident")&&-1==v.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(p(c.next)){c=c.next;var a=c.Le;c.Le=null;a()}};return function(a){d.next={Le:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("script")?function(a){var b=
document.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){n.setTimeout(a,0)}};function fb(a,b){gb||hb();ib||(gb(),ib=!0);jb.push(new kb(a,b))}var gb;function hb(){if(n.Promise&&n.Promise.resolve){var a=n.Promise.resolve();gb=function(){a.then(lb)}}else gb=function(){var a=lb;!ga(n.setImmediate)||n.Window&&n.Window.prototype&&n.Window.prototype.setImmediate==n.setImmediate?(db||(db=eb()),db(a)):n.setImmediate(a)}}var ib=!1,jb=[];[].push(function(){ib=!1;jb=[]});
function lb(){for(;jb.length;){var a=jb;jb=[];for(var b=0;b<a.length;b++){var c=a[b];try{c.Wf.call(c.scope)}catch(d){cb(d)}}}ib=!1}function kb(a,b){this.Wf=a;this.scope=b};function mb(a,b){this.L=nb;this.uf=void 0;this.Ca=this.Ha=null;this.jd=this.be=!1;if(a==ob)pb(this,qb,b);else try{var c=this;a.call(b,function(a){pb(c,qb,a)},function(a){if(!(a instanceof rb))try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(b){}pb(c,sb,a)})}catch(d){pb(this,sb,d)}}var nb=0,qb=2,sb=3;function ob(){}mb.prototype.then=function(a,b,c){return tb(this,ga(a)?a:null,ga(b)?b:null,c)};mb.prototype.then=mb.prototype.then;mb.prototype.$goog_Thenable=!0;h=mb.prototype;
h.Ag=function(a,b){return tb(this,null,a,b)};h.cancel=function(a){this.L==nb&&fb(function(){var b=new rb(a);ub(this,b)},this)};function ub(a,b){if(a.L==nb)if(a.Ha){var c=a.Ha;if(c.Ca){for(var d=0,e=-1,f=0,g;g=c.Ca[f];f++)if(g=g.m)if(d++,g==a&&(e=f),0<=e&&1<d)break;0<=e&&(c.L==nb&&1==d?ub(c,b):(d=c.Ca.splice(e,1)[0],vb(c,d,sb,b)))}a.Ha=null}else pb(a,sb,b)}function wb(a,b){a.Ca&&a.Ca.length||a.L!=qb&&a.L!=sb||xb(a);a.Ca||(a.Ca=[]);a.Ca.push(b)}
function tb(a,b,c,d){var e={m:null,hf:null,kf:null};e.m=new mb(function(a,g){e.hf=b?function(c){try{var e=b.call(d,c);a(e)}catch(l){g(l)}}:a;e.kf=c?function(b){try{var e=c.call(d,b);!p(e)&&b instanceof rb?g(b):a(e)}catch(l){g(l)}}:g});e.m.Ha=a;wb(a,e);return e.m}h.Cf=function(a){this.L=nb;pb(this,qb,a)};h.Df=function(a){this.L=nb;pb(this,sb,a)};
function pb(a,b,c){if(a.L==nb){if(a==c)b=sb,c=new TypeError("Promise cannot resolve to itself");else{var d;if(c)try{d=!!c.$goog_Thenable}catch(e){d=!1}else d=!1;if(d){a.L=1;c.then(a.Cf,a.Df,a);return}if(ha(c))try{var f=c.then;if(ga(f)){yb(a,c,f);return}}catch(g){b=sb,c=g}}a.uf=c;a.L=b;a.Ha=null;xb(a);b!=sb||c instanceof rb||zb(a,c)}}function yb(a,b,c){function d(b){f||(f=!0,a.Df(b))}function e(b){f||(f=!0,a.Cf(b))}a.L=1;var f=!1;try{c.call(b,e,d)}catch(g){d(g)}}
function xb(a){a.be||(a.be=!0,fb(a.Uf,a))}h.Uf=function(){for(;this.Ca&&this.Ca.length;){var a=this.Ca;this.Ca=null;for(var b=0;b<a.length;b++)vb(this,a[b],this.L,this.uf)}this.be=!1};function vb(a,b,c,d){if(c==qb)b.hf(d);else{if(b.m)for(;a&&a.jd;a=a.Ha)a.jd=!1;b.kf(d)}}function zb(a,b){a.jd=!0;fb(function(){a.jd&&Ab.call(null,b)})}var Ab=cb;function rb(a){Ha.call(this,a)}ka(rb,Ha);rb.prototype.name="cancel";function Bb(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function x(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function Cb(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])};function y(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}function Db(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}return a=a+" failed: "+(d+" argument ")}
function A(a,b,c,d){if((!d||p(c))&&!ga(c))throw Error(Db(a,b,d)+"must be a valid function.");}function Eb(a,b,c){if(p(c)&&(!ha(c)||null===c))throw Error(Db(a,b,!0)+"must be a valid context object.");};function Fb(a){var b=[];Cb(a,function(a,d){da(d)?Ja(d,function(d){b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))}):b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))});return b.length?"&"+b.join("&"):""};var Gb=n.Promise||mb;mb.prototype["catch"]=mb.prototype.Ag;function Hb(){var a=this;this.reject=this.resolve=null;this.ra=new Gb(function(b,c){a.resolve=b;a.reject=c})}function Ib(a,b){return function(c,d){c?a.reject(c):a.resolve(d);ga(b)&&(Jb(a.ra),1===b.length?b(c):b(c,d))}}function Jb(a){a.then(void 0,aa)};function Kb(a,b){if(!a)throw Lb(b);}function Lb(a){return Error("Firebase Database ("+firebase.SDK_VERSION+") INTERNAL ASSERT FAILED: "+a)};function Mb(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,Kb(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function Nb(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b++:2048>d?b+=2:55296<=d&&56319>=d?(b+=4,c++):b+=3}return b};function Ob(a){return"undefined"!==typeof JSON&&p(JSON.parse)?JSON.parse(a):za(a)}function B(a){if("undefined"!==typeof JSON&&p(JSON.stringify))a=JSON.stringify(a);else{var b=[];Ba(new Aa,a,b);a=b.join("")}return a};function Pb(a,b){this.committed=a;this.snapshot=b};function Qb(){return"undefined"!==typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test("undefined"!==typeof navigator&&"string"===typeof navigator.userAgent?navigator.userAgent:"")};function Rb(a){this.te=a;this.Bd=[];this.Rb=0;this.Yd=-1;this.Gb=null}function Sb(a,b,c){a.Yd=b;a.Gb=c;a.Yd<a.Rb&&(a.Gb(),a.Gb=null)}function Tb(a,b,c){for(a.Bd[b]=c;a.Bd[a.Rb];){var d=a.Bd[a.Rb];delete a.Bd[a.Rb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;Ub(function(){f.te(d[e])})}if(a.Rb===a.Yd){a.Gb&&(clearTimeout(a.Gb),a.Gb(),a.Gb=null);break}a.Rb++}};function Vb(){this.qc={}}Vb.prototype.set=function(a,b){null==b?delete this.qc[a]:this.qc[a]=b};Vb.prototype.get=function(a){return Bb(this.qc,a)?this.qc[a]:null};Vb.prototype.remove=function(a){delete this.qc[a]};Vb.prototype.cf=!0;function Wb(a){this.vc=a;this.Cd="firebase:"}h=Wb.prototype;h.set=function(a,b){null==b?this.vc.removeItem(this.Cd+a):this.vc.setItem(this.Cd+a,B(b))};h.get=function(a){a=this.vc.getItem(this.Cd+a);return null==a?null:Ob(a)};h.remove=function(a){this.vc.removeItem(this.Cd+a)};h.cf=!1;h.toString=function(){return this.vc.toString()};function Xb(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new Wb(b)}}catch(c){}return new Vb}var Yb=Xb("localStorage"),Zb=Xb("sessionStorage");function $b(a,b,c){this.type=ac;this.source=a;this.path=b;this.Ja=c}$b.prototype.Nc=function(a){return this.path.e()?new $b(this.source,C,this.Ja.R(a)):new $b(this.source,D(this.path),this.Ja)};$b.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" overwrite: "+this.Ja.toString()+")"};function bc(a,b){this.type=cc;this.source=a;this.path=b}bc.prototype.Nc=function(){return this.path.e()?new bc(this.source,C):new bc(this.source,D(this.path))};bc.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" listen_complete)"};function dc(a){this.He=a}dc.prototype.getToken=function(a){return this.He.INTERNAL.getToken(a).then(null,function(a){return a&&"auth/token-not-initialized"===a.code?(E("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(a)})};function ec(a,b){a.He.INTERNAL.addAuthTokenListener(b)};function fc(){this.Jd=F}fc.prototype.j=function(a){return this.Jd.Q(a)};fc.prototype.toString=function(){return this.Jd.toString()};function gc(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.Sc=b;this.pe=c;this.Cg=d;this.nf=e||"";this.bb=Yb.get("host:"+a)||this.host}function hc(a,b){b!==a.bb&&(a.bb=b,"s-"===a.bb.substr(0,2)&&Yb.set("host:"+a.host,a.bb))}
function ic(a,b,c){H("string"===typeof b,"typeof type must == string");H("object"===typeof c,"typeof params must == object");if("websocket"===b)b=(a.Sc?"wss://":"ws://")+a.bb+"/.ws?";else if("long_polling"===b)b=(a.Sc?"https://":"http://")+a.bb+"/.lp?";else throw Error("Unknown connection type: "+b);a.host!==a.bb&&(c.ns=a.pe);var d=[];t(c,function(a,b){d.push(b+"="+a)});return b+d.join("&")}
gc.prototype.toString=function(){var a=(this.Sc?"https://":"http://")+this.host;this.nf&&(a+="<"+this.nf+">");return a};function jc(a,b){this.zf={};this.Vc=new kc(a);this.va=b;var c=1E4+2E4*Math.random();setTimeout(r(this.rf,this),Math.floor(c))}jc.prototype.rf=function(){var a=this.Vc.get(),b={},c=!1,d;for(d in a)0<a[d]&&Bb(this.zf,d)&&(b[d]=a[d],c=!0);c&&this.va.ye(b);setTimeout(r(this.rf,this),Math.floor(6E5*Math.random()))};function lc(){this.uc={}}function mc(a,b,c){p(c)||(c=1);Bb(a.uc,b)||(a.uc[b]=0);a.uc[b]+=c}lc.prototype.get=function(){return ya(this.uc)};function kc(a){this.Nf=a;this.rd=null}kc.prototype.get=function(){var a=this.Nf.get(),b=ya(a);if(this.rd)for(var c in this.rd)b[c]-=this.rd[c];this.rd=a;return b};var nc={},oc={};function pc(a){a=a.toString();nc[a]||(nc[a]=new lc);return nc[a]}function qc(a,b){var c=a.toString();oc[c]||(oc[c]=b());return oc[c]};function rc(){this.wb=[]}function sc(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d],f=e.Zb();null===c||f.ca(c.Zb())||(a.wb.push(c),c=null);null===c&&(c=new tc(f));c.add(e)}c&&a.wb.push(c)}function uc(a,b,c){sc(a,c);vc(a,function(a){return a.ca(b)})}function wc(a,b,c){sc(a,c);vc(a,function(a){return a.contains(b)||b.contains(a)})}
function vc(a,b){for(var c=!0,d=0;d<a.wb.length;d++){var e=a.wb[d];if(e)if(e=e.Zb(),b(e)){for(var e=a.wb[d],f=0;f<e.hd.length;f++){var g=e.hd[f];if(null!==g){e.hd[f]=null;var k=g.Ub();xc&&E("event: "+g.toString());Ub(k)}}a.wb[d]=null}else c=!1}c&&(a.wb=[])}function tc(a){this.qa=a;this.hd=[]}tc.prototype.add=function(a){this.hd.push(a)};tc.prototype.Zb=function(){return this.qa};function yc(a,b,c,d){this.ae=b;this.Md=c;this.Dd=d;this.gd=a}yc.prototype.Zb=function(){var a=this.Md.xb();return"value"===this.gd?a.path:a.getParent().path};yc.prototype.ge=function(){return this.gd};yc.prototype.Ub=function(){return this.ae.Ub(this)};yc.prototype.toString=function(){return this.Zb().toString()+":"+this.gd+":"+B(this.Md.Ue())};function zc(a,b,c){this.ae=a;this.error=b;this.path=c}zc.prototype.Zb=function(){return this.path};zc.prototype.ge=function(){return"cancel"};
zc.prototype.Ub=function(){return this.ae.Ub(this)};zc.prototype.toString=function(){return this.path.toString()+":cancel"};function Ac(){}Ac.prototype.Xe=function(){return null};Ac.prototype.fe=function(){return null};var Bc=new Ac;function Cc(a,b,c){this.Gf=a;this.Na=b;this.yd=c}Cc.prototype.Xe=function(a){var b=this.Na.O;if(Dc(b,a))return b.j().R(a);b=null!=this.yd?new Ec(this.yd,!0,!1):this.Na.u();return this.Gf.rc(a,b)};Cc.prototype.fe=function(a,b,c){var d=null!=this.yd?this.yd:Fc(this.Na);a=this.Gf.Xd(d,b,1,c,a);return 0===a.length?null:a[0]};function I(a,b,c,d){this.type=a;this.Ma=b;this.Za=c;this.qe=d;this.Dd=void 0}function Gc(a){return new I(Hc,a)}var Hc="value";function Ec(a,b,c){this.A=a;this.ea=b;this.Tb=c}function Ic(a){return a.ea}function Jc(a){return a.Tb}function Kc(a,b){return b.e()?a.ea&&!a.Tb:Dc(a,J(b))}function Dc(a,b){return a.ea&&!a.Tb||a.A.Fa(b)}Ec.prototype.j=function(){return this.A};function Lc(a,b){return Mc(a.name,b.name)}function Nc(a,b){return Mc(a,b)};function K(a,b){this.name=a;this.S=b}function Oc(a,b){return new K(a,b)};function Pc(a,b){return a&&"object"===typeof a?(H(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function Qc(a,b){var c=new Rc;Sc(a,new L(""),function(a,e){Tc(c,a,Uc(e,b))});return c}function Uc(a,b){var c=a.C().H(),c=Pc(c,b),d;if(a.J()){var e=Pc(a.Ea(),b);return e!==a.Ea()||c!==a.C().H()?new Vc(e,M(c)):a}d=a;c!==a.C().H()&&(d=d.ga(new Vc(c)));a.P(N,function(a,c){var e=Uc(c,b);e!==c&&(d=d.U(a,e))});return d};var Wc=function(){var a=1;return function(){return a++}}(),H=Kb,Xc=Lb;
function Yc(a){try{var b;bb();for(var c=$a,d=[],e=0;e<a.length;){var f=c[a.charAt(e++)],g=e<a.length?c[a.charAt(e)]:0;++e;var k=e<a.length?c[a.charAt(e)]:64;++e;var m=e<a.length?c[a.charAt(e)]:64;++e;if(null==f||null==g||null==k||null==m)throw Error();d.push(f<<2|g>>4);64!=k&&(d.push(g<<4&240|k>>2),64!=m&&d.push(k<<6&192|m))}if(8192>d.length)b=String.fromCharCode.apply(null,d);else{a="";for(c=0;c<d.length;c+=8192)a+=String.fromCharCode.apply(null,Ra(d,c,c+8192));b=a}return b}catch(l){E("base64Decode failed: ",
l)}return null}function Zc(a){var b=Mb(a);a=new ma;a.update(b);var b=[],c=8*a.Pd;56>a.ac?a.update(a.zd,56-a.ac):a.update(a.zd,a.Ya-(a.ac-56));for(var d=a.Ya-1;56<=d;d--)a.Wd[d]=c&255,c/=256;na(a,a.Wd);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.N[d]>>e&255,++c;return ab(b)}function $c(a){for(var b="",c=0;c<arguments.length;c++)b=ea(arguments[c])?b+$c.apply(null,arguments[c]):"object"===typeof arguments[c]?b+B(arguments[c]):b+arguments[c],b+=" ";return b}var xc=null,ad=!0;
function bd(a,b){Kb(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?xc=r(console.log,console):"object"===typeof console.log&&(xc=function(a){console.log(a)})),b&&Zb.set("logging_enabled",!0)):ga(a)?xc=a:(xc=null,Zb.remove("logging_enabled"))}function E(a){!0===ad&&(ad=!1,null===xc&&!0===Zb.get("logging_enabled")&&bd(!0));if(xc){var b=$c.apply(null,arguments);xc(b)}}
function cd(a){return function(){E(a,arguments)}}function dd(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+$c.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function ed(a){var b=$c.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}function O(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+$c.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function fd(a){var b,c,d,e,f,g=a;f=c=a=b="";d=!0;e="https";if(q(g)){var k=g.indexOf("//");0<=k&&(e=g.substring(0,k-1),g=g.substring(k+2));k=g.indexOf("/");-1===k&&(k=g.length);b=g.substring(0,k);f="";g=g.substring(k).split("/");for(k=0;k<g.length;k++)if(0<g[k].length){var m=g[k];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(l){}f+="/"+m}g=b.split(".");3===g.length?(a=g[1],c=g[0].toLowerCase()):2===g.length&&(a=g[0]);k=b.indexOf(":");0<=k&&(d="https"===e||"wss"===e)}"firebase"===a&&ed(b+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");
c&&"undefined"!=c||ed("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&O("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");return{kc:new gc(b,d,c,"ws"===e||"wss"===e),path:new L(f)}}function gd(a){return fa(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function hd(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function Mc(a,b){if(a===b)return 0;if("[MIN_NAME]"===a||"[MAX_NAME]"===b)return-1;if("[MIN_NAME]"===b||"[MAX_NAME]"===a)return 1;var c=id(a),d=id(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function jd(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+B(b));}
function kd(a){if("object"!==typeof a||null===a)return B(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=B(b[d]),c+=":",c+=kd(a[b[d]]);return c+"}"}function ld(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function md(a,b){if(da(a))for(var c=0;c<a.length;++c)b(c,a[c]);else t(a,b)}
function nd(a){H(!gd(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;--a)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;--a)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}var od=/^-?\d{1,10}$/;function id(a){return od.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}function Ub(a){try{a()}catch(b){setTimeout(function(){O("Exception was thrown by user callback.",b.stack||"");throw b;},Math.floor(0))}}function pd(a,b,c){Object.defineProperty(a,b,{get:c})};function qd(a){var b={},c={},d={},e="";try{var f=a.split("."),b=Ob(Yc(f[0])||""),c=Ob(Yc(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(g){}return{Fg:b,Me:c,data:d,xg:e}}function rd(a){a=qd(a);var b=a.Me;return!!a.xg&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")}function sd(a){a=qd(a).Me;return"object"===typeof a&&!0===x(a,"admin")};var ud=null;"undefined"!==typeof MozWebSocket?ud=MozWebSocket:"undefined"!==typeof WebSocket&&(ud=WebSocket);function vd(a,b,c,d){this.Zd=a;this.f=cd(this.Zd);this.frames=this.Ac=null;this.qb=this.rb=this.Fe=0;this.Xa=pc(b);a={v:"5"};"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");c&&(a.s=c);d&&(a.ls=d);this.Ne=ic(b,"websocket",a)}var wd;
vd.prototype.open=function(a,b){this.kb=b;this.hg=a;this.f("Websocket connecting to "+this.Ne);this.xc=!1;Yb.set("previous_websocket_failure",!0);try{this.La=new ud(this.Ne)}catch(c){this.f("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.f(d);this.fb();return}var e=this;this.La.onopen=function(){e.f("Websocket connected.");e.xc=!0};this.La.onclose=function(){e.f("Websocket connection was disconnected.");e.La=null;e.fb()};this.La.onmessage=function(a){if(null!==e.La)if(a=a.data,e.qb+=
a.length,mc(e.Xa,"bytes_received",a.length),xd(e),null!==e.frames)yd(e,a);else{a:{H(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.Fe=b;e.frames=[];a=null;break a}}e.Fe=1;e.frames=[]}null!==a&&yd(e,a)}};this.La.onerror=function(a){e.f("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.f(a);e.fb()}};vd.prototype.start=function(){};
vd.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==ud&&!wd};vd.responsesRequiredToBeHealthy=2;vd.healthyTimeout=3E4;h=vd.prototype;h.sd=function(){Yb.remove("previous_websocket_failure")};function yd(a,b){a.frames.push(b);if(a.frames.length==a.Fe){var c=a.frames.join("");a.frames=null;c=Ob(c);a.hg(c)}}
h.send=function(a){xd(this);a=B(a);this.rb+=a.length;mc(this.Xa,"bytes_sent",a.length);a=ld(a,16384);1<a.length&&zd(this,String(a.length));for(var b=0;b<a.length;b++)zd(this,a[b])};h.Tc=function(){this.Bb=!0;this.Ac&&(clearInterval(this.Ac),this.Ac=null);this.La&&(this.La.close(),this.La=null)};h.fb=function(){this.Bb||(this.f("WebSocket is closing itself"),this.Tc(),this.kb&&(this.kb(this.xc),this.kb=null))};h.close=function(){this.Bb||(this.f("WebSocket is being closed"),this.Tc())};
function xd(a){clearInterval(a.Ac);a.Ac=setInterval(function(){a.La&&zd(a,"0");xd(a)},Math.floor(45E3))}function zd(a,b){try{a.La.send(b)}catch(c){a.f("Exception thrown from WebSocket.send():",c.message||c.data,"Closing connection."),setTimeout(r(a.fb,a),0)}};function Ad(a,b,c){this.f=cd("p:rest:");this.M=a;this.Hb=b;this.Vd=c;this.$={}}function Bd(a,b){if(p(b))return"tag$"+b;H(Cd(a.n),"should have a tag if it's not a default query.");return a.path.toString()}h=Ad.prototype;
h.df=function(a,b,c,d){var e=a.path.toString();this.f("Listen called for "+e+" "+a.ya());var f=Bd(a,c),g={};this.$[f]=g;a=Dd(a.n);var k=this;Ed(this,e+".json",a,function(a,b){var u=b;404===a&&(a=u=null);null===a&&k.Hb(e,u,!1,c);x(k.$,f)===g&&d(a?401==a?"permission_denied":"rest_error:"+a:"ok",null)})};h.Ef=function(a,b){var c=Bd(a,b);delete this.$[c]};h.qf=function(){};h.re=function(){};h.gf=function(){};h.xd=function(){};h.put=function(){};h.ef=function(){};h.ye=function(){};
function Ed(a,b,c,d){c=c||{};c.format="export";a.Vd.getToken(!1).then(function(e){(e=e&&e.accessToken)&&(c.auth=e);var f=(a.M.Sc?"https://":"http://")+a.M.host+b+"?"+Fb(c);a.f("Sending REST request for "+f);var g=new XMLHttpRequest;g.onreadystatechange=function(){if(d&&4===g.readyState){a.f("REST Response for "+f+" received. status:",g.status,"response:",g.responseText);var b=null;if(200<=g.status&&300>g.status){try{b=Ob(g.responseText)}catch(c){O("Failed to parse JSON response for "+f+": "+g.responseText)}d(null,
b)}else 401!==g.status&&404!==g.status&&O("Got unsuccessful REST response for "+f+" Status: "+g.status),d(g.status);d=null}};g.open("GET",f,!0);g.send()})};function Fd(a,b,c){this.type=Gd;this.source=a;this.path=b;this.children=c}Fd.prototype.Nc=function(a){if(this.path.e())return a=this.children.subtree(new L(a)),a.e()?null:a.value?new $b(this.source,C,a.value):new Fd(this.source,C,a);H(J(this.path)===a,"Can't get a merge for a child not on the path of the operation");return new Fd(this.source,D(this.path),this.children)};Fd.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"};function Hd(){this.hb={}}
function Id(a,b){var c=b.type,d=b.Za;H("child_added"==c||"child_changed"==c||"child_removed"==c,"Only child changes supported for tracking");H(".priority"!==d,"Only non-priority child changes can be tracked.");var e=x(a.hb,d);if(e){var f=e.type;if("child_added"==c&&"child_removed"==f)a.hb[d]=new I("child_changed",b.Ma,d,e.Ma);else if("child_removed"==c&&"child_added"==f)delete a.hb[d];else if("child_removed"==c&&"child_changed"==f)a.hb[d]=new I("child_removed",e.qe,d);else if("child_changed"==c&&
"child_added"==f)a.hb[d]=new I("child_added",b.Ma,d);else if("child_changed"==c&&"child_changed"==f)a.hb[d]=new I("child_changed",b.Ma,d,e.qe);else throw Xc("Illegal combination of changes: "+b+" occurred after "+e);}else a.hb[d]=b};function Jd(a){this.W=a;this.g=a.n.g}function Kd(a,b,c,d){var e=[],f=[];Ja(b,function(b){"child_changed"===b.type&&a.g.nd(b.qe,b.Ma)&&f.push(new I("child_moved",b.Ma,b.Za))});Ld(a,e,"child_removed",b,d,c);Ld(a,e,"child_added",b,d,c);Ld(a,e,"child_moved",f,d,c);Ld(a,e,"child_changed",b,d,c);Ld(a,e,Hc,b,d,c);return e}function Ld(a,b,c,d,e,f){d=Ka(d,function(a){return a.type===c});Sa(d,r(a.Of,a));Ja(d,function(c){var d=Md(a,c,f);Ja(e,function(e){e.tf(c.type)&&b.push(e.createEvent(d,a.W))})})}
function Md(a,b,c){"value"!==b.type&&"child_removed"!==b.type&&(b.Dd=c.Ze(b.Za,b.Ma,a.g));return b}Jd.prototype.Of=function(a,b){if(null==a.Za||null==b.Za)throw Xc("Should only compare child_ events.");return this.g.compare(new K(a.Za,a.Ma),new K(b.Za,b.Ma))};function Nd(a,b){this.Sd=a;this.Mf=b}function Od(a){this.V=a}
Od.prototype.gb=function(a,b,c,d){var e=new Hd,f;if(b.type===ac)b.source.ee?c=Pd(this,a,b.path,b.Ja,c,d,e):(H(b.source.We,"Unknown source."),f=b.source.Ee||Jc(a.u())&&!b.path.e(),c=Qd(this,a,b.path,b.Ja,c,d,f,e));else if(b.type===Gd)b.source.ee?c=Rd(this,a,b.path,b.children,c,d,e):(H(b.source.We,"Unknown source."),f=b.source.Ee||Jc(a.u()),c=Sd(this,a,b.path,b.children,c,d,f,e));else if(b.type===Td)if(b.Id)if(b=b.path,null!=c.mc(b))c=a;else{f=new Cc(c,a,d);d=a.O.j();if(b.e()||".priority"===J(b))Ic(a.u())?
b=c.Ba(Fc(a)):(b=a.u().j(),H(b instanceof P,"serverChildren would be complete if leaf node"),b=c.sc(b)),b=this.V.za(d,b,e);else{var g=J(b),k=c.rc(g,a.u());null==k&&Dc(a.u(),g)&&(k=d.R(g));b=null!=k?this.V.F(d,g,k,D(b),f,e):a.O.j().Fa(g)?this.V.F(d,g,F,D(b),f,e):d;b.e()&&Ic(a.u())&&(d=c.Ba(Fc(a)),d.J()&&(b=this.V.za(b,d,e)))}d=Ic(a.u())||null!=c.mc(C);c=Ud(a,b,d,this.V.Qa())}else c=Vd(this,a,b.path,b.Pb,c,d,e);else if(b.type===cc)d=b.path,b=a.u(),f=b.j(),g=b.ea||d.e(),c=Wd(this,new Xd(a.O,new Ec(f,
g,b.Tb)),d,c,Bc,e);else throw Xc("Unknown operation type: "+b.type);e=sa(e.hb);d=c;b=d.O;b.ea&&(f=b.j().J()||b.j().e(),g=Yd(a),(0<e.length||!a.O.ea||f&&!b.j().ca(g)||!b.j().C().ca(g.C()))&&e.push(Gc(Yd(d))));return new Nd(c,e)};
function Wd(a,b,c,d,e,f){var g=b.O;if(null!=d.mc(c))return b;var k;if(c.e())H(Ic(b.u()),"If change path is empty, we must have complete server data"),Jc(b.u())?(e=Fc(b),d=d.sc(e instanceof P?e:F)):d=d.Ba(Fc(b)),f=a.V.za(b.O.j(),d,f);else{var m=J(c);if(".priority"==m)H(1==Zd(c),"Can't have a priority with additional path components"),f=g.j(),k=b.u().j(),d=d.$c(c,f,k),f=null!=d?a.V.ga(f,d):g.j();else{var l=D(c);Dc(g,m)?(k=b.u().j(),d=d.$c(c,g.j(),k),d=null!=d?g.j().R(m).F(l,d):g.j().R(m)):d=d.rc(m,
b.u());f=null!=d?a.V.F(g.j(),m,d,l,e,f):g.j()}}return Ud(b,f,g.ea||c.e(),a.V.Qa())}function Qd(a,b,c,d,e,f,g,k){var m=b.u();g=g?a.V:a.V.Vb();if(c.e())d=g.za(m.j(),d,null);else if(g.Qa()&&!m.Tb)d=m.j().F(c,d),d=g.za(m.j(),d,null);else{var l=J(c);if(!Kc(m,c)&&1<Zd(c))return b;var u=D(c);d=m.j().R(l).F(u,d);d=".priority"==l?g.ga(m.j(),d):g.F(m.j(),l,d,u,Bc,null)}m=m.ea||c.e();b=new Xd(b.O,new Ec(d,m,g.Qa()));return Wd(a,b,c,e,new Cc(e,b,f),k)}
function Pd(a,b,c,d,e,f,g){var k=b.O;e=new Cc(e,b,f);if(c.e())g=a.V.za(b.O.j(),d,g),a=Ud(b,g,!0,a.V.Qa());else if(f=J(c),".priority"===f)g=a.V.ga(b.O.j(),d),a=Ud(b,g,k.ea,k.Tb);else{c=D(c);var m=k.j().R(f);if(!c.e()){var l=e.Xe(f);d=null!=l?".priority"===$d(c)&&l.Q(c.parent()).e()?l:l.F(c,d):F}m.ca(d)?a=b:(g=a.V.F(k.j(),f,d,c,e,g),a=Ud(b,g,k.ea,a.V.Qa()))}return a}
function Rd(a,b,c,d,e,f,g){var k=b;ae(d,function(d,l){var u=c.m(d);Dc(b.O,J(u))&&(k=Pd(a,k,u,l,e,f,g))});ae(d,function(d,l){var u=c.m(d);Dc(b.O,J(u))||(k=Pd(a,k,u,l,e,f,g))});return k}function be(a,b){ae(b,function(b,d){a=a.F(b,d)});return a}
function Sd(a,b,c,d,e,f,g,k){if(b.u().j().e()&&!Ic(b.u()))return b;var m=b;c=c.e()?d:ce(Q,c,d);var l=b.u().j();c.children.ia(function(c,d){if(l.Fa(c)){var G=b.u().j().R(c),G=be(G,d);m=Qd(a,m,new L(c),G,e,f,g,k)}});c.children.ia(function(c,d){var G=!Dc(b.u(),c)&&null==d.value;l.Fa(c)||G||(G=b.u().j().R(c),G=be(G,d),m=Qd(a,m,new L(c),G,e,f,g,k))});return m}
function Vd(a,b,c,d,e,f,g){if(null!=e.mc(c))return b;var k=Jc(b.u()),m=b.u();if(null!=d.value){if(c.e()&&m.ea||Kc(m,c))return Qd(a,b,c,m.j().Q(c),e,f,k,g);if(c.e()){var l=Q;m.j().P(de,function(a,b){l=l.set(new L(a),b)});return Sd(a,b,c,l,e,f,k,g)}return b}l=Q;ae(d,function(a){var b=c.m(a);Kc(m,b)&&(l=l.set(a,m.j().Q(b)))});return Sd(a,b,c,l,e,f,k,g)};function ee(a){this.g=a}h=ee.prototype;h.F=function(a,b,c,d,e,f){H(a.zc(this.g),"A node must be indexed if only a child is updated");e=a.R(b);if(e.Q(d).ca(c.Q(d))&&e.e()==c.e())return a;null!=f&&(c.e()?a.Fa(b)?Id(f,new I("child_removed",e,b)):H(a.J(),"A child remove without an old child only makes sense on a leaf node"):e.e()?Id(f,new I("child_added",c,b)):Id(f,new I("child_changed",c,b,e)));return a.J()&&c.e()?a:a.U(b,c).ob(this.g)};
h.za=function(a,b,c){null!=c&&(a.J()||a.P(N,function(a,e){b.Fa(a)||Id(c,new I("child_removed",e,a))}),b.J()||b.P(N,function(b,e){if(a.Fa(b)){var f=a.R(b);f.ca(e)||Id(c,new I("child_changed",e,b,f))}else Id(c,new I("child_added",e,b))}));return b.ob(this.g)};h.ga=function(a,b){return a.e()?F:a.ga(b)};h.Qa=function(){return!1};h.Vb=function(){return this};function fe(a){this.he=new ee(a.g);this.g=a.g;var b;a.ka?(b=ge(a),b=a.g.Fc(he(a),b)):b=a.g.Ic();this.Uc=b;a.na?(b=ie(a),a=a.g.Fc(je(a),b)):a=a.g.Gc();this.wc=a}h=fe.prototype;h.matches=function(a){return 0>=this.g.compare(this.Uc,a)&&0>=this.g.compare(a,this.wc)};h.F=function(a,b,c,d,e,f){this.matches(new K(b,c))||(c=F);return this.he.F(a,b,c,d,e,f)};
h.za=function(a,b,c){b.J()&&(b=F);var d=b.ob(this.g),d=d.ga(F),e=this;b.P(N,function(a,b){e.matches(new K(a,b))||(d=d.U(a,F))});return this.he.za(a,d,c)};h.ga=function(a){return a};h.Qa=function(){return!0};h.Vb=function(){return this.he};function ke(a){this.sa=new fe(a);this.g=a.g;H(a.xa,"Only valid if limit has been set");this.oa=a.oa;this.Jb=!le(a)}h=ke.prototype;h.F=function(a,b,c,d,e,f){this.sa.matches(new K(b,c))||(c=F);return a.R(b).ca(c)?a:a.Fb()<this.oa?this.sa.Vb().F(a,b,c,d,e,f):me(this,a,b,c,e,f)};
h.za=function(a,b,c){var d;if(b.J()||b.e())d=F.ob(this.g);else if(2*this.oa<b.Fb()&&b.zc(this.g)){d=F.ob(this.g);b=this.Jb?b.$b(this.sa.wc,this.g):b.Yb(this.sa.Uc,this.g);for(var e=0;0<b.Sa.length&&e<this.oa;){var f=R(b),g;if(g=this.Jb?0>=this.g.compare(this.sa.Uc,f):0>=this.g.compare(f,this.sa.wc))d=d.U(f.name,f.S),e++;else break}}else{d=b.ob(this.g);d=d.ga(F);var k,m,l;if(this.Jb){b=d.$e(this.g);k=this.sa.wc;m=this.sa.Uc;var u=ne(this.g);l=function(a,b){return u(b,a)}}else b=d.Xb(this.g),k=this.sa.Uc,
m=this.sa.wc,l=ne(this.g);for(var e=0,z=!1;0<b.Sa.length;)f=R(b),!z&&0>=l(k,f)&&(z=!0),(g=z&&e<this.oa&&0>=l(f,m))?e++:d=d.U(f.name,F)}return this.sa.Vb().za(a,d,c)};h.ga=function(a){return a};h.Qa=function(){return!0};h.Vb=function(){return this.sa.Vb()};
function me(a,b,c,d,e,f){var g;if(a.Jb){var k=ne(a.g);g=function(a,b){return k(b,a)}}else g=ne(a.g);H(b.Fb()==a.oa,"");var m=new K(c,d),l=a.Jb?oe(b,a.g):pe(b,a.g),u=a.sa.matches(m);if(b.Fa(c)){for(var z=b.R(c),l=e.fe(a.g,l,a.Jb);null!=l&&(l.name==c||b.Fa(l.name));)l=e.fe(a.g,l,a.Jb);e=null==l?1:g(l,m);if(u&&!d.e()&&0<=e)return null!=f&&Id(f,new I("child_changed",d,c,z)),b.U(c,d);null!=f&&Id(f,new I("child_removed",z,c));b=b.U(c,F);return null!=l&&a.sa.matches(l)?(null!=f&&Id(f,new I("child_added",
l.S,l.name)),b.U(l.name,l.S)):b}return d.e()?b:u&&0<=g(l,m)?(null!=f&&(Id(f,new I("child_removed",l.S,l.name)),Id(f,new I("child_added",d,c))),b.U(c,d).U(l.name,F)):b};function Vc(a,b){this.B=a;H(p(this.B)&&null!==this.B,"LeafNode shouldn't be created with null/undefined value.");this.aa=b||F;qe(this.aa);this.Eb=null}var re=["object","boolean","number","string"];h=Vc.prototype;h.J=function(){return!0};h.C=function(){return this.aa};h.ga=function(a){return new Vc(this.B,a)};h.R=function(a){return".priority"===a?this.aa:F};h.Q=function(a){return a.e()?this:".priority"===J(a)?this.aa:F};h.Fa=function(){return!1};h.Ze=function(){return null};
h.U=function(a,b){return".priority"===a?this.ga(b):b.e()&&".priority"!==a?this:F.U(a,b).ga(this.aa)};h.F=function(a,b){var c=J(a);if(null===c)return b;if(b.e()&&".priority"!==c)return this;H(".priority"!==c||1===Zd(a),".priority must be the last token in a path");return this.U(c,F.F(D(a),b))};h.e=function(){return!1};h.Fb=function(){return 0};h.P=function(){return!1};h.H=function(a){return a&&!this.C().e()?{".value":this.Ea(),".priority":this.C().H()}:this.Ea()};
h.hash=function(){if(null===this.Eb){var a="";this.aa.e()||(a+="priority:"+se(this.aa.H())+":");var b=typeof this.B,a=a+(b+":"),a="number"===b?a+nd(this.B):a+this.B;this.Eb=Zc(a)}return this.Eb};h.Ea=function(){return this.B};h.tc=function(a){if(a===F)return 1;if(a instanceof P)return-1;H(a.J(),"Unknown node type");var b=typeof a.B,c=typeof this.B,d=Ia(re,b),e=Ia(re,c);H(0<=d,"Unknown leaf type: "+b);H(0<=e,"Unknown leaf type: "+c);return d===e?"object"===c?0:this.B<a.B?-1:this.B===a.B?0:1:e-d};
h.ob=function(){return this};h.zc=function(){return!0};h.ca=function(a){return a===this?!0:a.J()?this.B===a.B&&this.aa.ca(a.aa):!1};h.toString=function(){return B(this.H(!0))};function te(){}var ue={};function ne(a){return r(a.compare,a)}te.prototype.nd=function(a,b){return 0!==this.compare(new K("[MIN_NAME]",a),new K("[MIN_NAME]",b))};te.prototype.Ic=function(){return ve};function we(a){H(!a.e()&&".priority"!==J(a),"Can't create PathIndex with empty path or .priority key");this.cc=a}ka(we,te);h=we.prototype;h.yc=function(a){return!a.Q(this.cc).e()};h.compare=function(a,b){var c=a.S.Q(this.cc),d=b.S.Q(this.cc),c=c.tc(d);return 0===c?Mc(a.name,b.name):c};
h.Fc=function(a,b){var c=M(a),c=F.F(this.cc,c);return new K(b,c)};h.Gc=function(){var a=F.F(this.cc,xe);return new K("[MAX_NAME]",a)};h.toString=function(){return this.cc.slice().join("/")};function ye(){}ka(ye,te);h=ye.prototype;h.compare=function(a,b){var c=a.S.C(),d=b.S.C(),c=c.tc(d);return 0===c?Mc(a.name,b.name):c};h.yc=function(a){return!a.C().e()};h.nd=function(a,b){return!a.C().ca(b.C())};h.Ic=function(){return ve};h.Gc=function(){return new K("[MAX_NAME]",new Vc("[PRIORITY-POST]",xe))};
h.Fc=function(a,b){var c=M(a);return new K(b,new Vc("[PRIORITY-POST]",c))};h.toString=function(){return".priority"};var N=new ye;function ze(){}ka(ze,te);h=ze.prototype;h.compare=function(a,b){return Mc(a.name,b.name)};h.yc=function(){throw Xc("KeyIndex.isDefinedOn not expected to be called.");};h.nd=function(){return!1};h.Ic=function(){return ve};h.Gc=function(){return new K("[MAX_NAME]",F)};h.Fc=function(a){H(q(a),"KeyIndex indexValue must always be a string.");return new K(a,F)};h.toString=function(){return".key"};
var de=new ze;function Ae(){}ka(Ae,te);h=Ae.prototype;h.compare=function(a,b){var c=a.S.tc(b.S);return 0===c?Mc(a.name,b.name):c};h.yc=function(){return!0};h.nd=function(a,b){return!a.ca(b)};h.Ic=function(){return ve};h.Gc=function(){return Be};h.Fc=function(a,b){var c=M(a);return new K(b,c)};h.toString=function(){return".value"};var Ce=new Ae;function De(){this.Sb=this.na=this.Lb=this.ka=this.xa=!1;this.oa=0;this.oc="";this.ec=null;this.Ab="";this.bc=null;this.yb="";this.g=N}var Ee=new De;function le(a){return""===a.oc?a.ka:"l"===a.oc}function he(a){H(a.ka,"Only valid if start has been set");return a.ec}function ge(a){H(a.ka,"Only valid if start has been set");return a.Lb?a.Ab:"[MIN_NAME]"}function je(a){H(a.na,"Only valid if end has been set");return a.bc}
function ie(a){H(a.na,"Only valid if end has been set");return a.Sb?a.yb:"[MAX_NAME]"}function Fe(a){var b=new De;b.xa=a.xa;b.oa=a.oa;b.ka=a.ka;b.ec=a.ec;b.Lb=a.Lb;b.Ab=a.Ab;b.na=a.na;b.bc=a.bc;b.Sb=a.Sb;b.yb=a.yb;b.g=a.g;return b}h=De.prototype;h.ne=function(a){var b=Fe(this);b.xa=!0;b.oa=a;b.oc="l";return b};h.oe=function(a){var b=Fe(this);b.xa=!0;b.oa=a;b.oc="r";return b};h.Nd=function(a,b){var c=Fe(this);c.ka=!0;p(a)||(a=null);c.ec=a;null!=b?(c.Lb=!0,c.Ab=b):(c.Lb=!1,c.Ab="");return c};
h.fd=function(a,b){var c=Fe(this);c.na=!0;p(a)||(a=null);c.bc=a;p(b)?(c.Sb=!0,c.yb=b):(c.Hg=!1,c.yb="");return c};function Ge(a,b){var c=Fe(a);c.g=b;return c}function He(a){var b={};a.ka&&(b.sp=a.ec,a.Lb&&(b.sn=a.Ab));a.na&&(b.ep=a.bc,a.Sb&&(b.en=a.yb));if(a.xa){b.l=a.oa;var c=a.oc;""===c&&(c=le(a)?"l":"r");b.vf=c}a.g!==N&&(b.i=a.g.toString());return b}function S(a){return!(a.ka||a.na||a.xa)}function Cd(a){return S(a)&&a.g==N}
function Dd(a){var b={};if(Cd(a))return b;var c;a.g===N?c="$priority":a.g===Ce?c="$value":a.g===de?c="$key":(H(a.g instanceof we,"Unrecognized index type!"),c=a.g.toString());b.orderBy=B(c);a.ka&&(b.startAt=B(a.ec),a.Lb&&(b.startAt+=","+B(a.Ab)));a.na&&(b.endAt=B(a.bc),a.Sb&&(b.endAt+=","+B(a.yb)));a.xa&&(le(a)?b.limitToFirst=a.oa:b.limitToLast=a.oa);return b}h.toString=function(){return B(He(this))};function Ie(a,b){this.od=a;this.dc=b}Ie.prototype.get=function(a){var b=x(this.od,a);if(!b)throw Error("No index defined for "+a);return b===ue?null:b};function Je(a,b,c){var d=oa(a.od,function(d,f){var g=x(a.dc,f);H(g,"Missing index implementation for "+f);if(d===ue){if(g.yc(b.S)){for(var k=[],m=c.Xb(Oc),l=R(m);l;)l.name!=b.name&&k.push(l),l=R(m);k.push(b);return Ke(k,ne(g))}return ue}g=c.get(b.name);k=d;g&&(k=k.remove(new K(b.name,g)));return k.Ra(b,b.S)});return new Ie(d,a.dc)}
function Le(a,b,c){var d=oa(a.od,function(a){if(a===ue)return a;var d=c.get(b.name);return d?a.remove(new K(b.name,d)):a});return new Ie(d,a.dc)}var Me=new Ie({".priority":ue},{".priority":N});function Ne(){this.set={}}h=Ne.prototype;h.add=function(a,b){this.set[a]=null!==b?b:!0};h.contains=function(a){return Bb(this.set,a)};h.get=function(a){return this.contains(a)?this.set[a]:void 0};h.remove=function(a){delete this.set[a]};h.clear=function(){this.set={}};h.e=function(){return xa(this.set)};h.count=function(){return qa(this.set)};function Oe(a,b){t(a.set,function(a,d){b(d,a)})}h.keys=function(){var a=[];t(this.set,function(b,c){a.push(c)});return a};function Pe(a,b,c,d){this.Zd=a;this.f=cd(a);this.kc=b;this.qb=this.rb=0;this.Xa=pc(b);this.Bf=c;this.xc=!1;this.Db=d;this.Yc=function(a){return ic(b,"long_polling",a)}}var Qe,Re;
Pe.prototype.open=function(a,b){this.Qe=0;this.ja=b;this.ff=new Rb(a);this.Bb=!1;var c=this;this.tb=setTimeout(function(){c.f("Timed out trying to connect.");c.fb();c.tb=null},Math.floor(3E4));hd(function(){if(!c.Bb){c.Wa=new Se(function(a,b,d,k,m){Te(c,arguments);if(c.Wa)if(c.tb&&(clearTimeout(c.tb),c.tb=null),c.xc=!0,"start"==a)c.id=b,c.mf=d;else if("close"===a)b?(c.Wa.Kd=!1,Sb(c.ff,b,function(){c.fb()})):c.fb();else throw Error("Unrecognized command received: "+a);},function(a,b){Te(c,arguments);
Tb(c.ff,a,b)},function(){c.fb()},c.Yc);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.Wa.Qd&&(a.cb=c.Wa.Qd);a.v="5";c.Bf&&(a.s=c.Bf);c.Db&&(a.ls=c.Db);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.Yc(a);c.f("Connecting via long-poll to "+a);Ue(c.Wa,a,function(){})}})};
Pe.prototype.start=function(){var a=this.Wa,b=this.mf;a.fg=this.id;a.gg=b;for(a.Ud=!0;Ve(a););a=this.id;b=this.mf;this.gc=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.gc.src=this.Yc(c);this.gc.style.display="none";document.body.appendChild(this.gc)};
Pe.isAvailable=function(){return Qe||!Re&&"undefined"!==typeof document&&null!=document.createElement&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.Dg)&&!0};h=Pe.prototype;h.sd=function(){};h.Tc=function(){this.Bb=!0;this.Wa&&(this.Wa.close(),this.Wa=null);this.gc&&(document.body.removeChild(this.gc),this.gc=null);this.tb&&(clearTimeout(this.tb),this.tb=null)};
h.fb=function(){this.Bb||(this.f("Longpoll is closing itself"),this.Tc(),this.ja&&(this.ja(this.xc),this.ja=null))};h.close=function(){this.Bb||(this.f("Longpoll is being closed."),this.Tc())};h.send=function(a){a=B(a);this.rb+=a.length;mc(this.Xa,"bytes_sent",a.length);a=Mb(a);a=ab(a,!0);a=ld(a,1840);for(var b=0;b<a.length;b++){var c=this.Wa;c.Qc.push({ug:this.Qe,Bg:a.length,Se:a[b]});c.Ud&&Ve(c);this.Qe++}};function Te(a,b){var c=B(b).length;a.qb+=c;mc(a.Xa,"bytes_received",c)}
function Se(a,b,c,d){this.Yc=d;this.kb=c;this.ve=new Ne;this.Qc=[];this.$d=Math.floor(1E8*Math.random());this.Kd=!0;this.Qd=Wc();window["pLPCommand"+this.Qd]=a;window["pRTLPCB"+this.Qd]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||E("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.ib=a.contentDocument:a.contentWindow?a.ib=a.contentWindow.document:a.document&&(a.ib=a.document);this.Ga=a;a="";this.Ga.src&&"javascript:"===this.Ga.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.Ga.ib.open(),this.Ga.ib.write(a),this.Ga.ib.close()}catch(f){E("frame writing exception"),f.stack&&E(f.stack),E(f)}}
Se.prototype.close=function(){this.Ud=!1;if(this.Ga){this.Ga.ib.body.innerHTML="";var a=this;setTimeout(function(){null!==a.Ga&&(document.body.removeChild(a.Ga),a.Ga=null)},Math.floor(0))}var b=this.kb;b&&(this.kb=null,b())};
function Ve(a){if(a.Ud&&a.Kd&&a.ve.count()<(0<a.Qc.length?2:1)){a.$d++;var b={};b.id=a.fg;b.pw=a.gg;b.ser=a.$d;for(var b=a.Yc(b),c="",d=0;0<a.Qc.length;)if(1870>=a.Qc[0].Se.length+30+c.length){var e=a.Qc.shift(),c=c+"&seg"+d+"="+e.ug+"&ts"+d+"="+e.Bg+"&d"+d+"="+e.Se;d++}else break;We(a,b+c,a.$d);return!0}return!1}function We(a,b,c){function d(){a.ve.remove(c);Ve(a)}a.ve.add(c,1);var e=setTimeout(d,Math.floor(25E3));Ue(a,b,function(){clearTimeout(e);d()})}
function Ue(a,b,c){setTimeout(function(){try{if(a.Kd){var d=a.Ga.ib.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){E("Long-poll script failed to load: "+b);a.Kd=!1;a.close()};a.Ga.ib.body.appendChild(d)}}catch(e){}},Math.floor(1))};function Xe(a){Ye(this,a)}var Ze=[Pe,vd];function Ye(a,b){var c=vd&&vd.isAvailable(),d=c&&!(Yb.cf||!0===Yb.get("previous_websocket_failure"));b.Cg&&(c||O("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.Wc=[vd];else{var e=a.Wc=[];md(Ze,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function $e(a){if(0<a.Wc.length)return a.Wc[0];throw Error("No transports available");};function af(a,b,c,d,e,f,g){this.id=a;this.f=cd("c:"+this.id+":");this.te=c;this.Mc=d;this.ja=e;this.se=f;this.M=b;this.Ad=[];this.Oe=0;this.Af=new Xe(b);this.L=0;this.Db=g;this.f("Connection created");bf(this)}
function bf(a){var b=$e(a.Af);a.I=new b("c:"+a.id+":"+a.Oe++,a.M,void 0,a.Db);a.xe=b.responsesRequiredToBeHealthy||0;var c=cf(a,a.I),d=df(a,a.I);a.Xc=a.I;a.Rc=a.I;a.D=null;a.Cb=!1;setTimeout(function(){a.I&&a.I.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.md=setTimeout(function(){a.md=null;a.Cb||(a.I&&102400<a.I.qb?(a.f("Connection exceeded healthy timeout but has received "+a.I.qb+" bytes.  Marking connection healthy."),a.Cb=!0,a.I.sd()):a.I&&10240<a.I.rb?a.f("Connection exceeded healthy timeout but has sent "+
a.I.rb+" bytes.  Leaving connection alive."):(a.f("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function df(a,b){return function(c){b===a.I?(a.I=null,c||0!==a.L?1===a.L&&a.f("Realtime connection lost."):(a.f("Realtime connection failed."),"s-"===a.M.bb.substr(0,2)&&(Yb.remove("host:"+a.M.host),a.M.bb=a.M.host)),a.close()):b===a.D?(a.f("Secondary connection lost."),c=a.D,a.D=null,a.Xc!==c&&a.Rc!==c||a.close()):a.f("closing an old connection")}}
function cf(a,b){return function(c){if(2!=a.L)if(b===a.Rc){var d=jd("t",c);c=jd("d",c);if("c"==d){if(d=jd("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.yf=c.s;hc(a.M,f);0==a.L&&(a.I.start(),ef(a,a.I,d),"5"!==e&&O("Protocol version mismatch detected"),c=a.Af,(c=1<c.Wc.length?c.Wc[1]:null)&&ff(a,c))}else if("n"===d){a.f("recvd end transmission on primary");a.Rc=a.D;for(c=0;c<a.Ad.length;++c)a.wd(a.Ad[c]);a.Ad=[];gf(a)}else"s"===d?(a.f("Connection shutdown command received. Shutting down..."),
a.se&&(a.se(c),a.se=null),a.ja=null,a.close()):"r"===d?(a.f("Reset packet received.  New host: "+c),hc(a.M,c),1===a.L?a.close():(hf(a),bf(a))):"e"===d?dd("Server Error: "+c):"o"===d?(a.f("got pong on primary."),jf(a),kf(a)):dd("Unknown control packet command: "+d)}else"d"==d&&a.wd(c)}else if(b===a.D)if(d=jd("t",c),c=jd("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?lf(a):"r"===c?(a.f("Got a reset on secondary, closing it"),a.D.close(),a.Xc!==a.D&&a.Rc!==a.D||a.close()):"o"===c&&(a.f("got pong on secondary."),
a.xf--,lf(a)));else if("d"==d)a.Ad.push(c);else throw Error("Unknown protocol layer: "+d);else a.f("message on old connection")}}af.prototype.ua=function(a){mf(this,{t:"d",d:a})};function gf(a){a.Xc===a.D&&a.Rc===a.D&&(a.f("cleaning up and promoting a connection: "+a.D.Zd),a.I=a.D,a.D=null)}
function lf(a){0>=a.xf?(a.f("Secondary connection is healthy."),a.Cb=!0,a.D.sd(),a.D.start(),a.f("sending client ack on secondary"),a.D.send({t:"c",d:{t:"a",d:{}}}),a.f("Ending transmission on primary"),a.I.send({t:"c",d:{t:"n",d:{}}}),a.Xc=a.D,gf(a)):(a.f("sending ping on secondary."),a.D.send({t:"c",d:{t:"p",d:{}}}))}af.prototype.wd=function(a){jf(this);this.te(a)};function jf(a){a.Cb||(a.xe--,0>=a.xe&&(a.f("Primary connection is healthy."),a.Cb=!0,a.I.sd()))}
function ff(a,b){a.D=new b("c:"+a.id+":"+a.Oe++,a.M,a.yf);a.xf=b.responsesRequiredToBeHealthy||0;a.D.open(cf(a,a.D),df(a,a.D));setTimeout(function(){a.D&&(a.f("Timed out trying to upgrade."),a.D.close())},Math.floor(6E4))}function ef(a,b,c){a.f("Realtime connection established.");a.I=b;a.L=1;a.Mc&&(a.Mc(c,a.yf),a.Mc=null);0===a.xe?(a.f("Primary connection is healthy."),a.Cb=!0):setTimeout(function(){kf(a)},Math.floor(5E3))}
function kf(a){a.Cb||1!==a.L||(a.f("sending ping on primary."),mf(a,{t:"c",d:{t:"p",d:{}}}))}function mf(a,b){if(1!==a.L)throw"Connection is not connected";a.Xc.send(b)}af.prototype.close=function(){2!==this.L&&(this.f("Closing realtime connection."),this.L=2,hf(this),this.ja&&(this.ja(),this.ja=null))};function hf(a){a.f("Shutting down all connections");a.I&&(a.I.close(),a.I=null);a.D&&(a.D.close(),a.D=null);a.md&&(clearTimeout(a.md),a.md=null)};function L(a,b){if(1==arguments.length){this.o=a.split("/");for(var c=0,d=0;d<this.o.length;d++)0<this.o[d].length&&(this.o[c]=this.o[d],c++);this.o.length=c;this.Z=0}else this.o=a,this.Z=b}function T(a,b){var c=J(a);if(null===c)return b;if(c===J(b))return T(D(a),D(b));throw Error("INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")");}
function nf(a,b){for(var c=a.slice(),d=b.slice(),e=0;e<c.length&&e<d.length;e++){var f=Mc(c[e],d[e]);if(0!==f)return f}return c.length===d.length?0:c.length<d.length?-1:1}function J(a){return a.Z>=a.o.length?null:a.o[a.Z]}function Zd(a){return a.o.length-a.Z}function D(a){var b=a.Z;b<a.o.length&&b++;return new L(a.o,b)}function $d(a){return a.Z<a.o.length?a.o[a.o.length-1]:null}h=L.prototype;
h.toString=function(){for(var a="",b=this.Z;b<this.o.length;b++)""!==this.o[b]&&(a+="/"+this.o[b]);return a||"/"};h.slice=function(a){return this.o.slice(this.Z+(a||0))};h.parent=function(){if(this.Z>=this.o.length)return null;for(var a=[],b=this.Z;b<this.o.length-1;b++)a.push(this.o[b]);return new L(a,0)};
h.m=function(a){for(var b=[],c=this.Z;c<this.o.length;c++)b.push(this.o[c]);if(a instanceof L)for(c=a.Z;c<a.o.length;c++)b.push(a.o[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new L(b,0)};h.e=function(){return this.Z>=this.o.length};h.ca=function(a){if(Zd(this)!==Zd(a))return!1;for(var b=this.Z,c=a.Z;b<=this.o.length;b++,c++)if(this.o[b]!==a.o[c])return!1;return!0};
h.contains=function(a){var b=this.Z,c=a.Z;if(Zd(this)>Zd(a))return!1;for(;b<this.o.length;){if(this.o[b]!==a.o[c])return!1;++b;++c}return!0};var C=new L("");function of(a,b){this.Ta=a.slice();this.Ka=Math.max(1,this.Ta.length);this.Te=b;for(var c=0;c<this.Ta.length;c++)this.Ka+=Nb(this.Ta[c]);pf(this)}of.prototype.push=function(a){0<this.Ta.length&&(this.Ka+=1);this.Ta.push(a);this.Ka+=Nb(a);pf(this)};of.prototype.pop=function(){var a=this.Ta.pop();this.Ka-=Nb(a);0<this.Ta.length&&--this.Ka};
function pf(a){if(768<a.Ka)throw Error(a.Te+"has a key path longer than 768 bytes ("+a.Ka+").");if(32<a.Ta.length)throw Error(a.Te+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+qf(a));}function qf(a){return 0==a.Ta.length?"":"in property '"+a.Ta.join(".")+"'"};function rf(a){a instanceof sf||ed("Don't call new Database() directly - please use firebase.database().");this.ta=a;this.ba=new U(a,C);this.INTERNAL=new tf(this)}var uf={TIMESTAMP:{".sv":"timestamp"}};h=rf.prototype;h.app=null;h.pf=function(a){vf(this,"ref");y("database.ref",0,1,arguments.length);return p(a)?this.ba.m(a):this.ba};
h.rg=function(a){vf(this,"database.refFromURL");y("database.refFromURL",1,1,arguments.length);var b=fd(a);wf("database.refFromURL",b);var c=b.kc;c.host!==this.ta.M.host&&ed("database.refFromURL: Host name does not match the current database: (found "+c.host+" but expected "+this.ta.M.host+")");return this.pf(b.path.toString())};function vf(a,b){null===a.ta&&ed("Cannot call "+b+" on a deleted database.")}h.$f=function(){y("database.goOffline",0,0,arguments.length);vf(this,"goOffline");this.ta.eb()};
h.ag=function(){y("database.goOnline",0,0,arguments.length);vf(this,"goOnline");this.ta.lc()};Object.defineProperty(rf.prototype,"app",{get:function(){return this.ta.app}});function tf(a){this.$a=a}tf.prototype.delete=function(){vf(this.$a,"delete");var a=xf.Wb(),b=this.$a.ta;x(a.nb,b.app.name)!==b&&ed("Database "+b.app.name+" has already been deleted.");b.eb();delete a.nb[b.app.name];this.$a.ta=null;this.$a.ba=null;this.$a=this.$a.INTERNAL=null;return firebase.Promise.resolve()};
rf.prototype.ref=rf.prototype.pf;rf.prototype.refFromURL=rf.prototype.rg;rf.prototype.goOnline=rf.prototype.ag;rf.prototype.goOffline=rf.prototype.$f;tf.prototype["delete"]=tf.prototype.delete;function Rc(){this.k=this.B=null}Rc.prototype.find=function(a){if(null!=this.B)return this.B.Q(a);if(a.e()||null==this.k)return null;var b=J(a);a=D(a);return this.k.contains(b)?this.k.get(b).find(a):null};function Tc(a,b,c){if(b.e())a.B=c,a.k=null;else if(null!==a.B)a.B=a.B.F(b,c);else{null==a.k&&(a.k=new Ne);var d=J(b);a.k.contains(d)||a.k.add(d,new Rc);a=a.k.get(d);b=D(b);Tc(a,b,c)}}
function yf(a,b){if(b.e())return a.B=null,a.k=null,!0;if(null!==a.B){if(a.B.J())return!1;var c=a.B;a.B=null;c.P(N,function(b,c){Tc(a,new L(b),c)});return yf(a,b)}return null!==a.k?(c=J(b),b=D(b),a.k.contains(c)&&yf(a.k.get(c),b)&&a.k.remove(c),a.k.e()?(a.k=null,!0):!1):!0}function Sc(a,b,c){null!==a.B?c(b,a.B):a.P(function(a,e){var f=new L(b.toString()+"/"+a);Sc(e,f,c)})}Rc.prototype.P=function(a){null!==this.k&&Oe(this.k,function(b,c){a(b,c)})};var zf=/[\[\].#$\/\u0000-\u001F\u007F]/,Af=/[\[\].#$\u0000-\u001F\u007F]/;function Bf(a){return q(a)&&0!==a.length&&!zf.test(a)}function Cf(a){return null===a||q(a)||fa(a)&&!gd(a)||ha(a)&&Bb(a,".sv")}function Df(a,b,c,d){d&&!p(b)||Ef(Db(a,1,d),b,c)}
function Ef(a,b,c){c instanceof L&&(c=new of(c,a));if(!p(b))throw Error(a+"contains undefined "+qf(c));if(ga(b))throw Error(a+"contains a function "+qf(c)+" with contents: "+b.toString());if(gd(b))throw Error(a+"contains "+b.toString()+" "+qf(c));if(q(b)&&b.length>10485760/3&&10485760<Nb(b))throw Error(a+"contains a string greater than 10485760 utf8 bytes "+qf(c)+" ('"+b.substring(0,50)+"...')");if(ha(b)){var d=!1,e=!1;Cb(b,function(b,g){if(".value"===b)d=!0;else if(".priority"!==b&&".sv"!==b&&(e=
!0,!Bf(b)))throw Error(a+" contains an invalid key ("+b+") "+qf(c)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');c.push(b);Ef(a,g,c);c.pop()});if(d&&e)throw Error(a+' contains ".value" child '+qf(c)+" in addition to actual children.");}}
function Ff(a,b){var c,d;for(c=0;c<b.length;c++){d=b[c];for(var e=d.slice(),f=0;f<e.length;f++)if((".priority"!==e[f]||f!==e.length-1)&&!Bf(e[f]))throw Error(a+"contains an invalid key ("+e[f]+") in path "+d.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');}b.sort(nf);e=null;for(c=0;c<b.length;c++){d=b[c];if(null!==e&&e.contains(d))throw Error(a+"contains a path "+e.toString()+" that is ancestor of another path "+d.toString());e=d}}
function Gf(a,b,c){var d=Db(a,1,!1);if(!ha(b)||da(b))throw Error(d+" must be an object containing the children to replace.");var e=[];Cb(b,function(a,b){var k=new L(a);Ef(d,b,c.m(k));if(".priority"===$d(k)&&!Cf(b))throw Error(d+"contains an invalid value for '"+k.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");e.push(k)});Ff(d,e)}
function Hf(a,b,c){if(gd(c))throw Error(Db(a,b,!1)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Cf(c))throw Error(Db(a,b,!1)+"must be a valid Firebase priority (a string, finite number, server value, or null).");}
function If(a,b,c){if(!c||p(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(Db(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function Jf(a,b){if(p(b)&&!Bf(b))throw Error(Db(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function Kf(a,b){if(!q(b)||0===b.length||Af.test(b))throw Error(Db(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function Lf(a,b){if(".info"===J(b))throw Error(a+" failed: Can't modify data under /.info/");}
function wf(a,b){var c=b.path.toString(),d;!(d=!q(b.kc.host)||0===b.kc.host.length||!Bf(b.kc.pe))&&(d=0!==c.length)&&(c&&(c=c.replace(/^\/*\.info(\/|$)/,"/")),d=!(q(c)&&0!==c.length&&!Af.test(c)));if(d)throw Error(Db(a,1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');};function V(a,b){this.ta=a;this.qa=b}V.prototype.cancel=function(a){y("Firebase.onDisconnect().cancel",0,1,arguments.length);A("Firebase.onDisconnect().cancel",1,a,!0);var b=new Hb;this.ta.xd(this.qa,Ib(b,a));return b.ra};V.prototype.cancel=V.prototype.cancel;V.prototype.remove=function(a){y("Firebase.onDisconnect().remove",0,1,arguments.length);Lf("Firebase.onDisconnect().remove",this.qa);A("Firebase.onDisconnect().remove",1,a,!0);var b=new Hb;Mf(this.ta,this.qa,null,Ib(b,a));return b.ra};
V.prototype.remove=V.prototype.remove;V.prototype.set=function(a,b){y("Firebase.onDisconnect().set",1,2,arguments.length);Lf("Firebase.onDisconnect().set",this.qa);Df("Firebase.onDisconnect().set",a,this.qa,!1);A("Firebase.onDisconnect().set",2,b,!0);var c=new Hb;Mf(this.ta,this.qa,a,Ib(c,b));return c.ra};V.prototype.set=V.prototype.set;
V.prototype.Kb=function(a,b,c){y("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);Lf("Firebase.onDisconnect().setWithPriority",this.qa);Df("Firebase.onDisconnect().setWithPriority",a,this.qa,!1);Hf("Firebase.onDisconnect().setWithPriority",2,b);A("Firebase.onDisconnect().setWithPriority",3,c,!0);var d=new Hb;Nf(this.ta,this.qa,a,b,Ib(d,c));return d.ra};V.prototype.setWithPriority=V.prototype.Kb;
V.prototype.update=function(a,b){y("Firebase.onDisconnect().update",1,2,arguments.length);Lf("Firebase.onDisconnect().update",this.qa);if(da(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Gf("Firebase.onDisconnect().update",a,this.qa);A("Firebase.onDisconnect().update",2,b,!0);
c=new Hb;Of(this.ta,this.qa,a,Ib(c,b));return c.ra};V.prototype.update=V.prototype.update;function Pf(a){H(da(a)&&0<a.length,"Requires a non-empty array");this.Kf=a;this.Ec={}}Pf.prototype.Ge=function(a,b){var c;c=this.Ec[a]||[];var d=c.length;if(0<d){for(var e=Array(d),f=0;f<d;f++)e[f]=c[f];c=e}else c=[];for(d=0;d<c.length;d++)c[d].Ke.apply(c[d].Pa,Array.prototype.slice.call(arguments,1))};Pf.prototype.hc=function(a,b,c){Qf(this,a);this.Ec[a]=this.Ec[a]||[];this.Ec[a].push({Ke:b,Pa:c});(a=this.Ye(a))&&b.apply(c,a)};
Pf.prototype.Jc=function(a,b,c){Qf(this,a);a=this.Ec[a]||[];for(var d=0;d<a.length;d++)if(a[d].Ke===b&&(!c||c===a[d].Pa)){a.splice(d,1);break}};function Qf(a,b){H(Oa(a.Kf,function(a){return a===b}),"Unknown event: "+b)};function Rf(){Pf.call(this,["online"]);this.ic=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener&&!Qb()){var a=this;window.addEventListener("online",function(){a.ic||(a.ic=!0,a.Ge("online",!0))},!1);window.addEventListener("offline",function(){a.ic&&(a.ic=!1,a.Ge("online",!1))},!1)}}ka(Rf,Pf);Rf.prototype.Ye=function(a){H("online"===a,"Unknown event type: "+a);return[this.ic]};ba(Rf);function Sf(){Pf.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.Nb=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.Nb&&(c.Nb=b,c.Ge("visible",b))},!1)}}ka(Sf,Pf);Sf.prototype.Ye=function(a){H("visible"===a,"Unknown event type: "+a);return[this.Nb]};ba(Sf);var Tf=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);H(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);H(20===c.length,"nextPushId: Length should be 20.");
return c}}();function Uf(a,b){this.Oa=a;this.ba=b?b:Vf}h=Uf.prototype;h.Ra=function(a,b){return new Uf(this.Oa,this.ba.Ra(a,b,this.Oa).Y(null,null,!1,null,null))};h.remove=function(a){return new Uf(this.Oa,this.ba.remove(a,this.Oa).Y(null,null,!1,null,null))};h.get=function(a){for(var b,c=this.ba;!c.e();){b=this.Oa(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function Wf(a,b){for(var c,d=a.ba,e=null;!d.e();){c=a.Oa(b,d.key);if(0===c){if(d.left.e())return e?e.key:null;for(d=d.left;!d.right.e();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}h.e=function(){return this.ba.e()};h.count=function(){return this.ba.count()};h.Hc=function(){return this.ba.Hc()};h.fc=function(){return this.ba.fc()};h.ia=function(a){return this.ba.ia(a)};
h.Xb=function(a){return new Xf(this.ba,null,this.Oa,!1,a)};h.Yb=function(a,b){return new Xf(this.ba,a,this.Oa,!1,b)};h.$b=function(a,b){return new Xf(this.ba,a,this.Oa,!0,b)};h.$e=function(a){return new Xf(this.ba,null,this.Oa,!0,a)};function Xf(a,b,c,d,e){this.Hd=e||null;this.le=d;this.Sa=[];for(e=1;!a.e();)if(e=b?c(a.key,b):1,d&&(e*=-1),0>e)a=this.le?a.left:a.right;else if(0===e){this.Sa.push(a);break}else this.Sa.push(a),a=this.le?a.right:a.left}
function R(a){if(0===a.Sa.length)return null;var b=a.Sa.pop(),c;c=a.Hd?a.Hd(b.key,b.value):{key:b.key,value:b.value};if(a.le)for(b=b.left;!b.e();)a.Sa.push(b),b=b.right;else for(b=b.right;!b.e();)a.Sa.push(b),b=b.left;return c}function Yf(a){if(0===a.Sa.length)return null;var b;b=a.Sa;b=b[b.length-1];return a.Hd?a.Hd(b.key,b.value):{key:b.key,value:b.value}}function Zf(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:Vf;this.right=null!=e?e:Vf}h=Zf.prototype;
h.Y=function(a,b,c,d,e){return new Zf(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};h.count=function(){return this.left.count()+1+this.right.count()};h.e=function(){return!1};h.ia=function(a){return this.left.ia(a)||a(this.key,this.value)||this.right.ia(a)};function $f(a){return a.left.e()?a:$f(a.left)}h.Hc=function(){return $f(this).key};h.fc=function(){return this.right.e()?this.key:this.right.fc()};
h.Ra=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.Y(null,null,null,e.left.Ra(a,b,c),null):0===d?e.Y(null,b,null,null,null):e.Y(null,null,null,null,e.right.Ra(a,b,c));return ag(e)};function bg(a){if(a.left.e())return Vf;a.left.fa()||a.left.left.fa()||(a=cg(a));a=a.Y(null,null,null,bg(a.left),null);return ag(a)}
h.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.e()||c.left.fa()||c.left.left.fa()||(c=cg(c)),c=c.Y(null,null,null,c.left.remove(a,b),null);else{c.left.fa()&&(c=dg(c));c.right.e()||c.right.fa()||c.right.left.fa()||(c=eg(c),c.left.left.fa()&&(c=dg(c),c=eg(c)));if(0===b(a,c.key)){if(c.right.e())return Vf;d=$f(c.right);c=c.Y(d.key,d.value,null,null,bg(c.right))}c=c.Y(null,null,null,null,c.right.remove(a,b))}return ag(c)};h.fa=function(){return this.color};
function ag(a){a.right.fa()&&!a.left.fa()&&(a=fg(a));a.left.fa()&&a.left.left.fa()&&(a=dg(a));a.left.fa()&&a.right.fa()&&(a=eg(a));return a}function cg(a){a=eg(a);a.right.left.fa()&&(a=a.Y(null,null,null,null,dg(a.right)),a=fg(a),a=eg(a));return a}function fg(a){return a.right.Y(null,null,a.color,a.Y(null,null,!0,null,a.right.left),null)}function dg(a){return a.left.Y(null,null,a.color,null,a.Y(null,null,!0,a.left.right,null))}
function eg(a){return a.Y(null,null,!a.color,a.left.Y(null,null,!a.left.color,null,null),a.right.Y(null,null,!a.right.color,null,null))}function gg(){}h=gg.prototype;h.Y=function(){return this};h.Ra=function(a,b){return new Zf(a,b,null)};h.remove=function(){return this};h.count=function(){return 0};h.e=function(){return!0};h.ia=function(){return!1};h.Hc=function(){return null};h.fc=function(){return null};h.fa=function(){return!1};var Vf=new gg;function P(a,b,c){this.k=a;(this.aa=b)&&qe(this.aa);a.e()&&H(!this.aa||this.aa.e(),"An empty node cannot have a priority");this.zb=c;this.Eb=null}h=P.prototype;h.J=function(){return!1};h.C=function(){return this.aa||F};h.ga=function(a){return this.k.e()?this:new P(this.k,a,this.zb)};h.R=function(a){if(".priority"===a)return this.C();a=this.k.get(a);return null===a?F:a};h.Q=function(a){var b=J(a);return null===b?this:this.R(b).Q(D(a))};h.Fa=function(a){return null!==this.k.get(a)};
h.U=function(a,b){H(b,"We should always be passing snapshot nodes");if(".priority"===a)return this.ga(b);var c=new K(a,b),d,e;b.e()?(d=this.k.remove(a),c=Le(this.zb,c,this.k)):(d=this.k.Ra(a,b),c=Je(this.zb,c,this.k));e=d.e()?F:this.aa;return new P(d,e,c)};h.F=function(a,b){var c=J(a);if(null===c)return b;H(".priority"!==J(a)||1===Zd(a),".priority must be the last token in a path");var d=this.R(c).F(D(a),b);return this.U(c,d)};h.e=function(){return this.k.e()};h.Fb=function(){return this.k.count()};
var hg=/^(0|[1-9]\d*)$/;h=P.prototype;h.H=function(a){if(this.e())return null;var b={},c=0,d=0,e=!0;this.P(N,function(f,g){b[f]=g.H(a);c++;e&&hg.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&!this.C().e()&&(b[".priority"]=this.C().H());return b};h.hash=function(){if(null===this.Eb){var a="";this.C().e()||(a+="priority:"+se(this.C().H())+":");this.P(N,function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});this.Eb=""===a?"":Zc(a)}return this.Eb};
h.Ze=function(a,b,c){return(c=ig(this,c))?(a=Wf(c,new K(a,b)))?a.name:null:Wf(this.k,a)};function oe(a,b){var c;c=(c=ig(a,b))?(c=c.Hc())&&c.name:a.k.Hc();return c?new K(c,a.k.get(c)):null}function pe(a,b){var c;c=(c=ig(a,b))?(c=c.fc())&&c.name:a.k.fc();return c?new K(c,a.k.get(c)):null}h.P=function(a,b){var c=ig(this,a);return c?c.ia(function(a){return b(a.name,a.S)}):this.k.ia(b)};h.Xb=function(a){return this.Yb(a.Ic(),a)};
h.Yb=function(a,b){var c=ig(this,b);if(c)return c.Yb(a,function(a){return a});for(var c=this.k.Yb(a.name,Oc),d=Yf(c);null!=d&&0>b.compare(d,a);)R(c),d=Yf(c);return c};h.$e=function(a){return this.$b(a.Gc(),a)};h.$b=function(a,b){var c=ig(this,b);if(c)return c.$b(a,function(a){return a});for(var c=this.k.$b(a.name,Oc),d=Yf(c);null!=d&&0<b.compare(d,a);)R(c),d=Yf(c);return c};h.tc=function(a){return this.e()?a.e()?0:-1:a.J()||a.e()?1:a===xe?-1:0};
h.ob=function(a){if(a===de||ua(this.zb.dc,a.toString()))return this;var b=this.zb,c=this.k;H(a!==de,"KeyIndex always exists and isn't meant to be added to the IndexMap.");for(var d=[],e=!1,c=c.Xb(Oc),f=R(c);f;)e=e||a.yc(f.S),d.push(f),f=R(c);d=e?Ke(d,ne(a)):ue;e=a.toString();c=ya(b.dc);c[e]=a;a=ya(b.od);a[e]=d;return new P(this.k,this.aa,new Ie(a,c))};h.zc=function(a){return a===de||ua(this.zb.dc,a.toString())};
h.ca=function(a){if(a===this)return!0;if(a.J())return!1;if(this.C().ca(a.C())&&this.k.count()===a.k.count()){var b=this.Xb(N);a=a.Xb(N);for(var c=R(b),d=R(a);c&&d;){if(c.name!==d.name||!c.S.ca(d.S))return!1;c=R(b);d=R(a)}return null===c&&null===d}return!1};function ig(a,b){return b===de?null:a.zb.get(b.toString())}h.toString=function(){return B(this.H(!0))};function M(a,b){if(null===a)return F;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);H(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new Vc(a,M(c));if(a instanceof Array){var d=F,e=a;t(e,function(a,b){if(Bb(e,b)&&"."!==b.substring(0,1)){var c=M(a);if(c.J()||!c.e())d=
d.U(b,c)}});return d.ga(M(c))}var f=[],g=!1,k=a;Cb(k,function(a){if("string"!==typeof a||"."!==a.substring(0,1)){var b=M(k[a]);b.e()||(g=g||!b.C().e(),f.push(new K(a,b)))}});if(0==f.length)return F;var m=Ke(f,Lc,function(a){return a.name},Nc);if(g){var l=Ke(f,ne(N));return new P(m,M(c),new Ie({".priority":l},{".priority":N}))}return new P(m,M(c),Me)}var jg=Math.log(2);
function kg(a){this.count=parseInt(Math.log(a+1)/jg,10);this.Re=this.count-1;this.Lf=a+1&parseInt(Array(this.count+1).join("1"),2)}function lg(a){var b=!(a.Lf&1<<a.Re);a.Re--;return b}
function Ke(a,b,c,d){function e(b,d){var f=d-b;if(0==f)return null;if(1==f){var l=a[b],u=c?c(l):l;return new Zf(u,l.S,!1,null,null)}var l=parseInt(f/2,10)+b,f=e(b,l),z=e(l+1,d),l=a[l],u=c?c(l):l;return new Zf(u,l.S,!1,f,z)}a.sort(b);var f=function(b){function d(b,g){var k=u-b,z=u;u-=b;var z=e(k+1,z),k=a[k],G=c?c(k):k,z=new Zf(G,k.S,g,null,z);f?f.left=z:l=z;f=z}for(var f=null,l=null,u=a.length,z=0;z<b.count;++z){var G=lg(b),td=Math.pow(2,b.count-(z+1));G?d(td,!1):(d(td,!1),d(td,!0))}return l}(new kg(a.length));
return null!==f?new Uf(d||b,f):new Uf(d||b)}function se(a){return"number"===typeof a?"number:"+nd(a):"string:"+a}function qe(a){if(a.J()){var b=a.H();H("string"===typeof b||"number"===typeof b||"object"===typeof b&&Bb(b,".sv"),"Priority must be a string or number.")}else H(a===xe||a.e(),"priority of unexpected type.");H(a===xe||a.C().e(),"Priority nodes can't have a priority of their own.")}var F=new P(new Uf(Nc),null,Me);function mg(){P.call(this,new Uf(Nc),F,Me)}ka(mg,P);h=mg.prototype;
h.tc=function(a){return a===this?0:1};h.ca=function(a){return a===this};h.C=function(){return this};h.R=function(){return F};h.e=function(){return!1};var xe=new mg,ve=new K("[MIN_NAME]",F),Be=new K("[MAX_NAME]",xe);function W(a,b,c){this.A=a;this.W=b;this.g=c}W.prototype.H=function(){y("Firebase.DataSnapshot.val",0,0,arguments.length);return this.A.H()};W.prototype.val=W.prototype.H;W.prototype.Ue=function(){y("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.A.H(!0)};W.prototype.exportVal=W.prototype.Ue;W.prototype.Vf=function(){y("Firebase.DataSnapshot.exists",0,0,arguments.length);return!this.A.e()};W.prototype.exists=W.prototype.Vf;
W.prototype.m=function(a){y("Firebase.DataSnapshot.child",0,1,arguments.length);fa(a)&&(a=String(a));Kf("Firebase.DataSnapshot.child",a);var b=new L(a),c=this.W.m(b);return new W(this.A.Q(b),c,N)};W.prototype.child=W.prototype.m;W.prototype.Fa=function(a){y("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Kf("Firebase.DataSnapshot.hasChild",a);var b=new L(a);return!this.A.Q(b).e()};W.prototype.hasChild=W.prototype.Fa;
W.prototype.C=function(){y("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.A.C().H()};W.prototype.getPriority=W.prototype.C;W.prototype.forEach=function(a){y("Firebase.DataSnapshot.forEach",1,1,arguments.length);A("Firebase.DataSnapshot.forEach",1,a,!1);if(this.A.J())return!1;var b=this;return!!this.A.P(this.g,function(c,d){return a(new W(d,b.W.m(c),N))})};W.prototype.forEach=W.prototype.forEach;
W.prototype.kd=function(){y("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.A.J()?!1:!this.A.e()};W.prototype.hasChildren=W.prototype.kd;W.prototype.getKey=function(){y("Firebase.DataSnapshot.key",0,0,arguments.length);return this.W.getKey()};pd(W.prototype,"key",W.prototype.getKey);W.prototype.Fb=function(){y("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.A.Fb()};W.prototype.numChildren=W.prototype.Fb;
W.prototype.xb=function(){y("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.W};pd(W.prototype,"ref",W.prototype.xb);function Xd(a,b){this.O=a;this.Ld=b}function Ud(a,b,c,d){return new Xd(new Ec(b,c,d),a.Ld)}function Yd(a){return a.O.ea?a.O.j():null}Xd.prototype.u=function(){return this.Ld};function Fc(a){return a.Ld.ea?a.Ld.j():null};function ng(a,b){this.W=a;var c=a.n,d=new ee(c.g),c=S(c)?new ee(c.g):c.xa?new ke(c):new fe(c);this.of=new Od(c);var e=b.u(),f=b.O,g=d.za(F,e.j(),null),k=c.za(F,f.j(),null);this.Na=new Xd(new Ec(k,f.ea,c.Qa()),new Ec(g,e.ea,d.Qa()));this.ab=[];this.Sf=new Jd(a)}function og(a){return a.W}h=ng.prototype;h.u=function(){return this.Na.u().j()};h.jb=function(a){var b=Fc(this.Na);return b&&(S(this.W.n)||!a.e()&&!b.R(J(a)).e())?b.Q(a):null};h.e=function(){return 0===this.ab.length};h.Ob=function(a){this.ab.push(a)};
h.mb=function(a,b){var c=[];if(b){H(null==a,"A cancel should cancel all event registrations.");var d=this.W.path;Ja(this.ab,function(a){(a=a.Pe(b,d))&&c.push(a)})}if(a){for(var e=[],f=0;f<this.ab.length;++f){var g=this.ab[f];if(!g.matches(a))e.push(g);else if(a.af()){e=e.concat(this.ab.slice(f+1));break}}this.ab=e}else this.ab=[];return c};
h.gb=function(a,b,c){a.type===Gd&&null!==a.source.Ib&&(H(Fc(this.Na),"We should always have a full cache before handling merges"),H(Yd(this.Na),"Missing event cache, even though we have a server cache"));var d=this.Na;a=this.of.gb(d,a,b,c);b=this.of;c=a.Sd;H(c.O.j().zc(b.V.g),"Event snap not indexed");H(c.u().j().zc(b.V.g),"Server snap not indexed");H(Ic(a.Sd.u())||!Ic(d.u()),"Once a server snap is complete, it should never go back");this.Na=a.Sd;return pg(this,a.Mf,a.Sd.O.j(),null)};
function qg(a,b){var c=a.Na.O,d=[];c.j().J()||c.j().P(N,function(a,b){d.push(new I("child_added",b,a))});c.ea&&d.push(Gc(c.j()));return pg(a,d,c.j(),b)}function pg(a,b,c,d){return Kd(a.Sf,b,c,d?[d]:a.ab)};function rg(a,b,c){this.Qb=a;this.sb=b;this.ub=c||null}h=rg.prototype;h.tf=function(a){return"value"===a};h.createEvent=function(a,b){var c=b.n.g;return new yc("value",this,new W(a.Ma,b.xb(),c))};h.Ub=function(a){var b=this.ub;if("cancel"===a.ge()){H(this.sb,"Raising a cancel event on a listener with no cancel callback");var c=this.sb;return function(){c.call(b,a.error)}}var d=this.Qb;return function(){d.call(b,a.Md)}};h.Pe=function(a,b){return this.sb?new zc(this,a,b):null};
h.matches=function(a){return a instanceof rg?a.Qb&&this.Qb?a.Qb===this.Qb&&a.ub===this.ub:!0:!1};h.af=function(){return null!==this.Qb};function sg(a,b,c){this.ha=a;this.sb=b;this.ub=c}h=sg.prototype;h.tf=function(a){a="children_added"===a?"child_added":a;return("children_removed"===a?"child_removed":a)in this.ha};h.Pe=function(a,b){return this.sb?new zc(this,a,b):null};
h.createEvent=function(a,b){H(null!=a.Za,"Child events should have a childName.");var c=b.xb().m(a.Za);return new yc(a.type,this,new W(a.Ma,c,b.n.g),a.Dd)};h.Ub=function(a){var b=this.ub;if("cancel"===a.ge()){H(this.sb,"Raising a cancel event on a listener with no cancel callback");var c=this.sb;return function(){c.call(b,a.error)}}var d=this.ha[a.gd];return function(){d.call(b,a.Md,a.Dd)}};
h.matches=function(a){if(a instanceof sg){if(!this.ha||!a.ha)return!0;if(this.ub===a.ub){var b=qa(a.ha);if(b===qa(this.ha)){if(1===b){var b=ra(a.ha),c=ra(this.ha);return c===b&&(!a.ha[b]||!this.ha[c]||a.ha[b]===this.ha[c])}return pa(this.ha,function(b,c){return a.ha[c]===b})}}}return!1};h.af=function(){return null!==this.ha};function X(a,b,c,d){this.w=a;this.path=b;this.n=c;this.Oc=d}
function tg(a){var b=null,c=null;a.ka&&(b=he(a));a.na&&(c=je(a));if(a.g===de){if(a.ka){if("[MIN_NAME]"!=ge(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==typeof b)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}if(a.na){if("[MAX_NAME]"!=ie(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==
typeof c)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}}else if(a.g===N){if(null!=b&&!Cf(b)||null!=c&&!Cf(c))throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");}else if(H(a.g instanceof we||a.g===Ce,"unknown index type."),null!=b&&"object"===typeof b||null!=c&&"object"===typeof c)throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
}function ug(a){if(a.ka&&a.na&&a.xa&&(!a.xa||""===a.oc))throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");}function vg(a,b){if(!0===a.Oc)throw Error(b+": You can't combine multiple orderBy calls.");}h=X.prototype;h.xb=function(){y("Query.ref",0,0,arguments.length);return new U(this.w,this.path)};
h.hc=function(a,b,c,d){y("Query.on",2,4,arguments.length);If("Query.on",a,!1);A("Query.on",2,b,!1);var e=wg("Query.on",c,d);if("value"===a)xg(this.w,this,new rg(b,e.cancel||null,e.Pa||null));else{var f={};f[a]=b;xg(this.w,this,new sg(f,e.cancel,e.Pa))}return b};
h.Jc=function(a,b,c){y("Query.off",0,3,arguments.length);If("Query.off",a,!0);A("Query.off",2,b,!0);Eb("Query.off",3,c);var d=null,e=null;"value"===a?d=new rg(b||null,null,c||null):a&&(b&&(e={},e[a]=b),d=new sg(e,null,c||null));e=this.w;d=".info"===J(this.path)?e.pd.mb(this,d):e.K.mb(this,d);uc(e.da,this.path,d)};
h.kg=function(a,b){function c(k){f&&(f=!1,e.Jc(a,c),b&&b.call(d.Pa,k),g.resolve(k))}y("Query.once",1,4,arguments.length);If("Query.once",a,!1);A("Query.once",2,b,!0);var d=wg("Query.once",arguments[2],arguments[3]),e=this,f=!0,g=new Hb;Jb(g.ra);this.hc(a,c,function(b){e.Jc(a,c);d.cancel&&d.cancel.call(d.Pa,b);g.reject(b)});return g.ra};
h.ne=function(a){y("Query.limitToFirst",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToFirst: First argument must be a positive integer.");if(this.n.xa)throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.w,this.path,this.n.ne(a),this.Oc)};
h.oe=function(a){y("Query.limitToLast",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToLast: First argument must be a positive integer.");if(this.n.xa)throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.w,this.path,this.n.oe(a),this.Oc)};
h.lg=function(a){y("Query.orderByChild",1,1,arguments.length);if("$key"===a)throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');if("$priority"===a)throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');if("$value"===a)throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');Kf("Query.orderByChild",a);vg(this,"Query.orderByChild");var b=new L(a);if(b.e())throw Error("Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead.");
b=new we(b);b=Ge(this.n,b);tg(b);return new X(this.w,this.path,b,!0)};h.mg=function(){y("Query.orderByKey",0,0,arguments.length);vg(this,"Query.orderByKey");var a=Ge(this.n,de);tg(a);return new X(this.w,this.path,a,!0)};h.ng=function(){y("Query.orderByPriority",0,0,arguments.length);vg(this,"Query.orderByPriority");var a=Ge(this.n,N);tg(a);return new X(this.w,this.path,a,!0)};
h.og=function(){y("Query.orderByValue",0,0,arguments.length);vg(this,"Query.orderByValue");var a=Ge(this.n,Ce);tg(a);return new X(this.w,this.path,a,!0)};h.Nd=function(a,b){y("Query.startAt",0,2,arguments.length);Df("Query.startAt",a,this.path,!0);Jf("Query.startAt",b);var c=this.n.Nd(a,b);ug(c);tg(c);if(this.n.ka)throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");p(a)||(b=a=null);return new X(this.w,this.path,c,this.Oc)};
h.fd=function(a,b){y("Query.endAt",0,2,arguments.length);Df("Query.endAt",a,this.path,!0);Jf("Query.endAt",b);var c=this.n.fd(a,b);ug(c);tg(c);if(this.n.na)throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");return new X(this.w,this.path,c,this.Oc)};
h.Rf=function(a,b){y("Query.equalTo",1,2,arguments.length);Df("Query.equalTo",a,this.path,!1);Jf("Query.equalTo",b);if(this.n.ka)throw Error("Query.equalTo: Starting point was already set (by another call to endAt or equalTo).");if(this.n.na)throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");return this.Nd(a,b).fd(a,b)};
h.toString=function(){y("Query.toString",0,0,arguments.length);for(var a=this.path,b="",c=a.Z;c<a.o.length;c++)""!==a.o[c]&&(b+="/"+encodeURIComponent(String(a.o[c])));return this.w.toString()+(b||"/")};h.ya=function(){var a=kd(He(this.n));return"{}"===a?"default":a};
function wg(a,b,c){var d={cancel:null,Pa:null};if(b&&c)d.cancel=b,A(a,3,d.cancel,!0),d.Pa=c,Eb(a,4,d.Pa);else if(b)if("object"===typeof b&&null!==b)d.Pa=b;else if("function"===typeof b)d.cancel=b;else throw Error(Db(a,3,!0)+" must either be a cancel callback or a context object.");return d}X.prototype.on=X.prototype.hc;X.prototype.off=X.prototype.Jc;X.prototype.once=X.prototype.kg;X.prototype.limitToFirst=X.prototype.ne;X.prototype.limitToLast=X.prototype.oe;X.prototype.orderByChild=X.prototype.lg;
X.prototype.orderByKey=X.prototype.mg;X.prototype.orderByPriority=X.prototype.ng;X.prototype.orderByValue=X.prototype.og;X.prototype.startAt=X.prototype.Nd;X.prototype.endAt=X.prototype.fd;X.prototype.equalTo=X.prototype.Rf;X.prototype.toString=X.prototype.toString;pd(X.prototype,"ref",X.prototype.xb);function yg(a,b){this.value=a;this.children=b||zg}var zg=new Uf(function(a,b){return a===b?0:a<b?-1:1});function Ag(a){var b=Q;t(a,function(a,d){b=b.set(new L(d),a)});return b}h=yg.prototype;h.e=function(){return null===this.value&&this.children.e()};function Bg(a,b,c){if(null!=a.value&&c(a.value))return{path:C,value:a.value};if(b.e())return null;var d=J(b);a=a.children.get(d);return null!==a?(b=Bg(a,D(b),c),null!=b?{path:(new L(d)).m(b.path),value:b.value}:null):null}
function Cg(a,b){return Bg(a,b,function(){return!0})}h.subtree=function(a){if(a.e())return this;var b=this.children.get(J(a));return null!==b?b.subtree(D(a)):Q};h.set=function(a,b){if(a.e())return new yg(b,this.children);var c=J(a),d=(this.children.get(c)||Q).set(D(a),b),c=this.children.Ra(c,d);return new yg(this.value,c)};
h.remove=function(a){if(a.e())return this.children.e()?Q:new yg(null,this.children);var b=J(a),c=this.children.get(b);return c?(a=c.remove(D(a)),b=a.e()?this.children.remove(b):this.children.Ra(b,a),null===this.value&&b.e()?Q:new yg(this.value,b)):this};h.get=function(a){if(a.e())return this.value;var b=this.children.get(J(a));return b?b.get(D(a)):null};
function ce(a,b,c){if(b.e())return c;var d=J(b);b=ce(a.children.get(d)||Q,D(b),c);d=b.e()?a.children.remove(d):a.children.Ra(d,b);return new yg(a.value,d)}function Dg(a,b){return Eg(a,C,b)}function Eg(a,b,c){var d={};a.children.ia(function(a,f){d[a]=Eg(f,b.m(a),c)});return c(b,a.value,d)}function Fg(a,b,c){return Gg(a,b,C,c)}function Gg(a,b,c,d){var e=a.value?d(c,a.value):!1;if(e)return e;if(b.e())return null;e=J(b);return(a=a.children.get(e))?Gg(a,D(b),c.m(e),d):null}
function Hg(a,b,c){Ig(a,b,C,c)}function Ig(a,b,c,d){if(b.e())return a;a.value&&d(c,a.value);var e=J(b);return(a=a.children.get(e))?Ig(a,D(b),c.m(e),d):Q}function ae(a,b){Jg(a,C,b)}function Jg(a,b,c){a.children.ia(function(a,e){Jg(e,b.m(a),c)});a.value&&c(b,a.value)}function Kg(a,b){a.children.ia(function(a,d){d.value&&b(a,d.value)})}var Q=new yg(null);yg.prototype.toString=function(){var a={};ae(this,function(b,c){a[b.toString()]=c.toString()});return B(a)};function Lg(a,b,c){this.type=Td;this.source=Mg;this.path=a;this.Pb=b;this.Id=c}Lg.prototype.Nc=function(a){if(this.path.e()){if(null!=this.Pb.value)return H(this.Pb.children.e(),"affectedTree should not have overlapping affected paths."),this;a=this.Pb.subtree(new L(a));return new Lg(C,a,this.Id)}H(J(this.path)===a,"operationForChild called for unrelated child.");return new Lg(D(this.path),this.Pb,this.Id)};
Lg.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" ack write revert="+this.Id+" affectedTree="+this.Pb+")"};var ac=0,Gd=1,Td=2,cc=3;function Ng(a,b,c,d){this.ee=a;this.We=b;this.Ib=c;this.Ee=d;H(!d||b,"Tagged queries must be from server.")}var Mg=new Ng(!0,!1,null,!1),Og=new Ng(!1,!0,null,!1);Ng.prototype.toString=function(){return this.ee?"user":this.Ee?"server(queryID="+this.Ib+")":"server"};function Pg(a){this.X=a}var Qg=new Pg(new yg(null));function Rg(a,b,c){if(b.e())return new Pg(new yg(c));var d=Cg(a.X,b);if(null!=d){var e=d.path,d=d.value;b=T(e,b);d=d.F(b,c);return new Pg(a.X.set(e,d))}a=ce(a.X,b,new yg(c));return new Pg(a)}function Sg(a,b,c){var d=a;Cb(c,function(a,c){d=Rg(d,b.m(a),c)});return d}Pg.prototype.Ed=function(a){if(a.e())return Qg;a=ce(this.X,a,Q);return new Pg(a)};function Tg(a,b){var c=Cg(a.X,b);return null!=c?a.X.get(c.path).Q(T(c.path,b)):null}
function Ug(a){var b=[],c=a.X.value;null!=c?c.J()||c.P(N,function(a,c){b.push(new K(a,c))}):a.X.children.ia(function(a,c){null!=c.value&&b.push(new K(a,c.value))});return b}function Vg(a,b){if(b.e())return a;var c=Tg(a,b);return null!=c?new Pg(new yg(c)):new Pg(a.X.subtree(b))}Pg.prototype.e=function(){return this.X.e()};Pg.prototype.apply=function(a){return Wg(C,this.X,a)};
function Wg(a,b,c){if(null!=b.value)return c.F(a,b.value);var d=null;b.children.ia(function(b,f){".priority"===b?(H(null!==f.value,"Priority writes must always be leaf nodes"),d=f.value):c=Wg(a.m(b),f,c)});c.Q(a).e()||null===d||(c=c.F(a.m(".priority"),d));return c};function Xg(){this.Aa={}}h=Xg.prototype;h.e=function(){return xa(this.Aa)};h.gb=function(a,b,c){var d=a.source.Ib;if(null!==d)return d=x(this.Aa,d),H(null!=d,"SyncTree gave us an op for an invalid query."),d.gb(a,b,c);var e=[];t(this.Aa,function(d){e=e.concat(d.gb(a,b,c))});return e};h.Ob=function(a,b,c,d,e){var f=a.ya(),g=x(this.Aa,f);if(!g){var g=c.Ba(e?d:null),k=!1;g?k=!0:(g=d instanceof P?c.sc(d):F,k=!1);g=new ng(a,new Xd(new Ec(g,k,!1),new Ec(d,e,!1)));this.Aa[f]=g}g.Ob(b);return qg(g,b)};
h.mb=function(a,b,c){var d=a.ya(),e=[],f=[],g=null!=Yg(this);if("default"===d){var k=this;t(this.Aa,function(a,d){f=f.concat(a.mb(b,c));a.e()&&(delete k.Aa[d],S(a.W.n)||e.push(a.W))})}else{var m=x(this.Aa,d);m&&(f=f.concat(m.mb(b,c)),m.e()&&(delete this.Aa[d],S(m.W.n)||e.push(m.W)))}g&&null==Yg(this)&&e.push(new U(a.w,a.path));return{sg:e,Tf:f}};function Zg(a){return Ka(sa(a.Aa),function(a){return!S(a.W.n)})}h.jb=function(a){var b=null;t(this.Aa,function(c){b=b||c.jb(a)});return b};
function $g(a,b){if(S(b.n))return Yg(a);var c=b.ya();return x(a.Aa,c)}function Yg(a){return wa(a.Aa,function(a){return S(a.W.n)})||null};function ah(){this.T=Qg;this.la=[];this.Cc=-1}function bh(a,b){for(var c=0;c<a.la.length;c++){var d=a.la[c];if(d.Zc===b)return d}return null}h=ah.prototype;
h.Ed=function(a){var b=Pa(this.la,function(b){return b.Zc===a});H(0<=b,"removeWrite called with nonexistent writeId.");var c=this.la[b];this.la.splice(b,1);for(var d=c.visible,e=!1,f=this.la.length-1;d&&0<=f;){var g=this.la[f];g.visible&&(f>=b&&ch(g,c.path)?d=!1:c.path.contains(g.path)&&(e=!0));f--}if(d){if(e)this.T=dh(this.la,eh,C),this.Cc=0<this.la.length?this.la[this.la.length-1].Zc:-1;else if(c.Ja)this.T=this.T.Ed(c.path);else{var k=this;t(c.children,function(a,b){k.T=k.T.Ed(c.path.m(b))})}return!0}return!1};
h.Ba=function(a,b,c,d){if(c||d){var e=Vg(this.T,a);return!d&&e.e()?b:d||null!=b||null!=Tg(e,C)?(e=dh(this.la,function(b){return(b.visible||d)&&(!c||!(0<=Ia(c,b.Zc)))&&(b.path.contains(a)||a.contains(b.path))},a),b=b||F,e.apply(b)):null}e=Tg(this.T,a);if(null!=e)return e;e=Vg(this.T,a);return e.e()?b:null!=b||null!=Tg(e,C)?(b=b||F,e.apply(b)):null};
h.sc=function(a,b){var c=F,d=Tg(this.T,a);if(d)d.J()||d.P(N,function(a,b){c=c.U(a,b)});else if(b){var e=Vg(this.T,a);b.P(N,function(a,b){var d=Vg(e,new L(a)).apply(b);c=c.U(a,d)});Ja(Ug(e),function(a){c=c.U(a.name,a.S)})}else e=Vg(this.T,a),Ja(Ug(e),function(a){c=c.U(a.name,a.S)});return c};h.$c=function(a,b,c,d){H(c||d,"Either existingEventSnap or existingServerSnap must exist");a=a.m(b);if(null!=Tg(this.T,a))return null;a=Vg(this.T,a);return a.e()?d.Q(b):a.apply(d.Q(b))};
h.rc=function(a,b,c){a=a.m(b);var d=Tg(this.T,a);return null!=d?d:Dc(c,b)?Vg(this.T,a).apply(c.j().R(b)):null};h.mc=function(a){return Tg(this.T,a)};h.Xd=function(a,b,c,d,e,f){var g;a=Vg(this.T,a);g=Tg(a,C);if(null==g)if(null!=b)g=a.apply(b);else return[];g=g.ob(f);if(g.e()||g.J())return[];b=[];a=ne(f);e=e?g.$b(c,f):g.Yb(c,f);for(f=R(e);f&&b.length<d;)0!==a(f,c)&&b.push(f),f=R(e);return b};
function ch(a,b){return a.Ja?a.path.contains(b):!!va(a.children,function(c,d){return a.path.m(d).contains(b)})}function eh(a){return a.visible}
function dh(a,b,c){for(var d=Qg,e=0;e<a.length;++e){var f=a[e];if(b(f)){var g=f.path;if(f.Ja)c.contains(g)?(g=T(c,g),d=Rg(d,g,f.Ja)):g.contains(c)&&(g=T(g,c),d=Rg(d,C,f.Ja.Q(g)));else if(f.children)if(c.contains(g))g=T(c,g),d=Sg(d,g,f.children);else{if(g.contains(c))if(g=T(g,c),g.e())d=Sg(d,C,f.children);else if(f=x(f.children,J(g)))f=f.Q(D(g)),d=Rg(d,C,f)}else throw Xc("WriteRecord should have .snap or .children");}}return d}function fh(a,b){this.Mb=a;this.X=b}h=fh.prototype;
h.Ba=function(a,b,c){return this.X.Ba(this.Mb,a,b,c)};h.sc=function(a){return this.X.sc(this.Mb,a)};h.$c=function(a,b,c){return this.X.$c(this.Mb,a,b,c)};h.mc=function(a){return this.X.mc(this.Mb.m(a))};h.Xd=function(a,b,c,d,e){return this.X.Xd(this.Mb,a,b,c,d,e)};h.rc=function(a,b){return this.X.rc(this.Mb,a,b)};h.m=function(a){return new fh(this.Mb.m(a),this.X)};function gh(){this.children={};this.ad=0;this.value=null}function hh(a,b,c){this.ud=a?a:"";this.Ha=b?b:null;this.A=c?c:new gh}function ih(a,b){for(var c=b instanceof L?b:new L(b),d=a,e;null!==(e=J(c));)d=new hh(e,d,x(d.A.children,e)||new gh),c=D(c);return d}h=hh.prototype;h.Ea=function(){return this.A.value};function jh(a,b){H("undefined"!==typeof b,"Cannot set value to undefined");a.A.value=b;kh(a)}h.clear=function(){this.A.value=null;this.A.children={};this.A.ad=0;kh(this)};
h.kd=function(){return 0<this.A.ad};h.e=function(){return null===this.Ea()&&!this.kd()};h.P=function(a){var b=this;t(this.A.children,function(c,d){a(new hh(d,b,c))})};function lh(a,b,c,d){c&&!d&&b(a);a.P(function(a){lh(a,b,!0,d)});c&&d&&b(a)}function mh(a,b){for(var c=a.parent();null!==c&&!b(c);)c=c.parent()}h.path=function(){return new L(null===this.Ha?this.ud:this.Ha.path()+"/"+this.ud)};h.name=function(){return this.ud};h.parent=function(){return this.Ha};
function kh(a){if(null!==a.Ha){var b=a.Ha,c=a.ud,d=a.e(),e=Bb(b.A.children,c);d&&e?(delete b.A.children[c],b.A.ad--,kh(b)):d||e||(b.A.children[c]=a.A,b.A.ad++,kh(b))}};function nh(a,b,c,d,e,f){this.id=oh++;this.f=cd("p:"+this.id+":");this.qd={};this.$={};this.pa=[];this.Pc=0;this.Lc=[];this.ma=!1;this.Va=1E3;this.td=3E5;this.Hb=b;this.Kc=c;this.ue=d;this.M=a;this.pb=this.Ia=this.Db=this.ze=null;this.Vd=e;this.de=!1;this.ke=0;if(f)throw Error("Auth override specified in options, but not supported on non Node.js platforms");this.Je=f||null;this.vb=null;this.Nb=!1;this.Gd={};this.tg=0;this.Ve=!0;this.Bc=this.me=null;ph(this,0);Sf.Wb().hc("visible",this.jg,this);-1===
a.host.indexOf("fblocal")&&Rf.Wb().hc("online",this.ig,this)}var oh=0,qh=0;h=nh.prototype;h.ua=function(a,b,c){var d=++this.tg;a={r:d,a:a,b:b};this.f(B(a));H(this.ma,"sendRequest call when we're not connected not allowed.");this.Ia.ua(a);c&&(this.Gd[d]=c)};
h.df=function(a,b,c,d){var e=a.ya(),f=a.path.toString();this.f("Listen called for "+f+" "+e);this.$[f]=this.$[f]||{};H(Cd(a.n)||!S(a.n),"listen() called for non-default but complete query");H(!this.$[f][e],"listen() called twice for same path/queryId.");a={G:d,ld:b,pg:a,tag:c};this.$[f][e]=a;this.ma&&rh(this,a)};
function rh(a,b){var c=b.pg,d=c.path.toString(),e=c.ya();a.f("Listen on "+d+" for "+e);var f={p:d};b.tag&&(f.q=He(c.n),f.t=b.tag);f.h=b.ld();a.ua("q",f,function(f){var k=f.d,m=f.s;if(k&&"object"===typeof k&&Bb(k,"w")){var l=x(k,"w");da(l)&&0<=Ia(l,"no_index")&&O("Using an unspecified index. Consider adding "+('".indexOn": "'+c.n.g.toString()+'"')+" at "+c.path.toString()+" to your security rules for better performance")}(a.$[d]&&a.$[d][e])===b&&(a.f("listen response",f),"ok"!==m&&sh(a,d,e),b.G&&b.G(m,
k))})}h.qf=function(a){this.pb=a;this.f("Auth token refreshed");this.pb?th(this):this.ma&&this.ua("unauth",{},function(){});if(a&&40===a.length||sd(a))this.f("Admin auth credential detected.  Reducing max reconnect time."),this.td=3E4};function th(a){if(a.ma&&a.pb){var b=a.pb,c=rd(b)?"auth":"gauth",d={cred:b};a.Je&&(d.authvar=a.Je);a.ua(c,d,function(c){var d=c.s;c=c.d||"error";a.pb===b&&("ok"===d?this.ke=0:uh(a,d,c))})}}
h.Ef=function(a,b){var c=a.path.toString(),d=a.ya();this.f("Unlisten called for "+c+" "+d);H(Cd(a.n)||!S(a.n),"unlisten() called for non-default but complete query");if(sh(this,c,d)&&this.ma){var e=He(a.n);this.f("Unlisten on "+c+" for "+d);c={p:c};b&&(c.q=e,c.t=b);this.ua("n",c)}};h.re=function(a,b,c){this.ma?vh(this,"o",a,b,c):this.Lc.push({we:a,action:"o",data:b,G:c})};h.gf=function(a,b,c){this.ma?vh(this,"om",a,b,c):this.Lc.push({we:a,action:"om",data:b,G:c})};
h.xd=function(a,b){this.ma?vh(this,"oc",a,null,b):this.Lc.push({we:a,action:"oc",data:null,G:b})};function vh(a,b,c,d,e){c={p:c,d:d};a.f("onDisconnect "+b,c);a.ua(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}h.put=function(a,b,c,d){wh(this,"p",a,b,c,d)};h.ef=function(a,b,c,d){wh(this,"m",a,b,c,d)};function wh(a,b,c,d,e,f){d={p:c,d:d};p(f)&&(d.h=f);a.pa.push({action:b,sf:d,G:e});a.Pc++;b=a.pa.length-1;a.ma?xh(a,b):a.f("Buffering put: "+c)}
function xh(a,b){var c=a.pa[b].action,d=a.pa[b].sf,e=a.pa[b].G;a.pa[b].qg=a.ma;a.ua(c,d,function(d){a.f(c+" response",d);delete a.pa[b];a.Pc--;0===a.Pc&&(a.pa=[]);e&&e(d.s,d.d)})}h.ye=function(a){this.ma&&(a={c:a},this.f("reportStats",a),this.ua("s",a,function(a){"ok"!==a.s&&this.f("reportStats","Error sending stats: "+a.d)}))};
h.wd=function(a){if("r"in a){this.f("from server: "+B(a));var b=a.r,c=this.Gd[b];c&&(delete this.Gd[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,a=a.b,this.f("handleServerMessage",b,a),"d"===b?this.Hb(a.p,a.d,!1,a.t):"m"===b?this.Hb(a.p,a.d,!0,a.t):"c"===b?yh(this,a.p,a.q):"ac"===b?uh(this,a.s,a.d):"sd"===b?this.ze?this.ze(a):"msg"in a&&"undefined"!==typeof console&&console.log("FIREBASE: "+a.msg.replace("\n","\nFIREBASE: ")):dd("Unrecognized action received from server: "+
B(b)+"\nAre you using the latest client?"))}};h.Mc=function(a,b){this.f("connection ready");this.ma=!0;this.Bc=(new Date).getTime();this.ue({serverTimeOffset:a-(new Date).getTime()});this.Db=b;if(this.Ve){var c={};c["sdk.js."+firebase.SDK_VERSION.replace(/\./g,"-")]=1;Qb()?c["framework.cordova"]=1:"object"===typeof navigator&&"ReactNative"===navigator.product&&(c["framework.reactnative"]=1);this.ye(c)}zh(this);this.Ve=!1;this.Kc(!0)};
function ph(a,b){H(!a.Ia,"Scheduling a connect when we're already connected/ing?");a.vb&&clearTimeout(a.vb);a.vb=setTimeout(function(){a.vb=null;Ah(a)},Math.floor(b))}h.jg=function(a){a&&!this.Nb&&this.Va===this.td&&(this.f("Window became visible.  Reducing delay."),this.Va=1E3,this.Ia||ph(this,0));this.Nb=a};h.ig=function(a){a?(this.f("Browser went online."),this.Va=1E3,this.Ia||ph(this,0)):(this.f("Browser went offline.  Killing connection."),this.Ia&&this.Ia.close())};
h.jf=function(){this.f("data client disconnected");this.ma=!1;this.Ia=null;for(var a=0;a<this.pa.length;a++){var b=this.pa[a];b&&"h"in b.sf&&b.qg&&(b.G&&b.G("disconnect"),delete this.pa[a],this.Pc--)}0===this.Pc&&(this.pa=[]);this.Gd={};Bh(this)&&(this.Nb?this.Bc&&(3E4<(new Date).getTime()-this.Bc&&(this.Va=1E3),this.Bc=null):(this.f("Window isn't visible.  Delaying reconnect."),this.Va=this.td,this.me=(new Date).getTime()),a=Math.max(0,this.Va-((new Date).getTime()-this.me)),a*=Math.random(),this.f("Trying to reconnect in "+
a+"ms"),ph(this,a),this.Va=Math.min(this.td,1.3*this.Va));this.Kc(!1)};
function Ah(a){if(Bh(a)){a.f("Making a connection attempt");a.me=(new Date).getTime();a.Bc=null;var b=r(a.wd,a),c=r(a.Mc,a),d=r(a.jf,a),e=a.id+":"+qh++,f=a.Db,g=!1,k=null,m=function(){k?k.close():(g=!0,d())};a.Ia={close:m,ua:function(a){H(k,"sendRequest call when we're not connected not allowed.");k.ua(a)}};var l=a.de;a.de=!1;a.Vd.getToken(l).then(function(l){g?E("getToken() completed but was canceled"):(E("getToken() completed. Creating connection."),a.pb=l&&l.accessToken,k=new af(e,a.M,b,c,d,function(b){O(b+
" ("+a.M.toString()+")");a.eb("server_kill")},f))}).then(null,function(b){a.f("Failed to get token: "+b);g||m()})}}h.eb=function(a){E("Interrupting connection for reason: "+a);this.qd[a]=!0;this.Ia?this.Ia.close():(this.vb&&(clearTimeout(this.vb),this.vb=null),this.ma&&this.jf())};h.lc=function(a){E("Resuming connection for reason: "+a);delete this.qd[a];xa(this.qd)&&(this.Va=1E3,this.Ia||ph(this,0))};
function yh(a,b,c){c=c?La(c,function(a){return kd(a)}).join("$"):"default";(a=sh(a,b,c))&&a.G&&a.G("permission_denied")}function sh(a,b,c){b=(new L(b)).toString();var d;p(a.$[b])?(d=a.$[b][c],delete a.$[b][c],0===qa(a.$[b])&&delete a.$[b]):d=void 0;return d}
function uh(a,b,c){E("Auth token revoked: "+b+"/"+c);a.pb=null;a.de=!0;a.Ia.close();"invalid_token"===b&&(a.ke++,3<=a.ke&&(a.Va=3E4,O("Provided authentication credentials are invalid. This usually indicates your FirebaseApp instance was not initialized correctly. Make sure your apiKey and databaseURL match the values provided for your app at https://console.firebase.google.com/, or if you're using a service account, make sure it's authorized to access the specified databaseURL and is from the correct project.")))}
function zh(a){th(a);t(a.$,function(b){t(b,function(b){rh(a,b)})});for(var b=0;b<a.pa.length;b++)a.pa[b]&&xh(a,b);for(;a.Lc.length;)b=a.Lc.shift(),vh(a,b.action,b.we,b.data,b.G)}function Bh(a){var b;b=Rf.Wb().ic;return xa(a.qd)&&b};var Y={Xf:function(){Qe=wd=!0}};Y.forceLongPolling=Y.Xf;Y.Yf=function(){Re=!0};Y.forceWebSockets=Y.Yf;Y.dg=function(){return vd.isAvailable()};Y.isWebSocketsAvailable=Y.dg;Y.wg=function(a,b){a.w.Ua.ze=b};Y.setSecurityDebugCallback=Y.wg;Y.Be=function(a,b){a.w.Be(b)};Y.stats=Y.Be;Y.Ce=function(a,b){a.w.Ce(b)};Y.statsIncrementCounter=Y.Ce;Y.ed=function(a){return a.w.ed};Y.dataUpdateCount=Y.ed;Y.cg=function(a,b){a.w.je=b};Y.interceptServerData=Y.cg;function Ch(a){this.wa=Q;this.lb=new ah;this.De={};this.jc={};this.Dc=a}function Dh(a,b,c,d,e){var f=a.lb,g=e;H(d>f.Cc,"Stacking an older write on top of newer ones");p(g)||(g=!0);f.la.push({path:b,Ja:c,Zc:d,visible:g});g&&(f.T=Rg(f.T,b,c));f.Cc=d;return e?Eh(a,new $b(Mg,b,c)):[]}function Fh(a,b,c,d){var e=a.lb;H(d>e.Cc,"Stacking an older merge on top of newer ones");e.la.push({path:b,children:c,Zc:d,visible:!0});e.T=Sg(e.T,b,c);e.Cc=d;c=Ag(c);return Eh(a,new Fd(Mg,b,c))}
function Gh(a,b,c){c=c||!1;var d=bh(a.lb,b);if(a.lb.Ed(b)){var e=Q;null!=d.Ja?e=e.set(C,!0):Cb(d.children,function(a,b){e=e.set(new L(a),b)});return Eh(a,new Lg(d.path,e,c))}return[]}function Hh(a,b,c){c=Ag(c);return Eh(a,new Fd(Og,b,c))}function Ih(a,b,c,d){d=Jh(a,d);if(null!=d){var e=Kh(d);d=e.path;e=e.Ib;b=T(d,b);c=new $b(new Ng(!1,!0,e,!0),b,c);return Lh(a,d,c)}return[]}
function Mh(a,b,c,d){if(d=Jh(a,d)){var e=Kh(d);d=e.path;e=e.Ib;b=T(d,b);c=Ag(c);c=new Fd(new Ng(!1,!0,e,!0),b,c);return Lh(a,d,c)}return[]}
Ch.prototype.Ob=function(a,b){var c=a.path,d=null,e=!1;Hg(this.wa,c,function(a,b){var f=T(a,c);d=d||b.jb(f);e=e||null!=Yg(b)});var f=this.wa.get(c);f?(e=e||null!=Yg(f),d=d||f.jb(C)):(f=new Xg,this.wa=this.wa.set(c,f));var g;null!=d?g=!0:(g=!1,d=F,Kg(this.wa.subtree(c),function(a,b){var c=b.jb(C);c&&(d=d.U(a,c))}));var k=null!=$g(f,a);if(!k&&!S(a.n)){var m=Nh(a);H(!(m in this.jc),"View does not exist, but we have a tag");var l=Oh++;this.jc[m]=l;this.De["_"+l]=m}g=f.Ob(a,b,new fh(c,this.lb),d,g);k||
e||(f=$g(f,a),g=g.concat(Ph(this,a,f)));return g};
Ch.prototype.mb=function(a,b,c){var d=a.path,e=this.wa.get(d),f=[];if(e&&("default"===a.ya()||null!=$g(e,a))){f=e.mb(a,b,c);e.e()&&(this.wa=this.wa.remove(d));e=f.sg;f=f.Tf;b=-1!==Pa(e,function(a){return S(a.n)});var g=Fg(this.wa,d,function(a,b){return null!=Yg(b)});if(b&&!g&&(d=this.wa.subtree(d),!d.e()))for(var d=Qh(d),k=0;k<d.length;++k){var m=d[k],l=m.W,m=Rh(this,m);this.Dc.Ae(Sh(l),Th(this,l),m.ld,m.G)}if(!g&&0<e.length&&!c)if(b)this.Dc.Od(Sh(a),null);else{var u=this;Ja(e,function(a){a.ya();
var b=u.jc[Nh(a)];u.Dc.Od(Sh(a),b)})}Uh(this,e)}return f};Ch.prototype.Ba=function(a,b){var c=this.lb,d=Fg(this.wa,a,function(b,c){var d=T(b,a);if(d=c.jb(d))return d});return c.Ba(a,d,b,!0)};function Qh(a){return Dg(a,function(a,c,d){if(c&&null!=Yg(c))return[Yg(c)];var e=[];c&&(e=Zg(c));t(d,function(a){e=e.concat(a)});return e})}function Uh(a,b){for(var c=0;c<b.length;++c){var d=b[c];if(!S(d.n)){var d=Nh(d),e=a.jc[d];delete a.jc[d];delete a.De["_"+e]}}}
function Sh(a){return S(a.n)&&!Cd(a.n)?a.xb():a}function Ph(a,b,c){var d=b.path,e=Th(a,b);c=Rh(a,c);b=a.Dc.Ae(Sh(b),e,c.ld,c.G);d=a.wa.subtree(d);if(e)H(null==Yg(d.value),"If we're adding a query, it shouldn't be shadowed");else for(e=Dg(d,function(a,b,c){if(!a.e()&&b&&null!=Yg(b))return[og(Yg(b))];var d=[];b&&(d=d.concat(La(Zg(b),function(a){return a.W})));t(c,function(a){d=d.concat(a)});return d}),d=0;d<e.length;++d)c=e[d],a.Dc.Od(Sh(c),Th(a,c));return b}
function Rh(a,b){var c=b.W,d=Th(a,c);return{ld:function(){return(b.u()||F).hash()},G:function(b){if("ok"===b){if(d){var f=c.path;if(b=Jh(a,d)){var g=Kh(b);b=g.path;g=g.Ib;f=T(b,f);f=new bc(new Ng(!1,!0,g,!0),f);b=Lh(a,b,f)}else b=[]}else b=Eh(a,new bc(Og,c.path));return b}f="Unknown Error";"too_big"===b?f="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==b?f="Client doesn't have permission to access the desired data.":"unavailable"==b&&
(f="The service is unavailable");f=Error(b+" at "+c.path.toString()+": "+f);f.code=b.toUpperCase();return a.mb(c,null,f)}}}function Nh(a){return a.path.toString()+"$"+a.ya()}function Kh(a){var b=a.indexOf("$");H(-1!==b&&b<a.length-1,"Bad queryKey.");return{Ib:a.substr(b+1),path:new L(a.substr(0,b))}}function Jh(a,b){var c=a.De,d="_"+b;return d in c?c[d]:void 0}function Th(a,b){var c=Nh(b);return x(a.jc,c)}var Oh=1;
function Lh(a,b,c){var d=a.wa.get(b);H(d,"Missing sync point for query tag that we're tracking");return d.gb(c,new fh(b,a.lb),null)}function Eh(a,b){return Vh(a,b,a.wa,null,new fh(C,a.lb))}function Vh(a,b,c,d,e){if(b.path.e())return Wh(a,b,c,d,e);var f=c.get(C);null==d&&null!=f&&(d=f.jb(C));var g=[],k=J(b.path),m=b.Nc(k);if((c=c.children.get(k))&&m)var l=d?d.R(k):null,k=e.m(k),g=g.concat(Vh(a,m,c,l,k));f&&(g=g.concat(f.gb(b,e,d)));return g}
function Wh(a,b,c,d,e){var f=c.get(C);null==d&&null!=f&&(d=f.jb(C));var g=[];c.children.ia(function(c,f){var l=d?d.R(c):null,u=e.m(c),z=b.Nc(c);z&&(g=g.concat(Wh(a,z,f,l,u)))});f&&(g=g.concat(f.gb(b,e,d)));return g};function sf(a,b,c){this.app=c;var d=new dc(c);this.M=a;this.Xa=pc(a);this.Vc=null;this.da=new rc;this.vd=1;this.Ua=null;if(b||0<=("object"===typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i))this.va=new Ad(this.M,r(this.Hb,this),d),setTimeout(r(this.Kc,this,!0),0);else{b=c.options.databaseAuthVariableOverride||null;if(null!==b){if("object"!==ca(b))throw Error("Only objects are supported for option databaseAuthVariableOverride");
try{B(b)}catch(e){throw Error("Invalid authOverride provided: "+e);}}this.va=this.Ua=new nh(this.M,r(this.Hb,this),r(this.Kc,this),r(this.ue,this),d,b)}var f=this;ec(d,function(a){f.va.qf(a)});this.zg=qc(a,r(function(){return new jc(this.Xa,this.va)},this));this.nc=new hh;this.ie=new fc;this.pd=new Ch({Ae:function(a,b,c,d){b=[];c=f.ie.j(a.path);c.e()||(b=Eh(f.pd,new $b(Og,a.path,c)),setTimeout(function(){d("ok")},0));return b},Od:aa});Xh(this,"connected",!1);this.ja=new Rc;this.$a=new rf(this);this.ed=
0;this.je=null;this.K=new Ch({Ae:function(a,b,c,d){f.va.df(a,c,b,function(b,c){var e=d(b,c);wc(f.da,a.path,e)});return[]},Od:function(a,b){f.va.Ef(a,b)}})}h=sf.prototype;h.toString=function(){return(this.M.Sc?"https://":"http://")+this.M.host};h.name=function(){return this.M.pe};function Yh(a){a=a.ie.j(new L(".info/serverTimeOffset")).H()||0;return(new Date).getTime()+a}function Zh(a){a=a={timestamp:Yh(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
h.Hb=function(a,b,c,d){this.ed++;var e=new L(a);b=this.je?this.je(a,b):b;a=[];d?c?(b=oa(b,function(a){return M(a)}),a=Mh(this.K,e,b,d)):(b=M(b),a=Ih(this.K,e,b,d)):c?(d=oa(b,function(a){return M(a)}),a=Hh(this.K,e,d)):(d=M(b),a=Eh(this.K,new $b(Og,e,d)));d=e;0<a.length&&(d=$h(this,e));wc(this.da,d,a)};h.Kc=function(a){Xh(this,"connected",a);!1===a&&ai(this)};h.ue=function(a){var b=this;md(a,function(a,d){Xh(b,d,a)})};
function Xh(a,b,c){b=new L("/.info/"+b);c=M(c);var d=a.ie;d.Jd=d.Jd.F(b,c);c=Eh(a.pd,new $b(Og,b,c));wc(a.da,b,c)}h.Kb=function(a,b,c,d){this.f("set",{path:a.toString(),value:b,Gg:c});var e=Zh(this);b=M(b,c);var e=Uc(b,e),f=this.vd++,e=Dh(this.K,a,e,f,!0);sc(this.da,e);var g=this;this.va.put(a.toString(),b.H(!0),function(b,c){var e="ok"===b;e||O("set at "+a+" failed: "+b);e=Gh(g.K,f,!e);wc(g.da,a,e);bi(d,b,c)});e=ci(this,a);$h(this,e);wc(this.da,e,[])};
h.update=function(a,b,c){this.f("update",{path:a.toString(),value:b});var d=!0,e=Zh(this),f={};t(b,function(a,b){d=!1;var c=M(a);f[b]=Uc(c,e)});if(d)E("update() called with empty data.  Don't do anything."),bi(c,"ok");else{var g=this.vd++,k=Fh(this.K,a,f,g);sc(this.da,k);var m=this;this.va.ef(a.toString(),b,function(b,d){var e="ok"===b;e||O("update at "+a+" failed: "+b);var e=Gh(m.K,g,!e),f=a;0<e.length&&(f=$h(m,a));wc(m.da,f,e);bi(c,b,d)});b=ci(this,a);$h(this,b);wc(this.da,a,[])}};
function ai(a){a.f("onDisconnectEvents");var b=Zh(a),c=[];Sc(Qc(a.ja,b),C,function(b,e){c=c.concat(Eh(a.K,new $b(Og,b,e)));var f=ci(a,b);$h(a,f)});a.ja=new Rc;wc(a.da,C,c)}h.xd=function(a,b){var c=this;this.va.xd(a.toString(),function(d,e){"ok"===d&&yf(c.ja,a);bi(b,d,e)})};function Mf(a,b,c,d){var e=M(c);a.va.re(b.toString(),e.H(!0),function(c,g){"ok"===c&&Tc(a.ja,b,e);bi(d,c,g)})}function Nf(a,b,c,d,e){var f=M(c,d);a.va.re(b.toString(),f.H(!0),function(c,d){"ok"===c&&Tc(a.ja,b,f);bi(e,c,d)})}
function Of(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(E("onDisconnect().update() called with empty data.  Don't do anything."),bi(d,"ok")):a.va.gf(b.toString(),c,function(e,f){if("ok"===e)for(var m in c){var l=M(c[m]);Tc(a.ja,b.m(m),l)}bi(d,e,f)})}function xg(a,b,c){c=".info"===J(b.path)?a.pd.Ob(b,c):a.K.Ob(b,c);uc(a.da,b.path,c)}h.eb=function(){this.Ua&&this.Ua.eb("repo_interrupt")};h.lc=function(){this.Ua&&this.Ua.lc("repo_interrupt")};
h.Be=function(a){if("undefined"!==typeof console){a?(this.Vc||(this.Vc=new kc(this.Xa)),a=this.Vc.get()):a=this.Xa.get();var b=Ma(ta(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};h.Ce=function(a){mc(this.Xa,a);this.zg.zf[a]=!0};h.f=function(a){var b="";this.Ua&&(b=this.Ua.id+":");E(b,arguments)};
function bi(a,b,c){a&&Ub(function(){if("ok"==b)a(null);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function di(a,b,c,d,e){function f(){}a.f("transaction on "+b);var g=new U(a,b);g.hc("value",f);c={path:b,update:c,G:d,status:null,lf:Wc(),Ie:e,wf:0,Rd:function(){g.Jc("value",f)},Td:null,Da:null,bd:null,cd:null,dd:null};d=a.K.Ba(b,void 0)||F;c.bd=d;d=c.update(d.H());if(p(d)){Ef("transaction failed: Data returned ",d,c.path);c.status=1;e=ih(a.nc,b);var k=e.Ea()||[];k.push(c);jh(e,k);"object"===typeof d&&null!==d&&Bb(d,".priority")?(k=x(d,".priority"),H(Cf(k),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):
k=(a.K.Ba(b)||F).C().H();e=Zh(a);d=M(d,k);e=Uc(d,e);c.cd=d;c.dd=e;c.Da=a.vd++;c=Dh(a.K,b,e,c.Da,c.Ie);wc(a.da,b,c);ei(a)}else c.Rd(),c.cd=null,c.dd=null,c.G&&(a=new W(c.bd,new U(a,c.path),N),c.G(null,!1,a))}function ei(a,b){var c=b||a.nc;b||fi(a,c);if(null!==c.Ea()){var d=gi(a,c);H(0<d.length,"Sending zero length transaction queue");Na(d,function(a){return 1===a.status})&&hi(a,c.path(),d)}else c.kd()&&c.P(function(b){ei(a,b)})}
function hi(a,b,c){for(var d=La(c,function(a){return a.Da}),e=a.K.Ba(b,d)||F,d=e,e=e.hash(),f=0;f<c.length;f++){var g=c[f];H(1===g.status,"tryToSendTransactionQueue_: items in queue should all be run.");g.status=2;g.wf++;var k=T(b,g.path),d=d.F(k,g.cd)}d=d.H(!0);a.va.put(b.toString(),d,function(d){a.f("transaction put response",{path:b.toString(),status:d});var e=[];if("ok"===d){d=[];for(f=0;f<c.length;f++){c[f].status=3;e=e.concat(Gh(a.K,c[f].Da));if(c[f].G){var g=c[f].dd,k=new U(a,c[f].path);d.push(r(c[f].G,
null,null,!0,new W(g,k,N)))}c[f].Rd()}fi(a,ih(a.nc,b));ei(a);wc(a.da,b,e);for(f=0;f<d.length;f++)Ub(d[f])}else{if("datastale"===d)for(f=0;f<c.length;f++)c[f].status=4===c[f].status?5:1;else for(O("transaction at "+b.toString()+" failed: "+d),f=0;f<c.length;f++)c[f].status=5,c[f].Td=d;$h(a,b)}},e)}function $h(a,b){var c=ii(a,b),d=c.path(),c=gi(a,c);ji(a,c,d);return d}
function ji(a,b,c){if(0!==b.length){for(var d=[],e=[],f=Ka(b,function(a){return 1===a.status}),f=La(f,function(a){return a.Da}),g=0;g<b.length;g++){var k=b[g],m=T(c,k.path),l=!1,u;H(null!==m,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===k.status)l=!0,u=k.Td,e=e.concat(Gh(a.K,k.Da,!0));else if(1===k.status)if(25<=k.wf)l=!0,u="maxretry",e=e.concat(Gh(a.K,k.Da,!0));else{var z=a.K.Ba(k.path,f)||F;k.bd=z;var G=b[g].update(z.H());p(G)?(Ef("transaction failed: Data returned ",G,
k.path),m=M(G),"object"===typeof G&&null!=G&&Bb(G,".priority")||(m=m.ga(z.C())),z=k.Da,G=Zh(a),G=Uc(m,G),k.cd=m,k.dd=G,k.Da=a.vd++,Qa(f,z),e=e.concat(Dh(a.K,k.path,G,k.Da,k.Ie)),e=e.concat(Gh(a.K,z,!0))):(l=!0,u="nodata",e=e.concat(Gh(a.K,k.Da,!0)))}wc(a.da,c,e);e=[];l&&(b[g].status=3,setTimeout(b[g].Rd,Math.floor(0)),b[g].G&&("nodata"===u?(k=new U(a,b[g].path),d.push(r(b[g].G,null,null,!1,new W(b[g].bd,k,N)))):d.push(r(b[g].G,null,Error(u),!1,null))))}fi(a,a.nc);for(g=0;g<d.length;g++)Ub(d[g]);ei(a)}}
function ii(a,b){for(var c,d=a.nc;null!==(c=J(b))&&null===d.Ea();)d=ih(d,c),b=D(b);return d}function gi(a,b){var c=[];ki(a,b,c);c.sort(function(a,b){return a.lf-b.lf});return c}function ki(a,b,c){var d=b.Ea();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.P(function(b){ki(a,b,c)})}function fi(a,b){var c=b.Ea();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;jh(b,0<c.length?c:null)}b.P(function(b){fi(a,b)})}
function ci(a,b){var c=ii(a,b).path(),d=ih(a.nc,b);mh(d,function(b){li(a,b)});li(a,d);lh(d,function(b){li(a,b)});return c}
function li(a,b){var c=b.Ea();if(null!==c){for(var d=[],e=[],f=-1,g=0;g<c.length;g++)4!==c[g].status&&(2===c[g].status?(H(f===g-1,"All SENT items should be at beginning of queue."),f=g,c[g].status=4,c[g].Td="set"):(H(1===c[g].status,"Unexpected transaction status in abort"),c[g].Rd(),e=e.concat(Gh(a.K,c[g].Da,!0)),c[g].G&&d.push(r(c[g].G,null,Error("set"),!1,null))));-1===f?jh(b,null):c.length=f+1;wc(a.da,b.path(),e);for(g=0;g<d.length;g++)Ub(d[g])}};function xf(){this.nb={};this.Ff=!1}xf.prototype.eb=function(){for(var a in this.nb)this.nb[a].eb()};xf.prototype.lc=function(){for(var a in this.nb)this.nb[a].lc()};xf.prototype.ce=function(a){this.Ff=a};ba(xf);xf.prototype.interrupt=xf.prototype.eb;xf.prototype.resume=xf.prototype.lc;var Z={};Z.pc=nh;Z.DataConnection=Z.pc;nh.prototype.yg=function(a,b){this.ua("q",{p:a},b)};Z.pc.prototype.simpleListen=Z.pc.prototype.yg;nh.prototype.Qf=function(a,b){this.ua("echo",{d:a},b)};Z.pc.prototype.echo=Z.pc.prototype.Qf;nh.prototype.interrupt=nh.prototype.eb;Z.If=af;Z.RealTimeConnection=Z.If;af.prototype.sendRequest=af.prototype.ua;af.prototype.close=af.prototype.close;
Z.bg=function(a){var b=nh.prototype.put;nh.prototype.put=function(c,d,e,f){p(f)&&(f=a());b.call(this,c,d,e,f)};return function(){nh.prototype.put=b}};Z.hijackHash=Z.bg;Z.Hf=gc;Z.ConnectionTarget=Z.Hf;Z.ya=function(a){return a.ya()};Z.queryIdentifier=Z.ya;Z.eg=function(a){return a.w.Ua.$};Z.listens=Z.eg;Z.ce=function(a){xf.Wb().ce(a)};Z.forceRestClient=Z.ce;Z.Context=xf;function U(a,b){if(!(a instanceof sf))throw Error("new Firebase() no longer supported - use app.database().");X.call(this,a,b,Ee,!1);this.then=void 0;this["catch"]=void 0}ka(U,X);h=U.prototype;h.getKey=function(){y("Firebase.key",0,0,arguments.length);return this.path.e()?null:$d(this.path)};
h.m=function(a){y("Firebase.child",1,1,arguments.length);if(fa(a))a=String(a);else if(!(a instanceof L))if(null===J(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Kf("Firebase.child",b)}else Kf("Firebase.child",a);return new U(this.w,this.path.m(a))};h.getParent=function(){y("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new U(this.w,a)};
h.Zf=function(){y("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.getParent();)a=a.getParent();return a};h.Pf=function(){return this.w.$a};h.set=function(a,b){y("Firebase.set",1,2,arguments.length);Lf("Firebase.set",this.path);Df("Firebase.set",a,this.path,!1);A("Firebase.set",2,b,!0);var c=new Hb;this.w.Kb(this.path,a,null,Ib(c,b));return c.ra};
h.update=function(a,b){y("Firebase.update",1,2,arguments.length);Lf("Firebase.update",this.path);if(da(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Gf("Firebase.update",a,this.path);A("Firebase.update",2,b,!0);c=new Hb;this.w.update(this.path,a,Ib(c,b));return c.ra};
h.Kb=function(a,b,c){y("Firebase.setWithPriority",2,3,arguments.length);Lf("Firebase.setWithPriority",this.path);Df("Firebase.setWithPriority",a,this.path,!1);Hf("Firebase.setWithPriority",2,b);A("Firebase.setWithPriority",3,c,!0);if(".length"===this.getKey()||".keys"===this.getKey())throw"Firebase.setWithPriority failed: "+this.getKey()+" is a read-only object.";var d=new Hb;this.w.Kb(this.path,a,b,Ib(d,c));return d.ra};
h.remove=function(a){y("Firebase.remove",0,1,arguments.length);Lf("Firebase.remove",this.path);A("Firebase.remove",1,a,!0);return this.set(null,a)};
h.transaction=function(a,b,c){y("Firebase.transaction",1,3,arguments.length);Lf("Firebase.transaction",this.path);A("Firebase.transaction",1,a,!1);A("Firebase.transaction",2,b,!0);if(p(c)&&"boolean"!=typeof c)throw Error(Db("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.getKey()||".keys"===this.getKey())throw"Firebase.transaction failed: "+this.getKey()+" is a read-only object.";"undefined"===typeof c&&(c=!0);var d=new Hb;ga(b)&&Jb(d.ra);di(this.w,this.path,a,function(a,c,
g){a?d.reject(a):d.resolve(new Pb(c,g));ga(b)&&b(a,c,g)},c);return d.ra};h.vg=function(a,b){y("Firebase.setPriority",1,2,arguments.length);Lf("Firebase.setPriority",this.path);Hf("Firebase.setPriority",1,a);A("Firebase.setPriority",2,b,!0);var c=new Hb;this.w.Kb(this.path.m(".priority"),a,null,Ib(c,b));return c.ra};
h.push=function(a,b){y("Firebase.push",0,2,arguments.length);Lf("Firebase.push",this.path);Df("Firebase.push",a,this.path,!0);A("Firebase.push",2,b,!0);var c=Yh(this.w),d=Tf(c),c=this.m(d);if(null!=a){var e=this,f=c.set(a,b).then(function(){return e.m(d)});c.then=r(f.then,f);c["catch"]=r(f.then,f,void 0);ga(b)&&Jb(f)}return c};h.kb=function(){Lf("Firebase.onDisconnect",this.path);return new V(this.w,this.path)};U.prototype.child=U.prototype.m;U.prototype.set=U.prototype.set;U.prototype.update=U.prototype.update;
U.prototype.setWithPriority=U.prototype.Kb;U.prototype.remove=U.prototype.remove;U.prototype.transaction=U.prototype.transaction;U.prototype.setPriority=U.prototype.vg;U.prototype.push=U.prototype.push;U.prototype.onDisconnect=U.prototype.kb;pd(U.prototype,"database",U.prototype.Pf);pd(U.prototype,"key",U.prototype.getKey);pd(U.prototype,"parent",U.prototype.getParent);pd(U.prototype,"root",U.prototype.Zf);if("undefined"===typeof firebase)throw Error("Cannot install Firebase Database - be sure to load firebase-app.js first.");
try{firebase.INTERNAL.registerService("database",function(a){var b=xf.Wb(),c=a.options.databaseURL;p(c)||ed("Can't determine Firebase Database URL.  Be sure to include databaseURL option when calling firebase.intializeApp().");var d=fd(c),c=d.kc;wf("Invalid Firebase Database URL",d);d.path.e()||ed("Database URL must point to the root of a Firebase Database (not including a child path).");(d=x(b.nb,a.name))&&ed("FIREBASE INTERNAL ERROR: Database initialized multiple times.");d=new sf(c,b.Ff,a);b.nb[a.name]=
d;return d.$a},{Reference:U,Query:X,Database:rf,enableLogging:bd,INTERNAL:Y,TEST_ACCESS:Z,ServerValue:uf})}catch(mi){ed("Failed to register the Firebase Database Service ("+mi+")")};})();

(function() {var k,aa=aa||{},l=this,n=function(a){return void 0!==a},ba=function(){},ca=function(){throw Error("unimplemented abstract method");},p=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";
if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},da=function(a){var b=p(a);return"array"==b||"object"==b&&"number"==typeof a.length},q=function(a){return"string"==typeof a},r=function(a){return"function"==p(a)},ea=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},fa="closure_uid_"+(1E9*Math.random()>>>
0),ga=0,ha=function(a,b,c){return a.call.apply(a.bind,arguments)},ia=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},t=function(a,b,c){t=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return t.apply(null,arguments)},ja=Date.now||function(){return+new Date},
u=function(a,b){function c(){}c.prototype=b.prototype;a.I=b.prototype;a.prototype=new c;a.Ka=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var ka=function(a,b,c){function d(){N||(N=!0,b.apply(null,arguments))}function e(b){m=setTimeout(function(){m=null;a(f,2===O)},b)}function f(a,b){if(!N)if(a)d.apply(null,arguments);else if(2===O||x)d.apply(null,arguments);else{64>h&&(h*=2);var c;1===O?(O=2,c=0):c=1E3*(h+Math.random());e(c)}}function g(a){ec||(ec=!0,N||(null!==m?(a||(O=2),clearTimeout(m),e(0)):a||(O=1)))}var h=1,m=null,x=!1,O=0,N=!1,ec=!1;e(0);setTimeout(function(){x=!0;g(!0)},c);return g};var la="https://firebasestorage.googleapis.com";var v=function(a,b){this.code="storage/"+a;this.message="Firebase Storage: "+b;this.serverResponse=null;this.name="FirebaseError"};u(v,Error);
var ma=function(){return new v("unknown","An unknown error occurred, please check the error payload for server response.")},na=function(){return new v("canceled","User canceled the upload/download.")},oa=function(){return new v("cannot-slice-blob","Cannot slice blob for upload. Please retry the upload.")},pa=function(a,b,c){return new v("invalid-argument","Invalid argument in `"+b+"` at index "+a+": "+c)},qa=function(){return new v("app-deleted","The Firebase app was deleted.")},ra=function(a,b){return new v("invalid-format",
"String does not match format '"+a+"': "+b)};var sa=function(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])},ta=function(a){var b={};sa(a,function(a,d){b[a]=d});return b};var w=function(a,b,c,d){this.i=a;this.b={};this.method=b;this.headers={};this.body="";this.N=c;this.c=this.a=null;this.f=[200];this.g=[];this.h=d};var ua={STATE_CHANGED:"state_changed"},va={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"},wa=function(a){switch(a){case "running":case "pausing":case "canceling":return"running";case "paused":return"paused";case "success":return"success";case "canceled":return"canceled";case "error":return"error";default:return"error"}};var y=function(a){return n(a)&&null!==a},xa=function(a){return"string"===typeof a||a instanceof String},ya=function(){return"undefined"!==typeof Blob};var za=function(a,b,c){this.f=c;this.c=a;this.g=b;this.b=0;this.a=null};za.prototype.get=function(){var a;0<this.b?(this.b--,a=this.a,this.a=a.next,a.next=null):a=this.c();return a};var Aa=function(a,b){a.g(b);a.b<a.f&&(a.b++,b.next=a.a,a.a=b)};var Ba=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Ba);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};u(Ba,Error);Ba.prototype.name="CustomError";var Ca=function(a,b,c,d,e){this.reset(a,b,c,d,e)};Ca.prototype.a=null;var Da=0;Ca.prototype.reset=function(a,b,c,d,e){"number"==typeof e||Da++;d||ja();this.b=b;delete this.a};var Ea=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b},Fa=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b},Ga="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),Ha=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Ga.length;f++)c=Ga[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var Ia=function(a){a.prototype.then=a.prototype.then;a.prototype.$goog_Thenable=!0},Ja=function(a){if(!a)return!1;try{return!!a.$goog_Thenable}catch(b){return!1}};var Ka=function(a){Ka[" "](a);return a};Ka[" "]=ba;var Ma=function(a,b){var c=La;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)};var Na=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")},Oa=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},Pa=function(a,b){return a<b?-1:a>b?1:0};var Qa=function(a,b){this.a=a;this.b=b};var z=function(a,b){this.bucket=a;this.path=b},Ra=function(a){var b=encodeURIComponent;return"/b/"+b(a.bucket)+"/o/"+b(a.path)},Sa=function(a){for(var b=null,c=[{ia:/^gs:\/\/([A-Za-z0-9.\-]+)(\/(.*))?$/i,ba:{bucket:1,path:3},ha:function(a){"/"===a.path.charAt(a.path.length-1)&&(a.path=a.path.slice(0,-1))}},{ia:/^https?:\/\/firebasestorage\.googleapis\.com\/v[A-Za-z0-9_]+\/b\/([A-Za-z0-9.\-]+)\/o(\/([^?#]*).*)?$/i,ba:{bucket:1,path:3},ha:function(a){a.path=decodeURIComponent(a.path)}}],d=0;d<c.length;d++){var e=
c[d],f=e.ia.exec(a);if(f){b=f[e.ba.bucket];(f=f[e.ba.path])||(f="");b=new z(b,f);e.ha(b);break}}if(null==b)throw new v("invalid-url","Invalid URL '"+a+"'.");return b};var Ta=function(a,b,c){r(a)||y(b)||y(c)?(this.next=a,this.a=b||null,this.b=c||null):(this.next=a.next||null,this.a=a.error||null,this.b=a.complete||null)};var Ua={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"},Va=function(a){switch(a){case "raw":case "base64":case "base64url":case "data_url":break;default:throw"Expected one of the event types: [raw, base64, base64url, data_url].";}},Wa=function(a,b){this.data=a;this.a=b||null},$a=function(a,b){switch(a){case "raw":return new Wa(Xa(b));case "base64":case "base64url":return new Wa(Ya(a,b));case "data_url":return a=new Za(b),a=a.a?Ya("base64",a.c):Xa(a.c),new Wa(a,(new Za(b)).b)}throw ma();
},Xa=function(a){for(var b=[],c=0;c<a.length;c++){var d=a.charCodeAt(c);if(127>=d)b.push(d);else if(2047>=d)b.push(192|d>>6,128|d&63);else if(55296==(d&64512))if(c<a.length-1&&56320==(a.charCodeAt(c+1)&64512)){var e=a.charCodeAt(++c),d=65536|(d&1023)<<10|e&1023;b.push(240|d>>18,128|d>>12&63,128|d>>6&63,128|d&63)}else b.push(239,191,189);else 56320==(d&64512)?b.push(239,191,189):b.push(224|d>>12,128|d>>6&63,128|d&63)}return new Uint8Array(b)},Ya=function(a,b){switch(a){case "base64":var c=-1!==b.indexOf("-"),
d=-1!==b.indexOf("_");if(c||d)throw ra(a,"Invalid character '"+(c?"-":"_")+"' found: is it base64url encoded?");break;case "base64url":c=-1!==b.indexOf("+");d=-1!==b.indexOf("/");if(c||d)throw ra(a,"Invalid character '"+(c?"+":"/")+"' found: is it base64 encoded?");b=b.replace(/-/g,"+").replace(/_/g,"/")}var e;try{e=atob(b)}catch(f){throw ra(a,"Invalid character found");}a=new Uint8Array(e.length);for(b=0;b<e.length;b++)a[b]=e.charCodeAt(b);return a},Za=function(a){var b=a.match(/^data:([^,]+)?,/);
if(null===b)throw ra("data_url","Must be formatted 'data:[<mediatype>][;base64],<data>");b=b[1]||null;this.a=!1;this.b=null;if(null!=b){var c=b.length-7;this.b=(this.a=0<=c&&b.indexOf(";base64",c)==c)?b.substring(0,b.length-7):b}this.c=a.substring(a.indexOf(",")+1)};var ab=function(a){var b=encodeURIComponent,c="?";sa(a,function(a,e){a=b(a)+"="+b(e);c=c+a+"&"});return c=c.slice(0,-1)};var A=function(a,b,c,d,e,f){this.b=a;this.h=b;this.f=c;this.a=d;this.g=e;this.c=f};k=A.prototype;k.na=function(){return this.b};k.Ja=function(){return this.h};k.Ga=function(){return this.f};k.Ba=function(){return this.a};k.pa=function(){if(y(this.a)){var a=this.a.downloadURLs;return y(a)&&y(a[0])?a[0]:null}return null};k.Ia=function(){return this.g};k.Ea=function(){return this.c};var bb=function(a,b){b.unshift(a);Ba.call(this,Na.apply(null,b));b.shift()};u(bb,Ba);bb.prototype.name="AssertionError";
var cb=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new bb(""+e,f||[]);},B=function(a,b,c){a||cb("",null,b,Array.prototype.slice.call(arguments,2))},db=function(a,b){throw new bb("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));},eb=function(a,b,c){r(a)||cb("Expected function but got %s: %s.",[p(a),a],b,Array.prototype.slice.call(arguments,2))};var fb=function(){this.g=this.g;this.o=this.o};fb.prototype.g=!1;fb.prototype.ea=function(){this.g||(this.g=!0,this.C())};fb.prototype.C=function(){if(this.o)for(;this.o.length;)this.o.shift()()};var gb="closure_listenable_"+(1E6*Math.random()|0),hb=0;var ib;a:{var jb=l.navigator;if(jb){var kb=jb.userAgent;if(kb){ib=kb;break a}}ib=""}var C=function(a){return-1!=ib.indexOf(a)};var lb=function(){};lb.prototype.b=null;lb.prototype.a=ca;var mb=function(a){return a.b||(a.b=a.f())};lb.prototype.f=ca;var nb=Array.prototype.indexOf?function(a,b,c){B(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(q(a))return q(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},ob=Array.prototype.forEach?function(a,b,c){B(null!=a.length);Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},pb=Array.prototype.filter?function(a,
b,c){B(null!=a.length);return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=q(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var m=g[h];b.call(c,m,h,a)&&(e[f++]=m)}return e},qb=Array.prototype.map?function(a,b,c){B(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=q(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},rb=Array.prototype.some?function(a,b,c){B(null!=a.length);return Array.prototype.some.call(a,
b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1},tb=function(a){var b;a:{b=sb;for(var c=a.length,d=q(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:q(a)?a.charAt(b):a[b]},ub=function(a){if("array"!=p(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0},vb=function(a,b){b=nb(a,b);var c;if(c=0<=b)B(null!=a.length),Array.prototype.splice.call(a,b,1);return c},wb=function(a){var b=
a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};var yb=new za(function(){return new xb},function(a){a.reset()},100),Ab=function(){var a=zb,b=null;a.a&&(b=a.a,a.a=a.a.next,a.a||(a.b=null),b.next=null);return b},xb=function(){this.next=this.b=this.a=null};xb.prototype.set=function(a,b){this.a=a;this.b=b;this.next=null};xb.prototype.reset=function(){this.next=this.b=this.a=null};var Bb=function(a,b){this.type=a;this.a=this.target=b;this.ja=!0};Bb.prototype.b=function(){this.ja=!1};var Cb=function(a,b,c,d,e){this.listener=a;this.a=null;this.src=b;this.type=c;this.U=!!d;this.N=e;++hb;this.O=this.T=!1},Db=function(a){a.O=!0;a.listener=null;a.a=null;a.src=null;a.N=null};var Eb=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;var Fb=function(a,b){b=pb(b.split("/"),function(a){return 0<a.length}).join("/");return 0===a.length?b:a+"/"+b},Gb=function(a){var b=a.lastIndexOf("/",a.length-2);return-1===b?a:a.slice(b+1)};var Hb=function(a){this.src=a;this.a={};this.b=0},Jb=function(a,b,c,d,e,f){var g=b.toString();b=a.a[g];b||(b=a.a[g]=[],a.b++);var h=Ib(b,c,e,f);-1<h?(a=b[h],d||(a.T=!1)):(a=new Cb(c,a.src,g,!!e,f),a.T=d,b.push(a));return a},Kb=function(a,b){var c=b.type;c in a.a&&vb(a.a[c],b)&&(Db(b),0==a.a[c].length&&(delete a.a[c],a.b--))},Ib=function(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.O&&f.listener==b&&f.U==!!c&&f.N==d)return e}return-1};var Lb,Mb=function(){};u(Mb,lb);Mb.prototype.a=function(){var a=Nb(this);return a?new ActiveXObject(a):new XMLHttpRequest};Mb.prototype.f=function(){var a={};Nb(this)&&(a[0]=!0,a[1]=!0);return a};
var Nb=function(a){if(!a.c&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.c=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.c};Lb=new Mb;var Ob=function(a){this.a=[];if(a)a:{var b;if(a instanceof Ob){if(b=a.H(),a=a.A(),0>=this.b()){for(var c=this.a,d=0;d<b.length;d++)c.push(new Qa(b[d],a[d]));break a}}else b=Fa(a),a=Ea(a);for(d=0;d<b.length;d++)Pb(this,b[d],a[d])}},Pb=function(a,b,c){var d=a.a;d.push(new Qa(b,c));b=d.length-1;a=a.a;for(c=a[b];0<b;)if(d=b-1>>1,a[d].a>c.a)a[b]=a[d],b=d;else break;a[b]=c};Ob.prototype.A=function(){for(var a=this.a,b=[],c=a.length,d=0;d<c;d++)b.push(a[d].b);return b};
Ob.prototype.H=function(){for(var a=this.a,b=[],c=a.length,d=0;d<c;d++)b.push(a[d].a);return b};Ob.prototype.b=function(){return this.a.length};var Qb=function(){this.c=[];this.a=[]},Rb=function(a){0==a.c.length&&(a.c=a.a,a.c.reverse(),a.a=[]);return a.c.pop()};Qb.prototype.b=function(){return this.c.length+this.a.length};Qb.prototype.A=function(){for(var a=[],b=this.c.length-1;0<=b;--b)a.push(this.c[b]);for(var c=this.a.length,b=0;b<c;++b)a.push(this.a[b]);return a};var Sb=function(a){if(a.A&&"function"==typeof a.A)return a.A();if(q(a))return a.split("");if(da(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Ea(a)},Tb=function(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(da(a)||q(a))ob(a,b,void 0);else{var c;if(a.H&&"function"==typeof a.H)c=a.H();else if(a.A&&"function"==typeof a.A)c=void 0;else if(da(a)||q(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=Fa(a);for(var d=Sb(a),e=d.length,f=0;f<e;f++)b.call(void 0,
d[f],c&&c[f],a)}};var Ub=function(a){l.setTimeout(function(){throw a;},0)},Vb,Wb=function(){var a=l.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!C("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,
a=t(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!C("Trident")&&!C("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(n(c.next)){c=c.next;var a=c.da;c.da=null;a()}};return function(a){d.next={da:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?
function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){l.setTimeout(a,0)}};var Xb="StopIteration"in l?l.StopIteration:{message:"StopIteration",stack:""},Yb=function(){};Yb.prototype.next=function(){throw Xb;};Yb.prototype.h=function(){return this};var Zb=function(){Ob.call(this)};u(Zb,Ob);var $b=C("Opera"),D=C("Trident")||C("MSIE"),ac=C("Edge"),bc=C("Gecko")&&!(-1!=ib.toLowerCase().indexOf("webkit")&&!C("Edge"))&&!(C("Trident")||C("MSIE"))&&!C("Edge"),cc=-1!=ib.toLowerCase().indexOf("webkit")&&!C("Edge"),dc=function(){var a=l.document;return a?a.documentMode:void 0},fc;
a:{var gc="",hc=function(){var a=ib;if(bc)return/rv\:([^\);]+)(\)|;)/.exec(a);if(ac)return/Edge\/([\d\.]+)/.exec(a);if(D)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(cc)return/WebKit\/(\S+)/.exec(a);if($b)return/(?:Version)[ \/]?(\S+)/.exec(a)}();hc&&(gc=hc?hc[1]:"");if(D){var ic=dc();if(null!=ic&&ic>parseFloat(gc)){fc=String(ic);break a}}fc=gc}
var jc=fc,La={},E=function(a){return Ma(a,function(){for(var b=0,c=Oa(String(jc)).split("."),d=Oa(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",h=d[f]||"";do{g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];h=/(\d*)(\D*)(.*)/.exec(h)||["","","",""];if(0==g[0].length&&0==h[0].length)break;b=Pa(0==g[1].length?0:parseInt(g[1],10),0==h[1].length?0:parseInt(h[1],10))||Pa(0==g[2].length,0==h[2].length)||Pa(g[2],h[2]);g=g[3];h=h[3]}while(0==b)}return 0<=b})},kc=l.document,
lc=kc&&D?dc()||("CSS1Compat"==kc.compatMode?parseInt(jc,10):5):void 0;var pc=function(a,b){mc||nc();oc||(mc(),oc=!0);var c=zb,d=yb.get();d.set(a,b);c.b?c.b.next=d:(B(!c.a),c.a=d);c.b=d},mc,nc=function(){if(l.Promise&&l.Promise.resolve){var a=l.Promise.resolve(void 0);mc=function(){a.then(qc)}}else mc=function(){var a=qc;!r(l.setImmediate)||l.Window&&l.Window.prototype&&!C("Edge")&&l.Window.prototype.setImmediate==l.setImmediate?(Vb||(Vb=Wb()),Vb(a)):l.setImmediate(a)}},oc=!1,zb=new function(){this.b=this.a=null},qc=function(){for(var a;a=Ab();){try{a.a.call(a.b)}catch(b){Ub(b)}Aa(yb,
a)}oc=!1};var rc;(rc=!D)||(rc=9<=Number(lc));var sc=rc,tc=D&&!E("9");!cc||E("528");bc&&E("1.9b")||D&&E("8")||$b&&E("9.5")||cc&&E("528");bc&&!E("8")||D&&E("9");var F=function(a,b){this.c={};this.a=[];this.g=this.f=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a){a instanceof F?(c=a.H(),d=a.A()):(c=Fa(a),d=Ea(a));for(var e=0;e<c.length;e++)this.set(c[e],d[e])}};F.prototype.b=function(){return this.f};F.prototype.A=function(){uc(this);for(var a=[],b=0;b<this.a.length;b++)a.push(this.c[this.a[b]]);return a};F.prototype.H=function(){uc(this);return this.a.concat()};
var vc=function(a,b){return Object.prototype.hasOwnProperty.call(a.c,b)?(delete a.c[b],a.f--,a.g++,a.a.length>2*a.f&&uc(a),!0):!1},uc=function(a){if(a.f!=a.a.length){for(var b=0,c=0;b<a.a.length;){var d=a.a[b];Object.prototype.hasOwnProperty.call(a.c,d)&&(a.a[c++]=d);b++}a.a.length=c}if(a.f!=a.a.length){for(var e={},c=b=0;b<a.a.length;)d=a.a[b],Object.prototype.hasOwnProperty.call(e,d)||(a.a[c++]=d,e[d]=1),b++;a.a.length=c}};
F.prototype.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.c,a)?this.c[a]:b};F.prototype.set=function(a,b){Object.prototype.hasOwnProperty.call(this.c,a)||(this.f++,this.a.push(a),this.g++);this.c[a]=b};F.prototype.forEach=function(a,b){for(var c=this.H(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};
F.prototype.h=function(a){uc(this);var b=0,c=this.g,d=this,e=new Yb;e.next=function(){if(c!=d.g)throw Error("The map has changed since the iterator was created");if(b>=d.a.length)throw Xb;var e=d.a[b++];return a?e:d.c[e]};return e};var wc=function(a,b){Bb.call(this,a?a.type:"");this.c=this.a=this.target=null;if(a){this.type=a.type;this.target=a.target||a.srcElement;this.a=b;if((b=a.relatedTarget)&&bc)try{Ka(b.nodeName)}catch(c){}this.c=a;a.defaultPrevented&&this.b()}};u(wc,Bb);wc.prototype.b=function(){wc.I.b.call(this);var a=this.c;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,tc)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var G=function(a,b){this.a=0;this.i=void 0;this.c=this.b=this.f=null;this.g=this.h=!1;if(a!=ba)try{var c=this;a.call(b,function(a){xc(c,2,a)},function(a){try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(e){}xc(c,3,a)})}catch(d){xc(this,3,d)}},yc=function(){this.next=this.f=this.c=this.a=this.b=null;this.g=!1};yc.prototype.reset=function(){this.f=this.c=this.a=this.b=null;this.g=!1};
var zc=new za(function(){return new yc},function(a){a.reset()},100),Ac=function(a,b,c){var d=zc.get();d.a=a;d.c=b;d.f=c;return d},Bc=function(a){if(a instanceof G)return a;var b=new G(ba);xc(b,2,a);return b},Cc=function(a){return new G(function(b,c){c(a)})};
G.prototype.then=function(a,b,c){null!=a&&eb(a,"opt_onFulfilled should be a function.");null!=b&&eb(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return Dc(this,r(a)?a:null,r(b)?b:null,c)};Ia(G);G.prototype.l=function(a,b){return Dc(this,null,a,b)};
var Fc=function(a,b){a.b||2!=a.a&&3!=a.a||Ec(a);B(null!=b.a);a.c?a.c.next=b:a.b=b;a.c=b},Dc=function(a,b,c,d){var e=Ac(null,null,null);e.b=new G(function(a,g){e.a=b?function(c){try{var e=b.call(d,c);a(e)}catch(x){g(x)}}:a;e.c=c?function(b){try{var e=c.call(d,b);a(e)}catch(x){g(x)}}:g});e.b.f=a;Fc(a,e);return e.b};G.prototype.o=function(a){B(1==this.a);this.a=0;xc(this,2,a)};G.prototype.m=function(a){B(1==this.a);this.a=0;xc(this,3,a)};
var xc=function(a,b,c){if(0==a.a){a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself"));a.a=1;var d;a:{var e=c,f=a.o,g=a.m;if(e instanceof G)null!=f&&eb(f,"opt_onFulfilled should be a function."),null!=g&&eb(g,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),Fc(e,Ac(f||ba,g||null,a)),d=!0;else if(Ja(e))e.then(f,g,a),d=!0;else{if(ea(e))try{var h=e.then;if(r(h)){Gc(e,h,f,g,a);d=!0;break a}}catch(m){g.call(a,m);d=!0;break a}d=!1}}d||
(a.i=c,a.a=b,a.f=null,Ec(a),3!=b||Hc(a,c))}},Gc=function(a,b,c,d,e){var f=!1,g=function(a){f||(f=!0,c.call(e,a))},h=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,g,h)}catch(m){h(m)}},Ec=function(a){a.h||(a.h=!0,pc(a.j,a))},Ic=function(a){var b=null;a.b&&(b=a.b,a.b=b.next,b.next=null);a.b||(a.c=null);null!=b&&B(null!=b.a);return b};
G.prototype.j=function(){for(var a;a=Ic(this);){var b=this.a,c=this.i;if(3==b&&a.c&&!a.g){var d;for(d=this;d&&d.g;d=d.f)d.g=!1}if(a.b)a.b.f=null,Jc(a,b,c);else try{a.g?a.a.call(a.f):Jc(a,b,c)}catch(e){Kc.call(null,e)}Aa(zc,a)}this.h=!1};var Jc=function(a,b,c){2==b?a.a.call(a.f,c):a.c&&a.c.call(a.f,c)},Hc=function(a,b){a.g=!0;pc(function(){a.g&&Kc.call(null,b)})},Kc=Ub;var Mc=function(a){this.a=new F;if(a){a=Sb(a);for(var b=a.length,c=0;c<b;c++){var d=a[c];this.a.set(Lc(d),d)}}},Lc=function(a){var b=typeof a;return"object"==b&&a||"function"==b?"o"+(a[fa]||(a[fa]=++ga)):b.substr(0,1)+a};Mc.prototype.b=function(){return this.a.b()};Mc.prototype.A=function(){return this.a.A()};Mc.prototype.h=function(){return this.a.h(!1)};var Nc=function(a){return function(){var b=[];Array.prototype.push.apply(b,arguments);Bc(!0).then(function(){a.apply(null,b)})}};var Oc="closure_lm_"+(1E6*Math.random()|0),Pc={},Qc=0,Rc=function(a,b,c,d,e){if("array"==p(b)){for(var f=0;f<b.length;f++)Rc(a,b[f],c,d,e);return null}c=Sc(c);a&&a[gb]?(Tc(a),a=Jb(a.b,String(b),c,!1,d,e)):a=Uc(a,b,c,!1,d,e);return a},Uc=function(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=!!e,h=Vc(a);h||(a[Oc]=h=new Hb(a));c=Jb(h,b,c,d,e,f);if(c.a)return c;d=Wc();c.a=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,g);else if(a.attachEvent)a.attachEvent(Xc(b.toString()),
d);else throw Error("addEventListener and attachEvent are unavailable.");Qc++;return c},Wc=function(){var a=Yc,b=sc?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b},Zc=function(a,b,c,d,e){if("array"==p(b))for(var f=0;f<b.length;f++)Zc(a,b[f],c,d,e);else c=Sc(c),a&&a[gb]?Jb(a.b,String(b),c,!0,d,e):Uc(a,b,c,!0,d,e)},$c=function(a,b,c,d,e){if("array"==p(b))for(var f=0;f<b.length;f++)$c(a,b[f],c,d,e);else(c=Sc(c),a&&a[gb])?(a=a.b,b=String(b).toString(),
b in a.a&&(f=a.a[b],c=Ib(f,c,d,e),-1<c&&(Db(f[c]),B(null!=f.length),Array.prototype.splice.call(f,c,1),0==f.length&&(delete a.a[b],a.b--)))):a&&(a=Vc(a))&&(b=a.a[b.toString()],a=-1,b&&(a=Ib(b,c,!!d,e)),(c=-1<a?b[a]:null)&&ad(c))},ad=function(a){if("number"==typeof a||!a||a.O)return;var b=a.src;if(b&&b[gb]){Kb(b.b,a);return}var c=a.type,d=a.a;b.removeEventListener?b.removeEventListener(c,d,a.U):b.detachEvent&&b.detachEvent(Xc(c),d);Qc--;(c=Vc(b))?(Kb(c,a),0==c.b&&(c.src=null,b[Oc]=null)):Db(a)},Xc=
function(a){return a in Pc?Pc[a]:Pc[a]="on"+a},cd=function(a,b,c,d){var e=!0;if(a=Vc(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.U==c&&!f.O&&(f=bd(f,d),e=e&&!1!==f)}return e},bd=function(a,b){var c=a.listener,d=a.N||a.src;a.T&&ad(a);return c.call(d,b)},Yc=function(a,b){if(a.O)return!0;if(!sc){if(!b)a:{b=["window","event"];for(var c=l,d;d=b.shift();)if(null!=c[d])c=c[d];else{b=null;break a}b=c}d=b;b=new wc(d,this);c=!0;if(!(0>d.keyCode||void 0!=d.returnValue)){a:{var e=
!1;if(0==d.keyCode)try{d.keyCode=-1;break a}catch(g){e=!0}if(e||void 0==d.returnValue)d.returnValue=!0}d=[];for(e=b.a;e;e=e.parentNode)d.push(e);a=a.type;for(e=d.length-1;0<=e;e--){b.a=d[e];var f=cd(d[e],a,!0,b),c=c&&f}for(e=0;e<d.length;e++)b.a=d[e],f=cd(d[e],a,!1,b),c=c&&f}return c}return bd(a,new wc(b,this))},Vc=function(a){a=a[Oc];return a instanceof Hb?a:null},dd="__closure_events_fn_"+(1E9*Math.random()>>>0),Sc=function(a){B(a,"Listener can not be null.");if(r(a))return a;B(a.handleEvent,"An object listener must have handleEvent method.");
a[dd]||(a[dd]=function(b){return a.handleEvent(b)});return a[dd]};var H=function(a,b){fb.call(this);this.m=a||0;this.f=b||10;if(this.m>this.f)throw Error("[goog.structs.Pool] Min can not be greater than max");this.a=new Qb;this.c=new Mc;this.j=null;this.S()};u(H,fb);H.prototype.W=function(){var a=ja();if(!(null!=this.j&&0>a-this.j)){for(var b;0<this.a.b()&&(b=Rb(this.a),!this.l(b));)this.S();!b&&this.b()<this.f&&(b=this.i());b&&(this.j=a,this.c.a.set(Lc(b),b));return b}};var fd=function(a){var b=ed;vc(b.c.a,Lc(a))&&b.$(a)};
H.prototype.$=function(a){vc(this.c.a,Lc(a));this.l(a)&&this.b()<this.f?this.a.a.push(a):gd(a)};H.prototype.S=function(){for(var a=this.a;this.b()<this.m;){var b=this.i();a.a.push(b)}for(;this.b()>this.f&&0<this.a.b();)gd(Rb(a))};H.prototype.i=function(){return{}};var gd=function(a){if("function"==typeof a.ea)a.ea();else for(var b in a)a[b]=null};H.prototype.l=function(a){return"function"==typeof a.oa?a.oa():!0};H.prototype.b=function(){return this.a.b()+this.c.b()};
H.prototype.C=function(){H.I.C.call(this);if(0<this.c.b())throw Error("[goog.structs.Pool] Objects not released");delete this.c;for(var a=this.a;0!=a.c.length||0!=a.a.length;)gd(Rb(a));delete this.a};/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
var hd=function(a,b){this.c=[];this.m=b||null;this.a=this.h=!1;this.b=void 0;this.j=this.g=!1;this.f=0;this.i=null;this.o=0};hd.prototype.l=function(a,b){this.g=!1;this.h=!0;this.b=b;this.a=!a;id(this)};var jd=function(a,b,c){B(!a.j,"Blocking Deferreds can not be re-used");a.c.push([b,c,void 0]);a.h&&id(a)};hd.prototype.then=function(a,b,c){var d,e,f=new G(function(a,b){d=a;e=b});jd(this,d,function(a){e(a)});return f.then(a,b,c)};Ia(hd);
var kd=function(a){return rb(a.c,function(a){return r(a[1])})},id=function(a){if(a.f&&a.h&&kd(a)){var b=a.f,c=ld[b];c&&(l.clearTimeout(c.a),delete ld[b]);a.f=0}a.i&&(a.i.o--,delete a.i);for(var b=a.b,d=c=!1;a.c.length&&!a.g;){var e=a.c.shift(),f=e[0],g=e[1],e=e[2];if(f=a.a?g:f)try{var h=f.call(e||a.m,b);n(h)&&(a.a=a.a&&(h==b||h instanceof Error),a.b=b=h);if(Ja(b)||"function"===typeof l.Promise&&b instanceof l.Promise)d=!0,a.g=!0}catch(m){b=m,a.a=!0,kd(a)||(c=!0)}}a.b=b;d&&(h=t(a.l,a,!0),d=t(a.l,a,
!1),b instanceof hd?(jd(b,h,d),b.j=!0):b.then(h,d));c&&(b=new md(b),ld[b.a]=b,a.f=b.a)},md=function(a){this.a=l.setTimeout(t(this.c,this),0);this.b=a};md.prototype.c=function(){B(ld[this.a],"Cannot throw an error that is not scheduled.");delete ld[this.a];throw this.b;};var ld={};var nd=function(a){this.f=a;this.b=this.c=this.a=null},od=function(a,b){this.name=a;this.value=b};od.prototype.toString=function(){return this.name};var pd=new od("SEVERE",1E3),qd=new od("CONFIG",700),rd=new od("FINE",500),sd=function(a){if(a.c)return a.c;if(a.a)return sd(a.a);db("Root logger has no level set.");return null};
nd.prototype.log=function(a,b,c){if(a.value>=sd(this).value)for(r(b)&&(b=b()),a=new Ca(a,String(b),this.f),c&&(a.a=c),c="log:"+a.b,l.console&&(l.console.timeStamp?l.console.timeStamp(c):l.console.markTimeline&&l.console.markTimeline(c)),l.msWriteProfilerMark&&l.msWriteProfilerMark(c),c=this;c;)c=c.a};
var td={},ud=null,vd=function(a){ud||(ud=new nd(""),td[""]=ud,ud.c=qd);var b;if(!(b=td[a])){b=new nd(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=vd(a.substr(0,c));c.b||(c.b={});c.b[d]=b;b.a=c;td[a]=b}return b};var wd=function(){fb.call(this);this.b=new Hb(this);this.Y=this;this.G=null};u(wd,fb);wd.prototype[gb]=!0;wd.prototype.removeEventListener=function(a,b,c,d){$c(this,a,b,c,d)};
var I=function(a,b){Tc(a);var c,d=a.G;if(d){c=[];for(var e=1;d;d=d.G)c.push(d),B(1E3>++e,"infinite loop")}a=a.Y;d=b.type||b;q(b)?b=new Bb(b,a):b instanceof Bb?b.target=b.target||a:(e=b,b=new Bb(d,a),Ha(b,e));var e=!0,f;if(c)for(var g=c.length-1;0<=g;g--)f=b.a=c[g],e=xd(f,d,!0,b)&&e;f=b.a=a;e=xd(f,d,!0,b)&&e;e=xd(f,d,!1,b)&&e;if(c)for(g=0;g<c.length;g++)f=b.a=c[g],e=xd(f,d,!1,b)&&e};
wd.prototype.C=function(){wd.I.C.call(this);if(this.b){var a=this.b,b=0,c;for(c in a.a){for(var d=a.a[c],e=0;e<d.length;e++)++b,Db(d[e]);delete a.a[c];a.b--}}this.G=null};var xd=function(a,b,c,d){b=a.b.a[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.O&&g.U==c){var h=g.listener,m=g.N||g.src;g.T&&Kb(a.b,g);e=!1!==h.call(m,d)&&e}}return e&&0!=d.ja},Tc=function(a){B(a.b,"Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")};var J=function(a,b){this.h=new Zb;H.call(this,a,b)};u(J,H);k=J.prototype;k.W=function(a,b){if(!a)return J.I.W.call(this);Pb(this.h,n(b)?b:100,a);this.aa()};k.aa=function(){for(var a=this.h;0<a.b();){var b=this.W();if(b){var c;var d=a,e=d.a,f=e.length;c=e[0];if(0>=f)c=void 0;else{if(1==f)ub(e);else{e[0]=e.pop();for(var e=0,d=d.a,f=d.length,g=d[e];e<f>>1;){var h=2*e+1,m=2*e+2,h=m<f&&d[m].a<d[h].a?m:h;if(d[h].a>g.a)break;d[e]=d[h];e=h}d[e]=g}c=c.b}c.apply(this,[b])}else break}};
k.$=function(a){J.I.$.call(this,a);this.aa()};k.S=function(){J.I.S.call(this);this.aa()};k.C=function(){J.I.C.call(this);l.clearTimeout(void 0);ub(this.h.a);this.h=null};var K=function(a,b){a&&a.log(rd,b,void 0)};var yd=function(a,b,c){if(r(a))c&&(a=t(a,c));else if(a&&"function"==typeof a.handleEvent)a=t(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(b)?-1:l.setTimeout(a,b||0)};var L=function(a){wd.call(this);this.headers=new F;this.B=a||null;this.c=!1;this.w=this.a=null;this.L=this.l="";this.J=0;this.h="";this.f=this.F=this.j=this.D=!1;this.i=0;this.m=null;this.R="";this.u=this.ca=this.X=!1};u(L,wd);var zd=L.prototype,Ad=vd("goog.net.XhrIo");zd.v=Ad;var Bd=/^https?$/i,Cd=["POST","PUT"];
L.prototype.send=function(a,b,c,d){if(this.a)throw Error("[goog.net.XhrIo] Object is active with another request="+this.l+"; newUri="+a);b=b?b.toUpperCase():"GET";this.l=a;this.h="";this.J=0;this.L=b;this.D=!1;this.c=!0;this.a=this.B?this.B.a():Lb.a();this.w=this.B?mb(this.B):mb(Lb);this.a.onreadystatechange=t(this.P,this);this.ca&&"onprogress"in this.a&&(this.a.onprogress=t(function(a){this.M(a,!0)},this),this.a.upload&&(this.a.upload.onprogress=t(this.M,this)));try{K(this.v,M(this,"Opening Xhr")),
this.F=!0,this.a.open(b,String(a),!0),this.F=!1}catch(f){K(this.v,M(this,"Error opening Xhr: "+f.message));Dd(this,f);return}a=c||"";var e=new F(this.headers);d&&Tb(d,function(a,b){e.set(b,a)});d=tb(e.H());c=l.FormData&&a instanceof l.FormData;!(0<=nb(Cd,b))||d||c||e.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");e.forEach(function(a,b){this.a.setRequestHeader(b,a)},this);this.R&&(this.a.responseType=this.R);"withCredentials"in this.a&&this.a.withCredentials!==this.X&&(this.a.withCredentials=
this.X);try{Ed(this),0<this.i&&(this.u=Fd(this.a),K(this.v,M(this,"Will abort after "+this.i+"ms if incomplete, xhr2 "+this.u)),this.u?(this.a.timeout=this.i,this.a.ontimeout=t(this.K,this)):this.m=yd(this.K,this.i,this)),K(this.v,M(this,"Sending request")),this.j=!0,this.a.send(a),this.j=!1}catch(f){K(this.v,M(this,"Send error: "+f.message)),Dd(this,f)}};var Fd=function(a){return D&&E(9)&&"number"==typeof a.timeout&&n(a.ontimeout)},sb=function(a){return"content-type"==a.toLowerCase()};
L.prototype.K=function(){"undefined"!=typeof aa&&this.a&&(this.h="Timed out after "+this.i+"ms, aborting",this.J=8,K(this.v,M(this,this.h)),I(this,"timeout"),Gd(this,8))};var Dd=function(a,b){a.c=!1;a.a&&(a.f=!0,a.a.abort(),a.f=!1);a.h=b;a.J=5;Hd(a);Id(a)},Hd=function(a){a.D||(a.D=!0,I(a,"complete"),I(a,"error"))},Gd=function(a,b){a.a&&a.c&&(K(a.v,M(a,"Aborting")),a.c=!1,a.f=!0,a.a.abort(),a.f=!1,a.J=b||7,I(a,"complete"),I(a,"abort"),Id(a))};
L.prototype.C=function(){this.a&&(this.c&&(this.c=!1,this.f=!0,this.a.abort(),this.f=!1),Id(this,!0));L.I.C.call(this)};L.prototype.P=function(){this.g||(this.F||this.j||this.f?Jd(this):this.Z())};L.prototype.Z=function(){Jd(this)};
var Jd=function(a){if(a.c&&"undefined"!=typeof aa)if(a.w[1]&&4==Kd(a)&&2==P(a))K(a.v,M(a,"Local request error detected and ignored"));else if(a.j&&4==Kd(a))yd(a.P,0,a);else if(I(a,"readystatechange"),4==Kd(a)){K(a.v,M(a,"Request complete"));a.c=!1;try{if(Ld(a))I(a,"complete"),I(a,"success");else{a.J=6;var b;try{b=2<Kd(a)?a.a.statusText:""}catch(c){K(a.v,"Can not get status: "+c.message),b=""}a.h=b+" ["+P(a)+"]";Hd(a)}}finally{Id(a)}}};
L.prototype.M=function(a,b){B("progress"===a.type,"goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");I(this,Md(a,"progress"));I(this,Md(a,b?"downloadprogress":"uploadprogress"))};
var Md=function(a,b){return{type:b,lengthComputable:a.lengthComputable,loaded:a.loaded,total:a.total}},Id=function(a,b){if(a.a){Ed(a);var c=a.a,d=a.w[0]?ba:null;a.a=null;a.w=null;b||I(a,"ready");try{c.onreadystatechange=d}catch(e){(a=a.v)&&a.log(pd,"Problem encountered resetting onreadystatechange: "+e.message,void 0)}}},Ed=function(a){a.a&&a.u&&(a.a.ontimeout=null);"number"==typeof a.m&&(l.clearTimeout(a.m),a.m=null)},Ld=function(a){var b=P(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=
!0;break a;default:c=!1}if(!c){if(b=0===b)a=String(a.l).match(Eb)[1]||null,!a&&l.self&&l.self.location&&(a=l.self.location.protocol,a=a.substr(0,a.length-1)),b=!Bd.test(a?a.toLowerCase():"");c=b}return c},Kd=function(a){return a.a?a.a.readyState:0},P=function(a){try{return 2<Kd(a)?a.a.status:-1}catch(b){return-1}},Nd=function(a){try{return a.a?a.a.responseText:""}catch(b){return K(a.v,"Can not get responseText: "+b.message),""}},Od=function(a,b){return a.a&&4==Kd(a)?a.a.getResponseHeader(b):void 0},
M=function(a,b){return b+" ["+a.L+" "+a.l+" "+P(a)+"]"};var Pd=function(a,b,c,d){this.u=a;this.w=!!d;J.call(this,b,c)};u(Pd,J);Pd.prototype.i=function(){var a=new L,b=this.u;b&&b.forEach(function(b,d){a.headers.set(d,b)});this.w&&(a.X=!0);return a};Pd.prototype.l=function(a){return!a.g&&!a.a};var ed=new Pd;var Rd=function(a,b,c,d,e,f,g,h,m,x,O){this.L=a;this.G=b;this.B=c;this.u=d;this.K=e.slice();this.m=f.slice();this.l=this.o=this.f=this.c=null;this.h=this.i=!1;this.w=g;this.j=h;this.g=x;this.M=O;this.F=m;var N=this;this.D=new G(function(a,b){N.o=a;N.l=b;Qd(N)})},Sd=function(a,b,c){this.b=a;this.c=b;this.a=!!c},Qd=function(a){function b(a,b){b?a(!1,new Sd(!1,null,!0)):ed.W(function(b){b.X=d.M;d.c=b;var c=null;null!==d.g&&(b.ca=!0,c=Rc(b,"uploadprogress",function(a){d.g(a.loaded,a.lengthComputable?
a.total:-1)}),b.ca=null!==d.g);b.send(d.L,d.G,d.u,d.B);Zc(b,"complete",function(b){null!==c&&ad(c);d.c=null;b=b.target;var e=6===b.J&&100<=P(b),f=Ld(b)||e,e=P(b);if(!(f=!f))var f=500<=e&&600>e,g=0<=nb(d.m,e),f=f||429===e||g;f?(e=7===b.J,fd(b),a(!1,new Sd(!1,null,e))):(e=0<=nb(d.K,e),a(!0,new Sd(e,b)))})})}function c(a,b){var c=d.o;a=d.l;var e=b.c;if(b.b)try{var f=d.w(e,Nd(e));n(f)?c(f):c()}catch(x){a(x)}else null!==e?(b=ma(),f=Nd(e),b.serverResponse=f,d.j?a(d.j(e,b)):a(b)):(b=b.a?d.h?qa():na():new v("retry-limit-exceeded",
"Max retry time for operation exceeded, please try again."),a(b));fd(e)}var d=a;a.i?c(0,new Sd(!1,null,!0)):a.f=ka(b,c,a.F)};Rd.prototype.a=function(){return this.D};Rd.prototype.b=function(a){this.i=!0;this.h=a||!1;null!==this.f&&(0,this.f)(!1);null!==this.c&&Gd(this.c)};
var Td=function(a,b,c){var d=ab(a.b),d=a.i+d,e=a.headers?ta(a.headers):{};null!==b&&0<b.length&&(e.Authorization="Firebase "+b);e["X-Firebase-Storage-Version"]="webjs/"+("undefined"!==typeof firebase?firebase.SDK_VERSION:"AppManager");return new Rd(d,a.method,e,a.body,a.f,a.g,a.N,a.a,a.h,a.c,c)};var Ud=function(a){var b=l.BlobBuilder||l.WebKitBlobBuilder;if(n(b)){for(var b=new b,c=0;c<arguments.length;c++)b.append(arguments[c]);return b.getBlob()}b=wb(arguments);c=l.BlobBuilder||l.WebKitBlobBuilder;if(n(c)){for(var c=new c,d=0;d<b.length;d++)c.append(b[d],void 0);b=c.getBlob(void 0)}else if(n(l.Blob))b=new Blob(b,{});else throw Error("This browser doesn't seem to support creating Blobs");return b},Vd=function(a,b,c){n(c)||(c=a.size);return a.webkitSlice?a.webkitSlice(b,c):a.mozSlice?a.mozSlice(b,
c):a.slice?bc&&!E("13.0")||cc&&!E("537.1")?(0>b&&(b+=a.size),0>b&&(b=0),0>c&&(c+=a.size),c<b&&(c=b),a.slice(b,c-b)):a.slice(b,c):null};var Q=function(a,b){ya()&&a instanceof Blob?(this.s=a,b=a.size,a=a.type):(a instanceof ArrayBuffer?(b?this.s=new Uint8Array(a):(this.s=new Uint8Array(a.byteLength),this.s.set(new Uint8Array(a))),b=this.s.length):(b?this.s=a:(this.s=new Uint8Array(a.length),this.s.set(a)),b=a.length),a="");this.a=b;this.b=a};Q.prototype.type=function(){return this.b};
Q.prototype.slice=function(a,b){if(ya()&&this.s instanceof Blob)return a=Vd(this.s,a,b),null===a?null:new Q(a);a=new Uint8Array(this.s.buffer,a,b-a);return new Q(a,!0)};
var Wd=function(a){var b=[];Array.prototype.push.apply(b,arguments);if(ya())return b=qb(b,function(a){return a instanceof Q?a.s:a}),new Q(Ud.apply(null,b));var b=qb(b,function(a){return xa(a)?$a("raw",a).data.buffer:a.s.buffer}),c=0;ob(b,function(a){c+=a.byteLength});var d=new Uint8Array(c),e=0;ob(b,function(a){a=new Uint8Array(a);for(var b=0;b<a.length;b++)d[e++]=a[b]});return new Q(d,!0)};var Xd=function(a){this.c=Cc(a)};Xd.prototype.a=function(){return this.c};Xd.prototype.b=function(){};var Yd=function(){this.a={};this.b=Number.MIN_SAFE_INTEGER},Zd=function(a,b){function c(){delete e.a[d]}var d=a.b;a.b++;a.a[d]=b;var e=a;b.a().then(c,c)},$d=function(a){sa(a.a,function(a,c){c&&c.b(!0)});a.a={}};var ae=function(a,b,c,d){this.a=a;this.g=null;if(null!==this.a&&(a=this.a.options,y(a))){a=a.storageBucket||null;if(null==a)a=null;else{var e=null;try{e=Sa(a)}catch(f){}if(null!==e){if(""!==e.path)throw new v("invalid-default-bucket","Invalid default bucket '"+a+"'.");a=e.bucket}}this.g=a}this.l=b;this.j=c;this.i=d;this.c=12E4;this.b=6E4;this.h=new Yd;this.f=!1},be=function(a){return null!==a.a&&y(a.a.INTERNAL)&&y(a.a.INTERNAL.getToken)?a.a.INTERNAL.getToken().then(function(a){return y(a)?a.accessToken:
null},function(){return null}):Bc(null)};ae.prototype.bucket=function(){if(this.f)throw qa();return this.g};var R=function(a,b,c){if(a.f)return new Xd(qa());b=a.j(b,c,null===a.a);Zd(a.h,b);return b};var ce=function(a,b){return b},S=function(a,b,c,d){this.c=a;this.b=b||a;this.f=!!c;this.a=d||ce},de=null,ee=function(){if(de)return de;var a=[];a.push(new S("bucket"));a.push(new S("generation"));a.push(new S("metageneration"));a.push(new S("name","fullPath",!0));var b=new S("name");b.a=function(a,b){return!xa(b)||2>b.length?b:Gb(b)};a.push(b);b=new S("size");b.a=function(a,b){return y(b)?+b:b};a.push(b);a.push(new S("timeCreated"));a.push(new S("updated"));a.push(new S("md5Hash",null,!0));a.push(new S("cacheControl",
null,!0));a.push(new S("contentDisposition",null,!0));a.push(new S("contentEncoding",null,!0));a.push(new S("contentLanguage",null,!0));a.push(new S("contentType",null,!0));a.push(new S("metadata","customMetadata",!0));a.push(new S("downloadTokens","downloadURLs",!1,function(a,b){if(!(xa(b)&&0<b.length))return[];var c=encodeURIComponent;return qb(b.split(","),function(b){var d=a.fullPath,d="https://firebasestorage.googleapis.com/v0"+("/b/"+c(a.bucket)+"/o/"+c(d));b=ab({alt:"media",token:b});return d+
b})}));return de=a},fe=function(a,b){Object.defineProperty(a,"ref",{get:function(){return b.l(b,new z(a.bucket,a.fullPath))}})},ge=function(a,b){for(var c={},d=b.length,e=0;e<d;e++){var f=b[e];f.f&&(c[f.c]=a[f.b])}return JSON.stringify(c)},he=function(a){if(!a||"object"!==typeof a)throw"Expected Metadata object.";for(var b in a){var c=a[b];if("customMetadata"===b&&"object"!==typeof c)throw"Expected object for 'customMetadata' mapping.";}};var T=function(a,b,c){for(var d=b.length,e=b.length,f=0;f<b.length;f++)if(b[f].b){d=f;break}if(!(d<=c.length&&c.length<=e))throw d===e?(b=d,d=1===d?"argument":"arguments"):(b="between "+d+" and "+e,d="arguments"),new v("invalid-argument-count","Invalid argument count in `"+a+"`: Expected "+b+" "+d+", received "+c.length+".");for(f=0;f<c.length;f++)try{b[f].a(c[f])}catch(g){if(g instanceof Error)throw pa(f,a,g.message);throw pa(f,a,g);}},U=function(a,b){var c=this;this.a=function(b){c.b&&!n(b)||a(b)};
this.b=!!b},ie=function(a,b){return function(c){a(c);b(c)}},je=function(a,b){function c(a){if(!("string"===typeof a||a instanceof String))throw"Expected string.";}var d;a?d=ie(c,a):d=c;return new U(d,b)},ke=function(){return new U(function(a){if(!(a instanceof Uint8Array||a instanceof ArrayBuffer||ya()&&a instanceof Blob))throw"Expected Blob or File.";})},le=function(){return new U(function(a){if(!(("number"===typeof a||a instanceof Number)&&0<=a))throw"Expected a number 0 or greater.";})},me=function(a,
b){return new U(function(b){if(!(null===b||y(b)&&b instanceof Object))throw"Expected an Object.";y(a)&&a(b)},b)},ne=function(){return new U(function(a){if(null!==a&&!r(a))throw"Expected a Function.";},!0)};var oe=function(a){if(!a)throw ma();},pe=function(a,b){return function(c,d){a:{var e;try{e=JSON.parse(d)}catch(h){c=null;break a}c=ea(e)?e:null}if(null===c)c=null;else{d={type:"file"};e=b.length;for(var f=0;f<e;f++){var g=b[f];d[g.b]=g.a(d,c[g.c])}fe(d,a);c=d}oe(null!==c);return c}},qe=function(a){return function(b,c){b=401===P(b)?new v("unauthenticated","User is not authenticated, please authenticate using Firebase Authentication and try again."):402===P(b)?new v("quota-exceeded","Quota for bucket '"+
a.bucket+"' exceeded, please view quota on https://firebase.google.com/pricing/."):403===P(b)?new v("unauthorized","User does not have permission to access '"+a.path+"'."):c;b.serverResponse=c.serverResponse;return b}},re=function(a){var b=qe(a);return function(c,d){var e=b(c,d);404===P(c)&&(e=new v("object-not-found","Object '"+a.path+"' does not exist."));e.serverResponse=d.serverResponse;return e}},se=function(a,b,c){var d=Ra(b);a=new w(la+"/v0"+d,"GET",pe(a,c),a.c);a.a=re(b);return a},te=function(a,
b){var c=Ra(b);a=new w(la+"/v0"+c,"DELETE",function(){},a.c);a.f=[200,204];a.a=re(b);return a},ue=function(a,b,c){c=c?ta(c):{};c.fullPath=a.path;c.size=b.a;c.contentType||(a=b&&b.type()||"application/octet-stream",c.contentType=a);return c},ve=function(a,b,c,d,e){var f="/b/"+encodeURIComponent(b.bucket)+"/o",g={"X-Goog-Upload-Protocol":"multipart"},h;h="";for(var m=0;2>m;m++)h+=Math.random().toString().slice(2);g["Content-Type"]="multipart/related; boundary="+h;e=ue(b,d,e);m=ge(e,c);d=Wd("--"+h+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+
m+"\r\n--"+h+"\r\nContent-Type: "+e.contentType+"\r\n\r\n",d,"\r\n--"+h+"--");if(null===d)throw oa();a=new w(la+"/v0"+f,"POST",pe(a,c),a.b);a.b={name:e.fullPath};a.headers=g;a.body=d.s;a.a=qe(b);return a},we=function(a,b,c,d){this.a=a;this.total=b;this.b=!!c;this.c=d||null},xe=function(a,b){var c;try{c=Od(a,"X-Goog-Upload-Status")}catch(d){oe(!1)}a=0<=nb(b||["active"],c);oe(a);return c},ye=function(a,b,c,d,e){var f="/b/"+encodeURIComponent(b.bucket)+"/o",g=ue(b,d,e);e={name:g.fullPath};f=la+"/v0"+
f;d={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":d.a,"X-Goog-Upload-Header-Content-Type":g.contentType,"Content-Type":"application/json; charset=utf-8"};c=ge(g,c);a=new w(f,"POST",function(a){xe(a);var b;try{b=Od(a,"X-Goog-Upload-URL")}catch(x){oe(!1)}oe(xa(b));return b},a.b);a.b=e;a.headers=d;a.body=c;a.a=qe(b);return a},ze=function(a,b,c,d){a=new w(c,"POST",function(a){var b=xe(a,["active","final"]),c;try{c=Od(a,"X-Goog-Upload-Size-Received")}catch(h){oe(!1)}a=
c;isFinite(a)&&(a=String(a));a=q(a)?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN;oe(!isNaN(a));return new we(a,d.a,"final"===b)},a.b);a.headers={"X-Goog-Upload-Command":"query"};a.a=qe(b);return a},Ae=function(a,b,c,d,e,f){var g=new we(0,0);f?(g.a=f.a,g.total=f.total):(g.a=0,g.total=d.a);if(d.a!==g.total)throw new v("server-file-wrong-size","Server recorded incorrect upload file size, please retry the upload.");var h=f=g.total-g.a,h=Math.min(h,262144),m=g.a;f={"X-Goog-Upload-Command":h===
f?"upload, finalize":"upload","X-Goog-Upload-Offset":g.a};m=d.slice(m,m+h);if(null===m)throw oa();c=new w(c,"POST",function(a,c){var f=xe(a,["active","final"]),m=g.a+h,O=d.a,x;"final"===f?x=pe(b,e)(a,c):x=null;return new we(m,O,"final"===f,x)},b.b);c.headers=f;c.body=m.s;c.c=null;c.a=qe(a);return c};var W=function(a,b,c,d,e,f){this.K=a;this.c=b;this.i=c;this.f=e;this.h=f||null;this.o=d;this.j=0;this.G=this.m=!1;this.B=[];this.Z=262144<this.f.a;this.b="running";this.a=this.u=this.g=null;var g=this;this.V=function(a){g.a=null;"storage/canceled"===a.code?(g.m=!0,Be(g)):(g.g=a,V(g,"error"))};this.Y=function(a){g.a=null;"storage/canceled"===a.code?Be(g):(g.g=a,V(g,"error"))};this.w=this.l=null;this.F=new G(function(a,b){g.l=a;g.w=b;Ce(g)});this.F.then(null,function(){})},Ce=function(a){"running"===
a.b&&null===a.a&&(a.Z?null===a.u?De(a):a.m?Ee(a):a.G?Fe(a):Ge(a):He(a))},Ie=function(a,b){be(a.c).then(function(c){switch(a.b){case "running":b(c);break;case "canceling":V(a,"canceled");break;case "pausing":V(a,"paused")}})},De=function(a){Ie(a,function(b){var c=ye(a.c,a.i,a.o,a.f,a.h);a.a=R(a.c,c,b);a.a.a().then(function(b){a.a=null;a.u=b;a.m=!1;Be(a)},this.V)})},Ee=function(a){var b=a.u;Ie(a,function(c){var d=ze(a.c,a.i,b,a.f);a.a=R(a.c,d,c);a.a.a().then(function(b){a.a=null;Je(a,b.a);a.m=!1;b.b&&
(a.G=!0);Be(a)},a.V)})},Ge=function(a){var b=new we(a.j,a.f.a),c=a.u;Ie(a,function(d){var e;try{e=Ae(a.i,a.c,c,a.f,a.o,b)}catch(f){a.g=f;V(a,"error");return}a.a=R(a.c,e,d);a.a.a().then(function(b){a.a=null;Je(a,b.a);b.b?(a.h=b.c,V(a,"success")):Be(a)},a.V)})},Fe=function(a){Ie(a,function(b){var c=se(a.c,a.i,a.o);a.a=R(a.c,c,b);a.a.a().then(function(b){a.a=null;a.h=b;V(a,"success")},a.Y)})},He=function(a){Ie(a,function(b){var c=ve(a.c,a.i,a.o,a.f,a.h);a.a=R(a.c,c,b);a.a.a().then(function(b){a.a=null;
a.h=b;Je(a,a.f.a);V(a,"success")},a.V)})},Je=function(a,b){var c=a.j;a.j=b;a.j>c&&Ke(a)},V=function(a,b){if(a.b!==b)switch(b){case "canceling":a.b=b;null!==a.a&&a.a.b();break;case "pausing":a.b=b;null!==a.a&&a.a.b();break;case "running":var c="paused"===a.b;a.b=b;c&&(Ke(a),Ce(a));break;case "paused":a.b=b;Ke(a);break;case "canceled":a.g=na();a.b=b;Ke(a);break;case "error":a.b=b;Ke(a);break;case "success":a.b=b,Ke(a)}},Be=function(a){switch(a.b){case "pausing":V(a,"paused");break;case "canceling":V(a,
"canceled");break;case "running":Ce(a)}};W.prototype.D=function(){return new A(this.j,this.f.a,wa(this.b),this.h,this,this.K)};
W.prototype.M=function(a,b,c,d){function e(a){try{g(a);return}catch(N){}try{if(h(a),!(n(a.next)||n(a.error)||n(a.complete)))throw"";}catch(N){throw"Expected a function or an Object with one of `next`, `error`, `complete` properties.";}}function f(a){return function(b,c,d){null!==a&&T("on",a,arguments);var e=new Ta(b,c,d);Le(m,e);return function(){vb(m.B,e)}}}var g=ne().a,h=me(null,!0).a;T("on",[je(function(){if("state_changed"!==a)throw"Expected one of the event types: [state_changed].";}),me(e,!0),
ne(),ne()],arguments);var m=this,x=[me(function(a){if(null===a)throw"Expected a function or an Object with one of `next`, `error`, `complete` properties.";e(a)}),ne(),ne()];return n(b)||n(c)||n(d)?f(null)(b,c,d):f(x)};W.prototype.then=function(a,b){return this.F.then(a,b)};
var Le=function(a,b){a.B.push(b);Me(a,b)},Ke=function(a){Ne(a);var b=wb(a.B);ob(b,function(b){Me(a,b)})},Ne=function(a){if(null!==a.l){var b=!0;switch(wa(a.b)){case "success":Nc(a.l.bind(null,a.D()))();break;case "canceled":case "error":Nc(a.w.bind(null,a.g))();break;default:b=!1}b&&(a.l=null,a.w=null)}},Me=function(a,b){switch(wa(a.b)){case "running":case "paused":null!==b.next&&Nc(b.next.bind(b,a.D()))();break;case "success":null!==b.b&&Nc(b.b.bind(b))();break;case "canceled":case "error":null!==
b.a&&Nc(b.a.bind(b,a.g))();break;default:null!==b.a&&Nc(b.a.bind(b,a.g))()}};W.prototype.R=function(){T("resume",[],arguments);var a="paused"===this.b||"pausing"===this.b;a&&V(this,"running");return a};W.prototype.P=function(){T("pause",[],arguments);var a="running"===this.b;a&&V(this,"pausing");return a};W.prototype.L=function(){T("cancel",[],arguments);var a="running"===this.b||"pausing"===this.b;a&&V(this,"canceling");return a};var X=function(a,b){this.b=a;if(b)this.a=b instanceof z?b:Sa(b);else if(a=a.bucket(),null!==a)this.a=new z(a,"");else throw new v("no-default-bucket","No default bucket found. Did you set the 'storageBucket' property when initializing the app?");};X.prototype.toString=function(){T("toString",[],arguments);return"gs://"+this.a.bucket+"/"+this.a.path};var Oe=function(a,b){return new X(a,b)};k=X.prototype;
k.fa=function(a){T("child",[je()],arguments);var b=Fb(this.a.path,a);return Oe(this.b,new z(this.a.bucket,b))};k.Da=function(){var a;a=this.a.path;if(0==a.length)a=null;else{var b=a.lastIndexOf("/");a=-1===b?"":a.slice(0,b)}return null===a?null:Oe(this.b,new z(this.a.bucket,a))};k.Fa=function(){return Oe(this.b,new z(this.a.bucket,""))};k.ma=function(){return this.a.bucket};k.ya=function(){return this.a.path};k.Ca=function(){return Gb(this.a.path)};k.Ha=function(){return this.b.i};
k.ra=function(a,b){T("put",[ke(),new U(he,!0)],arguments);Pe(this,"put");return new W(this,this.b,this.a,ee(),new Q(a),b)};k.sa=function(a,b,c){T("putString",[je(),je(Va,!0),new U(he,!0)],arguments);Pe(this,"putString");var d=$a(y(b)?b:"raw",a),e=c?ta(c):{};!y(e.contentType)&&y(d.a)&&(e.contentType=d.a);return new W(this,this.b,this.a,ee(),new Q(d.data,!0),e)};
k.delete=function(){T("delete",[],arguments);Pe(this,"delete");var a=this;return be(this.b).then(function(b){var c=te(a.b,a.a);return R(a.b,c,b).a()})};k.ga=function(){T("getMetadata",[],arguments);Pe(this,"getMetadata");var a=this;return be(this.b).then(function(b){var c=se(a.b,a.a,ee());return R(a.b,c,b).a()})};
k.ta=function(a){T("updateMetadata",[new U(he,void 0)],arguments);Pe(this,"updateMetadata");var b=this;return be(this.b).then(function(c){var d=b.b,e=b.a,f=a,g=ee(),h=Ra(e),h=la+"/v0"+h,f=ge(f,g),d=new w(h,"PATCH",pe(d,g),d.c);d.headers={"Content-Type":"application/json; charset=utf-8"};d.body=f;d.a=re(e);return R(b.b,d,c).a()})};
k.qa=function(){T("getDownloadURL",[],arguments);Pe(this,"getDownloadURL");return this.ga().then(function(a){a=a.downloadURLs[0];if(y(a))return a;throw new v("no-download-url","The given file does not have any download URLs.");})};var Pe=function(a,b){if(""===a.a.path)throw new v("invalid-root-operation","The operation '"+b+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').");};var Y=function(a){this.a=new ae(a,function(a,c){return new X(a,c)},Td,this);this.b=a;this.c=new Qe(this)};k=Y.prototype;k.ua=function(a){T("ref",[je(function(a){if(/^[A-Za-z]+:\/\//.test(a))throw"Expected child path but got a URL, use refFromURL instead.";},!0)],arguments);var b=new X(this.a);return n(a)?b.fa(a):b};
k.va=function(a){T("refFromURL",[je(function(a){if(!/^[A-Za-z]+:\/\//.test(a))throw"Expected full URL but got a child path, use ref instead.";try{Sa(a)}catch(c){throw"Expected valid full URL but got an invalid one.";}},!1)],arguments);return new X(this.a,a)};k.Aa=function(){return this.a.b};k.xa=function(a){T("setMaxUploadRetryTime",[le()],arguments);this.a.b=a};k.za=function(){return this.a.c};k.wa=function(a){T("setMaxOperationRetryTime",[le()],arguments);this.a.c=a};k.la=function(){return this.b};
k.ka=function(){return this.c};var Qe=function(a){this.a=a};Qe.prototype.delete=function(){var a=this.a.a;a.f=!0;a.a=null;$d(a.h)};var Z=function(a,b,c){Object.defineProperty(a,b,{get:c})};X.prototype.toString=X.prototype.toString;X.prototype.child=X.prototype.fa;X.prototype.put=X.prototype.ra;X.prototype.putString=X.prototype.sa;X.prototype["delete"]=X.prototype.delete;X.prototype.getMetadata=X.prototype.ga;X.prototype.updateMetadata=X.prototype.ta;X.prototype.getDownloadURL=X.prototype.qa;Z(X.prototype,"parent",X.prototype.Da);Z(X.prototype,"root",X.prototype.Fa);Z(X.prototype,"bucket",X.prototype.ma);
Z(X.prototype,"fullPath",X.prototype.ya);Z(X.prototype,"name",X.prototype.Ca);Z(X.prototype,"storage",X.prototype.Ha);Y.prototype.ref=Y.prototype.ua;Y.prototype.refFromURL=Y.prototype.va;Z(Y.prototype,"maxOperationRetryTime",Y.prototype.za);Y.prototype.setMaxOperationRetryTime=Y.prototype.wa;Z(Y.prototype,"maxUploadRetryTime",Y.prototype.Aa);Y.prototype.setMaxUploadRetryTime=Y.prototype.xa;Z(Y.prototype,"app",Y.prototype.la);Z(Y.prototype,"INTERNAL",Y.prototype.ka);Qe.prototype["delete"]=Qe.prototype.delete;
Y.prototype.capi_=function(a){la=a};W.prototype.on=W.prototype.M;W.prototype.resume=W.prototype.R;W.prototype.pause=W.prototype.P;W.prototype.cancel=W.prototype.L;Z(W.prototype,"snapshot",W.prototype.D);Z(A.prototype,"bytesTransferred",A.prototype.na);Z(A.prototype,"totalBytes",A.prototype.Ja);Z(A.prototype,"state",A.prototype.Ga);Z(A.prototype,"metadata",A.prototype.Ba);Z(A.prototype,"downloadURL",A.prototype.pa);Z(A.prototype,"task",A.prototype.Ia);Z(A.prototype,"ref",A.prototype.Ea);
ua.STATE_CHANGED="state_changed";va.RUNNING="running";va.PAUSED="paused";va.SUCCESS="success";va.CANCELED="canceled";va.ERROR="error";Ua.RAW="raw";Ua.BASE64="base64";Ua.BASE64URL="base64url";Ua.DATA_URL="data_url";G.prototype["catch"]=G.prototype.l;G.prototype.then=G.prototype.then;
(function(){function a(a){return new Y(a)}var b={TaskState:va,TaskEvent:ua,StringFormat:Ua,Storage:Y,Reference:X};if(window.firebase&&firebase.INTERNAL&&firebase.INTERNAL.registerService)firebase.INTERNAL.registerService("storage",a,b);else throw Error("Cannot install Firebase Storage - be sure to load firebase-app.js first.");})();})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ },

/***/ "./node_modules/rxjs/ReplaySubject.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = __webpack_require__("./node_modules/rxjs/Subject.js");
var queue_1 = __webpack_require__("./node_modules/rxjs/scheduler/queue.js");
var observeOn_1 = __webpack_require__("./node_modules/rxjs/operator/observeOn.js");
/**
 * @class ReplaySubject<T>
 */
var ReplaySubject = (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
        _super.call(this);
        this.scheduler = scheduler;
        this._events = [];
        this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        this._windowTime = windowTime < 1 ? 1 : windowTime;
    }
    ReplaySubject.prototype.next = function (value) {
        var now = this._getNow();
        this._events.push(new ReplayEvent(now, value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
        var _events = this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        if (scheduler) {
            subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
        }
        var len = _events.length;
        for (var i = 0; i < len && !subscriber.closed; i++) {
            subscriber.next(_events[i].value);
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || queue_1.queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        // Trim events that fall out of the time window.
        // Start at the front of the list. Break early once
        // we encounter an event that falls within the window.
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(Subject_1.Subject));
exports.ReplaySubject = ReplaySubject;
var ReplayEvent = (function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());
//# sourceMappingURL=ReplaySubject.js.map

/***/ },

/***/ "./node_modules/rxjs/Scheduler.js":
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * An execution context and a data structure to order tasks and schedule their
 * execution. Provides a notion of (potentially virtual) time, through the
 * `now()` getter method.
 *
 * Each unit of work in a Scheduler is called an {@link Action}.
 *
 * ```ts
 * class Scheduler {
 *   now(): number;
 *   schedule(work, delay?, state?): Subscription;
 * }
 * ```
 *
 * @class Scheduler
 */
var Scheduler = (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) { now = Scheduler.now; }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    /**
     * Schedules a function, `work`, for execution. May happen at some point in
     * the future, according to the `delay` parameter, if specified. May be passed
     * some context object, `state`, which will be passed to the `work` function.
     *
     * The given arguments will be processed an stored as an Action object in a
     * queue of actions.
     *
     * @param {function(state: ?T): ?Subscription} work A function representing a
     * task, or some unit of work to be executed by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler itself.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @return {Subscription} A subscription in order to be able to unsubscribe
     * the scheduled work.
     */
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = Date.now ? Date.now : function () { return +new Date(); };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
//# sourceMappingURL=Scheduler.js.map

/***/ },

/***/ "./node_modules/rxjs/add/observable/fromPromise.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var fromPromise_1 = __webpack_require__("./node_modules/rxjs/observable/fromPromise.js");
Observable_1.Observable.fromPromise = fromPromise_1.fromPromise;
//# sourceMappingURL=fromPromise.js.map

/***/ },

/***/ "./node_modules/rxjs/add/observable/of.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var of_1 = __webpack_require__("./node_modules/rxjs/observable/of.js");
Observable_1.Observable.of = of_1.of;
//# sourceMappingURL=of.js.map

/***/ },

/***/ "./node_modules/rxjs/add/operator/combineLatest.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var combineLatest_1 = __webpack_require__("./node_modules/rxjs/operator/combineLatest.js");
Observable_1.Observable.prototype.combineLatest = combineLatest_1.combineLatest;
//# sourceMappingURL=combineLatest.js.map

/***/ },

/***/ "./node_modules/rxjs/add/operator/concat.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var concat_1 = __webpack_require__("./node_modules/rxjs/operator/concat.js");
Observable_1.Observable.prototype.concat = concat_1.concat;
//# sourceMappingURL=concat.js.map

/***/ },

/***/ "./node_modules/rxjs/add/operator/merge.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var merge_1 = __webpack_require__("./node_modules/rxjs/operator/merge.js");
Observable_1.Observable.prototype.merge = merge_1.merge;
//# sourceMappingURL=merge.js.map

/***/ },

/***/ "./node_modules/rxjs/add/operator/observeOn.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var observeOn_1 = __webpack_require__("./node_modules/rxjs/operator/observeOn.js");
Observable_1.Observable.prototype.observeOn = observeOn_1.observeOn;
//# sourceMappingURL=observeOn.js.map

/***/ },

/***/ "./node_modules/rxjs/add/operator/skip.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var skip_1 = __webpack_require__("./node_modules/rxjs/operator/skip.js");
Observable_1.Observable.prototype.skip = skip_1.skip;
//# sourceMappingURL=skip.js.map

/***/ },

/***/ "./node_modules/rxjs/add/operator/take.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var take_1 = __webpack_require__("./node_modules/rxjs/operator/take.js");
Observable_1.Observable.prototype.take = take_1.take;
//# sourceMappingURL=take.js.map

/***/ },

/***/ "./node_modules/rxjs/operator/combineLatest.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayObservable_1 = __webpack_require__("./node_modules/rxjs/observable/ArrayObservable.js");
var isArray_1 = __webpack_require__("./node_modules/rxjs/util/isArray.js");
var OuterSubscriber_1 = __webpack_require__("./node_modules/rxjs/OuterSubscriber.js");
var subscribeToResult_1 = __webpack_require__("./node_modules/rxjs/util/subscribeToResult.js");
var none = {};
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from this Observable with values from
 * Observables passed as arguments. This is done by subscribing to each
 * Observable, in order, and collecting an array of each of the most recent
 * values any time any of the input Observables emits, then either taking that
 * array and passing it as arguments to an optional `project` function and
 * emitting the return value of that, or just emitting the array of recent
 * values directly if there is no `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = weight.combineLatest(height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method combineLatest
 * @owner Observable
 */
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
        observables = observables[0];
    }
    observables.unshift(this);
    return new ArrayObservable_1.ArrayObservable(observables).lift(new CombineLatestOperator(project));
}
exports.combineLatest = combineLatest;
/* tslint:enable:max-line-length */
var CombineLatestOperator = (function () {
    function CombineLatestOperator(project) {
        this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new CombineLatestSubscriber(subscriber, this.project));
    };
    return CombineLatestOperator;
}());
exports.CombineLatestOperator = CombineLatestOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CombineLatestSubscriber = (function (_super) {
    __extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
        _super.call(this, destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(none);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond
            ? 0
            : oldVal === none ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.project) {
                this._tryProject(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
        var result;
        try {
            result = this.project.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.CombineLatestSubscriber = CombineLatestSubscriber;
//# sourceMappingURL=combineLatest.js.map

/***/ },

/***/ "./node_modules/rxjs/operator/concat.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var isScheduler_1 = __webpack_require__("./node_modules/rxjs/util/isScheduler.js");
var ArrayObservable_1 = __webpack_require__("./node_modules/rxjs/observable/ArrayObservable.js");
var mergeAll_1 = __webpack_require__("./node_modules/rxjs/operator/mergeAll.js");
/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins this Observable with multiple other Observables by subscribing to them
 * one at a time, starting with the source, and merging their results into the
 * output Observable. Will wait for each Observable to complete before moving
 * on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = timer.concat(sequence);
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = timer1.concat(timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {Observable} other An input Observable to concatenate after the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @method concat
 * @owner Observable
 */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return concatStatic.apply(void 0, [this].concat(observables));
}
exports.concat = concat;
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins multiple Observables together by subscribing to them one at a time and
 * merging their results into the output Observable. Will wait for each
 * Observable to complete before moving on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = Rx.Observable.concat(timer, sequence);
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = Rx.Observable.concat(timer1, timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {Observable} input1 An input Observable to concatenate with others.
 * @param {Observable} input2 An input Observable to concatenate with others.
 * More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @static true
 * @name concat
 * @owner Observable
 */
function concatStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var scheduler = null;
    var args = observables;
    if (isScheduler_1.isScheduler(args[observables.length - 1])) {
        scheduler = args.pop();
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(1));
}
exports.concatStatic = concatStatic;
//# sourceMappingURL=concat.js.map

/***/ },

/***/ "./node_modules/rxjs/operator/merge.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var ArrayObservable_1 = __webpack_require__("./node_modules/rxjs/observable/ArrayObservable.js");
var mergeAll_1 = __webpack_require__("./node_modules/rxjs/operator/mergeAll.js");
var isScheduler_1 = __webpack_require__("./node_modules/rxjs/util/isScheduler.js");
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (either the source or an
 * Observable given as argument), and simply forwards (without doing any
 * transformation) all the values from all the input Observables to the output
 * Observable. The output Observable only completes once all input Observables
 * have completed. Any error delivered by an input Observable will be immediately
 * emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = clicks.merge(timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = timer1.merge(timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {Observable} other An input Observable to merge with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @method merge
 * @owner Observable
 */
function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    observables.unshift(this);
    return mergeStatic.apply(this, observables);
}
exports.merge = merge;
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (as arguments), and simply
 * forwards (without doing any transformation) all the values from all the input
 * Observables to the output Observable. The output Observable only completes
 * once all input Observables have completed. Any error delivered by an input
 * Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {Observable} input1 An input Observable to merge with others.
 * @param {Observable} input2 An input Observable to merge with others.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @static true
 * @name merge
 * @owner Observable
 */
function mergeStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if (isScheduler_1.isScheduler(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (observables.length === 1) {
        return observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(concurrent));
}
exports.mergeStatic = mergeStatic;
//# sourceMappingURL=merge.js.map

/***/ },

/***/ "./node_modules/rxjs/operator/skip.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__("./node_modules/rxjs/Subscriber.js");
/**
 * Returns an Observable that skips `n` items emitted by an Observable.
 *
 * <img src="./img/skip.png" width="100%">
 *
 * @param {Number} the `n` of times, items emitted by source Observable should be skipped.
 * @return {Observable} an Observable that skips values emitted by the source Observable.
 *
 * @method skip
 * @owner Observable
 */
function skip(total) {
    return this.lift(new SkipOperator(total));
}
exports.skip = skip;
var SkipOperator = (function () {
    function SkipOperator(total) {
        this.total = total;
    }
    SkipOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new SkipSubscriber(subscriber, this.total));
    };
    return SkipOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipSubscriber = (function (_super) {
    __extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    SkipSubscriber.prototype._next = function (x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    };
    return SkipSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=skip.js.map

/***/ },

/***/ "./node_modules/rxjs/operator/take.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__("./node_modules/rxjs/Subscriber.js");
var ArgumentOutOfRangeError_1 = __webpack_require__("./node_modules/rxjs/util/ArgumentOutOfRangeError.js");
var EmptyObservable_1 = __webpack_require__("./node_modules/rxjs/observable/EmptyObservable.js");
/**
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * <img src="./img/take.png" width="100%">
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
 * var interval = Rx.Observable.interval(1000);
 * var five = interval.take(5);
 * five.subscribe(x => console.log(x));
 *
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of `next` values to emit.
 * @return {Observable<T>} An Observable that emits only the first `count`
 * values emitted by the source Observable, or all of the values from the source
 * if the source emits fewer than `count` values.
 * @method take
 * @owner Observable
 */
function take(count) {
    if (count === 0) {
        return new EmptyObservable_1.EmptyObservable();
    }
    else {
        return this.lift(new TakeOperator(count));
    }
}
exports.take = take;
var TakeOperator = (function () {
    function TakeOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    TakeOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new TakeSubscriber(subscriber, this.total));
    };
    return TakeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeSubscriber = (function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        if (++this.count <= total) {
            this.destination.next(value);
            if (this.count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    };
    return TakeSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=take.js.map

/***/ },

/***/ "./node_modules/rxjs/scheduler/Action.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = __webpack_require__("./node_modules/rxjs/Subscription.js");
/**
 * A unit of work to be executed in a {@link Scheduler}. An action is typically
 * created from within a Scheduler and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
var Action = (function (_super) {
    __extends(Action, _super);
    function Action(scheduler, work) {
        _super.call(this);
    }
    /**
     * Schedules this action on its parent Scheduler for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        return this;
    };
    return Action;
}(Subscription_1.Subscription));
exports.Action = Action;
//# sourceMappingURL=Action.js.map

/***/ },

/***/ "./node_modules/rxjs/scheduler/AsyncAction.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = __webpack_require__("./node_modules/rxjs/util/root.js");
var Action_1 = __webpack_require__("./node_modules/rxjs/scheduler/Action.js");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AsyncAction = (function (_super) {
    __extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (this.closed) {
            return this;
        }
        // Always replace the current state with the new state.
        this.state = state;
        // Set the pending flag indicating that this action has been scheduled, or
        // has recursively rescheduled itself.
        this.pending = true;
        var id = this.id;
        var scheduler = this.scheduler;
        //
        // Important implementation note:
        //
        // Actions only execute once by default, unless rescheduled from within the
        // scheduled callback. This allows us to implement single and repeat
        // actions via the same code path, without adding API surface area, as well
        // as mimic traditional recursion but across asynchronous boundaries.
        //
        // However, JS runtimes and timers distinguish between intervals achieved by
        // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
        // serial `setTimeout` calls can be individually delayed, which delays
        // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
        // guarantee the interval callback will be invoked more precisely to the
        // interval period, regardless of load.
        //
        // Therefore, we use `setInterval` to schedule single and repeat actions.
        // If the action reschedules itself with the same delay, the interval is not
        // canceled. If the action doesn't reschedule, or reschedules with a
        // different delay, the interval will be canceled after scheduled callback
        // execution.
        //
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.delay = delay;
        // If this action has already an async Id, don't request a new one.
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        return root_1.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // clear the interval id
        return root_1.root.clearInterval(id) && undefined || undefined;
    };
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            // Dequeue if the action didn't reschedule itself. Don't call
            // unsubscribe(), because the action could reschedule later.
            // For example:
            // ```
            // scheduler.schedule(function doWork(counter) {
            //   /* ... I'm a busy worker bee ... */
            //   var originalAction = this;
            //   /* wait 100ms before rescheduling the action */
            //   setTimeout(function () {
            //     originalAction.schedule(counter + 1);
            //   }, 100);
            // }, 1000);
            // ```
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.delay = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
    };
    return AsyncAction;
}(Action_1.Action));
exports.AsyncAction = AsyncAction;
//# sourceMappingURL=AsyncAction.js.map

/***/ },

/***/ "./node_modules/rxjs/scheduler/AsyncScheduler.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Scheduler_1 = __webpack_require__("./node_modules/rxjs/Scheduler.js");
var AsyncScheduler = (function (_super) {
    __extends(AsyncScheduler, _super);
    function AsyncScheduler() {
        _super.apply(this, arguments);
        this.actions = [];
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         */
        this.active = false;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         */
        this.scheduled = undefined;
    }
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift()); // exhaust the scheduler queue
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler_1.Scheduler));
exports.AsyncScheduler = AsyncScheduler;
//# sourceMappingURL=AsyncScheduler.js.map

/***/ },

/***/ "./node_modules/rxjs/scheduler/QueueAction.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncAction_1 = __webpack_require__("./node_modules/rxjs/scheduler/AsyncAction.js");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var QueueAction = (function (_super) {
    __extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return (delay > 0 || this.closed) ?
            _super.prototype.execute.call(this, state, delay) :
            this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If delay is greater than 0, enqueue as an async action.
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        // Otherwise flush the scheduler starting with this action.
        return scheduler.flush(this);
    };
    return QueueAction;
}(AsyncAction_1.AsyncAction));
exports.QueueAction = QueueAction;
//# sourceMappingURL=QueueAction.js.map

/***/ },

/***/ "./node_modules/rxjs/scheduler/QueueScheduler.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncScheduler_1 = __webpack_require__("./node_modules/rxjs/scheduler/AsyncScheduler.js");
var QueueScheduler = (function (_super) {
    __extends(QueueScheduler, _super);
    function QueueScheduler() {
        _super.apply(this, arguments);
    }
    return QueueScheduler;
}(AsyncScheduler_1.AsyncScheduler));
exports.QueueScheduler = QueueScheduler;
//# sourceMappingURL=QueueScheduler.js.map

/***/ },

/***/ "./node_modules/rxjs/scheduler/queue.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var QueueAction_1 = __webpack_require__("./node_modules/rxjs/scheduler/QueueAction.js");
var QueueScheduler_1 = __webpack_require__("./node_modules/rxjs/scheduler/QueueScheduler.js");
exports.queue = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
//# sourceMappingURL=queue.js.map

/***/ },

/***/ "./node_modules/rxjs/util/ArgumentOutOfRangeError.js":
/***/ function(module, exports) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an element was queried at a certain index of an
 * Observable, but no such index or position exists in that sequence.
 *
 * @see {@link elementAt}
 * @see {@link take}
 * @see {@link takeLast}
 *
 * @class ArgumentOutOfRangeError
 */
var ArgumentOutOfRangeError = (function (_super) {
    __extends(ArgumentOutOfRangeError, _super);
    function ArgumentOutOfRangeError() {
        var err = _super.call(this, 'argument out of range');
        this.name = err.name = 'ArgumentOutOfRangeError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return ArgumentOutOfRangeError;
}(Error));
exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
//# sourceMappingURL=ArgumentOutOfRangeError.js.map

/***/ },

/***/ "./src/app/app.component.html":
/***/ function(module, exports) {

module.exports = "<navbar></navbar>\n\n<div class=\"main\">\n  <div class=\"container\">\n    <router-outlet></router-outlet>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/app.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'my-app',
            template: __webpack_require__("./src/app/app.component.html"),
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ },

/***/ "./src/app/app.filter.pipe.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var FilterPipe = (function () {
    function FilterPipe() {
    }
    FilterPipe.prototype.transform = function (items, term) {
        if (term === undefined)
            return items;
        return items.filter(function (item) {
            return item.name.toLowerCase().includes(term.toLowerCase());
        });
    };
    FilterPipe = __decorate([
        core_1.Pipe({
            name: 'filter'
        }), 
        __metadata('design:paramtypes', [])
    ], FilterPipe);
    return FilterPipe;
}());
exports.FilterPipe = FilterPipe;


/***/ },

/***/ "./src/app/app.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var hmr_1 = __webpack_require__("./node_modules/@angularclass/hmr/dist/index.js");
/*
 * Platform and Environment providers/directives/pipes
 */
var environment_1 = __webpack_require__("./src/app/environment.ts");
var app_routes_1 = __webpack_require__("./src/app/app.routes.ts");
// App is our top level component
var app_resolver_1 = __webpack_require__("./src/app/app.resolver.ts");
var app_service_1 = __webpack_require__("./src/app/app.service.ts");
var app_component_1 = __webpack_require__("./src/app/app.component.ts");
var navbar_component_1 = __webpack_require__("./src/app/components/navbar/navbar.component.ts");
var search_component_1 = __webpack_require__("./src/app/components/search/search.component.ts");
var about_component_1 = __webpack_require__("./src/app/components/about/about.component.ts");
var artist_component_1 = __webpack_require__("./src/app/components/artist/artist.component.ts");
var album_component_1 = __webpack_require__("./src/app/components/album/album.component.ts");
var track_component_1 = __webpack_require__("./src/app/components/track/track.component.ts");
var spotify_service_1 = __webpack_require__("./src/app/services/spotify.service.ts");
var app_filter_pipe_1 = __webpack_require__("./src/app/app.filter.pipe.ts");
var app_ms_to_minute_pipe_1 = __webpack_require__("./src/app/app.ms-to-minute.pipe.ts");
var angularfire2_1 = __webpack_require__("./node_modules/angularfire2/angularfire2.js");
// Initialize Firebase
exports.firebaseConfig = {
    apiKey: "AIzaSyAuice6zlwggtiwohsh9LRtaOS0l-Q7EnY",
    authDomain: "ngspotify-17272.firebaseapp.com",
    databaseURL: "https://ngspotify-17272.firebaseio.com",
    storageBucket: "",
};
// Application wide providers
var APP_PROVIDERS = app_resolver_1.APP_RESOLVER_PROVIDERS.concat([
    app_service_1.AppState
]);
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
var AppModule = (function () {
    function AppModule(appRef, appState) {
        this.appRef = appRef;
        this.appState = appState;
    }
    AppModule.prototype.hmrOnInit = function (store) {
        if (!store || !store.state)
            return;
        console.log('HMR store', store);
        this.appState._state = store.state;
        this.appRef.tick();
        delete store.state;
    };
    AppModule.prototype.hmrOnDestroy = function (store) {
        var cmpLocation = this.appRef.components.map(function (cmp) { return cmp.location.nativeElement; });
        // recreate elements
        var state = this.appState._state;
        store.state = state;
        store.disposeOldHosts = hmr_1.createNewHosts(cmpLocation);
        // remove styles
        hmr_1.removeNgStyles();
    };
    AppModule.prototype.hmrAfterDestroy = function (store) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    };
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [app_component_1.AppComponent],
            declarations: [app_component_1.AppComponent, navbar_component_1.NavbarComponent, search_component_1.SearchComponent, about_component_1.AboutComponent, artist_component_1.ArtistComponent, album_component_1.AlbumComponent, app_filter_pipe_1.FilterPipe, track_component_1.TrackComponent, app_ms_to_minute_pipe_1.MSPipe],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                http_1.JsonpModule,
                router_1.RouterModule.forRoot(app_routes_1.ROUTES),
                angularfire2_1.AngularFireModule.initializeApp(exports.firebaseConfig)
            ],
            providers: [
                environment_1.ENV_PROVIDERS,
                APP_PROVIDERS,
                spotify_service_1.SpotifyService,
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _a) || Object, (typeof (_b = typeof app_service_1.AppState !== 'undefined' && app_service_1.AppState) === 'function' && _b) || Object])
    ], AppModule);
    return AppModule;
    var _a, _b;
}());
exports.AppModule = AppModule;


/***/ },

/***/ "./src/app/app.ms-to-minute.pipe.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var MSPipe = (function () {
    function MSPipe() {
    }
    MSPipe.prototype.transform = function (millseconds, term) {
        var seconds = Math.floor(millseconds / 1000);
        var days = Math.floor(seconds / 86400);
        var hours = Math.floor((seconds % 86400) / 3600);
        var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var timeString = '';
        if (days > 0)
            timeString += (days > 1) ? (days + " days ") : (days + " day ");
        if (hours > 0)
            timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
        if (minutes >= 0)
            timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
        return timeString;
    };
    MSPipe = __decorate([
        core_1.Pipe({
            name: 'msMinute'
        }), 
        __metadata('design:paramtypes', [])
    ], MSPipe);
    return MSPipe;
}());
exports.MSPipe = MSPipe;


/***/ },

/***/ "./src/app/app.resolver.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
__webpack_require__("./node_modules/rxjs/add/observable/of.js");
var DataResolver = (function () {
    function DataResolver() {
    }
    DataResolver.prototype.resolve = function (route, state) {
        return Observable_1.Observable.of({ res: 'I am data' });
    };
    DataResolver = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DataResolver);
    return DataResolver;
}());
exports.DataResolver = DataResolver;
// an array of services to resolve routes with data
exports.APP_RESOLVER_PROVIDERS = [
    DataResolver
];


/***/ },

/***/ "./src/app/app.routes.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
// import { Routes, RouterModule } from '@angular/router';
// import { Home } from './home';
// import { About } from './about';
// import { NoContent } from './no-content';
"use strict";
var search_component_1 = __webpack_require__("./src/app/components/search/search.component.ts");
var about_component_1 = __webpack_require__("./src/app/components/about/about.component.ts");
var artist_component_1 = __webpack_require__("./src/app/components/artist/artist.component.ts");
var album_component_1 = __webpack_require__("./src/app/components/album/album.component.ts");
var track_component_1 = __webpack_require__("./src/app/components/track/track.component.ts");
exports.ROUTES = [
    { path: '', component: search_component_1.SearchComponent },
    { path: 'about', component: about_component_1.AboutComponent },
    { path: 'artist/:id', component: artist_component_1.ArtistComponent },
    { path: 'album/:id', component: album_component_1.AlbumComponent },
    { path: 'top-tracks/:id', component: track_component_1.TrackComponent }
];


/***/ },

/***/ "./src/app/app.service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var AppState = (function () {
    function AppState() {
        this._state = {};
    }
    Object.defineProperty(AppState.prototype, "state", {
        // already return a clone of the current state
        get: function () {
            return this._state = this._clone(this._state);
        },
        // never allow mutation
        set: function (value) {
            throw new Error('do not mutate the `.state` directly');
        },
        enumerable: true,
        configurable: true
    });
    AppState.prototype.get = function (prop) {
        // use our state getter for the clone
        var state = this.state;
        return state.hasOwnProperty(prop) ? state[prop] : state;
    };
    AppState.prototype.set = function (prop, value) {
        // internally mutate our state
        return this._state[prop] = value;
    };
    AppState.prototype._clone = function (object) {
        // simple object clone
        return JSON.parse(JSON.stringify(object));
    };
    AppState = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], AppState);
    return AppState;
}());
exports.AppState = AppState;


/***/ },

/***/ "./src/app/components/about/about.component.html":
/***/ function(module, exports) {

module.exports = "<h2>{{ (_about | async)?.title }}</h2>\n\n<p>{{ (_about | async)?.value }}</p>\n\n<ul>\n\t<li *ngFor=\"let list of _aboutList | async\">\n\t\t{{ list.name }}\n\t</li>\n</ul>\n"

/***/ },

/***/ "./src/app/components/about/about.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var angularfire2_1 = __webpack_require__("./node_modules/angularfire2/angularfire2.js");
var AboutComponent = (function () {
    function AboutComponent(_af) {
        this._af = _af;
        this._about = _af.database.object('/about');
        this._aboutList = _af.database.list('/about/lists');
    }
    AboutComponent.prototype.ngOnInit = function () { };
    AboutComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'about',
            template: __webpack_require__("./src/app/components/about/about.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angularfire2_1.AngularFire !== 'undefined' && angularfire2_1.AngularFire) === 'function' && _a) || Object])
    ], AboutComponent);
    return AboutComponent;
    var _a;
}());
exports.AboutComponent = AboutComponent;


/***/ },

/***/ "./src/app/components/album/album.component.html":
/***/ function(module, exports) {

module.exports = "<div id=\"album\" *ngIf=\"album\">\n  <header class=\"album-header\">\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <div *ngIf=\"album.images.length > 0\">\n          <img src=\"{{album.images[0].url}}\" class=\"album-thumb\" alt=\"\">\n        </div>\n      </div>\n      <div class=\"col-md-8\">\n        <h4 *ngIf=\"album.artists.length > 0\">\n          <span *ngFor=\"let artist of album.artists\">\n            {{artist.name}}\n          </span>\n        </h4>\n        <h2>{{album.name}}</h2>\n        <h5>Release Date: {{album.release_date}}</h5>\n        <a href=\"{{album.external_urls.spotify}}\" target=\"_blank\" class=\"btn btn-primary\">View In Spotify</a>\n      </div>\n    </div>\n  </header>\n\n  <div class=\"album-tracks\">\n    <h2>Album Tracks</h2>\n    <div *ngFor=\"let track of album.tracks.items\">\n      <div class=\"well\">\n        <h5>{{track.track_number}} - {{track.name}}</h5>\n        <a href=\"{{track.preview_url}}\" target=\"_blank\">Preview Track</a>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/components/album/album.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var spotify_service_1 = __webpack_require__("./src/app/services/spotify.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var AlbumComponent = (function () {
    function AlbumComponent(_spotifyService, _route) {
        this._spotifyService = _spotifyService;
        this._route = _route;
    }
    AlbumComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params
            .map(function (params) { return params['id']; })
            .subscribe(function (id) {
            _this._spotifyService.getAlbum(id)
                .subscribe(function (album) {
                _this.album = album;
            });
        });
    };
    AlbumComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'album',
            template: __webpack_require__("./src/app/components/album/album.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof spotify_service_1.SpotifyService !== 'undefined' && spotify_service_1.SpotifyService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object])
    ], AlbumComponent);
    return AlbumComponent;
    var _a, _b;
}());
exports.AlbumComponent = AlbumComponent;


/***/ },

/***/ "./src/app/components/artist/artist.component.html":
/***/ function(module, exports) {

module.exports = "<div *ngIf=\"artist\">\n\t<header class=\"artist-header clearfix\">\n\n\t\t<h1>\n\t    <span *ngIf=\"artist.images.length > 0\">\n\t\t    <img src=\"{{artist.images[0].url}}\" class=\"artist-thumb img-circle\" alt=\"\">\n\t    </span>\n\t\t\t{{artist.name}}\n\t\t</h1>\n\t\t<p *ngIf=\"artist.genres.length > 0\">\n\t\t\tGenres: <span *ngFor=\"let genres of artist.genres\">{{genres}}</span>\n\t\t</p>\n\t\t<div class=\"col-md-3 col-md-offset-1\">\n\t\t\t<a routerLink=\"/top-tracks/{{artist.id}}\" class=\"btn btn-success\">View all Tracks</a>\n\t\t</div>\n\t</header>\n\n\t<form id=\"albumFilter\">\n\t\t<div class=\"form-group\">\n\t\t\t<label class=\"control-label\" for=\"inputDefault\">Filter Album</label>\n\t\t\t<input type=\"text\" [(ngModel)]=\"term\" name=\"albumFilter\" class=\"form-control\" id=\"inputDefault\">\n\t\t</div>\n\t</form>\n\n\t<div class=\"artist-albums\">\n\t\t<div class=\"row flexy\">\n\n\t\t\t<div class=\"col-md-3 well\" *ngFor=\"let album of albums | filter:term \">\n\t\t\t\t<div class=\"album\" *ngIf=\"album.images.length > 0\">\n\n\t\t\t\t\t<img class=\"album-thumb img-thumbnail\" src=\"{{album.images[0].url}}\" alt=\"\">\n\t\t\t\t\t<h4>{{album.name}}</h4>\n\t\t\t\t\t<a routerLink=\"/album/{{album.id}}\" class=\"btn btn-default btn-block\">Album Details</a>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\n\n\t\t</div>\n\t</div>\n\n</div>\n"

/***/ },

/***/ "./src/app/components/artist/artist.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var spotify_service_1 = __webpack_require__("./src/app/services/spotify.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var ArtistComponent = (function () {
    function ArtistComponent(_spotifyService, _route) {
        this._spotifyService = _spotifyService;
        this._route = _route;
    }
    ArtistComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params
            .map(function (params) { return params['id']; })
            .subscribe(function (id) {
            _this._spotifyService.getArtist(id)
                .subscribe(function (artists) {
                _this.artist = artists;
            });
            _this._spotifyService.getAlbums(id)
                .subscribe(function (albums) {
                _this.albums = albums.items;
            });
        });
    };
    ArtistComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'artist',
            template: __webpack_require__("./src/app/components/artist/artist.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof spotify_service_1.SpotifyService !== 'undefined' && spotify_service_1.SpotifyService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object])
    ], ArtistComponent);
    return ArtistComponent;
    var _a, _b;
}());
exports.ArtistComponent = ArtistComponent;


/***/ },

/***/ "./src/app/components/navbar/navbar.component.html":
/***/ function(module, exports) {

module.exports = "<nav class=\"navbar navbar-inverse\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">ngSpotify</a>\n    </div>\n    <div id=\"navbar\" class=\"collapse navbar-collapse\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a routerLink=\"/\" routerLinkActive=\"active\">Home</a></li>\n        <li><a routerLink=\"/about\" routerLinkActive=\"active\">About</a></li>\n      </ul>\n    </div><!--/.nav-collapse -->\n  </div>\n</nav>\n"

/***/ },

/***/ "./src/app/components/navbar/navbar.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var NavbarComponent = (function () {
    function NavbarComponent() {
    }
    NavbarComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'navbar',
            template: __webpack_require__("./src/app/components/navbar/navbar.component.html")
        }), 
        __metadata('design:paramtypes', [])
    ], NavbarComponent);
    return NavbarComponent;
}());
exports.NavbarComponent = NavbarComponent;


/***/ },

/***/ "./src/app/components/search/search.component.html":
/***/ function(module, exports) {

module.exports = "<h1>{{ (_search | async)?.title }}</h1>\n<div class=\"lead\">\n\t{{ (_search | async)?.text }}\n</div>\n\n<form>\n  <div class=\"form-group\">\n    <input\n      type=\"text\"\n      class=\"form-control\"\n      placeholder=\"Search Music...\"\n      name=\"searchStr\"\n      [(ngModel)]=\"searchStr\"\n      (keyup)=\"searchMusic()\"\n    >\n  </div>\n</form>\n\n<div *ngIf=\"searchRes\">\n  <div *ngFor=\"let res of searchRes\">\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div class=\"search-res well\">\n          <h4><a routerLink=\"/artist/{{res.id}}\">{{res.name}}</a></h4>\n          <div>\n            <strong>Genres: </strong>\n            <span *ngFor=\"let genre of res.genres\">{{genre}}</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/components/search/search.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var spotify_service_1 = __webpack_require__("./src/app/services/spotify.service.ts");
var angularfire2_1 = __webpack_require__("./node_modules/angularfire2/angularfire2.js");
var SearchComponent = (function () {
    function SearchComponent(_spotifyService, _af) {
        this._spotifyService = _spotifyService;
        this._af = _af;
    }
    SearchComponent.prototype.searchMusic = function () {
        var _this = this;
        this._spotifyService.searchMusic(this.searchStr)
            .subscribe(function (res) {
            _this.searchRes = res.artists.items;
        });
    };
    SearchComponent.prototype.ngOnInit = function () {
        this._search = this._af.database.object('/search');
    };
    SearchComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'search',
            template: __webpack_require__("./src/app/components/search/search.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof spotify_service_1.SpotifyService !== 'undefined' && spotify_service_1.SpotifyService) === 'function' && _a) || Object, (typeof (_b = typeof angularfire2_1.AngularFire !== 'undefined' && angularfire2_1.AngularFire) === 'function' && _b) || Object])
    ], SearchComponent);
    return SearchComponent;
    var _a, _b;
}());
exports.SearchComponent = SearchComponent;


/***/ },

/***/ "./src/app/components/track/track.component.html":
/***/ function(module, exports) {

module.exports = "<div id=\"track\" *ngIf=\"artist\">\r\n\t<header class=\"album-header\">\r\n\t\t<div class=\"row\">\r\n\t\t\t<div class=\"col-md-4\">\r\n\t\t\t\t<div *ngIf=\"artist.images.length > 0\">\r\n\t\t\t\t\t<img src=\"{{artist.images[0].url}}\" class=\"album-thumb\" alt=\"\">\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"col-md-8\">\r\n\t\t\t\t<h2>{{artist.name}}</h2>\r\n\t\t\t\t<h4>Follower: {{artist.followers.total}}</h4>\r\n\t\t\t\t<h5>Popularity: {{artist.popularity}}</h5>\r\n\t\t\t\t<a href=\"{{artist.external_urls.spotify}}\" target=\"_blank\" class=\"btn btn-primary\">View Artist In Spotify</a>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</header>\r\n\r\n\t<div class=\"album-tracks\">\r\n\t\t<h2>Album Tracks</h2>\r\n\t\t<div *ngFor=\"let track of tracks\">\r\n\t\t\t<div class=\"well\">\r\n\t\t\t\t<div class=\"row\">\r\n\t\t\t\t\t<div class=\"col-md-2\">\r\n\t\t\t\t\t\t<img class=\"album-thumb\" src=\"{{track.album.images[0].url}}\" alt=\"\">\r\n\t\t\t\t\t\t<span>{{track.album.name}}</span><br>\r\n\t\t\t\t\t\t<a routerLink=\"/album/{{track.album.id}}\" >View Album </a>\r\n\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-md-10\">\r\n\t\t\t\t\t\t<h4>{{track.name}} </h4>\r\n\t\t\t\t\t\t<a href=\"{{track.preview_url}}\" target=\"_blank\" class=\"btn btn-primary\">Preview Track</a>\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t{{track.duration_ms | msMinute}} - \tPopularity: {{track.popularity}} <br>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"

/***/ },

/***/ "./src/app/components/track/track.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var spotify_service_1 = __webpack_require__("./src/app/services/spotify.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var TrackComponent = (function () {
    function TrackComponent(_spotifyService, _route) {
        this._spotifyService = _spotifyService;
        this._route = _route;
    }
    TrackComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params
            .map(function (params) { return params['id']; })
            .subscribe(function (id) {
            _this._spotifyService.getTopTracks(id)
                .subscribe(function (track) {
                _this.tracks = track.tracks;
            });
            _this._spotifyService.getArtist(id)
                .subscribe(function (artist) {
                _this.artist = artist;
            });
        });
    };
    TrackComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'tracks',
            template: __webpack_require__("./src/app/components/track/track.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof spotify_service_1.SpotifyService !== 'undefined' && spotify_service_1.SpotifyService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object])
    ], TrackComponent);
    return TrackComponent;
    var _a, _b;
}());
exports.TrackComponent = TrackComponent;


/***/ },

/***/ "./src/app/environment.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
// Angular 2
// rc2 workaround
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
// Environment Providers
var PROVIDERS = [];
// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
var _decorateModuleRef = function identity(value) { return value; };
if (false) {
    // Production
    platform_browser_1.disableDebugTools();
    core_1.enableProdMode();
    PROVIDERS = PROVIDERS.slice();
}
else {
    _decorateModuleRef = function (modRef) {
        var appRef = modRef.injector.get(core_1.ApplicationRef);
        var cmpRef = appRef.components[0];
        var _ng = window.ng;
        platform_browser_1.enableDebugTools(cmpRef);
        window.ng.probe = _ng.probe;
        window.ng.coreTokens = _ng.coreTokens;
        return modRef;
    };
    // Development
    PROVIDERS = PROVIDERS.slice();
}
exports.decorateModuleRef = _decorateModuleRef;
exports.ENV_PROVIDERS = PROVIDERS.slice();


/***/ },

/***/ "./src/app/index.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// App
__export(__webpack_require__("./src/app/app.module.ts"));


/***/ },

/***/ "./src/app/services/spotify.service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
var SpotifyService = (function () {
    function SpotifyService(_http) {
        this._http = _http;
    }
    SpotifyService.prototype.searchMusic = function (str, type) {
        if (type === void 0) { type = 'artist'; }
        this.searchUrl = "https://api.spotify.com/v1/search?query=" + str + "&offset=0&limit=20&type=" + type + "&market0=TW";
        return this._http.get(this.searchUrl)
            .map(function (res) { return res.json(); });
    };
    SpotifyService.prototype.getArtist = function (id) {
        this.artistUrl = "https://api.spotify.com/v1/artists/" + id;
        return this._http.get(this.artistUrl)
            .map(function (res) { return res.json(); });
    };
    SpotifyService.prototype.getAlbums = function (artistId) {
        this.albumsUrl = "https://api.spotify.com/v1/artists/" + artistId + "/albums";
        return this._http.get(this.albumsUrl)
            .map(function (res) { return res.json(); });
    };
    SpotifyService.prototype.getAlbum = function (id) {
        this.albumUrl = "https://api.spotify.com/v1/albums/" + id;
        return this._http.get(this.albumUrl)
            .map(function (res) { return res.json(); });
    };
    SpotifyService.prototype.getTopTracks = function (id) {
        this.tracksUrl = "https://api.spotify.com/v1/artists/" + id + "/top-tracks?country=TW";
        return this._http.get(this.tracksUrl)
            .map(function (res) { return res.json(); });
    };
    SpotifyService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], SpotifyService);
    return SpotifyService;
    var _a;
}());
exports.SpotifyService = SpotifyService;


/***/ },

/***/ "./src/main.browser.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
/*
 * Angular bootstraping
 */
var platform_browser_dynamic_1 = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/index.js");
var environment_1 = __webpack_require__("./src/app/environment.ts");
var hmr_1 = __webpack_require__("./node_modules/@angularclass/hmr/dist/index.js");
/*
 * App Module
 * our top level module that holds all of our components
 */
var app_1 = __webpack_require__("./src/app/index.ts");
/*
 * Bootstrap our Angular app with a top level NgModule
 */
function main() {
    return platform_browser_dynamic_1.platformBrowserDynamic()
        .bootstrapModule(app_1.AppModule).then(function (MODULE_REF) {
        if (false) {
            module["hot"]["accept"]();
            if (MODULE_REF.instance["hmrOnInit"]) {
                MODULE_REF.instance["hmrOnInit"](module["hot"]["data"]);
            }
            if (MODULE_REF.instance["hmrOnStatus"]) {
                module["hot"]["apply"](function (status) {
                    MODULE_REF.instance["hmrOnStatus"](status);
                });
            }
            if (MODULE_REF.instance["hmrOnCheck"]) {
                module["hot"]["check"](function (err, outdatedModules) {
                    MODULE_REF.instance["hmrOnCheck"](err, outdatedModules);
                });
            }
            if (MODULE_REF.instance["hmrOnDecline"]) {
                module["hot"]["decline"](function (dependencies) {
                    MODULE_REF.instance["hmrOnDecline"](dependencies);
                });
            }
            module["hot"]["dispose"](function (store) {
                MODULE_REF.instance["hmrOnDestroy"] && MODULE_REF.instance["hmrOnDestroy"](store);
                MODULE_REF.destroy();
                MODULE_REF.instance["hmrAfterDestroy"] && MODULE_REF.instance["hmrAfterDestroy"](store);
            });
        }
        return MODULE_REF;
    })
        .then(environment_1.decorateModuleRef)
        .catch(function (err) { return console.error(err); });
}
exports.main = main;
hmr_1.bootloader(main);


/***/ }

},["./src/main.browser.ts"]);
//# sourceMappingURL=main.map