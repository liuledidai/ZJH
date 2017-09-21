#include "MissionWeiXin.h"
#include "PlatformHelper.h"
#include "../../libs/JJParamUntil.h"
#include "../Classes/libs/JsonBox/include/JsonBox.h"
#include "../Classes/Game/NetWork/cocos-net.h"
#include "../Classes/JCBridge.h"


MissionWeiXin* MissionWeiXin::m_pMissionWeiXin = NULL;

MissionWeiXin* MissionWeiXin::getInstance()
{
    if (m_pMissionWeiXin == NULL)
    {
        m_pMissionWeiXin = new MissionWeiXin();
    }
    
    return m_pMissionWeiXin;
}

MissionWeiXin::MissionWeiXin():m_pWeixinMissionSink(NULL)
, m_pWeixinShareSink(NULL)
, m_pOpenAppCallbackSink(NULL)
{
    
}

MissionWeiXin::~MissionWeiXin()
{

}

void MissionWeiXin::init()
{
 
}

void MissionWeiXin::loginWeiXin()
{
	std::string access_token = cocos2d::UserDefault::getInstance()->getStringForKey("token");
	std::string openid = cocos2d::UserDefault::getInstance()->getStringForKey("openid","");
	if (access_token != "" && openid != "")
	{
		Req_UserInfo(access_token,openid);
	}
	else
	{
		if (PlatformHelper::loginWX("","") == false)
        {
            m_pWeixinMissionSink->onWxLoginFail("登录失败，请检查是否安装微信。");
        }
	}
}
void MissionWeiXin::restWeiXin()
{
	cocos2d::UserDefault::getInstance()->setStringForKey("token","");
	cocos2d::UserDefault::getInstance()->setStringForKey("openid","");
}
void MissionWeiXin::setMissionSink(IWeiXinMissionSink* pWeixinMissionSink)
{
	m_pWeixinMissionSink = pWeixinMissionSink;
}

void MissionWeiXin::setWeiXinShareSink(IWeiXinShareCallbackSink* pWeiXinShareSink)
{
    m_pWeixinShareSink = pWeiXinShareSink;
}

void MissionWeiXin::setOpenAppCallbackSink(IOpenAppCallbackSink* pSink)
{
    m_pOpenAppCallbackSink = pSink;
}

IWeiXinMissionSink* MissionWeiXin::getMissionSink()
{
	return m_pWeixinMissionSink;
}
const char* MissionWeiXin::getAppid()
{
    return kWX_APP_ID;
}
void MissionWeiXin::access_token_callback(std::string param,bool isSuccess)
{
    if( !isSuccess ){
        //this->Req_Fail_token(param);
        JCBridge::callJS("WXFail",param, false);
    }else{
        //this->Req_Access_token(param);
        std::string params = kWX_APP_ID;
        params += ":";
        params += kWX_APP_Secret;
        params += ":" + param;
        params += ":authorization_code";
        
        JCBridge::callJS("WXSuccess",params, false);
    }
}


void MissionWeiXin::Req_Fail_token(std::string param)
{
	if (m_pWeixinMissionSink)
	{
		m_pWeixinMissionSink->onWxLoginFail(param);
	}
}

void MissionWeiXin::Req_Access_token(std::string param)
{
//	std::vector<std::string> kVector = JJParamUntil::split(param,":");
//	if (kVector.size() != 4)
//	{
//        assert(false);
//		return ;
//	}
//    
//    //微信登录安卓版 有可能会回调多次，如果接收到相同的授权码 直接屏蔽
//    std::string wxCode = kVector[2];
//    if (wxCode.compare(UserDefault::getInstance()->getStringForKey("wxcode")) == 0)
//    {
//        return;
//    }
//    
//    //保存授权码
//    UserDefault::getInstance()->setStringForKey("wxcode", kVector[2]);
//    UserDefault::getInstance()->flush();
//
//    StringMap params;
//    params["code"] = wxCode;
//    params["channelid"] = "7";
//    params["kindid"] = itoa(KIND_ID);
//    
//    std::string paramString = JJParamUntil::buildRequestParam(params);
//    
//    std::string url = "";
//    //std::string url = DatModule::sharedDatModule()->_serverData[ACCOUNT][USERCENTER].getString();
//    url.append("/UserCenter/GetThirdLoginInfo.ashx");
//    HttpRequest* request = new (std::nothrow) HttpRequest();
//    request->setUrl(url.c_str());
//    request->setTag("get_token");
//    request->setRequestType(HttpRequest::Type::POST);
//    request->setResponseCallback(CC_CALLBACK_2(MissionWeiXin::onHttpRequestCompleted, this));
//    request->setRequestData(paramString.c_str(), paramString.size());
//    
//    HttpClient::getInstance()->send(request);
//    request->release();
}

