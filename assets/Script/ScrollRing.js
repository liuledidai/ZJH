cc.Class({
    extends: cc.Component,

    properties: {
        isFocusMode:true,
        isVertival:false,
        speedLimit:1,
    },

    // use this for initialization
    onLoad: function () {
        // this.init();
    },
    init:function(){
        this._bIsInit = true;
        this._acceleration = 1.5;
        this._farLeftIdx = 0;
        this.speedLimit = 1;
        this._minScale = 0.8;
        this._totalMoveDist = 0;
        this._clickAbleDist = 10;
        this._touchState = undefined;
        this._initFocusId = 0;
        var spacecount = 0;
        var layout = this.node.getComponent(cc.Layout);
        if(layout)layout.enabled = false;
        if(this.node.childrenCount > 1){
            for(var i = 0;i < this.node.childrenCount;i++){
                this.node.children[i].tag = i;
            }
            
            if(this.isVertival){
                spacecount = Math.abs(this.node.children[0].getPositionY() - this.node.children[this.node.childrenCount-1].getPositionY());
            }
            else{
                spacecount = Math.abs(this.node.children[0].getPositionX() - this.node.children[this.node.childrenCount-1].getPositionX());
            }
            this._space = spacecount/(this.node.childrenCount-1);
            
            console.log("this.speedLimit",this.speedLimit);
            if(this.speedLimit < 3){
                this._calcSpeed = this.calcSpeedForDist(this.speedLimit*this._space/2,this._acceleration);
            }
        }else{
            console.log("error:no children");
            this._space = 0;
        }
    },
    start:function(){
        console.log("_updateToFocus _bIssetFocusid = ",this._bIssetFocusid)
        if (this._bIssetFocusid) {
            // console.log("_updateToFocus _bIssetFocusid = ",this._bIssetFocusid)
            return;
        }
        console.log("_updateToFocus start");
        if(this.isFocusMode && this._bIsInit){
            this._updateToFocus("init");
        }
        // this._updateToFocus(0);
        // this._updatePostion();
    },
    onEnable:function(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    onDisable:function(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    onTouchStart:function(param){
        if(this.node.childrenCount < 1){return false;}
        if(this._isMoving)return;
        //if(this._touchState != undefined){return false;}

        this._touchState = "start";
        this._totalMoveDist = 0;
        this._touchStartNode = undefined;
        this._moveDirection = 0;
        this._speed = 0;
        this._startFocusid = this._focusid;
        var pt = new cc.Vec2(param.touch.getLocation());
        for(var i = 0; i < this.node.childrenCount;i++){
            if(this.node.children[i].getBoundingBoxToWorld().contains(pt)){
                this._touchStartNode = this.node.children[i];
                this.setItemClickState(this._touchStartNode,"pressed");
                break;
            }
        }
    },
    
    onTouchMove:function(param){
        if(this._isMoving)return;
        this._touchState = "move";
        var prevPoint = new cc.Vec2(param.touch.getPreviousLocation());
        var movePoint = new cc.Vec2(param.touch.getLocation());
        var adjustPoint = movePoint.sub(prevPoint);
        
        var speed = undefined;
        if(this.isVertival){
            speed = adjustPoint.y;
        }else{
            speed = adjustPoint.x;
        }
        if(this._moveDirection != (speed > 0)?1:-1){//changed direction
            this._moveDirection = (speed > 0)?1:-1;
            this._speed = 0;
        }
        if(Math.abs(this._speed) < Math.abs(speed)){this._speed = speed}

        this._totalMoveDist += Math.abs(adjustPoint.x);
        if(this._totalMoveDist >= this._clickAbleDist && this._touchStartNode){
            this.setItemClickState(this._touchStartNode,"normal");
        }
        // console.log("adjustPoint",adjustPoint);
        for(var i = 0; i < this.node.childrenCount;i++){
            var pt = this.node.children[i].getPosition();
            if(this.isVertival){
                pt.y += adjustPoint.y;
            }else{
                pt.x += adjustPoint.x;
            }
            this.node.children[i].setPosition(pt);
        }
        this._updatePostion();
        this._updateToFocus("stateOnly");
    },
    calcSpeedForDist:function(dist,accele){
        var speed = accele +1;
        while(true){
            var tmpdist = 0,tmpspeed = speed;
            while(tmpspeed > accele){
                tmpdist += tmpspeed;
                tmpspeed -= accele;
            }
            
            if(tmpdist >= dist){
                return speed-1;
            }
            speed++;
        }
    },
    onTouchEnd:function(param){
        if(this._isMoving)return;
        this._touchState = "touchend";
        
        if(this.speedLimit == 1){
            if(Math.abs(this._speed) > 10){
                if(this._startFocusid == this._focusid){
                    this._updateToFocus((this._focusid+(this._speed>0?this.node.childrenCount-1:1))%this.node.childrenCount);
                }else{
                    this._updateToFocus();
                }
                this._speed = undefined;
                // console.log("this._calcSpeed",this._calcSpeed);
                // var tmpnode = this.node.children[this._focusid];
                // var tmpdist = Math.abs(this.isVertival?tmpnode.getPositionY():tmpnode.getPositionX());
                // this._speed = this.calcSpeedForDist(tmpdist,this._acceleration)*(this._speed<0?-1:1);
            }
        }else if(this.speedLimit){
            if(this.speedLimit < 3){
                this._speed = this._calcSpeed*(this._speed<0?-1:1);
            }else{
                this._speed = Math.min(this._speed ,this.speedLimit*(this._speed<0?-1:1));
            }
        }
        
        if(this._totalMoveDist < this._clickAbleDist && this._touchStartNode){//check click able;
            var endPoint = new cc.Vec2(param.touch.getLocation());
            if(this._touchStartNode.getBoundingBoxToWorld().contains(endPoint)){
                if(this.isFocusMode && this._touchStartNode.tag != this._focusid){
                    this._updateToFocus(this._touchStartNode.tag);
                }else{
                    this.onClickItem(this._touchStartNode);
                    this.setItemClickState(this._touchStartNode,"normal");
                }
            }
        }
    },
    setItemFocusState:function(itemNode,bFocus){
        this.setItemColor(itemNode,bFocus?"normal":"gray");
    },
    setItemColor:function(itemNode,clr){
        if(clr == "gray"){
            clr = cc.color(125,125,125,125);
        }else if(clr == "normal"){
            clr = cc.color(255,255,255,255);
        }else if( typeof clr == "string"){
            console.log("not buidin color:",clr);
            return;
        }
        itemNode.color = clr;
        for(var i = 0;i < itemNode.childrenCount;i++){
            itemNode.children[i].color = clr;
        }
    },
    setItemClickState:function(itemNode,state){
        if(this.isFocusMode){
            if(itemNode != this.node.children[this._focusid]){
                return;
            }
        }
        this.setItemColor(itemNode,state == "pressed"?"gray":"normal");
    },
    
    _updateFocusScale:function(){
        for(var i = 0;i < this.node.childrenCount;i++){
            var ch = this.node.children[i];
            var tmpdist = Math.abs(this.isVertival?ch.getPositionY():ch.getPositionX());
            if(tmpdist > this._space){
                ch.setScale(this._minScale);
            }else{
                var scale = this._minScale + (1 - this._minScale)*((this._space-tmpdist)/this._space);
                ch.setScale(scale);
            }
        }
    },
    _updatePostion:function(mdir){
        if(this._moveDirection == 1){//1:right ||top
            var node = this.node.children[this._farLeftIdx];
            var pt = node.getPosition();
            var size = node.getContentSize();
            var beyondline = undefined,moveTail = undefined;
            
            if(this.isVertival){
                beyondline = this.node.getPositionY() - this.node.getContentSize().height/2;
                if(pt.y - size.height/2 > beyondline){
                    moveTail = (this._farLeftIdx+this.node.childrenCount-1)%this.node.childrenCount;
                }
            }else{
                beyondline = this.node.getPositionX() - this.node.getContentSize().width/2;
                //console.log("update postion",beyondline,pt.x - size.width/2);
                if(pt.x - size.width/2 > beyondline){
                    moveTail = (this._farLeftIdx+this.node.childrenCount-1)%this.node.childrenCount;
                }
            }
            if(moveTail != undefined){
                var tail = this.node.children[moveTail];
                if(this.isVertival){
                    tail.setPositionY(this.node.children[this._farLeftIdx].getPositionY()-this._space);
                }else{
                    tail.setPositionX(this.node.children[this._farLeftIdx].getPositionX()-this._space);
                }
                this._farLeftIdx = moveTail;
            }
        }else{
            var tailidx = (this._farLeftIdx+this.node.childrenCount-1)%this.node.childrenCount;
            var node = this.node.children[tailidx];
            var pt = node.getPosition();
            var size = node.getContentSize();
            var beyondline = undefined,moveHead = undefined;
            if(this.isVertival){
                beyondline = this.node.getPositionY() + this.node.getContentSize().height/2;
                if(pt.y + size.height/2 < beyondline){
                    moveHead = this._farLeftIdx;
                }
            }else{
                beyondline = this.node.getPositionX() + this.node.getContentSize().width/2;
                //console.log("update postion",beyondline,pt.x + size.width/2,this._farLeftIdx);
                if(pt.x + size.width/2 < beyondline){
                    moveHead = this._farLeftIdx;
                }
            }
            
            if(moveHead != undefined){
                // console.log("move postion",moveHead,tailidx);
                var head = this.node.children[moveHead];
                if(this.isVertival){
                    head.setPositionY(this.node.children[tailidx].getPositionY()+this._space);
                }else{
                    head.setPositionX(this.node.children[tailidx].getPositionX()+this._space);
                }
                this._farLeftIdx = (moveHead+1)%this.node.childrenCount;
            }
        }
    },
    _updateToFocus:function(focusid){
        if(!this.isFocusMode)return;
        if(this._isMoving){
            this.node.stopAllActions();
            for(var i = 0; i < this.node.childrenCount;i++){
                this.node.children[i].stopAllActions();
            }
            this._focusid = undefined;
        }
        var focusChanged = false,tmpfocusid = this._focusid;
        if(focusid == undefined || focusid == "stateOnly" ||focusid == "init"){
            var dist = 1000;
            for(var i = 0; i < this.node.childrenCount;i++){
                var tmpdist = Math.abs(this.node.children[i].getPositionX());
                if(this.isVertival ){
                    if(Math.abs(this.node.children[i].getPositionY()) < dist){
                        tmpfocusid = i;
                        dist = Math.abs(this.node.children[i].getPositionY());
                    }
                }else{
                    if(Math.abs(this.node.children[i].getPositionX()) < dist){
                        tmpfocusid = i;
                        dist = Math.abs(this.node.children[i].getPositionX());
                    }
                }
                if(focusid == "init"){this.onFocusChange("loseFocus",this.node.children[i]);}
            }
            if(focusid == "init" ){
                tmpfocusid = this._initFocusId !== undefined?this._initFocusId: tmpfocusid;
            }
            focusChanged = (this._focusid !== tmpfocusid);
            if(focusChanged){
                if(this._focusid >= 0){this.onFocusChange("loseFocus",this.node.children[this._focusid]);}
                this._focusid = tmpfocusid;
            }
        }else{
            focusChanged = this._focusid !== focusid;
            if(focusChanged && this._focusid >= 0)this.onFocusChange("loseFocus",this.node.children[this._focusid]);
            this._focusid = focusid;
        }
        
        var movesub = this.node.children[this._focusid].getPosition();
        var time = Math.abs(this.isVertival?movesub.y:movesub.x)/1000;
        if(time > 0.4)time = 0.4;
        
        if(focusid == "stateOnly" || time == 0){
            for(var i = 0; i < this.node.childrenCount;i++){
                this.setItemFocusState(this.node.children[i],i == this._focusid);
            }
            this._updateFocusScale();
            if(focusChanged){this.onFocusChange("focused",this.node.children[this._focusid]);}
        }else if(time != 0){
            this._isMoving = true;
            this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(()=>{
                this._touchState = undefined;
                this._isMoving = undefined;
                for(var i = 0; i < this.node.childrenCount;i++){
                    this.setItemFocusState(this.node.children[i],i == this._focusid);
                }
                if(focusChanged){this.onFocusChange("focused",this.node.children[this._focusid]);}
            })));
            for(var i = 0; i < this.node.childrenCount;i++){
                var movedist = this.node.children[i].getPosition().sub(movesub);
                var move = cc.moveTo(time,movedist);//
                 move.easing(cc.easeOut(3.0));
                this.node.children[i].runAction(move);
            }
            this._touchState = "focusing";
            if(this.isVertival){
                this._moveDirection = this.node.children[this._focusid].getPositionY() < 0?1:-1;
            }else{
                this._moveDirection = this.node.children[this._focusid].getPositionX() < 0?1:-1;
            }
        }
    },
    update:function(dt){
        //console.log("update",dt);
        
        if (!this._bIsInit) return;
        
        if(this._touchState == "focusing"){
            this._updatePostion();
            this._updateFocusScale();
        }
        if(this._speed != undefined && this._touchState == "touchend"){
            // console.log("update",this._speed,this._space,this._touchState);

            if(this.isFocusMode && (Math.abs(this._speed) < 5)){
                this._updateToFocus();
                this._speed = undefined;
            }else if(this._speed != 0){
                var dist = this._speed;
                if(Math.abs(this._speed) <= this._acceleration){
                    this._speed = undefined;
                    this._touchState = undefined;
                }
                this._speed -= (this._speed < 0)?-this._acceleration:this._acceleration;
                for(var i = 0; i < this.node.childrenCount;i++){
                    var pt = this.node.children[i].getPosition();

                    if(this.isVertival){
                        pt.y += dist;
                    }else{
                        pt.x += dist;
                    }
                    this.node.children[i].setPosition(pt);
                }
                this._updatePostion();
                this._updateFocusScale();
            }else{    
                this._speed = undefined;
            }
        }
    },
    addChild:function(child){
        var tailidx = (this._farLeftIdx+this.node.childrenCount-1)%this.node.childrenCount;
        this.node.addChild(child);
        var pt = this.node.children[tailidx].getPosition();
        if(this.isVertival){
            pt.y += this._space;
        }else{
            pt.x += this._space;
        }
        child.setPosition(pt);
    },
    setFocusid:function(focusid){
        this._bIssetFocusid = true;
        this._updateToFocus(focusid);
    },
    onClickItem:function(itemNode){
        console.log("clicked itemnode",itemNode.name);
    },
    onFocusChange:function(evName,itemNode){
        console.log("onFocusChange",itemNode.tag,evName);
        itemNode.emit(evName,{event:evName,name:itemNode.name});
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
