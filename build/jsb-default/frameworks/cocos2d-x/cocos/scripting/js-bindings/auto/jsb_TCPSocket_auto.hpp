#include "base/ccConfig.h"
#ifndef __TCPSocket_h__
#define __TCPSocket_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_CTCPSocket_class;
extern JSObject *jsb_CTCPSocket_prototype;

bool js_TCPSocket_CTCPSocket_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_TCPSocket_CTCPSocket_finalize(JSContext *cx, JSObject *obj);
void js_register_TCPSocket_CTCPSocket(JSContext *cx, JS::HandleObject global);
void register_all_TCPSocket(JSContext* cx, JS::HandleObject obj);
bool js_TCPSocket_CTCPSocket_connetfaildDeal(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getConnectType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_CrevasseBuffer(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_setTcpSink(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_onConnected(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_setwPort(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getHeartTime(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_threadCreate(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_socketRecv(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_socketConnect(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getEntry(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_setNoMessageTime(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_OnMessageRead(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getConnect(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getwPort(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getNoMessageTime(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_SendData(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_socketSend(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_socketClose(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_setConnectType(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_OnConnectFaild(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getLoop(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_setEntry(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getSocket(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_getDomain(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_setHeartTime(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_threadClosed(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_setDomain(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_onConnectTimeout(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_EncryptBuffer(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_OnConnectKickOut(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_RecvDataUpdate(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_handle_quit(JSContext *cx, uint32_t argc, jsval *vp);
bool js_TCPSocket_CTCPSocket_CTCPSocket(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __TCPSocket_h__
