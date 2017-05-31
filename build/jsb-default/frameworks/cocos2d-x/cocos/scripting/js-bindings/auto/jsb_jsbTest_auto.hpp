#include "base/ccConfig.h"
#ifndef __jsbTest_h__
#define __jsbTest_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_jsbTest_class;
extern JSObject *jsb_jsbTest_prototype;

bool js_jsbTest_jsbTest_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsbTest_jsbTest_finalize(JSContext *cx, JSObject *obj);
void js_register_jsbTest_jsbTest(JSContext *cx, JS::HandleObject global);
void register_all_jsbTest(JSContext* cx, JS::HandleObject obj);
bool js_jsbTest_jsbTest_testlog(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __jsbTest_h__
