#include "scripting/js-bindings/auto/jsb_CCmd_Data_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "CCmd_Data.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;
}
JSClass  *jsb_CCmd_Data_class;
JSObject *jsb_CCmd_Data_prototype;

bool js_CCmd_Data_CCmd_Data_pushdouble(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushdouble : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushdouble : Error processing arguments");
        cobj->pushdouble(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushdouble : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readfloat(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readfloat : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->readfloat();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readfloat : Error processing arguments");
        double ret = cobj->readfloat(arg0);
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readfloat : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readint64(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readint64 : Invalid Native Object");
    if (argc == 0) {
        long long ret = cobj->readint64();
        JS::RootedValue jsret(cx);
        jsret = long_long_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readint64 : Error processing arguments");
        long long ret = cobj->readint64(arg0);
        JS::RootedValue jsret(cx);
        jsret = long_long_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readint64 : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushbool(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushbool : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushbool : Error processing arguments");
        cobj->pushbool(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushbool : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushbyte(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushbyte : Invalid Native Object");
    if (argc == 1) {
        uint16_t arg0;
        ok &= jsval_to_uint16(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushbyte : Error processing arguments");
        cobj->pushbyte(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushbyte : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readshort(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readshort : Invalid Native Object");
    if (argc == 0) {
        int32_t ret = cobj->readshort();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR short;
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readshort : Error processing arguments");
        int32_t ret = cobj->readshort(arg0);
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR short;
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readshort : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_getmain(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_getmain : Invalid Native Object");
    if (argc == 0) {
        unsigned short ret = cobj->getmain();
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_getmain : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readint(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readint : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->readint();
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readint : Error processing arguments");
        int ret = cobj->readint(arg0);
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readint : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_getReadOffset(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_getReadOffset : Invalid Native Object");
    if (argc == 0) {
        unsigned short ret = cobj->getReadOffset();
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_getReadOffset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushpacket(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushpacket : Invalid Native Object");
    if (argc == 2) {
        void* arg0 = nullptr;
        unsigned short arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;
        ok &= jsval_to_ushort(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushpacket : Error processing arguments");
        cobj->pushpacket(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushpacket : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readdword(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readdword : Invalid Native Object");
    if (argc == 0) {
        unsigned int ret = cobj->readdword();
        JS::RootedValue jsret(cx);
        jsret = uint32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readdword : Error processing arguments");
        unsigned int ret = cobj->readdword(arg0);
        JS::RootedValue jsret(cx);
        jsret = uint32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readdword : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_setcmdinfo(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_setcmdinfo : Invalid Native Object");
    if (argc == 2) {
        unsigned short arg0 = 0;
        unsigned short arg1 = 0;
        ok &= jsval_to_ushort(cx, args.get(0), &arg0);
        ok &= jsval_to_ushort(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_setcmdinfo : Error processing arguments");
        cobj->setcmdinfo(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_setcmdinfo : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushdword(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushdword : Invalid Native Object");
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= jsval_to_uint32(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushdword : Error processing arguments");
        cobj->pushdword(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushdword : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushint64(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushint64 : Invalid Native Object");
    if (argc == 1) {
        long long arg0 = 0;
        ok &= jsval_to_long_long(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushint64 : Error processing arguments");
        cobj->pushint64(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushint64 : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readstring(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readstring : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->readstring();
        JS::RootedValue jsret(cx);
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        unsigned short arg0 = 0;
        ok &= jsval_to_ushort(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readstring : Error processing arguments");
        std::string ret = cobj->readstring(arg0);
        JS::RootedValue jsret(cx);
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        unsigned short arg0 = 0;
        bool arg1;
        ok &= jsval_to_ushort(cx, args.get(0), &arg0);
        arg1 = JS::ToBoolean(args.get(1));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readstring : Error processing arguments");
        std::string ret = cobj->readstring(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readstring : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_setmaxsize(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_setmaxsize : Invalid Native Object");
    if (argc == 1) {
        unsigned short arg0 = 0;
        ok &= jsval_to_ushort(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_setmaxsize : Error processing arguments");
        cobj->setmaxsize(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_setmaxsize : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushstring(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushstring : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        unsigned short arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_ushort(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushstring : Error processing arguments");
        cobj->pushstring(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushstring : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushshort(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushshort : Invalid Native Object");
    if (argc == 1) {
        int32_t arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushshort : Error processing arguments");
        cobj->pushshort(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushshort : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readbool(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readbool : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->readbool();
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readbool : Error processing arguments");
        bool ret = cobj->readbool(arg0);
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readbool : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readdouble(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readdouble : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->readdouble();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readdouble : Error processing arguments");
        double ret = cobj->readdouble(arg0);
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readdouble : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushint(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushint : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushint : Error processing arguments");
        cobj->pushint(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_getDataSize(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_getDataSize : Invalid Native Object");
    if (argc == 0) {
        unsigned short ret = cobj->getDataSize();
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_getDataSize : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_getDataBuffer(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_getDataBuffer : Invalid Native Object");
    if (argc == 0) {
        void* ret = cobj->getDataBuffer();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR void*;
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_getDataBuffer : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readword(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readword : Invalid Native Object");
    if (argc == 0) {
        unsigned short ret = cobj->readword();
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readword : Error processing arguments");
        unsigned short ret = cobj->readword(arg0);
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readword : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_cleanData(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_cleanData : Invalid Native Object");
    if (argc == 0) {
        cobj->cleanData();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_cleanData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushword(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushword : Invalid Native Object");
    if (argc == 1) {
        unsigned short arg0 = 0;
        ok &= jsval_to_ushort(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushword : Error processing arguments");
        cobj->pushword(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushword : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_readbyte(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_readbyte : Invalid Native Object");
    if (argc == 0) {
        uint16_t ret = cobj->readbyte();
        JS::RootedValue jsret(cx);
        jsret = uint32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_readbyte : Error processing arguments");
        uint16_t ret = cobj->readbyte(arg0);
        JS::RootedValue jsret(cx);
        jsret = uint32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_readbyte : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_pushfloat(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_pushfloat : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_CCmd_Data_CCmd_Data_pushfloat : Error processing arguments");
        cobj->pushfloat(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_pushfloat : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_CCmd_Data_CCmd_Data_getsub(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CCmd_Data* cobj = (CCmd_Data *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_CCmd_Data_CCmd_Data_getsub : Invalid Native Object");
    if (argc == 0) {
        unsigned short ret = cobj->getsub();
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_getsub : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_CCmd_Data_CCmd_Data_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {

        CCmd_Data* ret = CCmd_Data::create();
        jsval jsret = JSVAL_NULL;
        if (ret) {
        jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<CCmd_Data>(cx, (CCmd_Data*)ret));
    } else {
        jsret = JSVAL_NULL;
    };
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "js_CCmd_Data_CCmd_Data_create : wrong number of arguments");
    return false;
}

bool js_CCmd_Data_CCmd_Data_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    CCmd_Data* cobj = new (std::nothrow) CCmd_Data();

    js_type_class_t *typeClass = js_get_type_from_native<CCmd_Data>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_create_weak_jsobject(cx, cobj, typeClass, "CCmd_Data"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}


void js_CCmd_Data_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (CCmd_Data)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    jsproxy = jsb_get_js_proxy(jsobj);
    if (jsproxy) {
        CCmd_Data *nobj = static_cast<CCmd_Data *>(jsproxy->ptr);
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        if (nobj) {
            jsb_remove_proxy(nproxy, jsproxy);
            JS::RootedValue flagValue(cx);
            JS_GetProperty(cx, jsobj, "__cppCreated", &flagValue);
            if (flagValue.isNullOrUndefined()){
                delete nobj;
            }
        }
        else
            jsb_remove_proxy(nullptr, jsproxy);
    }
}
void js_register_CCmd_Data_CCmd_Data(JSContext *cx, JS::HandleObject global) {
    jsb_CCmd_Data_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_CCmd_Data_class->name = "CCmd_Data";
    jsb_CCmd_Data_class->addProperty = JS_PropertyStub;
    jsb_CCmd_Data_class->delProperty = JS_DeletePropertyStub;
    jsb_CCmd_Data_class->getProperty = JS_PropertyStub;
    jsb_CCmd_Data_class->setProperty = JS_StrictPropertyStub;
    jsb_CCmd_Data_class->enumerate = JS_EnumerateStub;
    jsb_CCmd_Data_class->resolve = JS_ResolveStub;
    jsb_CCmd_Data_class->convert = JS_ConvertStub;
    jsb_CCmd_Data_class->finalize = js_CCmd_Data_finalize;
    jsb_CCmd_Data_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("pushdouble", js_CCmd_Data_CCmd_Data_pushdouble, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readfloat", js_CCmd_Data_CCmd_Data_readfloat, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readint64", js_CCmd_Data_CCmd_Data_readint64, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushbool", js_CCmd_Data_CCmd_Data_pushbool, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushbyte", js_CCmd_Data_CCmd_Data_pushbyte, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readshort", js_CCmd_Data_CCmd_Data_readshort, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getmain", js_CCmd_Data_CCmd_Data_getmain, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readint", js_CCmd_Data_CCmd_Data_readint, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getReadOffset", js_CCmd_Data_CCmd_Data_getReadOffset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushpacket", js_CCmd_Data_CCmd_Data_pushpacket, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readdword", js_CCmd_Data_CCmd_Data_readdword, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setcmdinfo", js_CCmd_Data_CCmd_Data_setcmdinfo, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushdword", js_CCmd_Data_CCmd_Data_pushdword, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushint64", js_CCmd_Data_CCmd_Data_pushint64, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readstring", js_CCmd_Data_CCmd_Data_readstring, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setmaxsize", js_CCmd_Data_CCmd_Data_setmaxsize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushstring", js_CCmd_Data_CCmd_Data_pushstring, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushshort", js_CCmd_Data_CCmd_Data_pushshort, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readbool", js_CCmd_Data_CCmd_Data_readbool, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readdouble", js_CCmd_Data_CCmd_Data_readdouble, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushint", js_CCmd_Data_CCmd_Data_pushint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDataSize", js_CCmd_Data_CCmd_Data_getDataSize, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDataBuffer", js_CCmd_Data_CCmd_Data_getDataBuffer, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readword", js_CCmd_Data_CCmd_Data_readword, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("cleanData", js_CCmd_Data_CCmd_Data_cleanData, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushword", js_CCmd_Data_CCmd_Data_pushword, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("readbyte", js_CCmd_Data_CCmd_Data_readbyte, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pushfloat", js_CCmd_Data_CCmd_Data_pushfloat, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getsub", js_CCmd_Data_CCmd_Data_getsub, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_CCmd_Data_CCmd_Data_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_CCmd_Data_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_CCmd_Data_class,
        js_CCmd_Data_CCmd_Data_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_CCmd_Data_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "CCmd_Data"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<CCmd_Data>(cx, jsb_CCmd_Data_class, proto, JS::NullPtr());
}

void register_all_CCmd_Data(JSContext* cx, JS::HandleObject obj) {
    // Get the global ns
    JS::RootedObject ns(cx, ScriptingCore::getInstance()->getGlobalObject());

    js_register_CCmd_Data_CCmd_Data(cx, ns);
}