void MissionWeiXin::onHttpRequestCompleted(HttpClient *sender, HttpResponse *response)
{
    if (!response)
    {
        return;
    }
    
    if (0 != strlen(response->getHttpRequest()->getTag()))
    {
        log("%s completed", response->getHttpRequest()->getTag());
    }
    
    long statusCode = response->getResponseCode();
    
    char statusString[64] = {};
    sprintf(statusString, "HTTP Status Code: %ld, tag = %s", statusCode, response->getHttpRequest()->getTag());
    
    log("response code: %ld", statusCode);
    
    if (!response->isSucceed())
    {
        HttpRequest* request = response->getHttpRequest();
        std::string url = request->getUrl();
        
        if (url.find("https") == std::string::npos)
        {
            std::string httpHeader = "http";
            std::string::size_type pos = url.find(httpHeader);
            if (pos != std::string::npos)
            {
                url.replace(pos, httpHeader.size(), "https");
                request->setUrl(url.c_str());
                HttpClient::getInstance()->send(request);
                return;
            }
        }
        
        log("error buffer: %s", response->getErrorBuffer());
        m_pWeixinMissionSink->onWxLoginFail("微信登录失败，请检查网络是否通畅！");
        
        return;
    }
    
    // dump data
    std::vector<char> *buffer = response->getResponseData();
    printf("Http Test, dump data: ");
    char* pBuffer = (char*)malloc(buffer->size());
    for (unsigned int i = 0; i < buffer->size(); i++)
    {
        pBuffer[i] = (*buffer)[i];
        printf("%c", (*buffer)[i]);
    }
    printf("\n");
    
    JsonBox::Value tValue;
    tValue.loadFromString(std::string(pBuffer, buffer->size()));
    free(pBuffer);
//    
    if (tValue.isNull())
    {
        return;
    }
    
    std::string tag = response->getHttpRequest()->getTag();
    if (tag.compare("get_token") == 0)
    {
        if(tValue["status"].getString().compare("1") == 0)
        {
            std::string access_token = tValue["token"].getString();
            std::string openid = tValue["openid"].getString();
            UserDefault::getInstance()->setStringForKey("token",access_token);
            UserDefault::getInstance()->setStringForKey("openid",openid);
            UserDefault::getInstance()->flush();
            
            Req_UserInfo(access_token,openid);
        }
        else
        {
            m_pWeixinMissionSink->onWxLoginFail(tValue["msg"].getString());
            return;
        }
    }
    
    if (tag.compare("wx_userinfo") == 0) {
        
        if (!tValue["errcode"].isNull())
        {
            int errcode = tValue["errcode"].getInt();
            if (errcode != 0)
            {
                restWeiXin();
                loginWeiXin();
                return;
            }
        }
        
        WxUserInfo kWxUserInfo;
        kWxUserInfo.openid = tValue["openid"].getString();
        kWxUserInfo.nickname = tValue["nickname"].getString();
        kWxUserInfo.sex = tValue["sex"].getInt();
        kWxUserInfo.province = tValue["province"].getString();
        kWxUserInfo.city = tValue["city"].getString();
        kWxUserInfo.country = tValue["country"].getString();
        kWxUserInfo.headimgurl = tValue["headimgurl"].getString();
        kWxUserInfo.unionid = tValue["unionid"].getString();
        kWxUserInfo.token = UserDefault::getInstance()->getStringForKey("token","");
        
        cocos2d::UserDefault::getInstance()->setIntegerForKey("sex",kWxUserInfo.sex);
        cocos2d::UserDefault::getInstance()->setStringForKey("headimgurl",kWxUserInfo.headimgurl);
        cocos2d::UserDefault::getInstance()->setStringForKey("nickname",kWxUserInfo.nickname);
        cocos2d::UserDefault::getInstance()->flush();
        
        if (m_pWeixinMissionSink)
        {
            m_pWeixinMissionSink->onWxLoginSuccess(kWxUserInfo);
        }
    }
}

