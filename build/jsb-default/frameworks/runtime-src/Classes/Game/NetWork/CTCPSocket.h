//
//  CTCPSocket.h
//  NiuNiuGame
//
//  Created by anxijun on 16/7/25.
//
//

#ifndef CTCPSocket_h
#define CTCPSocket_h

#include "cocos2d.h"
#include "cocos-net.h"
#include <stdio.h>
#include <iostream>
#include <pthread.h>



#define SOCKET_READ_BUFFER_SIZE 81920

using namespace cocos2d;

enum ConnectType
{
    unConnect = 0,//未连接
    Connecting,//正在连接
    ConnectFinished,//连接完成
    Connected,//已连接
    Connect_Faild,//连接失败
    Connect_Kick_Out,//踢出
};

struct ISocketSink
{
    //事件消息
    virtual bool OnMessageRead(Ref* pSender,CMD_Command cmd,void *pData,WORD wDataSize)=0;
    virtual void OnConnected(Ref* pSender)=0;
    virtual void OnConnectTimeout(Ref* pSender)=0;
    virtual void OnConnectFaild(Ref* pSender)=0;
    virtual void OnConnectKickOut(Ref* pSender)=0;
};

//线程接收函数
void *threadSocketRecv();

class RecvData;
//socket使用
class CTCPSocket : public cocos2d::Ref
{
    //构造
public:
    CTCPSocket();
    ~CTCPSocket();
    
public:
    // will calling when a package is coming
    virtual void OnMessageRead(CMD_Command cmd,void *pData,WORD wDataSize){
        if(m_pSink)
            m_pSink->OnMessageRead(this,cmd,pData,wDataSize);
    }
    // when connected will calling
    virtual void onConnected(){
        if(m_pSink) m_pSink->OnConnected(this);
    }
    
    // when connect time out will calling
    virtual void onConnectTimeout(){
        if(m_pSink) m_pSink->OnConnectTimeout(this);
    }
    
    // on disconnected will call
    virtual void OnConnectFaild(){
        if(m_pSink) m_pSink->OnConnectFaild(this);
    }
    
    // on exception
    virtual void OnConnectKickOut(){
        if (m_pSink) m_pSink->OnConnectKickOut(this);
    }
    
    void connetfaildDeal();
    
    //网络操作
public:
    bool socketConnect(const char *domain, WORD wPort);
    bool socketConnect();
    void socketClose();
    
    bool socketRecv();
    bool SendData(WORD wMainCmdID,WORD wSubCmdID);
    bool SendData(WORD wMainCmdID,WORD wSubCmdID,void* buffer, WORD wSize);
    bool socketSend(char* pData, WORD wSize);
    //隐射数据
    WORD EncryptBuffer(void* pData, WORD wDataSize);
    
    //隐射数据
    bool CrevasseBuffer(void* pData, WORD wDataSize);
    
private:
    //字节映射
    inline WORD seedRandMap(WORD wSeed);
    //发送映射
    inline BYTE mapSendByte(BYTE cbData);
    //接收映射
    inline BYTE mapRecvByte(BYTE cbData);
    
    inline GUID createGuid();
    
    DWORD getTickCount();
    //多线程操作
public:
    bool threadCreate();
    void threadClosed();
    static void handle_quit(int signo);
public:
    void setEntry(bool isEntry) { m_bEntry=isEntry;}    //加密映射
    void setTcpSink( ISocketSink *pSink );
    
    bool getLoop() {return m_bLoop;};
    bool getEntry() {return m_bEntry;};
    
    bool getConnect();
    
    CBSDSocket *getSocket(){
        return m_pSocket;
    }
    
    
    
    //网络回包数据调用
    void RecvDataUpdate(float time);
    
private:
    CBSDSocket*             m_pSocket;                  //网络连接
    pthread_t               m_hThread;                  //线程句丙
    bool                    m_bConnect;                 //连接状态 d:false
    bool                    m_bLoop;                    //接收标识 d:true
    
    //数据隐射标识在此添加
    bool                    m_bEntry;                   //隐射标识 d:true
    
    //数据缓冲
    char                    m_pData[SOCKET_READ_BUFFER_SIZE];     //网络缓冲
    WORD                    m_wSize;                    //缓冲大小
    //加密数据
protected:
    BYTE							m_cbSendRound;						//字节映射
    BYTE							m_cbRecvRound;						//字节映射
    DWORD							m_dwSendXorKey;						//发送密钥
    DWORD							m_dwRecvXorKey;						//接收密钥
    
protected:
    ISocketSink						*m_pSink;
    
    //计数变量
protected:
    DWORD							m_dwSendPacketCount;				//发送计数
    DWORD							m_dwRecvPacketCount;				//接受计数
        
    cocos2d::Vector<RecvData *> m_recvdataQueue;//接受到需要调用得数据
    
    std::mutex recvdatamutex;//控制数据调用得互斥锁
    std::mutex sendtimeMutex;//控制发送数据时间互斥锁
    bool  m_bAfterSend;//刚发送完数据
    
    CC_SYNTHESIZE(float, m_heartTime , HeartTime)
    
    CC_SYNTHESIZE(float, m_NoMessageTime , NoMessageTime)
    
    //网络连接状态
    CC_SYNTHESIZE(ConnectType, m_connecttype , ConnectType)
    
    //ip地址
    CC_SYNTHESIZE(std::string, m_domain, Domain)
    
    //端口号
    CC_SYNTHESIZE(WORD, m_wport, wPort)
};


#endif /* CTCPSocket_h */
