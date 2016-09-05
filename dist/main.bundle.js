var ac_main =
webpackJsonpac__name_([1],{

/***/ "./node_modules/rxjs/add/observable/of.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var of_1 = __webpack_require__("./node_modules/rxjs/observable/of.js");
Observable_1.Observable.of = of_1.of;
//# sourceMappingURL=of.js.map

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
var spotify_service_1 = __webpack_require__("./src/app/services/spotify.service.ts");
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
            declarations: [app_component_1.AppComponent, navbar_component_1.NavbarComponent, search_component_1.SearchComponent, about_component_1.AboutComponent, artist_component_1.ArtistComponent, album_component_1.AlbumComponent],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                http_1.JsonpModule,
                router_1.RouterModule.forRoot(app_routes_1.ROUTES)
            ],
            providers: [
                environment_1.ENV_PROVIDERS,
                APP_PROVIDERS,
                spotify_service_1.SpotifyService
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _a) || Object, (typeof (_b = typeof app_service_1.AppState !== 'undefined' && app_service_1.AppState) === 'function' && _b) || Object])
    ], AppModule);
    return AppModule;
    var _a, _b;
}());
exports.AppModule = AppModule;


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
exports.ROUTES = [
    { path: '', component: search_component_1.SearchComponent },
    { path: 'about', component: about_component_1.AboutComponent },
    { path: 'artist/:id', component: artist_component_1.ArtistComponent },
    { path: 'album/:id', component: album_component_1.AlbumComponent }
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

module.exports = "About\n"

/***/ },

/***/ "./src/app/components/about/about.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var AboutComponent = (function () {
    function AboutComponent() {
    }
    AboutComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'about',
            template: __webpack_require__("./src/app/components/about/about.component.html")
        }), 
        __metadata('design:paramtypes', [])
    ], AboutComponent);
    return AboutComponent;
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

module.exports = "<div *ngIf=\"artist\">\n  <header class=\"artist-header\">\n    <div *ngIf=\"artist.images.length > 0\">\n      <img src=\"{{artist.images[0].url}}\" class=\"artist-thumb img-circle\" alt=\"\">\n    </div>\n    <h1>{{artist.name}}</h1>\n    <p *ngIf=\"artist.genres.length > 0\">\n      Genres: <span *ngFor=\"let genres of artist.genres\">{{genres}}</span>\n    </p>\n  </header>\n\n  <div class=\"artist-albums\">\n    <div class=\"row flexy\">\n\n      <div class=\"col-md-3 well\" *ngFor=\"let album of albums\">\n        <div class=\"album\" *ngIf=\"album.images.length > 0\">\n\n          <img class=\"album-thumb img-thumbnail\" src=\"{{album.images[0].url}}\" alt=\"\">\n          <h4>{{album.name}}</h4>\n          <a routerLink=\"/album/{{album.id}}\" class=\"btn btn-default btn-block\">Album Details</a>\n\n        </div>\n      </div>\n\n\n    </div>\n  </div>\n\n</div>\n"

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

module.exports = "<h1>Need Music?</h1>\n<div class=\"lead\">\n  Use Spotify to listen music!\n</div>\n\n<form>\n  <div class=\"form-group\">\n    <input\n      type=\"text\"\n      class=\"form-control\"\n      placeholder=\"Search Music...\"\n      name=\"searchStr\"\n      [(ngModel)]=\"searchStr\"\n      (keyup)=\"searchMusic()\"\n    >\n  </div>\n</form>\n\n<div *ngIf=\"searchRes\">\n  <div *ngFor=\"let res of searchRes\">\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div class=\"search-res well\">\n          <h4><a routerLink=\"/artist/{{res.id}}\">{{res.name}}</a></h4>\n          <div>\n            <strong>Genres: </strong>\n            <span *ngFor=\"let genre of res.genres\">{{genre}}</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/components/search/search.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var spotify_service_1 = __webpack_require__("./src/app/services/spotify.service.ts");
var SearchComponent = (function () {
    function SearchComponent(_spotifyService) {
        this._spotifyService = _spotifyService;
    }
    SearchComponent.prototype.searchMusic = function () {
        var _this = this;
        this._spotifyService.searchMusic(this.searchStr)
            .subscribe(function (res) {
            _this.searchRes = res.artists.items;
        });
    };
    SearchComponent = __decorate([
        core_1.Component({
            moduleId: module.i,
            selector: 'search',
            template: __webpack_require__("./src/app/components/search/search.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof spotify_service_1.SpotifyService !== 'undefined' && spotify_service_1.SpotifyService) === 'function' && _a) || Object])
    ], SearchComponent);
    return SearchComponent;
    var _a;
}());
exports.SearchComponent = SearchComponent;


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
        this.searchUrl = "https://api.spotify.com/v1/search?query=" + str + "&offset=0&limit=20&type=" + type + "&market=US";
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