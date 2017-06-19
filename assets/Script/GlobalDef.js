var GlobalDef = {
    //正式服务器地址
    httpInitUrl: "http://ver.jjhgame.com/Handle/hz/init.ashx",   //app初始化接口地址
    httpBaseUrl: "http://interface.jjhgame.com/Handle",        //web接口地址
    httpOpenUrl: "http://user.jjhgame.com/findpasswordHZ.aspx",  //找回密码
    httpUserCenter: "http://f.jjhgame.com/Handle",                  //用户中心
    LOGON_SERVER_DOMAIN: "nnapp.jjhgame.com",                            //登录服务器
    LOGON_SERVER_IP: "122.226.186.38",                               //登录服务器
    PORT_LOGON_SERVER: 9009,                                           //登陆服务器

//端口定义
    PORT_VIDEO_SERVER: 7600,								//视频服务器
    PORT_CENTER_SERVER: 9090,								//中心服务器

    CHANNELID_init: 1,                              //渠道号
    CHANNELID_center: 7,                              //渠道号
//网络数据定义
    SOCKET_VER: 0x8C,								//网络版本
}
module.exports = GlobalDef;
