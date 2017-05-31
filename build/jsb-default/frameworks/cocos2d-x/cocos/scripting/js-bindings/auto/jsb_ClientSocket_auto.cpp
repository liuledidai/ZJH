#include "scripting/js-bindings/auto/jsb_ClientSocket_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "ClientSocket.h"

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
JSClass  *jsb_ClientSocket_class;
JSObject *jsb_ClientSocket_prototype;

bool js_ClientSocket_ClientSocket_releaseSocket(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    ClientSocket* cobj = (ClientSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_ClientSocket_ClientSocket_releaseSocket : Invalid Native Object");
    if (argc == 0) {
        cobj->releaseSocket();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_ClientSocket_ClientSocket_releaseSocket : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_ClientSocket_ClientSocket_sendSocketData(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    ClientSocket* cobj = (ClientSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_ClientSocket_ClientSocket_sendSocketData : Invalid Native Object");
    if (argc == 1) {
        CCmd_Data* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (CCmd_Data*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_ClientSocket_ClientSocket_sendSocketData : Error processing arguments");
        cobj->sendSocketData(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_ClientSocket_ClientSocket_sendSocketData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_ClientSocket_ClientSocket_ConnectSocket(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    ClientSocket* cobj = (ClientSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_ClientSocket_ClientSocket_ConnectSocket : Invalid Native Object");
    if (argc == 2) {
        const char* arg0 = nullptr;
        unsigned short arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_ushort(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_ClientSocket_ClientSocket_ConnectSocket : Error processing arguments");
        cobj->ConnectSocket(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_ClientSocket_ClientSocket_ConnectSocket : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_ClientSocket_ClientSocket_createSocket(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 1) {
        std::function<void (const CCmd_Data *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
		        auto lambda = [=](const CCmd_Data* larg0) -> void {
		            JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
		            jsval largv[1];
		            if (larg0) {
		            largv[0] = OBJECT_TO_JSVAL(js_get_or_create_jsobject<CCmd_Data>(cx, (CCmd_Data*)larg0));
		        } else {
		            largv[0] = JSVAL_NULL;
		        };
		            JS::RootedValue rval(cx);
		            bool succeed = func->invoke(JS::HandleValueArray::fromMarkedLocation(1, largv), &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                JS_ReportPendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_ClientSocket_ClientSocket_createSocket : Error processing arguments");

        auto ret = ClientSocket::createSocket(arg0);
        js_type_class_t *typeClass = js_get_type_from_native<ClientSocket>(ret);
        JS::RootedObject jsret(cx, jsb_ref_autoreleased_create_jsobject(cx, ret, typeClass, "ClientSocket"));
        args.rval().set(OBJECT_TO_JSVAL(jsret));
        return true;
    }
    JS_ReportError(cx, "js_ClientSocket_ClientSocket_createSocket : wrong number of arguments");
    return false;
}

bool js_ClientSocket_ClientSocket_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    ClientSocket* cobj = new (std::nothrow) ClientSocket();

    js_type_class_t *typeClass = js_get_type_from_native<ClientSocket>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "ClientSocket"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}


extern JSObject *jsb_cocos2d_Node_prototype;

void js_register_ClientSocket_ClientSocket(JSContext *cx, JS::HandleObject global) {
    jsb_ClientSocket_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_ClientSocket_class->name = "ClientSocket";
    jsb_ClientSocket_class->addProperty = JS_PropertyStub;
    jsb_ClientSocket_class->delProperty = JS_DeletePropertyStub;
    jsb_ClientSocket_class->getProperty = JS_PropertyStub;
    jsb_ClientSocket_class->setProperty = JS_StrictPropertyStub;
    jsb_ClientSocket_class->enumerate = JS_EnumerateStub;
    jsb_ClientSocket_class->resolve = JS_ResolveStub;
    jsb_ClientSocket_class->convert = JS_ConvertStub;
    jsb_ClientSocket_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("releaseSocket", js_ClientSocket_ClientSocket_releaseSocket, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("sendSocketData", js_ClientSocket_ClientSocket_sendSocketData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ConnectSocket", js_ClientSocket_ClientSocket_ConnectSocket, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("createSocket", js_ClientSocket_ClientSocket_createSocket, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype);
    jsb_ClientSocket_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_ClientSocket_class,
        js_ClientSocket_ClientSocket_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_ClientSocket_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "ClientSocket"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<ClientSocket>(cx, jsb_ClientSocket_class, proto, parent_proto);
}

void register_all_ClientSocket(JSContext* cx, JS::HandleObject obj) {
    // Get the global ns
    JS::RootedObject ns(cx, ScriptingCore::getInstance()->getGlobalObject());

    js_register_ClientSocket_ClientSocket(cx, ns);
}

