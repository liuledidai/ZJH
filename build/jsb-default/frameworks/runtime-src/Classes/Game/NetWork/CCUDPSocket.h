//
//  CCUDPSocket.h
//  NiuNiuGame
//
//  Created by anxijun on 16/4/19.
//
//

#ifndef CCUDPSocket_h
#define CCUDPSocket_h

#include "cocos2d.h"
#include "CCNetMacros.h"
#include <string>
#include "../Classes/Game/Common/GlobalDef.h"
#include "../Classes/Game/KernelEngine/ServiceThread.h"


//////////////////////////////////////////////////////////////////////////

class CCUDPSocketDelegate;
//应答线程对象
class CUDPSocketRecvThread : public CServiceThread
{
    //变量定义
protected:
    SOCKET                           m_hListenSocket;					//监听连接
    CCUDPSocketDelegate*             m_pDelegate;
    //函数定义
public:
    //构造函数
    CUDPSocketRecvThread(void);
    //析构雨杰高科www.cnyjwl.com函数
    virtual ~CUDPSocketRecvThread(void);
    
    //功能函雨杰高科www.cnyjwl.com数
public:
    //配置函数
    bool InitThread(SOCKET hListenSocket, CCUDPSocketDelegate * pUDPSocket);
    
    //重载函数
private:
    //运行函数
    virtual bool OnEventThreadRun();
};

//////////////////////////////////////////////////////////////////////////


class CCUDPSocketDelegate {
    
public:
    virtual void recvServerMessage(const LanGameServerInfo* pGameServer) = 0;
};

class CCUDPSocket : public cocos2d::Ref
{
public:
    CCUDPSocket();
    virtual ~CCUDPSocket();
    
    
    static CCUDPSocket* create();
    
    virtual bool init();

    void StartService();
    void StopService();
    
public:
    CCUDPSocketDelegate*   delegate;
    
protected:
    CUDPSocketRecvThread    m_socketRecvThread;
    SOCKET                  m_uSocket;
    bool                    m_bRunSchedule;
};

#endif /* CCUDPSocket_h */
