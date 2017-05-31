#ifndef _TOOLS_H_
#define  _TOOLS_H_


#include "cocos2d.h"

// URLCode 使用
char Char2Num(char ch);
int URLEncode(const char* str, const int strSize, char* result, const int resultSize);
int URLDecode(const char* str, const int strSize, char* result, const int resultSize);

// GBK UTF 转化
int convert(char *from_charset, char *to_charset,char *gbkStr,size_t inlen, char *outbuf, size_t outlen);
std::string TCN(char *gbkStr);
std::string TCNTCP(char *gbkStr);
std::string TGBK(char *utfStr);

bool IsTextUTF8(const char* str,unsigned int  length);

std::string lltoa(long long i);
std::string itoa(int i);
std::string ftoa(float i);
std::string numToIP1(unsigned int num);
std::string numToIP2(unsigned int num);
unsigned int ipToNum(char* ip);


std::string CreateSign(int userID, long long datetamp);

float durationWithSpeed(float speed, cocos2d::Vec2 startPoint, cocos2d::Vec2 endPoint);

#endif

