#include "base/ccConfig.h"
#ifndef __ClientSocket_h__
#define __ClientSocket_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_ClientSocket_class;
extern JSObject *jsb_ClientSocket_prototype;

bool js_ClientSocket_ClientSocket_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_ClientSocket_ClientSocket_finalize(JSContext *cx, JSObject *obj);
void js_register_ClientSocket_ClientSocket(JSContext *cx, JS::HandleObject global);
void register_all_ClientSocket(JSContext* cx, JS::HandleObject obj);
bool js_ClientSocket_ClientSocket_releaseSocket(JSContext *cx, uint32_t argc, jsval *vp);
bool js_ClientSocket_ClientSocket_sendSocketData(JSContext *cx, uint32_t argc, jsval *vp);
bool js_ClientSocket_ClientSocket_ConnectSocket(JSContext *cx, uint32_t argc, jsval *vp);
bool js_ClientSocket_ClientSocket_createSocket(JSContext *cx, uint32_t argc, jsval *vp);
bool js_ClientSocket_ClientSocket_ClientSocket(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __ClientSocket_h__
