//
//  CTCPSocket.cpp
//  NiuNiuGame
//
//  Created by anxijun on 16/7/25.
//
//

#include "CTCPSocket.h"
#include "SocketRecvData.h"

static volatile bool s_bCloseSocket = false;

void CTCPSocket::handle_quit(int signo)
{
    log("in qq handle sig %d \n",signo);
#if(CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    pthread_exit(NULL);
#endif
}

//线程接收函数
void *threadSocketRecv(void* param)
{
    signal(1,CTCPSocket::handle_quit);
  
    //接收消息
    CTCPSocket* socket=(CTCPSocket*)param;
    if (nullptr == socket)
    {
        return 0;
    }

    int count = socket->getReferenceCount();
    if (0 == count)
    {
        return 0;
    }
    
    while(socket->getLoop())
    {
        if (socket->getConnectType() == unConnect)
        {
            socket->setConnectType(Connecting);
            std::string sdomain(socket->getDomain());
            CCLOG("网络连接地址 %s",socket->getDomain().c_str());
            bool ret = socket->getSocket()->Connect(socket->getDomain().c_str(), socket->getwPort());
            if (ret == true)
            {
                socket->setHeartTime(0.f);
                socket->setConnectType(ConnectFinished);
            }
            else
            {
                CCLOG("连接服务器失败");
                socket->setConnectType(Connect_Faild);
                break;
            }
        }
        else if(socket->getConnectType() == Connected)
        {
            if (!socket->socketRecv())
            {
                break;
            }
        }
        sleep(1.0/60.0f);
    }
    
    pthread_exit(NULL);
    
    return 0;
}

CTCPSocket::CTCPSocket()
:m_heartTime(0.f)
,m_connecttype(unConnect),m_NoMessageTime(0.f),m_bAfterSend(false)
{
    m_cbSendRound = 0;
    m_cbRecvRound = 0;
    m_dwSendXorKey = 0;
    m_dwRecvXorKey = 0;
    m_dwSendPacketCount = 0;
    m_dwRecvPacketCount = 0;
    
    m_bEntry = true;

    m_wSize = 0;
    m_pSink = nullptr;
    memset(m_pData, 0, sizeof(m_pData));
}


CTCPSocket::~CTCPSocket()
{
    m_recvdataQueue.clear();
    
}

void CTCPSocket::setTcpSink( ISocketSink *pSink )
{
    if (pSink ==NULL)
    {
        CCLOG("It's not make sence,tcpsink = nil");
    }
    m_pSink = pSink;
}

bool CTCPSocket::socketConnect(const char *domain, WORD wPort)
{
    m_domain = domain;
    m_wport = wPort;

    return socketConnect();
}

bool CTCPSocket::socketConnect()
{
    assert(m_domain.size() > 0 && m_wport!=0);
    
    m_hThread = 0;
    m_bLoop = true;
    m_bConnect = false;
    m_pSocket = NULL;
    
    m_cbSendRound = 0;
    m_cbRecvRound = 0;
    m_dwSendXorKey = 0x12345678;
    m_dwRecvXorKey = 0x12345678;
    
    m_NoMessageTime = 0;
    
    m_pSocket = new CBSDSocket();
    m_pSocket->Init();
    
    s_bCloseSocket = false;
    
    m_bAfterSend = false;
    
    memset(m_pData, 0, sizeof(m_pData));

    this->threadCreate();
    
    Director::getInstance()->getScheduler()->schedule(CC_SCHEDULE_SELECTOR(CTCPSocket::RecvDataUpdate), this, 0, false);
    return true;
}


