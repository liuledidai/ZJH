//
//  CCmd_Data.cpp
//  ZJHGAME
//
//  Created by leeliu on 2017/5/24.
//
//

#include "CCmd_Data.h"
#include "tools.h"

CCmd_Data::CCmd_Data(){
    length = 0;
    read_offset = 0;
    push_offset = 0;
    maxsize = 1;
    m_curBlockName = "";
    m_isReadMode = false;
    memset(&buffer, 0, sizeof(buffer));
}

CCmd_Data::~CCmd_Data(){
    length = 0;
    read_offset = 0;
    push_offset = 0;
    maxsize = 1;
    
    memset(&buffer, 0, sizeof(buffer));
}

CCmd_Data* CCmd_Data::create()
{
    // it will auto delete memory by js's garbageCollect
    CCmd_Data* pData = new CCmd_Data();
    
    return pData;
}

void CCmd_Data::cleanData(){
    length = 0;
}
void CCmd_Data::setmaxsize(WORD data){
    maxsize = data;
}

WORD CCmd_Data::getmaxsize(){
    return maxsize;
}
void CCmd_Data::setDataSize(WORD data){
    length = data;
}

WORD CCmd_Data::getDataSize(){
    return length;
}

WORD CCmd_Data::getReadOffset(){
    return read_offset;
}

void* CCmd_Data::getDataBuffer(){
    return buffer;
}

void CCmd_Data::setcmdinfo(WORD main,WORD sub)
{
    cmdinfo.wMainCmdID = main;
    cmdinfo.wSubCmdID = sub;
}
void CCmd_Data::pushdata(void *data,int unitsize, WORD datalen)
{
    CCLOG("CCmd_Data push size:%d,len:%d",unitsize,datalen);
    if(m_curBlockName != ""){
        if((m_blocksLength[m_curBlockName.c_str()] % unitsize) != 0){
            push_offset += unitsize - (m_blocksLength[m_curBlockName.c_str()] % unitsize);
        }
    }else if(push_offset % (unitsize) != 0){
        push_offset += unitsize - push_offset % (unitsize);
    }
    
    CopyMemory(buffer+push_offset, data, datalen);
    
    push_offset += datalen;
    length = push_offset;
    
    if (maxsize < unitsize){
        maxsize = unitsize;
    }
    
    if(m_curBlockName != ""){
        if (m_blocksUnitSize[m_curBlockName.c_str()] < unitsize){
            m_blocksUnitSize[m_curBlockName.c_str()] = unitsize;
        }
        if(m_blocksLength[m_curBlockName.c_str()] % m_blocksUnitSize[m_curBlockName.c_str()]){
            CCLOG("CCmd_Data filled with size:%d",m_blocksLength[m_curBlockName.c_str()] % m_blocksUnitSize[m_curBlockName.c_str()]);
            length +=  m_blocksUnitSize[m_curBlockName.c_str()] - m_blocksLength[m_curBlockName.c_str()] % m_blocksUnitSize[m_curBlockName.c_str()];;
        }
    }else if(length % maxsize != 0)
    {
        CCLOG("CCmd_Data filled with size:%d",length % maxsize);
        length += maxsize - length % maxsize;
    }
}

