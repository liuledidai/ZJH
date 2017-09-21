#include "scripting/js-bindings/auto/jsb_JCBridge_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "JCBridge.h"

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
JSClass  *jsb_JCBridge_class;
JSObject *jsb_JCBridge_prototype;

bool js_JCBridge_JCBridge_callJS(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        bool arg2;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        arg2 = JS::ToBoolean(args.get(2));
        JSB_PRECONDITION2(ok, cx, false, "js_JCBridge_JCBridge_callJS : Error processing arguments");
        JCBridge::callJS(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_JCBridge_JCBridge_callJS : wrong number of arguments");
    return false;
}

bool js_JCBridge_JCBridge_callNative(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_JCBridge_JCBridge_callNative : Error processing arguments");

        std::string ret = JCBridge::callNative(arg0, arg1);
        jsval jsret = JSVAL_NULL;
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "js_JCBridge_JCBridge_callNative : wrong number of arguments");
    return false;
}

bool js_JCBridge_JCBridge_setJSCallback(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 1) {
        std::function<void (std::basic_string<char>, std::basic_string<char>, bool)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(0), args.thisv()));
		        auto lambda = [=](std::basic_string<char> larg0, std::basic_string<char> larg1, bool larg2) -> void {
		            JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
		            jsval largv[3];
		            largv[0] = std_string_to_jsval(cx, larg0);
		            largv[1] = std_string_to_jsval(cx, larg1);
		            largv[2] = BOOLEAN_TO_JSVAL(larg2);
		            JS::RootedValue rval(cx);
		            bool succeed = func->invoke(JS::HandleValueArray::fromMarkedLocation(3, largv), &rval);
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
        JSB_PRECONDITION2(ok, cx, false, "js_JCBridge_JCBridge_setJSCallback : Error processing arguments");
        JCBridge::setJSCallback(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_JCBridge_JCBridge_setJSCallback : wrong number of arguments");
    return false;
}

bool js_JCBridge_JCBridge_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JCBridge* cobj = new (std::nothrow) JCBridge();

    js_type_class_t *typeClass = js_get_type_from_native<JCBridge>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_create_weak_jsobject(cx, cobj, typeClass, "JCBridge"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}


void js_JCBridge_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (JCBridge)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    jsproxy = jsb_get_js_proxy(jsobj);
    if (jsproxy) {
        JCBridge *nobj = static_cast<JCBridge *>(jsproxy->ptr);
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
void js_register_JCBridge_JCBridge(JSContext *cx, JS::HandleObject global) {
    jsb_JCBridge_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_JCBridge_class->name = "JCBridge";
    jsb_JCBridge_class->addProperty = JS_PropertyStub;
    jsb_JCBridge_class->delProperty = JS_DeletePropertyStub;
    jsb_JCBridge_class->getProperty = JS_PropertyStub;
    jsb_JCBridge_class->setProperty = JS_StrictPropertyStub;
    jsb_JCBridge_class->enumerate = JS_EnumerateStub;
    jsb_JCBridge_class->resolve = JS_ResolveStub;
    jsb_JCBridge_class->convert = JS_ConvertStub;
    jsb_JCBridge_class->finalize = js_JCBridge_finalize;
    jsb_JCBridge_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("callJS", js_JCBridge_JCBridge_callJS, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("callNative", js_JCBridge_JCBridge_callNative, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setJSCallback", js_JCBridge_JCBridge_setJSCallback, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_JCBridge_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_JCBridge_class,
        js_JCBridge_JCBridge_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_JCBridge_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "JCBridge"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<JCBridge>(cx, jsb_JCBridge_class, proto, JS::NullPtr());
}

void register_all_JCBridge(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "nati", &ns);

    js_register_JCBridge_JCBridge(cx, ns);
}