void CTCPSocket::RecvDataUpdate(float time)
{
    int type = m_connecttype;
    if (type == unConnect) {
        return;
    }
    if (type == Connecting) {
        m_heartTime += time;
        if (m_heartTime > 30.f) {
            Director::getInstance()->getScheduler()->unschedule(CC_SCHEDULE_SELECTOR(CTCPSocket::RecvDataUpdate), this);
            this->socketClose();
            onConnectTimeout();
        }
        
        return;
    }
    if (type == Connect_Faild) {
        Director::getInstance()->getScheduler()->unschedule(CC_SCHEDULE_SELECTOR(CTCPSocket::RecvDataUpdate), this);
        this->socketClose();
        OnConnectFaild();
        return;
    }
    if (type == Connect_Kick_Out) {
        Director::getInstance()->getScheduler()->unschedule(CC_SCHEDULE_SELECTOR(CTCPSocket::RecvDataUpdate), this);
        this->socketClose();
        OnConnectKickOut();
        return;
    }
    if (m_NoMessageTime > 30.f) {
        Director::getInstance()->getScheduler()->unschedule(CC_SCHEDULE_SELECTOR(CTCPSocket::RecvDataUpdate), this);
        this->socketClose();
        OnConnectFaild();
        return;
    }
    
    if (type == ConnectFinished) {
        m_bConnect = true;
        setConnectType(Connected);
        onConnected();
        return;
    }
    //上一帧发送成功后本帧把 m_heartTime 重置,这要只要一端时间不发数据就发心跳包
    sendtimeMutex.lock();
    if (m_bAfterSend) {
        m_heartTime = 0;
        m_bAfterSend = false;
    }
    sendtimeMutex.unlock();
    
    cocos2d::Vector<RecvData *> vectordata;
    RecvData *rdata = NULL;
    recvdatamutex.lock();
    if (!m_recvdataQueue.size()) {
        m_heartTime += time;
        m_NoMessageTime += time;
        recvdatamutex.unlock();
        
        if (m_heartTime > 10) {
            CMD_Buffer	heartBuffer;
            memset(&heartBuffer,0,sizeof(CMD_Buffer));
            heartBuffer.Head.CommandInfo.wMainCmdID	= MDM_KN_COMMAND;
            heartBuffer.Head.CommandInfo.wSubCmdID	= SUB_KN_DETECT_SOCKET;
            this->socketSend((char *)&heartBuffer, sizeof(heartBuffer.Head));
            m_heartTime = 0;
        }
        return;
    }
    else
    {
        vectordata = m_recvdataQueue;
        m_recvdataQueue.clear();
        recvdatamutex.unlock();
        m_NoMessageTime = 0.f;
    }
    while(vectordata.size() != 0) {
        if (m_connecttype == unConnect ||
            m_connecttype == Connect_Faild ||
            m_connecttype == Connect_Kick_Out
            ) break;
        
        rdata = vectordata.at(0);
        if (rdata) {
            int datasize = rdata->getDatasize();
            if (rdata->getdataType() == Send_Data) {
                this->socketSend(rdata->getRecvData(), datasize);
            }
            else
            {
                CMD_Buffer	tcpBuffer;
                memset(&tcpBuffer,0,sizeof(CMD_Buffer));
                CopyMemory(&tcpBuffer, rdata->getRecvData(), datasize);
                
                void* buffer = tcpBuffer.cbBuffer;
                uint size = tcpBuffer.Head.CmdInfo.wPacketSize - sizeof(CMD_Head);
                OnMessageRead(tcpBuffer.Head.CommandInfo,buffer,size);
            }
            vectordata.erase(0);
        }
    }
}

//关闭socket
void CTCPSocket::socketClose()
{
    if (m_connecttype  == unConnect) {
        return;
    }
    m_bConnect = false;
    m_connecttype = unConnect;
    if (m_hThread)
    {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        pthread_cancel(m_hThread);
#endif
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
        pthread_kill(m_hThread,0);
#endif
        m_hThread = 0;
    }
    s_bCloseSocket = true;
    m_bConnect = false;
    
    m_cbSendRound = 0;
    m_cbRecvRound = 0;
    m_dwSendXorKey = 0;
    m_dwRecvXorKey = 0;
    m_dwSendPacketCount = 0;
    m_dwRecvPacketCount = 0;
    
    m_recvdataQueue.clear();
    
    m_bLoop = false;
    m_wSize=0;
    Director::getInstance()->getScheduler()->unschedule(CC_SCHEDULE_SELECTOR(CTCPSocket::RecvDataUpdate), this);
    //关闭socket
    if(m_pSocket)
    {
        m_pSocket->Clean();
        m_pSocket->Close();
        CC_SAFE_DELETE(m_pSocket);
    }
    this->threadClosed();
    
}