void CCmd_Data::pushbyte(BYTE data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushint(int data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushword(WORD data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushdword(DWORD data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushint64(__int64 data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushstring(std::string data,WORD dataLen)
{
    pushdata((void *)data.c_str(), 1,dataLen);
//    CopyMemory(buffer+push_offset, data.c_str(), dataLen);
//    push_offset+=dataLen;
//    length = push_offset;
//    if(length % maxsize != 0)
//    {
//        length = length + maxsize - length % maxsize;
//    }
}
void CCmd_Data::pushbool(bool data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushdouble(double data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushfloat(float data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}
void CCmd_Data::pushshort(short data)
{
    pushdata(&data, sizeof(data),sizeof(data));
}

void CCmd_Data::pushpacket(void *data,WORD datasize)
{
    m_isReadMode = true;
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

void CCmd_Data::blockBegin(std::string blockName,int unitMaxSize)
{
    CCLOG("CCmd_Data blockBegin %s",blockName.c_str());
    if(blockName != ""){
        m_blocksLength[blockName.c_str()] = 0;
        m_blocksUnitSize[blockName.c_str()] = unitMaxSize;
        m_curBlockName = blockName;
    }
    if(m_isReadMode){
        if((read_offset % unitMaxSize) > 0){
            CCLOG("CCmd_Data blockBegin read fill size:%d",unitMaxSize - read_offset %unitMaxSize);
            read_offset += unitMaxSize - read_offset %unitMaxSize;
        }
    }else{
        if((push_offset %unitMaxSize) > 0){
            CCLOG("CCmd_Data blockBegin push fill size:%d",unitMaxSize - push_offset %unitMaxSize);
            push_offset += unitMaxSize - push_offset %unitMaxSize;
        }
    }
}

void CCmd_Data::blockEnd()
{
    if(m_isReadMode){
        int unitMaxSize = maxsize;
        int totalSize = read_offset;
        
        if((m_curBlockName != "")){
            unitMaxSize = m_blocksUnitSize[m_curBlockName.c_str()];
            totalSize = m_blocksLength[m_curBlockName.c_str()];
        }
        if(totalSize%unitMaxSize > 0){
            read_offset += unitMaxSize - totalSize%unitMaxSize;
            CCLOG("CCmd_Data blockEnd read fill size:%d",totalSize%unitMaxSize);
        }
    }else{
        if(length - push_offset > 0){
            CCLOG("CCmd_Data blockEnd push fill size:%d",length - push_offset);
        }
        push_offset = length;
    }
    m_curBlockName = "";
}

void CCmd_Data::updateUnitSize(int unitsize,int dataLen)
{
    if (maxsize < unitsize){
        maxsize = unitsize;
    }
    if(m_curBlockName != ""){
        if(m_blocksUnitSize[m_curBlockName.c_str()] < unitsize){
            m_blocksUnitSize[m_curBlockName.c_str()] = unitsize;
        }
        
        m_blocksLength[m_curBlockName.c_str()] += dataLen;
        int mode = m_blocksLength[m_curBlockName.c_str()] %unitsize;
        if(mode > 0){
            CCLOG("CCmd_Data read filled with size:%d",unitsize- mode);
            read_offset += unitsize - mode;
        }
    }else {
        if(read_offset % unitsize != 0){
            CCLOG("CCmd_Data read fill with size:%d",unitsize - read_offset % unitsize);
            read_offset += unitsize - read_offset % unitsize;
        }
    }
    CCLOG("CCmd_Data read begin:%d size:%d",read_offset,dataLen);
}

BYTE CCmd_Data::readbyte(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(BYTE),sizeof(BYTE));
    }
    BYTE data = *(BYTE *)(buffer+read_offset);
    read_offset += sizeof(BYTE);
    return data;
}
int CCmd_Data::readint(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(int),sizeof(int));
    }
    int data = *(int *)(buffer+read_offset);
    read_offset += sizeof(int);
    return data;
}
WORD CCmd_Data::readword(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(WORD),sizeof(WORD));
    }
    WORD data = *(WORD *)(buffer+read_offset);
    read_offset += sizeof(WORD);
    return data;
}
DWORD CCmd_Data::readdword(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(DWORD),sizeof(DWORD));
    }
    DWORD data = *(DWORD *)(buffer+read_offset);
    read_offset += sizeof(DWORD);
    return data;
}
//    SCORE readscore();
__int64 CCmd_Data::readint64(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(__int64),sizeof(__int64));
    }
    __int64 data = *(__int64 *)(buffer+read_offset);
    read_offset += sizeof(__int64);
    return data;
}
std::string CCmd_Data::readstring(WORD dataLen,bool bIgnoreAlign)
{
    if(dataLen == 0){
        dataLen = length-read_offset;
    }
    if(!bIgnoreAlign){
        updateUnitSize(1,dataLen);
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
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(bool),sizeof(bool));
    }
    bool data = *(bool *)(buffer+read_offset);
    read_offset += sizeof(bool);
    return data;
}
double CCmd_Data::readdouble(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(double),sizeof(double));
    }
    double data = *(double *)(buffer+read_offset);
    read_offset += sizeof(double);
    return data;
}
float CCmd_Data::readfloat(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(float),sizeof(float));
    }
    float data = *(float *)(buffer+read_offset);
    read_offset += sizeof(float);
    return data;
}
short CCmd_Data::readshort(bool bIgnoreAlign)
{
    if(!bIgnoreAlign){
        updateUnitSize(sizeof(short),sizeof(short));
    }
    short data = *(short *)(buffer+read_offset);
    read_offset += sizeof(short);
    return data;
}
