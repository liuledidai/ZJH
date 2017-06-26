//
//  CCmd_Data.cpp
//  ZJHGAME
//
//  Created by leeliu on 2017/5/24.
//
//

#include "CCmd_Data.h"
#include "tools.h"
CCmd_Data::CCmd_Data()
{
    length = 0;
    read_offset = 0;
    push_offset = 0;
    maxsize = 1;
    memset(&buffer, 0, sizeof(buffer));
}
CCmd_Data::~CCmd_Data()
{
    length = 0;
    read_offset = 0;
    push_offset = 0;
    maxsize = 1;
    memset(&buffer, 0, sizeof(buffer));
}
CCmd_Data* CCmd_Data::create()
{
    CCmd_Data* pData = new CCmd_Data();
    return pData;
}

void CCmd_Data::cleanData()
{
    length = 0;
}
void CCmd_Data::setmaxsize(WORD data)
{
    maxsize = data;
}


void CCmd_Data::setDataSize(WORD data)
{
    length = data;
}

WORD CCmd_Data::getDataSize()
{
    return length;
}
WORD CCmd_Data::getReadOffset()
{
    return read_offset;
}
void* CCmd_Data::getDataBuffer()
{
    return buffer;
}

void CCmd_Data::setcmdinfo(WORD main,WORD sub)
{
    cmdinfo.wMainCmdID = main;
    cmdinfo.wSubCmdID = sub;
}
void CCmd_Data::pushdata(void *data, WORD datasize)
{
    if(push_offset % (datasize) != 0)
    {
        push_offset = push_offset + datasize - push_offset % (datasize);
    }
    
    CopyMemory(buffer+push_offset, data, datasize);
    
    push_offset += datasize;
    length = push_offset;
    
    if (maxsize < datasize)
    {
        maxsize = datasize;
    }
    if(length % maxsize != 0)
    {
        length = length + maxsize - length % maxsize;
    }
}

void CCmd_Data::pushbyte(BYTE data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
    
}
void CCmd_Data::pushint(int data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushword(WORD data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushdword(DWORD data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushint64(__int64 data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushstring(std::string data,WORD dataLen)
{
    CopyMemory(buffer+push_offset, data.c_str(), dataLen);
    push_offset+=dataLen;
    length = push_offset;
    if(length % maxsize != 0)
    {
        length = length + maxsize - length % maxsize;
    }
}
void CCmd_Data::pushbool(bool data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushdouble(double data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushfloat(float data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushshort(short data)
{
    pushdata(&data, sizeof(data));
//    if(push_offset % (sizeof(data)) != 0)
//    {
//        push_offset = push_offset + sizeof(data) - push_offset % (sizeof(data));
//    }
//    
//    CopyMemory(buffer+push_offset, &data, sizeof(data));
//    
//    push_offset += sizeof(data);
//    length = push_offset;
//    
//    if (maxsize < sizeof(data))
//    {
//        maxsize = sizeof(data);
//    }
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}

void CCmd_Data::pushpacket(void *data,WORD datasize)
{
    CopyMemory(buffer+length, data, datasize);
    length+=datasize;
}
/*  set   */

WORD CCmd_Data::getmain()
{
    return cmdinfo.wMainCmdID;
}
WORD CCmd_Data::getsub()
{
    return cmdinfo.wSubCmdID;
}
BYTE CCmd_Data::readbyte(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(BYTE)) != 0)
    {
        read_offset = read_offset + sizeof(BYTE) - read_offset % (sizeof(BYTE));
    }
    BYTE data = *(BYTE *)(buffer+read_offset);
    read_offset += sizeof(BYTE);
    return data;
}
int CCmd_Data::readint(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(int)) != 0)
    {
        read_offset = read_offset + sizeof(int) - read_offset % (sizeof(int));
    }
    int data = *(int *)(buffer+read_offset);
    read_offset += sizeof(int);
    return data;
}
WORD CCmd_Data::readword(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(WORD)) != 0)
    {
        read_offset = read_offset + sizeof(WORD) - read_offset % (sizeof(WORD));
    }
    WORD data = *(WORD *)(buffer+read_offset);
    read_offset += sizeof(WORD);
    return data;
}
DWORD CCmd_Data::readdword(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(DWORD)) != 0)
    {
        read_offset = read_offset + sizeof(DWORD) - read_offset % (sizeof(DWORD));
    }
    DWORD data = *(DWORD *)(buffer+read_offset);
    read_offset += sizeof(DWORD);
    return data;
}
//    SCORE readscore();
__int64 CCmd_Data::readint64(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(__int64)) != 0)
    {
        read_offset = read_offset + sizeof(__int64) - read_offset % (sizeof(__int64));
    }
    __int64 data = *(__int64 *)(buffer+read_offset);
    read_offset += sizeof(__int64);
    return data;
}
std::string CCmd_Data::readstring(WORD dataLen,bool bIgnoreAlign)
{
    if(dataLen == 0)
    {
        dataLen = length-read_offset;
    }
    char databuffer[dataLen];
    ZeroMemory(databuffer, sizeof(databuffer));
    CopyMemory(databuffer, buffer+read_offset, dataLen);
    read_offset += dataLen;
    std::string data;
    data = TCNTCP(databuffer);
    CCLOG("databuffer = %s", databuffer);
    CCLOG("databuffer_data = %s", data.c_str());
    return data;
}
bool CCmd_Data::readbool(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(bool)) != 0)
    {
        read_offset = read_offset + sizeof(bool) - read_offset % (sizeof(bool));
    }
    bool data = *(bool *)(buffer+read_offset);
    read_offset += sizeof(bool);
    return data;
}
double CCmd_Data::readdouble(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(double)) != 0)
    {
        read_offset = read_offset + sizeof(double) - read_offset % (sizeof(double));
    }
    double data = *(double *)(buffer+read_offset);
    read_offset += sizeof(double);
    return data;
}
float CCmd_Data::readfloat(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(float)) != 0)
    {
        read_offset = read_offset + sizeof(float) - read_offset % (sizeof(float));
    }
    float data = *(float *)(buffer+read_offset);
    read_offset += sizeof(float);
    return data;
}
short CCmd_Data::readshort(bool bIgnoreAlign)
{
    if(!bIgnoreAlign && read_offset % (sizeof(short)) != 0)
    {
        read_offset = read_offset + sizeof(short) - read_offset % (sizeof(short));
    }
    short data = *(short *)(buffer+read_offset);
    read_offset += sizeof(short);
    return data;
}
