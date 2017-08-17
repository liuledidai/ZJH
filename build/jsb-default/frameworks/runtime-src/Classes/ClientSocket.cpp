//
//  ClientSocket.cpp
//  ZJHGAME
//
//  Created by leeliu on 2017/5/24.
//
//

#include "ClientSocket.h"

ClientSocket::ClientSocket()
{
    m_Socket = nullptr;
}

ClientSocket::~ClientSocket()
{
    if (m_Socket)
    {
//        m_Socket->socketClose();
        delete m_Socket;
    }
}


bool ClientSocket::ConnectSocket(const char* ip, WORD wPort)
{
    if(m_Socket)
    {
        delete m_Socket;
    }
    m_Socket = new CTCPSocket();
    m_Socket->setTcpSink(this);
    return m_Socket->socketConnect(ip,wPort);
}
void ClientSocket::releaseSocket()
{
//    this->release();
    if(m_Socket) {
        m_Socket->socketClose();
    }
}
ClientSocket* ClientSocket::createSocket(const std::function<void (const CCmd_Data*)> callback)
{
    ClientSocket * pClientSocket = new ClientSocket();
    pClientSocket->m_callback = callback;
    if (pClientSocket && pClientSocket->init())
    {
//        pClientSocket->autorelease();
    }
    else
    {
        CC_SAFE_DELETE(pClientSocket);
    }
    return pClientSocket;
}

void ClientSocket::sendSocketData(CCmd_Data* cmd_data)
{
    m_Socket->SendData(cmd_data->getmain(), cmd_data->getsub(), cmd_data->getDataBuffer(),cmd_data->getDataSize());
}

#pragma ISocketSink
bool ClientSocket::OnMessageRead(Ref* pSender,CMD_Command command,void *pData,WORD wDataSize)
{
    CCLOG("ClientSocket::OnMessageRead");
    CCmd_Data* cmd_data = new CCmd_Data();
    cmd_data->setcmdinfo(command.wMainCmdID,command.wSubCmdID);
    cmd_data->pushpacket(pData, wDataSize);
    m_callback(cmd_data);
    return true;
}

void ClientSocket::OnConnected(Ref* pSender)
{
    CCmd_Data* cmd_data = new CCmd_Data();
    cmd_data->setcmdinfo(0,0);
    m_callback(cmd_data);
    CCLOG("ClientSocket::OnConnected");

}

void ClientSocket::OnConnectTimeout(Ref* pSender)
{
    CCLOG("ClientSocket::OnConnectTimeout");
    CCmd_Data* cmd_data = new CCmd_Data();
    cmd_data->setcmdinfo(0,1);
    m_callback(cmd_data);
    this->OnConnectFaild(pSender);
    
}

void ClientSocket::OnConnectFaild(Ref* pSender)
{
    CCLOG("ClientSocket::OnConnectFaild");
    CCmd_Data* cmd_data = new CCmd_Data();
    cmd_data->setcmdinfo(0,2);
    m_callback(cmd_data);
}

void ClientSocket::OnConnectKickOut(Ref* pSender)
{
    CCLOG("ClientSocket::OnConnectKickOut");
    CCmd_Data* cmd_data = new CCmd_Data();
    cmd_data->setcmdinfo(0,3);
    m_callback(cmd_data);
}