//消息接收
bool CTCPSocket::socketRecv()
{
    if (m_pSocket == NULL) {
        return false;
    }
    
    int nSize=m_pSocket->Recv(m_pData+m_wSize, SOCKET_READ_BUFFER_SIZE-m_wSize);
    if (nSize == -1)
    {
        int code=this->getSocket()->GetError();
        CCLOG("GetError:%d",code);
        if (m_pSocket == NULL) {
            return false;
        }
        if (m_connecttype == Connected) {
            connetfaildDeal();
        }
        return false;
    }
    if (nSize == 0) {
        return false;
    }
    
    if(nSize!=0)
    {
        m_wSize += nSize;
    }
    
    //wh协议映射
    if(m_bEntry)
    {
        while ( m_wSize>=sizeof(CMD_Head) )
        {
            //取出前8字节数据
            char headChar[8];
            memset(headChar,0,sizeof(headChar));
            memcpy(headChar,m_pData,8);
            
            //取的数据长度
            CMD_Head* head = (CMD_Head*)headChar;
            WORD wCurSize = head->CmdInfo.wPacketSize;
            
            //长度效验，小于包头 或者 大于当前数据总长度,说明只接收了一半数据，跳出处理
            if( wCurSize<sizeof(CMD_Head) || wCurSize>m_wSize){
                break;
            }
            
            m_dwRecvPacketCount++;
            
            //取的当前长度 开始处理
            char curBuffer[wCurSize];
            
            memset(curBuffer,0,sizeof(curBuffer));
            memcpy(curBuffer,m_pData,wCurSize);
            
            //数据映射
            if( !CrevasseBuffer(curBuffer,wCurSize)){
                CCLOG("数据隐射错误");
                break;
            }
            
            RecvData *rdata = new RecvData(curBuffer, wCurSize);
            recvdatamutex.lock();
            m_recvdataQueue.pushBack(rdata);
            rdata->release();
            recvdatamutex.unlock();
            
            //减去已处理长度
            m_wSize -= wCurSize;
            
            //数据移动
            memmove(m_pData, m_pData+wCurSize, m_wSize);
            
            //跳出判断
            if( m_wSize<sizeof(CMD_Head))
            {
                break;
            }
        }
    }
    return true;
}

 bool CTCPSocket::SendData(WORD wMainCmdID,WORD wSubCmdID)
{
    CMD_Buffer tcp_buffer;
    memset(&tcp_buffer,0,sizeof(CMD_Buffer));
    tcp_buffer.Head.CommandInfo.wMainCmdID=wMainCmdID;
    tcp_buffer.Head.CommandInfo.wSubCmdID=wSubCmdID;

    return socketSend((char*)&tcp_buffer,sizeof(CMD_Head));
}

bool CTCPSocket::SendData(WORD wMainCmdID,WORD wSubCmdID,void* buffer, WORD wSize)
{
    CMD_Buffer tcp_buffer;
    memset(&tcp_buffer,0,sizeof(CMD_Buffer));
    tcp_buffer.Head.CommandInfo.wMainCmdID=wMainCmdID;
    tcp_buffer.Head.CommandInfo.wSubCmdID=wSubCmdID;
    memcpy(&tcp_buffer.cbBuffer,buffer,wSize);
    
    return socketSend((char*)&tcp_buffer,wSize+sizeof(CMD_Head));
}

bool CTCPSocket::socketSend(char* pData, WORD wSize)
{
    //数据大包
    //assert(m_bConnect != false);
    if (m_pSocket == NULL) {
        return false;
    }
    if (m_connecttype == Connect_Kick_Out) {
        return false;
    }
    if (m_connecttype != Connected) {
        RecvData *rdata = new RecvData(pData, wSize);
        rdata->setdataType(Send_Data);
        recvdatamutex.lock();
        m_recvdataQueue.pushBack(rdata);
        rdata->release();
        recvdatamutex.unlock();
        
        return false;
    }
    WORD wSendSize = this->EncryptBuffer(pData, wSize);
    int count = m_pSocket->Send(pData, wSendSize);
    if(count == SOCKET_ERROR)
    {
        this->socketClose();
        this->OnConnectFaild();
    }
    else
    {
        //发送成功的标记一下
        sendtimeMutex.lock();
        m_bAfterSend = true;
        sendtimeMutex.unlock();
    }
    
    return true;
}

