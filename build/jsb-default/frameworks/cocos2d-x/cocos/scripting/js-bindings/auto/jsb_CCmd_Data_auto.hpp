#include "base/ccConfig.h"
#ifndef __CCmd_Data_h__
#define __CCmd_Data_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_CCmd_Data_class;
extern JSObject *jsb_CCmd_Data_prototype;

bool js_CCmd_Data_CCmd_Data_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_CCmd_Data_CCmd_Data_finalize(JSContext *cx, JSObject *obj);
void js_register_CCmd_Data_CCmd_Data(JSContext *cx, JS::HandleObject global);
void register_all_CCmd_Data(JSContext* cx, JS::HandleObject obj);
bool js_CCmd_Data_CCmd_Data_pushdouble(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readfloat(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readint64(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushbool(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushbyte(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readshort(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_getmain(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readint(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_getReadOffset(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushpacket(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readdword(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readword(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_setcmdinfo(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_setDataSize(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushdword(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushint64(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readstring(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_setmaxsize(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushstring(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushshort(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readbool(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readdouble(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushint(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_getDataSize(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_getDataBuffer(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_getsub(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_cleanData(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushword(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_readbyte(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushfloat(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_pushdata(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_create(JSContext *cx, uint32_t argc, jsval *vp);
bool js_CCmd_Data_CCmd_Data_CCmd_Data(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __CCmd_Data_h__
