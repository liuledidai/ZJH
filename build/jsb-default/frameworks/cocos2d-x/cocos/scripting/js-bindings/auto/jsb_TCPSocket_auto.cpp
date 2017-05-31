#include "scripting/js-bindings/auto/jsb_TCPSocket_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "CTCPSocket.h"

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
JSClass  *jsb_CTCPSocket_class;
JSObject *jsb_CTCPSocket_prototype;

bool js_TCPSocket_CTCPSocket_connetfaildDeal(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_connetfaildDeal : Invalid Native Object");
    if (argc == 0) {
        cobj->connetfaildDeal();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_connetfaildDeal : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_getConnectType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getConnectType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getConnectType();
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getConnectType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_CrevasseBuffer(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_CrevasseBuffer : Invalid Native Object");
    if (argc == 2) {
        void* arg0 = nullptr;
        unsigned short arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;
        ok &= jsval_to_ushort(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_CrevasseBuffer : Error processing arguments");
        bool ret = cobj->CrevasseBuffer(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_CrevasseBuffer : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_TCPSocket_CTCPSocket_setTcpSink(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_setTcpSink : Invalid Native Object");
    if (argc == 1) {
        ISocketSink* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR ISocketSink*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_setTcpSink : Error processing arguments");
        cobj->setTcpSink(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_setTcpSink : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_onConnected(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_onConnected : Invalid Native Object");
    if (argc == 0) {
        cobj->onConnected();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_onConnected : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_setwPort(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_setwPort : Invalid Native Object");
    if (argc == 1) {
        unsigned short arg0 = 0;
        ok &= jsval_to_ushort(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_setwPort : Error processing arguments");
        cobj->setwPort(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_setwPort : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_getHeartTime(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getHeartTime : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getHeartTime();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getHeartTime : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_threadCreate(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_threadCreate : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->threadCreate();
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_threadCreate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_socketRecv(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_socketRecv : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->socketRecv();
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_socketRecv : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_socketConnect(JSContext *cx, uint32_t argc, jsval *vp)
{
    CTCPSocket* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (CTCPSocket *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_socketConnect : Invalid Native Object");
    do {
        if (argc == 0) {
            bool ret = cobj->socketConnect();
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 2) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            unsigned short arg1 = 0;
            ok &= jsval_to_ushort(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->socketConnect(arg0, arg1);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_socketConnect : wrong number of arguments");
    return false;
}
bool js_TCPSocket_CTCPSocket_getEntry(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getEntry : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getEntry();
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getEntry : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_setNoMessageTime(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_setNoMessageTime : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_setNoMessageTime : Error processing arguments");
        cobj->setNoMessageTime(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_setNoMessageTime : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_OnMessageRead(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_OnMessageRead : Invalid Native Object");
    if (argc == 3) {
        CMD_Command arg0;
        void* arg1 = nullptr;
        unsigned short arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR CMD_Command
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;
        ok &= jsval_to_ushort(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_OnMessageRead : Error processing arguments");
        cobj->OnMessageRead(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_OnMessageRead : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_TCPSocket_CTCPSocket_getConnect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getConnect : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getConnect();
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getConnect : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_getwPort(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getwPort : Invalid Native Object");
    if (argc == 0) {
        unsigned short ret = cobj->getwPort();
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getwPort : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_getNoMessageTime(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getNoMessageTime : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getNoMessageTime();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getNoMessageTime : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_SendData(JSContext *cx, uint32_t argc, jsval *vp)
{
    CTCPSocket* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (CTCPSocket *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_SendData : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 4) {
            unsigned short arg0 = 0;
            ok &= jsval_to_ushort(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            unsigned short arg1 = 0;
            ok &= jsval_to_ushort(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            void* arg2 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR void*
			ok = false;
            if (!ok) { ok = true; break; }
            unsigned short arg3 = 0;
            ok &= jsval_to_ushort(cx, args.get(3), &arg3);
            if (!ok) { ok = true; break; }
            bool ret = cobj->SendData(arg0, arg1, arg2, arg3);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 2) {
            unsigned short arg0 = 0;
            ok &= jsval_to_ushort(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            unsigned short arg1 = 0;
            ok &= jsval_to_ushort(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->SendData(arg0, arg1);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_SendData : wrong number of arguments");
    return false;
}
bool js_TCPSocket_CTCPSocket_socketSend(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_socketSend : Invalid Native Object");
    if (argc == 2) {
        char* arg0 = nullptr;
        unsigned short arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_ushort(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_socketSend : Error processing arguments");
        bool ret = cobj->socketSend(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_socketSend : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_TCPSocket_CTCPSocket_socketClose(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_socketClose : Invalid Native Object");
    if (argc == 0) {
        cobj->socketClose();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_socketClose : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_setConnectType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_setConnectType : Invalid Native Object");
    if (argc == 1) {
        ConnectType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_setConnectType : Error processing arguments");
        cobj->setConnectType(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_setConnectType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_OnConnectFaild(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_OnConnectFaild : Invalid Native Object");
    if (argc == 0) {
        cobj->OnConnectFaild();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_OnConnectFaild : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_getLoop(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getLoop : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getLoop();
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getLoop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_setEntry(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_setEntry : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_setEntry : Error processing arguments");
        cobj->setEntry(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_setEntry : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_getSocket(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getSocket : Invalid Native Object");
    if (argc == 0) {
        CBSDSocket* ret = cobj->getSocket();
        JS::RootedValue jsret(cx);
        if (ret) {
            jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<CBSDSocket>(cx, (CBSDSocket*)ret));
        } else {
            jsret = JSVAL_NULL;
        };
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getSocket : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_getDomain(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_getDomain : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getDomain();
        JS::RootedValue jsret(cx);
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_getDomain : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_setHeartTime(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_setHeartTime : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_setHeartTime : Error processing arguments");
        cobj->setHeartTime(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_setHeartTime : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_threadClosed(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_threadClosed : Invalid Native Object");
    if (argc == 0) {
        cobj->threadClosed();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_threadClosed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_setDomain(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_setDomain : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_setDomain : Error processing arguments");
        cobj->setDomain(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_setDomain : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_onConnectTimeout(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_onConnectTimeout : Invalid Native Object");
    if (argc == 0) {
        cobj->onConnectTimeout();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_onConnectTimeout : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_EncryptBuffer(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_EncryptBuffer : Invalid Native Object");
    if (argc == 2) {
        void* arg0 = nullptr;
        unsigned short arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;
        ok &= jsval_to_ushort(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_EncryptBuffer : Error processing arguments");
        unsigned short ret = cobj->EncryptBuffer(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = ushort_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_EncryptBuffer : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_TCPSocket_CTCPSocket_OnConnectKickOut(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_OnConnectKickOut : Invalid Native Object");
    if (argc == 0) {
        cobj->OnConnectKickOut();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_OnConnectKickOut : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_TCPSocket_CTCPSocket_RecvDataUpdate(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    CTCPSocket* cobj = (CTCPSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_TCPSocket_CTCPSocket_RecvDataUpdate : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_RecvDataUpdate : Error processing arguments");
        cobj->RecvDataUpdate(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_RecvDataUpdate : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_TCPSocket_CTCPSocket_handle_quit(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_TCPSocket_CTCPSocket_handle_quit : Error processing arguments");
        CTCPSocket::handle_quit(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_TCPSocket_CTCPSocket_handle_quit : wrong number of arguments");
    return false;
}

bool js_TCPSocket_CTCPSocket_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    CTCPSocket* cobj = new (std::nothrow) CTCPSocket();

    js_type_class_t *typeClass = js_get_type_from_native<CTCPSocket>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "CTCPSocket"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}


extern JSObject *jsb_cocos2d_Ref_prototype;

void js_register_TCPSocket_CTCPSocket(JSContext *cx, JS::HandleObject global) {
    jsb_CTCPSocket_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_CTCPSocket_class->name = "CTCPSocket";
    jsb_CTCPSocket_class->addProperty = JS_PropertyStub;
    jsb_CTCPSocket_class->delProperty = JS_DeletePropertyStub;
    jsb_CTCPSocket_class->getProperty = JS_PropertyStub;
    jsb_CTCPSocket_class->setProperty = JS_StrictPropertyStub;
    jsb_CTCPSocket_class->enumerate = JS_EnumerateStub;
    jsb_CTCPSocket_class->resolve = JS_ResolveStub;
    jsb_CTCPSocket_class->convert = JS_ConvertStub;
    jsb_CTCPSocket_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("connetfaildDeal", js_TCPSocket_CTCPSocket_connetfaildDeal, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getConnectType", js_TCPSocket_CTCPSocket_getConnectType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("CrevasseBuffer", js_TCPSocket_CTCPSocket_CrevasseBuffer, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTcpSink", js_TCPSocket_CTCPSocket_setTcpSink, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onConnected", js_TCPSocket_CTCPSocket_onConnected, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setwPort", js_TCPSocket_CTCPSocket_setwPort, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getHeartTime", js_TCPSocket_CTCPSocket_getHeartTime, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("threadCreate", js_TCPSocket_CTCPSocket_threadCreate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("socketRecv", js_TCPSocket_CTCPSocket_socketRecv, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("socketConnect", js_TCPSocket_CTCPSocket_socketConnect, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getEntry", js_TCPSocket_CTCPSocket_getEntry, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setNoMessageTime", js_TCPSocket_CTCPSocket_setNoMessageTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("OnMessageRead", js_TCPSocket_CTCPSocket_OnMessageRead, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getConnect", js_TCPSocket_CTCPSocket_getConnect, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getwPort", js_TCPSocket_CTCPSocket_getwPort, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getNoMessageTime", js_TCPSocket_CTCPSocket_getNoMessageTime, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SendData", js_TCPSocket_CTCPSocket_SendData, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("socketSend", js_TCPSocket_CTCPSocket_socketSend, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("socketClose", js_TCPSocket_CTCPSocket_socketClose, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setConnectType", js_TCPSocket_CTCPSocket_setConnectType, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("OnConnectFaild", js_TCPSocket_CTCPSocket_OnConnectFaild, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLoop", js_TCPSocket_CTCPSocket_getLoop, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setEntry", js_TCPSocket_CTCPSocket_setEntry, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSocket", js_TCPSocket_CTCPSocket_getSocket, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDomain", js_TCPSocket_CTCPSocket_getDomain, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setHeartTime", js_TCPSocket_CTCPSocket_setHeartTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("threadClosed", js_TCPSocket_CTCPSocket_threadClosed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDomain", js_TCPSocket_CTCPSocket_setDomain, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onConnectTimeout", js_TCPSocket_CTCPSocket_onConnectTimeout, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("EncryptBuffer", js_TCPSocket_CTCPSocket_EncryptBuffer, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("OnConnectKickOut", js_TCPSocket_CTCPSocket_OnConnectKickOut, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RecvDataUpdate", js_TCPSocket_CTCPSocket_RecvDataUpdate, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("handle_quit", js_TCPSocket_CTCPSocket_handle_quit, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Ref_prototype);
    jsb_CTCPSocket_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_CTCPSocket_class,
        js_TCPSocket_CTCPSocket_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_CTCPSocket_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "CTCPSocket"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<CTCPSocket>(cx, jsb_CTCPSocket_class, proto, parent_proto);
}

void register_all_TCPSocket(JSContext* cx, JS::HandleObject obj) {
    // Get the global ns
    JS::RootedObject ns(cx, ScriptingCore::getInstance()->getGlobalObject());

    js_register_TCPSocket_CTCPSocket(cx, ns);
}

