//
//  CCUDPSocket.cpp
//  NiuNiuGame
//
//  Created by anxijun on 16/4/19.
//
//

#include "CCUDPSocket.h"


using namespace cocos2d;



//////////////////////////////////////////////////////////////////////////

//构造函数
CUDPSocketRecvThread::CUDPSocketRecvThread(void)
{
    m_hListenSocket = INVALID_SOCKET;
    m_pDelegate = NULL;
}

//析构函数
CUDPSocketRecvThread::~CUDPSocketRecvThread(void)
{
}

//配置函数
bool CUDPSocketRecvThread::InitThread(SOCKET hListenSocket, CCUDPSocketDelegate * pDelegate)
{
    assert(pDelegate != NULL);
    assert(hListenSocket != INVALID_SOCKET);
    m_hListenSocket = hListenSocket;
    m_pDelegate = pDelegate;
    return true;
}

//运行函数
bool CUDPSocketRecvThread::OnEventThreadRun()
{
    //效验参数
    assert(m_pDelegate != NULL);
    assert(m_hListenSocket != 0);
    
    // 广播地址
    struct sockaddr_in from;
    bzero(&from, sizeof(struct sockaddr_in));
    from.sin_family = AF_INET;
    from.sin_addr.s_addr = htonl(INADDR_ANY);
    from.sin_port = htons(7773);
    
    int len = sizeof(sockaddr_in);
    
    LanGameServerInfo gameServerInfo;
    ZeroMemory(&gameServerInfo, sizeof(tagGameServer));
    
    //从广播地址接受消息
    ssize_t ret=recvfrom(m_hListenSocket, &gameServerInfo, 256, 0, (struct sockaddr*)&from,(socklen_t*)&len);
    if(ret<=0)
    {
        CCLOG("read error.... %d",m_hListenSocket);
        return false;
    }
    else
    {
        struct timeval current;
        gettimeofday(&current, NULL);
        gameServerInfo.dwSendTime = (DWORD)current.tv_sec;
        CopyMemory(gameServerInfo.szServerAddr,inet_ntoa(from.sin_addr),sizeof(gameServerInfo.szServerAddr));
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([=]{
            if (m_pDelegate)
            {
                m_pDelegate->recvServerMessage(&gameServerInfo);
            }
        });
    }
    
    return true;
}

///////////////////////////////////////////////////////////////////////

CCUDPSocket::CCUDPSocket()
{
    m_uSocket = -1;
    m_bRunSchedule  = false;
}

CCUDPSocket::~CCUDPSocket()
{
    
}


CCUDPSocket* CCUDPSocket::create()
{
    CCUDPSocket *ret = new CCUDPSocket();
    if (ret && ret->init())
    {
        ret->autorelease();
    }
    
    return ret;
}

bool CCUDPSocket::init()
{
    setvbuf(stdout, NULL, _IONBF, 0);
    fflush(stdout);
    
    // 绑定地址
    struct sockaddr_in addrto;
    bzero(&addrto, sizeof(struct sockaddr_in));
    addrto.sin_family = AF_INET;
    addrto.sin_addr.s_addr = htonl(INADDR_ANY);
    addrto.sin_port = htons(7773);
    
    if ((m_uSocket = socket(AF_INET, SOCK_DGRAM, 0)) == -1)
    {
        CCLOG("socket error");
        return false;
    }
    
    const int opt = 1;
    //设置该套接字为广播类型，
    int nb = 0;
    nb = setsockopt(m_uSocket, SOL_SOCKET, SO_BROADCAST, (char *)&opt, sizeof(opt));
    if(nb == -1)
    {
        CCLOG("set socket error...");
        return false;
    }
    
    if(bind(m_uSocket,(struct sockaddr *)&(addrto), sizeof(struct sockaddr_in)) == -1)
    {
        CCLOG("bind error...");
        return false;
    }
    
    
    return true;
}

void CCUDPSocket::StartService()
{
    assert(delegate != nullptr);
    
    m_socketRecvThread.InitThread(m_uSocket, delegate);
    m_socketRecvThread.StartThread();
}


void CCUDPSocket::StopService()
{
    m_socketRecvThread.ConcludeThread();
}



