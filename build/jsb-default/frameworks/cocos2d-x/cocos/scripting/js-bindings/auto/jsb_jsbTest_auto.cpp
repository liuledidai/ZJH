#include "scripting/js-bindings/auto/jsb_jsbTest_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "jsbTest.h"

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
JSClass  *jsb_jsbTest_class;
JSObject *jsb_jsbTest_prototype;

bool js_jsbTest_jsbTest_testlog(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        jsbTest::testlog();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_jsbTest_jsbTest_testlog : wrong number of arguments");
    return false;
}


void js_register_jsbTest_jsbTest(JSContext *cx, JS::HandleObject global) {
    jsb_jsbTest_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_jsbTest_class->name = "jsbTest";
    jsb_jsbTest_class->addProperty = JS_PropertyStub;
    jsb_jsbTest_class->delProperty = JS_DeletePropertyStub;
    jsb_jsbTest_class->getProperty = JS_PropertyStub;
    jsb_jsbTest_class->setProperty = JS_StrictPropertyStub;
    jsb_jsbTest_class->enumerate = JS_EnumerateStub;
    jsb_jsbTest_class->resolve = JS_ResolveStub;
    jsb_jsbTest_class->convert = JS_ConvertStub;
    jsb_jsbTest_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("testlog", js_jsbTest_jsbTest_testlog, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_jsbTest_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_jsbTest_class,
        dummy_constructor<jsbTest>, 0, // no constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_jsbTest_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "jsbTest"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<jsbTest>(cx, jsb_jsbTest_class, proto, JS::NullPtr());
}

void register_all_jsbTest(JSContext* cx, JS::HandleObject obj) {
    // Get the global ns
    JS::RootedObject ns(cx, ScriptingCore::getInstance()->getGlobalObject());

    js_register_jsbTest_jsbTest(cx, ns);
}

