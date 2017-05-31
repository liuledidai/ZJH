#include "tools.h"
#include <string>
#include <stdlib.h>

#import "CMD5.h"

#if (CC_TARGET_PLATFORM != CC_PLATFORM_ANDROID)
#pragma comment(lib,"libiconv.lib")
#include "iconv.h"
#else
#include "libiconv/include/iconv.h"
#endif

std::string TCN(char *gbkStr)
{
#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
	return gbkStr;
#endif
	size_t inLen = strlen(gbkStr);
	size_t outlen = inLen << 1;
	char outBuf[outlen];
	 
	convert("gb18030","utf-8",gbkStr,inLen,outBuf,outlen);
	return std::string(outBuf);
}

int convert(char *from_charset, char *to_charset,char *inbuf,size_t inlen, char *outbuf, size_t outlen)
{
	iconv_t iconvH;
	iconvH =iconv_open(to_charset,from_charset);
	if(!iconvH)
		return 0;

	memset(outbuf,0,outlen);

#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
	if (!iconv(iconvH,&inbuf,&inlen,&outbuf,&outlen))
	{
		iconv_close(iconvH);
		return 0;
	}
#else 
	const char *temp = inbuf;
	const char **pin = &temp;
	char **pout = &outbuf;
	if (!iconv(iconvH,pin,&inlen,pout,&outlen))
	{
		iconv_close(iconvH);
		return NULL;
	}
#endif
	iconv_close(iconvH);
	return NULL;
}

std::string TCNTCP(char *gbkStr)
{
// #if( CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
// 	return gbkStr;
// #endif
	size_t inLen = strlen(gbkStr);
    if (IsTextUTF8(gbkStr, inLen))
    {
        return gbkStr;
    }
    
	size_t outlen = inLen << 1;
	char outBuf[outlen];

//	convert("gb2312","utf-8",gbkStr,inLen,outBuf,outlen);
	convert("gb18030", "utf-8", gbkStr, inLen, outBuf, outlen);
	return std::string(outBuf);
}

std::string TGBK(char *utfStr)
{
	size_t inLen = strlen(utfStr);
	size_t outlen = inLen << 1;
	char outBuf[outlen];

	convert("utf-8","gb18030",utfStr,inLen,outBuf,outlen);
	return std::string(outBuf);;
}

#define NON_NUM '0' 

char Char2Num(char ch){ 
	if(ch>='0' && ch<='9')return (char)(ch-'0'); 
	if(ch>='a' && ch<='f')return (char)(ch-'a'+10); 
	if(ch>='A' && ch<='F')return (char)(ch-'A'+10); 
	return NON_NUM; 
} 

/************************************************ 
* 把字符串进行URL编码。 
* 输入： 
* str: 要编码的字符串 
* strSize: 字符串的长度。这样str中可以是二进制数据 
* result: 结果缓冲区的地址 
* resultSize:结果地址的缓冲区大小(如果str所有字符都编码，该值为strSize*3) 
* 返回值： 
* >0: result中实际有效的字符长度， 
* 0: 编码失败，原因是结果缓冲区result的长度太小 
************************************************/ 
int URLEncode(const char* str, const int strSize, char* result, const int resultSize) { 
	int i; 
	int j = 0; /* for result index */ 
	char ch; 

	if ((str == NULL) || (result == NULL) || (strSize <= 0) || (resultSize <= 0)) { 
		return 0; 
	} 

	for (i=0; (i<strSize) && (j<resultSize); i++) { 
		ch = str[i]; 
		if ((ch >= 'A') && (ch <= 'Z')) { 
			result[j++] = ch; 
		} else if ((ch >= 'a') && (ch <= 'z')) { 
			result[j++] = ch; 
		} else if ((ch >= '0') && (ch <= '9')) { 
			result[j++] = ch; 
		} else if(ch == ' '){ 
			result[j++] = '+'; 
		} else { 
			if (j + 3 < resultSize) { 
				sprintf(result+j, "_%02X", (unsigned char)ch);  //原本是%%%02X,
				j += 3; 
			} else { 
				return 0; 
			} 
		} 
	} 

	result[j] = '\0'; 
	return j; 
} 