//隐射数据
WORD CTCPSocket::EncryptBuffer(void* pData, WORD wDataSize)
{
    BYTE *pcbDataBuffer = (BYTE*)pData;
    //效验参数
    assert(wDataSize>=sizeof(CMD_Head));
    assert(wDataSize<=(sizeof(CMD_Head)+SOCKET_PACKET));
    
    //调整长度
    WORD wEncryptSize=wDataSize-sizeof(CMD_Command),wSnapCount=0;
    if ((wEncryptSize%sizeof(DWORD))!=0)
    {
        wSnapCount=sizeof(DWORD)-wEncryptSize%sizeof(DWORD);
        memset(pcbDataBuffer+sizeof(CMD_Info)+wEncryptSize,0,wSnapCount);
    }
    
    //效验码与字节映射
    BYTE cbCheckCode=0;
    for (WORD i=sizeof(CMD_Info);i<wDataSize;i++)
    {
        cbCheckCode+=pcbDataBuffer[i];
        pcbDataBuffer[i]=mapSendByte(pcbDataBuffer[i]);
    }
    
    //填写信息头
    CMD_Head * pHead=(CMD_Head *)pcbDataBuffer;
    pHead->CmdInfo.cbCheckCode=~cbCheckCode+1;
    pHead->CmdInfo.wPacketSize=wDataSize;
    pHead->CmdInfo.cbVersion=SOCKET_VER;
    
    //创建密钥
    DWORD dwXorKey=m_dwSendXorKey;
    if (m_dwSendPacketCount==0)
    {
        //生成第一次随机种子
        GUID Guid = createGuid();
        dwXorKey=getTickCount()*getTickCount();
        dwXorKey^=Guid.Data1;
        dwXorKey^=Guid.Data2;
        dwXorKey^=Guid.Data3;
        dwXorKey^=*((DWORD *)Guid.Data4);
        
        //随机映射种子
        dwXorKey=seedRandMap((WORD)dwXorKey);
        dwXorKey|=((DWORD)seedRandMap((WORD)(dwXorKey>>16)))<<16;
        dwXorKey^=g_dwPacketKey;
        m_dwSendXorKey=dwXorKey;
        m_dwRecvXorKey=dwXorKey;
    }
    
    //加密数据
    WORD * pwSeed=(WORD *)(pcbDataBuffer+sizeof(CMD_Info));
    DWORD * pdwXor=(DWORD *)(pcbDataBuffer+sizeof(CMD_Info));
    WORD wEncrypCount=(wEncryptSize+wSnapCount)/sizeof(DWORD);
    for (int i=0;i<wEncrypCount;i++)
    {
        *pdwXor++^=dwXorKey;
        dwXorKey=seedRandMap(*pwSeed++);
        dwXorKey|=((DWORD)seedRandMap(*pwSeed++))<<16;
        dwXorKey^=g_dwPacketKey;
    }
    
    //插入密钥
    if (m_dwSendPacketCount==0)
    {
        MoveMemory(pcbDataBuffer+sizeof(CMD_Head)+sizeof(DWORD),pcbDataBuffer+sizeof(CMD_Head),wDataSize);
        *((DWORD *)(pcbDataBuffer+sizeof(CMD_Head)))=m_dwSendXorKey;
        pHead->CmdInfo.wPacketSize+=sizeof(DWORD);
        wDataSize+=sizeof(DWORD);
    }
    
    //设置变量
    m_dwSendPacketCount++;
    m_dwSendXorKey=dwXorKey;
    
    return wDataSize;
}

//隐射数据
bool CTCPSocket::CrevasseBuffer(void* pData, WORD wDataSize)
{
    BYTE* pcbDataBuffer=(BYTE*)pData;
    
    //效验参数
    if (m_dwSendPacketCount <= 0) return false;
    if (wDataSize < sizeof(CMD_Head)) return false;
    if (((CMD_Head *)pcbDataBuffer)->CmdInfo.wPacketSize!=wDataSize) return false;
//    assert(m_dwSendPacketCount>0);
//    assert(wDataSize>=sizeof(CMD_Head));
//    assert(((CMD_Head *)pcbDataBuffer)->CmdInfo.wPacketSize==wDataSize);
    
    //调整长度
    WORD wSnapCount=0;
    if ((wDataSize%sizeof(DWORD))!=0)
    {
        wSnapCount=sizeof(DWORD)-wDataSize%sizeof(DWORD);
        memset(pcbDataBuffer+wDataSize,0,wSnapCount);
    }
    
    //解密数据
    DWORD dwXorKey=m_dwRecvXorKey;
    DWORD * pdwXor=(DWORD *)(pcbDataBuffer+sizeof(CMD_Info));
    WORD  * pwSeed=(WORD *)(pcbDataBuffer+sizeof(CMD_Info));
    WORD wEncrypCount=(wDataSize+wSnapCount-sizeof(CMD_Info))/4;
    for (WORD i=0;i<wEncrypCount;i++)
    {
        if ((i==(wEncrypCount-1))&&(wSnapCount>0))
        {
            BYTE * pcbKey=((BYTE *)&m_dwRecvXorKey)+sizeof(DWORD)-wSnapCount;
            CopyMemory(pcbDataBuffer+wDataSize,pcbKey,wSnapCount);
        }
        dwXorKey=seedRandMap(*pwSeed++);
        dwXorKey|=((DWORD)seedRandMap(*pwSeed++))<<16;
        dwXorKey^=g_dwPacketKey;
        *pdwXor++^=m_dwRecvXorKey;
        m_dwRecvXorKey=dwXorKey;
    }
    
    //效验码与字节映射
    CMD_Head * pHead=(CMD_Head *)pcbDataBuffer;
    BYTE cbCheckCode=pHead->CmdInfo.cbCheckCode;
    for (int i=sizeof(CMD_Info);i<wDataSize;i++)
    {
        pcbDataBuffer[i]=mapRecvByte(pcbDataBuffer[i]);
        cbCheckCode+=pcbDataBuffer[i];
    }

    if (cbCheckCode != 0)
    {
        CCLOG("数据隐射错误-接收校验码不对");
        return false;
    }
    
    return true;
    
}

