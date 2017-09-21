//
//  JCBridge.cpp
//  ZJHGAME
//
//  Created by leeliu on 2017/5/24.
//
//

#include "JCBridge.h"
#include "tools.h"
#include "JsonBox.h"
#include <iostream>
#include "libs/Platform/PlatformHelper.h"

JCBridge::JCBridge(){
    
}

JCBridge::~JCBridge(){
    
}
/*
 create json example:{
 {
 "BluetoothInfo":
    [
        "devicename":"HTC1",
        "deciceStatus":1,
        "deviceType":2,
        "deviceID":"D8:Y3:54:67"
    ]
 }
    JsonBox::Object key;
 JsonBox::Array arrayJson;
 }
 
 */
std::string jsonToString(JsonBox::Value json)
{
//    std::string s_filepath = CCFileUtils::sharedFileUtils()->getWritablePath() + filename;
//    json.writeToFile(s_filepath);
    auto  s_filepath = FileUtils::getInstance()->getWritablePath() + "tmpjsonfile";
    //std::string s_filepath = FileUtils::getInstance()->fullPathForFilename("tmpjson");
    json.writeToFile(s_filepath,false);
    
    return FileUtils::getInstance()->getStringFromFile(s_filepath);
}

std::string JCBridge::callNative(std::string funcName,std::string params)
{
    /*
      if params is json style,can use JsonBox,forexample:
        JsonBox::Value jsval;
        jsval.loadFromString(params);
     */
    if(funcName == "excample"){
        JsonBox::Value jsval;
        jsval.loadFromString(params);
        CCLOG("test:%d",jsval["test"].getInt());
        
        JsonBox::Object key;
        JsonBox::Array arrayJson;
        for(int i = 0; i < 2;i++)
        {
            JsonBox::Object value;
            value["devicename"] = JsonBox::Value(StringUtils::format("HTC%d",i));
            int status =random(1,3);
            value["deciceStatus"] = JsonBox::Value(status);
            int type =random(1,3);
            value["deviceType"] = JsonBox::Value(type);
            value["deviceID"] = JsonBox::Value("D8:Y3:54:67");
            arrayJson.push_back(value);
        }
        key["BluetoothInfo"]=arrayJson;
        JsonBox::Value jsonv(key);
        //参数化方法中间有读写文件的转换操作，效率较低，，不建议频繁调用的情况下使用
        std::string tmp = jsonToString(jsonv);
        callJS("example",tmp,true);

    }else if(funcName == "loginWX"){
        auto result = PlatformHelper::loginWX("","");
        return result?"true":"false";
    }
    else if (funcName == "shareWX") {
        JsonBox::Value jsval;
        jsval.loadFromString(params);
        PlatformHelper::shareUrlWX(jsval["url"].getString().c_str(),jsval["title"].getString().c_str(),jsval["des"].getString().c_str(),jsval["shareType"].getInt());
    }
    else{
        CCLOG("unkonw funcName;%s",funcName.c_str());
    }
    
    return "";
}


static std::function<void (std::string,std::string,bool)> s_jscallback = nullptr;
void JCBridge::setJSCallback(std::function<void (std::string,std::string,bool)> jscallback)
{
    s_jscallback = jscallback;
}
void JCBridge::callJS(std::string funcName,std::string params,bool isJson)
{
    if(s_jscallback){
        s_jscallback(funcName,params,isJson);
    }
    else{
        CCLOG("you not set jscallback");
    }
}