/************************************************ 
* 把字符串进行URL解码。 
* 输入： 
* str: 要解码的字符串 
* strSize: 字符串的长度。 
* result: 结果缓冲区的地址 
* resultSize:结果地址的缓冲区大小，可以<=strSize 
* 返回值： 
* >0: result中实际有效的字符长度， 
* 0: 解码失败，原因是结果缓冲区result的长度太小 
************************************************/ 
int URLDecode(const char* str, const int strSize, char* result, const int resultSize) { 
	char ch, ch1, ch2; 
	int i; 
	int j = 0; /* for result index */ 

	if ((str == NULL) || (result == NULL) || (strSize <= 0) || (resultSize <= 0)) { 
		return 0; 
	} 

	for (i=0; (i<strSize) && (j<resultSize); i++) { 
		ch = str[i]; 
		switch (ch) { 
		case '+': 
			result[j++] = ' '; 
			break; 

		case '%': 
			if (i+2 < strSize) { 
				ch1 = Char2Num(str[i+1]); 
				ch2 = Char2Num(str[i+2]); 
				if ((ch1 != NON_NUM) && (ch2 != NON_NUM)) { 
					result[j++] = (char)((ch1<<4) | ch2); 

					i += 2; 
					break; 
				} 
			} 

			/* goto default */ 
		default: 
			result[j++] = ch; 
			break; 
		} 
	} 

	result[j] = '\0'; 
	return j; 
} 

//iconv utf8编码判断
bool IsTextUTF8(const char* str,unsigned int  length)
{
    int i;
    unsigned long nBytes=0; //UFT8可用1-6个字节编码,ASCII用一个字节
    unsigned char chr;
    bool bAllAscii = true;        //如果全部都是ASCII, 说明不是UTF-8
    for(i = 0; i < length; i++)
    {
        chr= *(str+i);
        if((chr&0x80) != 0) // 判断是否ASCII编码,如果不是,说明有可能是UTF-8,ASCII用7位编码,但用一个字节存,最高位标记为0,o0xxxxxxx
        {
            bAllAscii= false;
        }
        if(nBytes==0) //如果不是ASCII码,应该是多字节符,计算字节数
        {
            if(chr>=0x80)
            {
                if(chr>=0xFC&&chr<=0xFD)
                    nBytes=6;
                else if(chr>=0xF8)
                    nBytes=5;
                else if(chr>=0xF0)
                    nBytes=4;
                
                else if(chr>=0xE0)
                    nBytes=3;
                else if(chr>=0xC0)
                    nBytes=2;
                else
                {
                    return false;
                }
                nBytes--;
            }
        }
        else //多字节符的非首字节,应为 10xxxxxx
        {
            if( (chr&0xC0) != 0x80 )
            {
                return false;
            }
            nBytes--;
        }
    }
    if( nBytes > 0 ) //违返规则
    {
        return false;
    }
    if(bAllAscii) //如果全部都是ASCII, 说明不是UTF-8
    {
        return false;
    }
    return true;
}

std::string itoa(int i)
{
    char buf[128];
    sprintf(buf, "%d",i);
    return std::string(buf);
}

std::string ftoa(float i)
{
    char buf[128];
    sprintf(buf, "%.1f",i);
    return std::string(buf);
}

std::string lltoa(long long i)
{
    char buf[128];
    sprintf(buf, "%lld",i);
    return std::string(buf);
}

std::string numToIP1(unsigned int num)
{
    char buf[128];
    unsigned char* p = (unsigned char *)&num;
    sprintf(buf, "%d.%d.%d.%d",p[0]&0xff,p[1]&0xff,p[2]&0xff,p[3]&0xff);
    std::string strBuf(buf);
    return std::string(buf);
}

std::string numToIP2(unsigned int num)
{
    char buf[128];
    buf[0]='\0';
    for(int i=0;i<=3;i++)
    {
        strcat(buf, itoa((num>>(8*i))&0xff).c_str());
        if(i!=3)
        {
            strcat(buf,".");
        }
    }
    std::string strBuf(buf);
    return strBuf;
}

unsigned int ipToNum(char* ip)
{
    char* p;
    int sections[4]={0};
    int i=0;
    
    p = strtok(ip,".");
    while( p )
    {
        sections[i] = atoi(p);
        p = strtok(NULL,".");
        i++;
    }
    
    unsigned int num =0;
    for( int j=3,i=0 ; j>=0 ; j--,i++ )
    {
        num += (sections[i] <<(8*j));
    }
    
    return num;
}


//////////////////////////////////////////////

std::string CreateSign(int userID, long long datetamp)
{
    char szTemp[128];
    sprintf(szTemp, "UserID%d|DateTamp%lld|Keyfgr7hk5ds35h30hnj7hwas4gfy6sj78x",userID,datetamp);
    
    char szPassword[33];
    CMD5::EncryptData(szTemp,szPassword);
    
    return std::string(szPassword);
}

float durationWithSpeed(float speed, cocos2d::Vec2 startPoint, cocos2d::Vec2 endPoint)
{
    float distance = sqrt((startPoint.x-endPoint.x)*(startPoint.x-endPoint.x)
                          +(startPoint.y-endPoint.y)*(startPoint.y-endPoint.y));
    return (distance / speed);
}