//随机映射
WORD CTCPSocket::seedRandMap(WORD wSeed)
{
    DWORD dwHold = wSeed;
    return (WORD)((dwHold = dwHold * 241103L + 2533101L) >> 16);
}

//映射发送数据
BYTE CTCPSocket::mapSendByte(BYTE const cbData)
{
    BYTE cbMap = g_SendByteMap[(BYTE)(cbData+m_cbSendRound)];
    m_cbSendRound += 3;
    return cbMap;
}

//映射接收数据
BYTE CTCPSocket::mapRecvByte(BYTE const cbData)
{
    BYTE cbMap = g_RecvByteMap[cbData] - m_cbRecvRound;
    m_cbRecvRound += 3;
    return cbMap;
}

GUID CTCPSocket::createGuid(){
    BYTE uu[16];
    for (int i=0; i<16; i++) {
        uu[i]=arc4random();
    }
    
    GUID Guid;
    BYTE data1[4]={uu[0],uu[1],uu[2],uu[3]};
    BYTE data2[2]={uu[4],uu[5]};
    BYTE data3[2]={uu[6],uu[7]};
    
    CopyMemory(&Guid.Data1, data1, sizeof(Guid.Data1));
    CopyMemory(&Guid.Data2, data2, sizeof(Guid.Data2));
    CopyMemory(&Guid.Data3, data3, sizeof(Guid.Data3));
    for (int i=0; i<8; i++) {
        Guid.Data4[i]=uu[i+8];
    }
    return Guid;
}

DWORD CTCPSocket::getTickCount(){
    uintptr_t currentTime;
    struct timeval current;
    gettimeofday(&current, NULL);
    currentTime = current.tv_sec * 1000 + current.tv_usec/1000;
    return (DWORD)currentTime;
}

//多线程创建
bool CTCPSocket::threadCreate()
{
#ifdef WIN32
#ifdef PTW32_STATIC_LIB
    pthread_win32_process_attach_np();
#endif
#endif
    
    //创建线程
    pthread_attr_t attr;
    
    //1/4 init
    pthread_attr_init(&attr);
    
    //2/4: explicitly specify as joinable or detached
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);
    
    //3/4 create
    int code = pthread_create(&m_hThread, 0, threadSocketRecv, this);
    
    if(code!=0)
        CCLOG("线程创建失败");
    
    //4/4 join
    pthread_detach(m_hThread);
    
    return false;
}

//detach线程
void CTCPSocket::threadClosed()
{
    m_bConnect=false;
    
    
#ifdef WIN32
#ifdef PTW32_STATIC_LIB
    pthread_win32_process_detach_np();
#endif
#endif
    
}

bool CTCPSocket::getConnect()
{
    return this->m_bConnect;
}

void CTCPSocket::connetfaildDeal()
{
    int code=this->getSocket()->GetError();
    switch (code)
    {
        case ECONNREFUSED:
        {
            m_connecttype = Connect_Kick_Out;
            CCLOG("CTCPSocket: 服务器拒绝，无法响应，请留意系统公告。");
        }
            break;
        case ETIMEDOUT:
        {
            m_connecttype = Connect_Faild;
            CCLOG("CTCPSocket: 服务器连接超时，请稍后重试");
        }
            break;
        case ECONNRESET:
        {
            m_connecttype = Connect_Kick_Out;
            CCLOG("CTCPSocket: 连接被强制关闭，请注意操作是否非法。");
        }
            break;
        case ENETUNREACH:
        {
            m_connecttype = Connect_Kick_Out;
            CCLOG("CTCPSocket: 服务器无法响应，请留意系统公告。");
        }
            break;
        case EHOSTUNREACH:
        {
            m_connecttype = Connect_Kick_Out;
            CCLOG("CTCPSocket: 无网络连接，请检查网络状况");
        }
            break;
        case 0:
        case EINVAL:
        {
            m_connecttype = Connect_Kick_Out;
            CCLOG("CTCPSocket: 无网络连接");
        }
            break;
        case ENOENT:
        {
            m_connecttype = Connect_Kick_Out;
            CCLOG("CTCPSocket: 服务器无响应，请留意系统公告后重试");
        }
            break;
        default:
        {
            m_connecttype = Connect_Kick_Out;
        }
            break;
    }
}

