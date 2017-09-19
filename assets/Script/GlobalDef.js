var GlobalDef = {
    MAX_CHAIR: 100,								//◊Ó¥Û“Œ◊”
    MAX_CHAIR_NORMAL: 8,								//◊Ó¥Û»À ˝

    INVALID_TABLE: 0xFFFF,						//Œﬁ–ß◊¿◊”∫≈
    INVALID_CHAIR: 0xFFFF,						//Œﬁ–ß“Œ◊”∫≈
    INVALID_ITEM: 0xFFFF,

    HMATCH_PORT_MIN: 10000,							//–° ±»¸◊Ó–°∂Àø⁄∫≈
    HMATCH_PORT_MAX: 20000,							//–° ±»¸◊Ó¥Û∂Àø⁄∫≈
    HMATCH_SIGN_MAX: 99,								//–° ±»¸µ•≥°±»»¸±®√˚»À ˝…œœﬁ
    HMATCH_MAXONLINE: 500,

    MAX_ANDROID: 10,								//最大机器
    MAX_CHAT_LEN: 128,								//聊天长度
    LIMIT_CHAT_TIMES: 1200,							//限时聊天

    //测试服务器地址
    Environment: "test",                            //服务器环境
    // Environment: "release",                            //服务器环境
    INIT: "init",
    GUEST: "guest",
    ACCOUNT: "account",
    INTERFACE: "interface",
    USERCENTER: "userCenter",
    RECHARGE: "recharge",
    LOGINURL: "loginUrl",
    LOGINIP: "loginIP",
    PORT: "loginPort",

    //用户类型
    USER_TYPE_ACCOUNT: 0,                    //注册用户
    USER_TYPE_GUEST: 1,                            //游客用户
    USER_TYPE_WEIXIN: 2,                             //微信用户

    //正式服务器地址
    httpInitUrl: "http://tver.jjhgame.com/Handle/hz/init.ashx",   //app初始化接口地址
    // httpBaseUrl: "http://interface.jjhgame.com/Handle",        //web接口地址
    // httpBaseUrl:"http://thzinterface.jjhgame.com/Handle",
    httpBaseUrl:"http://thzguest.jjhgame.com/Handle",
    // httpOpenUrl: "http://user.jjhgame.com/findpasswordHZ.aspx",  //找回密码
    httpOpenUrl: "http://thzguestu.jjhgame.com",  //找回密码
    // httpUserCenter: "http://f.jjhgame.com/Handle",                  //用户中心
    httpUserCenter: "http://thzguest.jjhgame.com/Handle",
    LOGON_SERVER_DOMAIN: "nnapp.jjhgame.com",                            //登录服务器
    // LOGON_SERVER_IP: "122.226.186.38",                               //登录服务器
    // PORT_LOGON_SERVER: 9009,                                           //登陆服务器
    LOGON_SERVER_IP: "183.146.209.139",                               // 测试登录服务器
    PORT_LOGON_SERVER: 9008,                                           //测试登陆服务器
    

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
    //宏定义

    //游戏状态
    GS_FREE: 0,                               //空闲状态
    GS_PLAYING: 100,                             //游戏状态

    //////////////////////////////////////////////////////////////////////////
    //IPC 网络事件

    IPC_MAIN_SOCKET: 1,                               //网络消息

    IPC_SUB_SOCKET_SEND: 1,                               //网络发送
    IPC_SUB_SOCKET_RECV: 2,                               //网络接收

    IPC_MAIN_CONFIG: 2,                               //配置信息

    IPC_SUB_SERVER_INFO: 1,                               //房间信息
    IPC_SUB_COLUMN_INFO: 2,                               //列表信息

    //////////////////////////////////////////////////////////////////////////
    //IPC 用户信息

    IPC_MAIN_USER: 3,                               //用户信息

    IPC_SUB_USER_COME: 1,                               //用户信息
    IPC_SUB_USER_STATUS: 2,                               //用户状态
    IPC_SUB_USER_SCORE: 3,                               //用户积分
    IPC_SUB_GAME_START: 4,                               //游戏开始
    IPC_SUB_GAME_FINISH: 5,                               //游戏结束
    IPC_SUB_UPDATE_FACE: 6,                               //更新头像
    IPC_SUB_MEMBERORDER: 7,                               //更新头像

    //////////////////////////////////////////////////////////////////////////
    //IPC 控制信息

    IPC_MAIN_CONCTROL: 4,                               //控制信息

    IPC_SUB_START_FINISH: 1,                               //启动完成
    IPC_SUB_CLOSE_FRAME: 2,                               //关闭框架
    IPC_SUB_JOIN_IN_GAME: 3,                               //加入游戏

    //////////////////////////////////////////////////////////////////////////
    //网络命令码

    MDM_GF_GAME: 99,                              //游戏消息
    MDM_GF_FRAME: 98,                              //框架消息
    MDM_GF_PRESENT: 97,                              //礼物消息
    MDM_GF_BANK: 96,                              //银行消息

    SUB_GF_INFO: 111,                             //游戏信息
    SUB_GF_USER_READY: 112,                             //用户同意
    SUB_GF_LOOKON_CONTROL: 113,                             //旁观控制
    SUB_GF_KICK_TABLE_USER: 114,                             //踢走用户
    SUB_GF_WRITE_MATCH_SCORE: 115,                             //写比赛成绩

    SUB_GF_OPTION: 116,                             //游戏配置
    SUB_GF_SCENE: 117,                             //场景信息

    SUB_GF_USER_CHAT: 118,                             //用户聊天

    SUB_GF_MESSAGE: 119,                             //系统消息

    //SUB_GF_GIFT: 400,                             //赠送消息

    SUB_GF_BANK_STORAGE: 250,                             //银行存储
    SUB_GF_BANK_GET: 251,                             //银行提取
    SUB_GF_BANK_PRESENT: 252,                             //赠送金币
    SUB_GF_BANK_MODIFY_PASS: 253,                             //修改密码
    SUB_GF_BANK_QUERY: 254,                             //查询金币
    SUB_GF_BANK_PRESENT_QUREY: 255,                             //查询用户
    SUB_GF_BANK_CLOSE: 256,                             //退出
    SUB_GF_TRAN_RECORD: 257,                             //转帐记录
    SUB_GF_USER_INFO_QUREY: 258,                             //查询用户
    SUB_GF_USER_RECHARGE: 259,                             //用户充值

    SUB_GF_FLOWER_ATTRIBUTE: 530,                             //鲜花属性
    SUB_GF_FLOWER: 531,                             //鲜花消息
    SUB_GF_EXCHANGE_CHARM: 532,                             //兑换魅力

    SUB_GF_FLOWER_MB: 533,								//手机端送人气值

    SUB_GF_PROPERTY: 510,                             //道具消息
    SUB_GF_PROPERTY_RESULT: 511,                             //道具结果
    SUB_GF_RESIDUAL_PROPERTY: 512,                             //剩余道具
    SUB_GF_PROP_ATTRIBUTE: 513,                             //道具属性
    SUB_GF_PROP_BUGLE: 514,                             //喇叭道具
    SUB_GF_QUERY_USER_INFO: 515,                             //鲜花消息
    SUB_GF_SEND_HONG_BAO: 516,                             //发红包
    SUB_GF_QIANG_HONG_BAO: 517,                             //发红包

    SUB_GF_PRESENT_RESULT: 519,								//送人气值结果

    SUB_GF_TABLETALK_UP: 703,								//语音聊天上行
    SUB_GF_TABLETALK_DOWN: 704,							//语音聊天下行
    SUB_GF_QUICKPHRASE_UP: 705,							//发送快捷短语上行
    SUB_GF_QUICKPHRASE_DOWN: 706,								//发送快捷短语下行

    //消息类型
    SMT_INFO: 0x0001,                          //信息消息
    SMT_EJECT: 0x0002,                          //弹出消息
    SMT_GLOBAL: 0x0004,                          //全局消息
    SMT_CLOSE_GAME: 0x1000,                          //关闭游戏

    //发送场所
    LOCATION_GAME_ROOM: 1,                               //游戏房间
    LOCATION_PLAZA_ROOM: 2,                               //大厅房间

}
module.exports = GlobalDef;
