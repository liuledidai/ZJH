#include "base/ccConfig.h"
#ifndef __JCBridge_h__
#define __JCBridge_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_JCBridge_class;
extern JSObject *jsb_JCBridge_prototype;

bool js_JCBridge_JCBridge_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_JCBridge_JCBridge_finalize(JSContext *cx, JSObject *obj);
void js_register_JCBridge_JCBridge(JSContext *cx, JS::HandleObject global);
void register_all_JCBridge(JSContext* cx, JS::HandleObject obj);
bool js_JCBridge_JCBridge_callJS(JSContext *cx, uint32_t argc, jsval *vp);
bool js_JCBridge_JCBridge_callNative(JSContext *cx, uint32_t argc, jsval *vp);
bool js_JCBridge_JCBridge_setJSCallback(JSContext *cx, uint32_t argc, jsval *vp);
bool js_JCBridge_JCBridge_JCBridge(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __JCBridge_h__
