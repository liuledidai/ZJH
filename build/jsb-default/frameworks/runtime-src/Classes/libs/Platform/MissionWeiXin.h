//
//  MissionWeiXin.h
//  MyCppGame
//
//  Created by 李文龙 on 2016/12/9.
//
//

#ifndef __WX_MissionWeiXin_H__
#define __WX_MissionWeiXin_H__

#include "cocos2d.h"
#include "network/HttpClient.h"
using namespace cocos2d;
using namespace cocos2d::network;

#define kUrl_WxShare_Game_Download "www.jjhgame.com"
//#define kWX_APP_ID                "wx8831d4d3e8e7bf45"
//#define kWX_APP_Secret            "7e95266142c0f058495db95e89c0c834"
//#define kWX_DESCRIBE               "NiuNiuGame"
#define kWX_APP_ID                "wxb0eac5c9cf4f866d"
#define kWX_APP_Secret            "cc4348f7745008b1ad979ceebd47627c"
#define kWX_DESCRIBE               "ZhaJinHua"

struct WxUserInfo
{
    std::string openid;
    std::string token;
    std::string nickname;
	int		   sex;
	std::string province;
	std::string city;
	std::string country;
	std::string headimgurl;
	std::string unionid;
};

class IWeiXinMissionSink
{
public:
    virtual void onWxLoginSuccess(WxUserInfo kWxUserInfo) = 0;
	virtual void onWxLoginFail(std::string kError) = 0;
};

class IWeiXinShareCallbackSink
{
public:
    virtual void onWxShareSuccess() = 0;
    virtual void onWxShareFail(std::string kError) = 0;
};

class IOpenAppCallbackSink
{
public:
    virtual void openAppCallback(std::string action,std::string roomcardID) = 0;
};

class MissionWeiXin:public cocos2d::Ref
{
public:
	const static int SHARE_SESSION = 0;
	const static int SHARE_MOMENTS = 1;
public:
	MissionWeiXin();
	~MissionWeiXin();
public:
    static MissionWeiXin* getInstance();
    void init();
    
	void loginWeiXin();
	void restWeiXin();
	void setMissionSink(IWeiXinMissionSink* pJniMissionSink);
    void setWeiXinShareSink(IWeiXinShareCallbackSink* pWeiXinShareSink);
    void setOpenAppCallbackSink(IOpenAppCallbackSink* pSink);
	IWeiXinMissionSink* getMissionSink();
	void shareScreenWeiXin(std::string strImagic,int nShareType = SHARE_SESSION);
	void shareTextWeiXin(std::string kText,int nShareType = SHARE_SESSION);
    void shareImageWeiXin(std::string filepath,int nShareType = SHARE_SESSION);
	void shareUrlWeiXin(std::string kUrl,std::string kTitle,std::string kDesc,int nShareType = SHARE_SESSION);
    void shareAppData(std::string strImagic);
    void access_token_callback(std::string param,bool isSuccess);
    void share_callback(int retCode);
    void WxShareOpenAppCallback(const char* action,const char* roomCardID);
    const char* getAppid();
private:
	void Req_Fail_token(std::string param);
	void Req_Access_token(std::string param);

	void Req_UserInfo(const std::string& access_token,const std::string& open_id);
    
    void onHttpRequestCompleted(HttpClient *sender, HttpResponse *response);
    
private:
	void captureScreen(bool succeed, const std::string& outputFile,int nShareType);
    
private:
    static MissionWeiXin*                           m_pMissionWeiXin;
    
private:
	IWeiXinMissionSink*                             m_pWeixinMissionSink;
    IWeiXinShareCallbackSink*                       m_pWeixinShareSink;
    IOpenAppCallbackSink*                           m_pOpenAppCallbackSink;
	std::string                                     m_sHeadImgUrl;
    std::string                                     m_sNickName;
    int                                             m_nSex;
};

#endif
