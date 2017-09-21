//
//  JJParamUntil.cpp
//
//  Created by anxijun on 16/10/10.
//
//

#include "JJParamUntil.h"
#include "../Classes/Game/NetWork/cocos-net.h"
//#include "../Classes/DatModule/DeviceModule.h"



StringMap JJParamUntil::stringTobuildParam(std::string paramStr)
{
    StringMap stringMap;
    std::vector<std::string> strArray = split(paramStr,"&");
    std::vector<std::string>::iterator iter;
    for(iter = strArray.begin(); iter != strArray.end(); iter++)
    {
        std::vector<std::string> substrArray = split(*iter,"=");
        stringMap[substrArray[0]] = substrArray[1];
    }
    stringMap.erase("datetamp");
    stringMap.erase("sign");
    return stringMap;
}

void JJParamUntil::sort(std::vector<std::string> & container,StringMap& params)
{
    container.clear();
    
    StringMap::iterator iter;
    for(iter = params.begin(); iter != params.end(); iter++)
    {
        container.push_back(iter->first);
    }
    
    std::stable_sort(container.begin(), container.end(), JJParamUntil::compareLevel);
}

bool JJParamUntil::compareLevel(const std::string &a,const std::string &b)
{
    int index = a.compare(b);
    return index <= 0;
}

std::string JJParamUntil::getSign(std::string paramstr)
{
    //加入key
    paramstr.append("key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x");
//    return DeviceModule::sharedDeviceModule()->md5(paramstr);
    return "";
}

//字符串分割函数
std::vector<std::string> JJParamUntil::split(std::string str,std::string pattern)
{
    std::string::size_type pos;
    std::vector<std::string> result;
    str+=pattern;//扩展字符串以方便操作
    size_t size=str.size();
    
    for(int i=0; i<size; i++)
    {
        pos=str.find(pattern,i);
        if(pos<size)
        {
            std::string s=str.substr(i,pos-i);
            result.push_back(s);
            i=pos+pattern.size()-1;
        }
    }
    return result;
}
