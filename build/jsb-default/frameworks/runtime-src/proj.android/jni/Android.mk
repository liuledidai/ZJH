LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

FILE_LIST := hellojavascript/main.cpp
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/libs/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/libs/Platform/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/libs/JsonBox/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/libs/JsonBox/include/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/libs/JsonBox/include/JsonBox/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/libs/JsonBox/src/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Game/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Game/Common/*.cpp)
FILE_LIST += $(wildcard $(LOCAL_PATH)/../../Classes/Game/NetWork/*.cpp)

LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)

# LOCAL_SRC_FILES

LOCAL_CPPFLAGS := -DSDKBOX_ENABLED \
-DSDKBOX_COCOS_CREATOR
LOCAL_LDLIBS := -landroid \
-llog
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes
# LOCAL_C_INCLUDES
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/libs
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/libs/JsonBox
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/libs/JsonBox/include
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/libs/JsonBox/include/JsonBox
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/libs/JsonBox/src
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/Game
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/Game/Common
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../Classes/Game/NetWork

LOCAL_STATIC_LIBRARIES := cocos2d_js_static
LOCAL_WHOLE_STATIC_LIBRARIES := PluginProtocolStatic \
PluginIAP \
sdkbox

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 \
-DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)
$(call import-add-path, $(LOCAL_PATH))


$(call import-module, scripting/js-bindings/proj.android)
$(call import-module, ./sdkbox)
$(call import-module, ./pluginiap)
