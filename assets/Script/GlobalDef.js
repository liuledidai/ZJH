var GlobalDef = {
    MAX_CHAIR: 100,								//◊Ó¥Û“Œ◊”
    MAX_CHAIR_NORMAL: 8,								//◊Ó¥Û»À ˝

    INVALID_TABLE: -1,						//Œﬁ–ß◊¿◊”∫≈
    INVALID_CHAIR: -1,						//Œﬁ–ß“Œ◊”∫≈

    HMATCH_PORT_MIN: 10000,							//–° ±»¸◊Ó–°∂Àø⁄∫≈
    HMATCH_PORT_MAX: 20000,							//–° ±»¸◊Ó¥Û∂Àø⁄∫≈
    HMATCH_SIGN_MAX: 99,								//–° ±»¸µ•≥°±»»¸±®√˚»À ˝…œœﬁ
    HMATCH_MAXONLINE: 500,

    MAX_ANDROID: 10,								//最大机器
    MAX_CHAT_LEN: 128,								//聊天长度
    LIMIT_CHAT_TIMES: 1200,							//限时聊天
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
    SOCKET_BUFFER: 8192,                                //网络缓冲
    SOCKET_PACKET: 8192,

    /////////////////////////////////////////////////////////////////////////////////////////

    //内核命令码
    MDM_KN_COMMAND: 3,                                   //内核命令
    SUB_KN_DETECT_SOCKET: 5,                                   //检测命令
    SUB_KN_SHUT_DOWN_SOCKET: 9,                                   //中断网络

    //IPC 数据定义
    IPC_VER: 0x0001,                              //IPC 版本
    IPC_IDENTIFIER: 0x0001,                              //标识号码
    IPC_PACKAGE: 4096,                                //最大 IPC 包
    IPC_BUFFER: 4096,    //缓冲长度

    TYPE_LEN: 32,                                  //÷÷¿‡≥§∂»
    KIND_LEN: 32,                                  //¿‡–Õ≥§∂»
    STATION_LEN: 32,                                  //’æµ„≥§∂»
    SERVER_LEN: 32,                                  //∑øº‰≥§∂»
    MODULE_LEN: 32,                                  //Ω¯≥Ã≥§∂»

    //–‘±∂®“Â
    GENDER_NULL: 0,                                   //Œ¥÷™–‘±
    GENDER_BOY: 1,                                   //ƒ––‘–‘±
    GENDER_GIRL: 2,                                   //≈Æ–‘–‘±

    //”Œœ∑¿‡–Õ
    GAME_GENRE_SCORE: 0x0001,                              //µ„÷µ¿‡–Õ
    GAME_GENRE_GOLD: 0x0002,                              //¿÷∂π¿‡–Õ
    GAME_GENRE_MATCH: 0x0004,                              //±»»¸¿‡–Õ
    GAME_GENRE_EDUCATE: 0x0008,                              //—µ¡∑¿‡–Õ
    GAME_GENRE_QTHERMATCH: 0x0016,                              //自定义比赛类型

    //”√ªß◊¥Ã¨∂®“Â
    US_NULL: 0x00,                                //没有状态
    US_FREE: 0x01,                                //站立状态
    US_SIT: 0x02,                                //坐下状态
    US_READY: 0x03,                                //同意状态
    US_LOOKON: 0x04,                                //旁观状态
    US_PLAY: 0x05,                                //游戏状态
    US_OFFLINE: 0x06,                                //断线状态

    //≥§∂»∫Í∂®“Â
    NAME_LEN: 32,                                  //√˚◊÷≥§∂»
    PASS_LEN: 33,                                  //√‹¬Î≥§∂»
    EMAIL_LEN: 32,                                  //” œ‰≥§∂»
    GROUP_LEN: 32,                                  //…ÁÕ≈≥§∂»
    COMPUTER_ID_LEN: 33,                                  //ª˙∆˜–Ú¡–
    UNDER_WRITE_LEN: 32,                                  //∏ˆ–‘«©√˚
    MOBILEPHONE_LEN: 32,                                  //∏ˆ–‘«©√˚

    //GlobalFrame.h
    

}
module.exports = GlobalDef;