void MissionWeiXin::Req_UserInfo(const std::string& access_token,const std::string& open_id)
{
	std::string kUrl = "https://api.weixin.qq.com/sns/userinfo?";
    
    std::string paramString;
    paramString.append("access_token=");
    paramString.append(access_token);
    paramString.append("&");
    paramString.append("openid=");
    paramString.append(open_id);

    HttpRequest* request = new (std::nothrow) HttpRequest();
    request->setUrl(kUrl.c_str());
    request->setTag("wx_userinfo");
    request->setRequestType(HttpRequest::Type::POST);
    request->setResponseCallback(CC_CALLBACK_2(MissionWeiXin::onHttpRequestCompleted, this));
    request->setRequestData(paramString.c_str(), paramString.size());
    
    HttpClient::getInstance()->send(request);
    request->release();
}

void MissionWeiXin::shareScreenWeiXin(std::string strImagic,int nShareType /*= SHARE_SESSION*/)
{    
	captureScreen(true,strImagic,nShareType);
}
void MissionWeiXin::captureScreen(bool succeed, const std::string& outputFile,int nShareType)
{
	if (succeed)
	{
		cocos2d::log("MissionWeiXin captureScreen:%s",outputFile.c_str());
		PlatformHelper::shareImageWX(outputFile.c_str(),nShareType);
	}
	else
	{
		cocos2d::log("MissionWeiXin captureScreen failed!");
	}
}
void MissionWeiXin::shareTextWeiXin(std::string kText,int nShareType /*= SHARE_SESSION*/)
{
	PlatformHelper::shareTextWX(kText.c_str(),nShareType);
}

void MissionWeiXin::shareUrlWeiXin(std::string kUrl,std::string kTitle,std::string kDesc,int nShareType)
{
	PlatformHelper::shareUrlWX(kUrl.c_str(),kTitle.c_str(),kDesc.c_str(),nShareType);
}

void MissionWeiXin::shareImageWeiXin(std::string filepath,int nShareType)
{
    PlatformHelper::shareImageWX(filepath.c_str(),nShareType);
}

void MissionWeiXin::WxShareOpenAppCallback(const char* action,const char* roomCardID)
{
    if (action != nullptr && roomCardID != nullptr)
    {
        std::string text = "wxshare";
        if (text.compare(action) == 0)
        {
            UserDefault::getInstance()->setStringForKey("RoomCardOpenType", text.c_str());
            UserDefault::getInstance()->setStringForKey("RoomCardID", roomCardID);
            UserDefault::getInstance()->flush();
            
            if (m_pOpenAppCallbackSink)
            {
                m_pOpenAppCallbackSink->openAppCallback(action, roomCardID);
            }
        }
    }
    
}

void MissionWeiXin::shareAppData(std::string strImagic)
{
    PlatformHelper::shareAppData(strImagic.c_str(),1);
}

void MissionWeiXin::share_callback(int retCode)
{
    if (retCode != 0)
    {
        std::string msg = "";
        
        switch (retCode) {
            case 1:
                msg = "微信分享失败，错误码：1，普通类型错误。";
                break;
            case 2:
                msg = "微信分享失败，用户点击取消";
                break;
            default:
                msg = "微信分享失败";
                break;
        }
            //this->Req_Fail_token(param);
            JCBridge::callJS("WXShareFail",msg, false);

        if (m_pWeixinShareSink)
        {
            m_pWeixinShareSink->onWxShareFail(msg);
        }
    }
    else
    {
        JCBridge::callJS("WXShareSuccess","", false);
        if (m_pWeixinShareSink)
        {
            m_pWeixinShareSink->onWxShareSuccess();
        }
    }
}
