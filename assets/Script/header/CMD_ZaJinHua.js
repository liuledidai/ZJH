var zjh_cmd = {};


zjh_cmd.KIND_ID = 3;                                   //游戏 I D
zjh_cmd.SERVER_ID = 301;                                 //服务器 I D
zjh_cmd.GAME_PLAYER = 4;                                   //游戏人数
zjh_cmd.GAME_NAME = "诈金花";                             //游戏名字
// zjh_cmd.GAME_GENRE                      (GAME_GENRE_GOLD|GAME_GENRE_MATCH)  //游戏类型
zjh_cmd.MAX_COUNT = 3;                                   //扑克数目


zjh_cmd.SERVERADDRESS = "127.0.0.1";
zjh_cmd.SERVER_PORT = 1680;

//结束原因
zjh_cmd.GER_NO_PLAYER = 0x10;                                //没有玩家
zjh_cmd.GER_COMPARECARD = 0x20;                                //比牌结束
zjh_cmd.GER_OPENCARD = 0x30;                                //开牌结束

//游戏状态
zjh_cmd.GS_TK_FREE = 0;                                 //等待开始
zjh_cmd.GS_TK_PLAYING = 100;                              //游戏进行

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

zjh_cmd.SUB_S_GAME_START = 100;                                 //游戏开始
zjh_cmd.SUB_S_ADD_SCORE = 101;                                 //加注结果
zjh_cmd.SUB_S_GIVE_UP = 102;                                 //放弃跟注
zjh_cmd.SUB_S_COMPARE_CARD = 105;                                 //比牌跟注
zjh_cmd.SUB_S_LOOK_CARD = 106;                                 //看牌跟注
zjh_cmd.SUB_S_SEND_CARD = 103;                                 //发牌消息
zjh_cmd.SUB_S_GAME_END = 104;                                 //游戏结束
zjh_cmd.SUB_S_PLAYER_EXIT = 107;                                 //用户强退
zjh_cmd.SUB_S_OPEN_CARD = 108;                                 //开牌消息
zjh_cmd.SUB_S_WAIT_COMPARE = 109;                                 //等待比牌
zjh_cmd.SUB_S_LAST_ADD = 110;                                 //孤注一掷
// //游戏状态
// struct CMD_S_StatusFree
// {
//     LONG                                lCellScore;                         //基础积分
// };

// //游戏状态
// struct CMD_S_StatusPlay
// {
//     //加注信息
//     LONG                                lMaxCellScore;                      //单元上限
//     LONG                                lCellScore;                         //单元下注
//     LONG                                lCurrentTimes;                      //当前倍数
//     LONG                                lUserMaxScore;                      //用户分数上限
    
//     //状态信息
//     WORD                                wBankerUser;                        //庄家用户
//     WORD                                wCurrentUser;                       //当前玩家
//     BYTE                                cbPlayStatus[GAME_PLAYER];          //游戏状态
//     bool                                bMingZhu[GAME_PLAYER];              //看牌状态
//     LONG                                lTableScore[GAME_PLAYER];           //下注数目
    
//     //扑克信息
//     BYTE                                cbHandCardData[MAX_COUNT];          //扑克数据
    
//     //状态信息
//     bool                                bCompareState;                      //比牌状态
//     LONG                                lCurrentTurn;                       //当前轮数
// };

// //游戏开始
// struct CMD_S_GameStart
// {
//     //下注信息
//     LONG                                lMaxScore;                          //最大下注
//     LONG                                lCellScore;                         //单元下注
//     LONG                                lCurrentTimes;                      //当前倍数
//     LONG                                lUserMaxScore;                      //分数上限
    
//     //用户信息
//     WORD                                wBankerUser;                        //庄家用户
//     WORD                                wCurrentUser;                       //当前玩家
//     BYTE                                cbPlayStatus[GAME_PLAYER];          //游戏状态
// };

// //用户下注
// struct CMD_S_AddScore
// {
//     WORD                                wCurrentUser;                       //当前用户
//     WORD                                wAddScoreUser;                      //加注用户
//     WORD                                wCompareState;                      //比牌状态
//     LONG                                lAddScoreCount;                     //加注数目
//     LONG                                lCurrentTimes;                      //当前倍数
//     LONG                                lCurrentTurn;                       //当前轮数
//     BYTE                                cbLastAddScore;                     //是否孤注一掷
// };

// //用户放弃
// struct CMD_S_GiveUp
// {
//     WORD                                wGiveUpUser;                        //放弃用户
// };

// //比牌数据包
// struct CMD_S_CompareCard
// {
//     WORD                                wCurrentUser;                       //当前用户
//     WORD                                wCompareUser[2];                    //比牌用户
//     WORD                                wLostUser;                          //输牌用户
//     LONG                                lCurrentTurn;                       //当前轮数
//     BYTE                                cbLostCardData[MAX_COUNT];          //输家牌数据
// };

// //看牌数据包
// struct CMD_S_LookCard
// {
//     WORD                                wLookCardUser;                      //看牌用户
//     BYTE                                cbCardData[MAX_COUNT];              //用户扑克
//     BYTE                                cbLastAdd;                          //孤注一掷
// };

// //开牌数据包
// struct CMD_S_OpenCard
// {
//     WORD                                wWinner;                            //胜利用户
// };

// //孤注一掷
// struct CMD_S_LastAdd
// {
//     WORD                                wStartLastAddUser;
//     WORD                                wCompareUser[GAME_PLAYER];
//     WORD                                wLostUser[GAME_PLAYER];
//     WORD                                wCurrentUser;
//     LONG                                lCurrentTurn;
// };


// //游戏结束
// struct CMD_S_GameEnd
// {
//     LONG                                lGameTax;                           //游戏税收
//     LONG                                lGameScore[GAME_PLAYER];            //游戏得分
//     BYTE                                cbCardData[GAME_PLAYER][MAX_COUNT]; //用户扑克
//     WORD                                wCompareUser[GAME_PLAYER][4];       //比牌用户
//     WORD                                wEndState;                          //结束状态
// };

// //用户退出
// struct CMD_S_PlayerExit
// {
//     WORD                                wPlayerID;                          //退出用户
// };

// //等待比牌
// struct CMD_S_WaitCompare
// {
//     WORD                                wCompareUser;                       //比牌用户
// };

//////////////////////////////////////////////////////////////////////////

//客户端命令结构
zjh_cmd.SUB_C_ADD_SCORE = 1;                                   //用户加注
zjh_cmd.SUB_C_GIVE_UP = 2;                                   //放弃消息
zjh_cmd.SUB_C_COMPARE_CARD = 3;                                   //比牌消息
zjh_cmd.SUB_C_LOOK_CARD = 4;                                   //看牌消息
zjh_cmd.SUB_C_OPEN_CARD = 5;                                   //开牌消息
zjh_cmd.SUB_C_WAIT_COMPARE = 6;                                   //等待比牌
zjh_cmd.SUB_C_FINISH_FLASH = 7;                                   //完成动画
zjh_cmd.SUB_C_LAST_ADD = 8;                                   //孤注一掷

// //用户加注
// struct CMD_C_AddScore
// {
//     LONG                                lScore;                             //加注数目
//     WORD                                wState;                             //当前状态
// };

// //比牌数据包
// struct CMD_C_CompareCard
// {   
//     WORD                                wCompareUser;                       //比牌用户
// };

//////////////////////////////////////////////////////////////////////////

module.exports = zjh_cmd;