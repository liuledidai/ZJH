var GameLogic = {};
//宏定义
GameLogic.MAX_COUNT = 3;									//最大数目
GameLogic.DRAW = 2;									        //和局类型

//数值掩码
GameLogic.LOGIC_MASK_COLOR = 0xF0;							//花色掩码
GameLogic.LOGIC_MASK_VALUE = 0x0F;							//数值掩码

//扑克类型
GameLogic.CT_SINGLE = 1;									//单牌类型
GameLogic.CT_DOUBLE = 2;								    //对子类型
GameLogic.CT_SHUN_ZI = 3;									//顺子类型
GameLogic.CT_JIN_HUA = 4;									//金花类型
GameLogic.CT_SHUN_JIN = 5;									//顺金类型
GameLogic.CT_BAO_ZI = 6;									//豹子类型
GameLogic.CT_SPECIAL = 7;									//特殊类型

//获取数值
GameLogic.getCardValue = function (cbCardData) {
    return (cbCardData & GameLogic.LOGIC_MASK_VALUE);
};
//获取花色
GameLogic.getCardColor = function (cbCardData) {
    return (cbCardData & GameLogic.LOGIC_MASK_COLOR);
};
//逻辑数值
GameLogic.getCardLogicValue = function (cbCardData) {
    var cbCardValue = GameLogic.getCardValue(cbCardData);

    if (cbCardValue == 1) {
        cbCardValue = cbCardValue + 13;
    }
    return cbCardValue;
};
GameLogic.sortCard = function (cardData) {
    var cardDataTmp = [];
    for (var index = 0; index < cardData.length; index++) {
        cardDataTmp[index] = cardData[index];
    }
    //先排颜色
    for (var i = 0; i < cardDataTmp.length; i++) {
        for (var j = 0; j < cardDataTmp.length - i; j++) {
            if (cardDataTmp[j] < cardDataTmp[j + 1]) {
                [cardDataTmp[j], cardDataTmp[j + 1]] = [cardDataTmp[j + 1], cardDataTmp[j]];
            }
        } 
    }
    //再排大小
    for (var i = 0; i < cardDataTmp.length; i++) {
        for (var j = 0; j < cardDataTmp.length - i; j++) {
            if (GameLogic.getCardLogicValue(cardDataTmp[j]) < GameLogic.getCardLogicValue(cardDataTmp[j + 1]) ) {
                [cardDataTmp[j], cardDataTmp[j + 1]] = [cardDataTmp[j + 1], cardDataTmp[j]];
            }
        }
    }
    return cardDataTmp;
};
//获得牌型
GameLogic.getCardType = function (card) {
    if (card.length !== GameLogic.MAX_COUNT) {
        return false;
    }
    var cardData = GameLogic.sortCard(card);
    var cbSameColor = true;
    var bLineCard = true;
    var cbFirstColor = GameLogic.getCardColor(cardData[0]);
    var cbFirstValue = GameLogic.getCardLogicValue(cardData[0]);

    //牌型分析
    for (var index = 0; index < cardData.length; index++) {
        if (cbFirstColor !== GameLogic.getCardColor(cardData[index])) {
            cbSameColor = false;
        }
        if (cbFirstValue !== GameLogic.getCardLogicValue(cardData[index]+index)) {
            bLineCard = false;
        }
        if (cbSameColor === false && bLineCard === false) {
            break;
        }
    }
    //特殊A23
    if (false === bLineCard) {
        var bOne = false;
        var bTwo = false;
        var bThree = false;
        for (var index = 0; index < cardData.length; index++) {
            if (GameLogic.getCardValue(cardData[index]) === 1) {
                bOne = true;
            }
            else if (GameLogic.getCardValue(cardData[index]) === 2) {
                bTwo = true;
            }
            else if (GameLogic.getCardValue(cardData[index]) === 3) {
                bThree = true;
            }

            if (bOne && bTwo && bThree) {
                bLineCard = true;
            }
        }
    }
    //顺金类型
    if (cbSameColor && bLineCard) {
        return GameLogic.CT_SHUN_JIN;
    }
    //顺子类型
    if ( (false === cbSameColor) && bLineCard) {
        return GameLogic.CT_SHUN_ZI;
    }
    //金花类型
    if (cbSameColor && (false === bLineCard) ) {
        return GameLogic.CT_JIN_HUA;
    }
    //牌型分析
    var bDouble = false;
    var bPanther = true;
    //对牌分析
    for (var i = 0; i < cardData.length - 1; i++) {
        for (var j = i+1; j < cardData.length; j++) {
            if (GameLogic.getCardLogicValue(cardData[i]) === GameLogic.getCardLogicValue(cardData[j])) {
                bDouble = true;
                break;
            }
        }
        if (bDouble) {
            break;
        }
    }
    //三条(豹子)分析
    for (var i = 0; i < cardData.length; i++) {
        if (bPanther && cbFirstValue !== GameLogic.getCardLogicValue(cardData[i])) {
            bPanther = false;
        }
    }
    //对子和豹子判断
    if (bDouble) {
        if (bPanther) {
            return GameLogic.CT_BAO_ZI;
        }
        else {
            return GameLogic.CT_DOUBLE;
        }
    }
    //特殊235
    var bTwo = false;
    var bThree = false;
    var bFive = false;
    for (var index = 0; index < cardData.length; index++) {
        if (GameLogic.getCardValue(cardData[index]) === 2) {
            bTwo = true;
        }
        else if (GameLogic.getCardValue(cardData[index]) === 3) {
            bThree = true;
        }
        else if (GameLogic.getCardValue(cardData[index]) === 5) {
            bFive = true;
        }

        if ( bTwo && bThree && bFive) {
            return GameLogic.CT_SPECIAL;
        }
    }

    return GameLogic.CT_SINGLE;
};


module.exports = GameLogic;