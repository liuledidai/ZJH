//
//  MissionUrlScheme.cpp
//  MaJiangGame
//
//  Created by 李文龙 on 2017/6/29.
//
//

#include "MissionUrlScheme.h"
#include "../../../Classes/libs/JJParamUntil.h"
#include "ScriptingCore.h"

MissionUrlScheme* MissionUrlScheme::m_pMissionUrlScheme = NULL;

MissionUrlScheme* MissionUrlScheme::getInstance()
{
    if (m_pMissionUrlScheme == NULL)
    {
        m_pMissionUrlScheme = new MissionUrlScheme();
    }
    
    return m_pMissionUrlScheme;
}

MissionUrlScheme::MissionUrlScheme():m_pUrlOpenAppSink(NULL)
{
    
}

MissionUrlScheme::~MissionUrlScheme()
{
    
}

void MissionUrlScheme::setUrlOpenAppSink(IUrlOpenAppCallbackSink* pSink)
{
    m_pUrlOpenAppSink = pSink;
}

void MissionUrlScheme::openAppByUrlCallback(const char* str)
{
    std::string text(str);
    std::string action = "";
    std::string param = "";
    std::vector<std::string> kVector = JJParamUntil::split(text,"&");
    if (kVector.size() == 2)
    {
        std::vector<std::string> tmp1 = JJParamUntil::split(kVector[0],"=");
        std::vector<std::string> tmp2 = JJParamUntil::split(kVector[1],"=");
        
        if (tmp1.size() == 2 && tmp2.size() == 2)
        {
            action = tmp1[1];
            param  = tmp2[1];
        }
    }
    
    if (action.compare("wxshare") == 0)
    {
      
    }
    else if(action.compare("wappay") == 0)
    {
//        int action = atoi(param.c_str());
//        cocos2d::EventDispatcher* eventDispatcher = cocos2d::Director::getInstance()->getEventDispatcher();
//        eventDispatcher->dispatchCustomEvent("ENTER_GAME_PAY_RESULT",&action);
//        NSString *action = [NSString stringWithUTF8String:paraMap["action"].c_str()];
//        NSString *function = [NSString stringWithFormat: @"cc.game.emit('ENTER_GAME_PAY_RESULT','%@');",action];
        char function[64] = {0};
        sprintf(function, "cc.game.emit('ENTER_GAME_PAY_RESULT','%s');",param.c_str());
        // 转为C风格字符串
        const char *stringFunc = function;
        // outVal 是js函数的返回值，这里我们可以不管它
        //                    jsval *outVal;
        // OC调用JS
        ScriptingCore::getInstance()->evalString(stringFunc);
    }
    if (m_pUrlOpenAppSink)
    {
        m_pUrlOpenAppSink->openAppByUrlCallback(action, param);
    }
}
