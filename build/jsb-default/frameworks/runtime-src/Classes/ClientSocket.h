//
//  ClientSocket.h
//  ZJHGAME
//
//  Created by leeliu on 2017/5/24.
//
//

#ifndef ClientSocket_h
#define ClientSocket_h

#include <stdio.h>
#include "cocos2d.h"
#include "Game/NetWork/cocos-net.h"
#include "CCmd_Data.h"
class ClientSocket : public cocos2d::Node , public ISocketSink
{
//    instance variables
    
public:
//    <#member functions#>
    ClientSocket();
    ~ClientSocket();
//    bool init();
    bool ConnectSocket(const char* ip, WORD wPort);
    void releaseSocket();
    void sendSocketData(CCmd_Data* cmd_data);
    static ClientSocket* createSocket(const std::function<void (const CCmd_Data*)> callback);

public:
    virtual bool OnMessageRead(Ref* pSender,CMD_Command cmd,void *pData,WORD wDataSize);
    virtual void OnConnected(Ref* pSender);
    virtual void OnConnectTimeout(Ref* pSender);
    virtual void OnConnectFaild(Ref* pSender);
    virtual void OnConnectKickOut(Ref* pSender);
private:
    CTCPSocket  * m_Socket;
    std::function<void(const CCmd_Data*)> m_callback;
    
};

#endif /* ClientSocket_h */
