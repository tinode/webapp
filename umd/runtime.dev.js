/******/ var __webpack_modules__ = ({});
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	if (!(moduleId in __webpack_modules__)) {
/******/ 		delete __webpack_module_cache__[moduleId];
/******/ 		const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/******/ // expose the modules object (__webpack_modules__)
/******/ __webpack_require__.m = __webpack_modules__;
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ // getDefaultExport function for compatibility with non-harmony modules
/******/ __webpack_require__.n = (module) => {
/******/ 	const getter = module && module.__esModule ?
/******/ 		() => (module['default']) :
/******/ 		() => (module);
/******/ 	__webpack_require__.d(getter, { a: getter });
/******/ 	return getter;
/******/ };
/******/ 
/******/ /* webpack/runtime/create fake namespace object */
/******/ (() => {
/******/ 	const getProto = Object.getPrototypeOf;
/******/ 	let leafPrototypes;
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 16: return value when it's Promise-like
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = this(value);
/******/ 		if(mode & 8) return value;
/******/ 		if(typeof value === 'object' && value) {
/******/ 			if((mode & 4) && value.__esModule) return value;
/******/ 			if((mode & 16) && typeof value.then === 'function') return value;
/******/ 		}
/******/ 		const ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		const def = {};
/******/ 		leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 		for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 			Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 		}
/******/ 		def['default'] = () => (value);
/******/ 		__webpack_require__.d(ns, def);
/******/ 		return ns;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	for(var key in definition) {
/******/ 		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/ensure chunk */
/******/ __webpack_require__.f = {};
/******/ // This file contains only the entry chunk.
/******/ // The chunk loading function for additional chunks
/******/ __webpack_require__.e = (chunkId) => {
/******/ 	const promises = [];
/******/ 	__webpack_require__.f.j(chunkId, promises);
/******/ 	return Promise.all(promises);
/******/ };
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ // define __esModule on exports
/******/ __webpack_require__.r = (exports) => {
/******/ 	Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 	Object.defineProperty(exports, '__esModule', { value: true });
/******/ };
/******/ 
/******/ /* webpack/runtime/set anonymous default export name */
/******/ // set .name for anonymous default exports per ES spec
/******/ // skipped when the property is non-configurable (pre-ES2015 engines),
/******/ // where Object.defineProperty would throw
/******/ __webpack_require__.dn = (x) => {
/******/ 	var descriptor = Object.getOwnPropertyDescriptor(x, "name");
/******/ 	if (!descriptor || (!descriptor.writable && descriptor.configurable)) Object.defineProperty(x, "name", { value: "default", configurable: true });
/******/ };
/******/ 
/******/ /* webpack/runtime/export webpack runtime */
/******/ export { __webpack_require__ };
/******/ 
/******/ /* webpack/runtime/import chunk loading */
/******/ (() => {
/******/ 	// no baseURI
/******/ 	
/******/ 	const chunkImports = {
/******/ 		"src_i18n_min_ar_json": () => (import("/umd/src_i18n_min_ar_json.dev.js")),
/******/ 		"src_i18n_min_de_json": () => (import("/umd/src_i18n_min_de_json.dev.js")),
/******/ 		"src_i18n_min_en_json": () => (import("/umd/src_i18n_min_en_json.dev.js")),
/******/ 		"src_i18n_min_es_json": () => (import("/umd/src_i18n_min_es_json.dev.js")),
/******/ 		"src_i18n_min_fr_json": () => (import("/umd/src_i18n_min_fr_json.dev.js")),
/******/ 		"src_i18n_min_id_json": () => (import("/umd/src_i18n_min_id_json.dev.js")),
/******/ 		"src_i18n_min_it_json": () => (import("/umd/src_i18n_min_it_json.dev.js")),
/******/ 		"src_i18n_min_ko_json": () => (import("/umd/src_i18n_min_ko_json.dev.js")),
/******/ 		"src_i18n_min_pt_json": () => (import("/umd/src_i18n_min_pt_json.dev.js")),
/******/ 		"src_i18n_min_ro_json": () => (import("/umd/src_i18n_min_ro_json.dev.js")),
/******/ 		"src_i18n_min_ru_json": () => (import("/umd/src_i18n_min_ru_json.dev.js")),
/******/ 		"src_i18n_min_th_json": () => (import("/umd/src_i18n_min_th_json.dev.js")),
/******/ 		"src_i18n_min_uk_json": () => (import("/umd/src_i18n_min_uk_json.dev.js")),
/******/ 		"src_i18n_min_vi_json": () => (import("/umd/src_i18n_min_vi_json.dev.js")),
/******/ 		"src_i18n_min_zh_json": () => (import("/umd/src_i18n_min_zh_json.dev.js")),
/******/ 		"src_i18n_min_zh-TW_json": () => (import("/umd/src_i18n_min_zh-TW_json.dev.js")),
/******/ 		"src_widgets_phone-country-selector_jsx": () => (import("/umd/src_widgets_phone-country-selector_jsx.dev.js")),
/******/ 		"src_views_info-view_jsx": () => (import("/umd/src_views_info-view_jsx.dev.js")),
/******/ 		"src_views_messages-view_jsx": () => (import("/umd/src_views_messages-view_jsx.dev.js")),
/******/ 		"vendors-node_modules_libphonenumber-js_mobile_exports_parsePhoneNumberWithError_js": () => (import("/umd/vendors-node_modules_libphonenumber-js_mobile_exports_parsePhoneNumberWithError_js.dev.js")),
/******/ 		"vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-883e54": () => (import("/umd/vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-883e54.dev.js")),
/******/ 		"src_widgets_phone-edit_jsx": () => (import("/umd/src_widgets_phone-edit_jsx.dev.js")),
/******/ 		"src_views_account-settings-view_jsx": () => (import("/umd/src_views_account-settings-view_jsx.dev.js")),
/******/ 		"src_views_create-account-view_jsx": () => (import("/umd/src_views_create-account-view_jsx.dev.js")),
/******/ 		"src_views_acc-security-view_jsx": () => (import("/umd/src_views_acc-security-view_jsx.dev.js")),
/******/ 		"src_views_password-reset-view_jsx": () => (import("/umd/src_views_password-reset-view_jsx.dev.js")),
/******/ 		"src_views_wallpapers_jsx": () => (import("/umd/src_views_wallpapers_jsx.dev.js")),
/******/ 		"src_widgets_call-panel_jsx": () => (import("/umd/src_widgets_call-panel_jsx.dev.js")),
/******/ 		"src_widgets_doc-preview_jsx": () => (import("/umd/src_widgets_doc-preview_jsx.dev.js")),
/******/ 		"src_widgets_image-preview_jsx": () => (import("/umd/src_widgets_image-preview_jsx.dev.js")),
/******/ 		"src_widgets_the-card-preview_jsx": () => (import("/umd/src_widgets_the-card-preview_jsx.dev.js")),
/******/ 		"src_widgets_video-preview_jsx": () => (import("/umd/src_widgets_video-preview_jsx.dev.js")),
/******/ 		"vendors-node_modules_webm-duration-fix_lib_index_js": () => (import("/umd/vendors-node_modules_webm-duration-fix_lib_index_js.dev.js")),
/******/ 		"src_widgets_audio-recorder_jsx": () => (import("/umd/src_widgets_audio-recorder_jsx.dev.js"))
/******/ 	};
/******/ 	
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// [resolve, Promise] = chunk loading, 0 = chunk loaded
/******/ 	const installedChunks = {
/******/ 		"runtime": 0
/******/ 	};
/******/ 	
/******/ 	const installChunk = (data) => {
/******/ 		let {__webpack_esm_ids__, __webpack_esm_modules__, __webpack_esm_runtime__} = data;
/******/ 		// add "modules" to the modules object,
/******/ 		// then flag all "ids" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0;
/******/ 		for(moduleId in __webpack_esm_modules__) {
/******/ 			if(__webpack_require__.o(__webpack_esm_modules__, moduleId)) {
/******/ 				__webpack_require__.m[moduleId] = __webpack_esm_modules__[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(__webpack_esm_runtime__) __webpack_esm_runtime__(__webpack_require__);
/******/ 		for(;i < __webpack_esm_ids__.length; i++) {
/******/ 			chunkId = __webpack_esm_ids__[i];
/******/ 			if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				installedChunks[chunkId][0]();
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 	
/******/ 	}
/******/ 	
/******/ 	__webpack_require__.f.j = (chunkId, promises) => {
/******/ 			// import() chunk loading for javascript
/******/ 			let installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 			if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 	
/******/ 				// a Promise means "currently loading".
/******/ 				if(installedChunkData) {
/******/ 					promises.push(installedChunkData[1]);
/******/ 				} else {
/******/ 					if("runtime" != chunkId) {
/******/ 						// setup Promise in chunk cache
/******/ 						let promise = chunkImports[chunkId]().then(installChunk, (e) => {
/******/ 							if(installedChunks[chunkId] !== 0) installedChunks[chunkId] = undefined;
/******/ 							throw e;
/******/ 						});
/******/ 						promise = Promise.race([promise, new Promise((resolve) => (installedChunkData = installedChunks[chunkId] = [resolve]))])
/******/ 						promises.push(installedChunkData[1] = promise);
/******/ 					} else installedChunks[chunkId] = 0;
/******/ 				}
/******/ 			}
/******/ 	};
/******/ 	
/******/ 	// no prefetching
/******/ 	
/******/ 	// no preloaded
/******/ 	
/******/ 	__webpack_require__.C = installChunk;
/******/ 	
/******/ 	// no on chunks loaded
/******/ 	// no HMR
/******/ 	
/******/ 	// no HMR manifest
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ 

//# sourceMappingURL=runtime.dev.js.map