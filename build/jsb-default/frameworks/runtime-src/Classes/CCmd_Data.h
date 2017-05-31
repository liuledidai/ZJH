//
//  CCmd_Data.h
//  ZJHGAME
//
//  Created by leeliu on 2017/5/24.
//
//

#ifndef CCmd_Data_h
#define CCmd_Data_h

#include <stdio.h>
#include "cocos2d.h"
#include "Game/NetWork/cocos-net.h"

class CCmd_Data {
public:
    CCmd_Data();
    ~CCmd_Data();
    static CCmd_Data* create();
    void cleanData();
    WORD getDataSize();
    void* getDataBuffer();
public:
    void setcmdinfo(WORD main,WORD sub);
    void pushbyte(BYTE data);
    void pushint(int data);
    void pushword(WORD data);
    void pushdword(DWORD data);
    void pushint64(__int64 data);
    void pushstring(std::string data,WORD dataLen);
    void pushbool(bool data);
    void pushdouble(double data);
    void pushfloat(float data);
    void pushshort(short data);
    void pushpacket(void* data,WORD datasize);
public:
    WORD getmain();
    WORD getsub();
    BYTE readbyte();
    int readint();
    WORD readword();
    DWORD readdword();
    //    SCORE readscore();
    __int64 readint64();
    std::string readstring(WORD dataLen=0);
    bool readbool();
    double readdouble();
    float readfloat();
    short readshort();
private:
    CMD_Command cmdinfo;
    WORD length;
    WORD read_offset;
    WORD push_offset;
    WORD maxsize;
    BYTE buffer[SOCKET_PACKET];
};


#endif /* CCmd_Data_h */
