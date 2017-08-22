cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        m_Label_content: {
            default: null,
            type: cc.RichText,
        },
        m_Layout_btnSet: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },
    onDestroy: function () {
        // cc.sys.garbageCollect();
        console.log("[AlertView][onDestroy]");
    },
    close: function (callback) {
        if (typeof callback === "function") {
            callback();
        }
        this.node.destroy();
    },
    init: function (params) {
        var szText = params.message || "";
        console.log("[AlertView]",this.m_Label_content.horizontalAlign);
        var textAlignment;
        if (params.textAlignment !== undefined) {
            textAlignment = params.textAlignment;
        }
        else {
            textAlignment = cc.TextAlignment.CENTER;
        }
        this.m_Label_content.horizontalAlign = textAlignment;
        console.log("[AlertView]",this.m_Label_content.horizontalAlign);        
        this.m_Label_content.string = szText;
        var btnNumber = 0;
        if (params.btn && params.btn.length > 0) {
            btnNumber = params.btn.length;
        }
        else {
            params.btn = [{name:"确定"}];
            btnNumber = 1;
        }
        for (var i = 0; i < btnNumber; i++) {
            console.log("[AlertView] btn ",i,params.btn[i].name);
            let btn = this.m_Layout_btnSet.children[i];
            let btn_callback = params.btn[i].callback;
            if (!cc.isValid(btn)) break;
            btn.active = true;
            btn.on(cc.Node.EventType.TOUCH_END,()=>{
                this.close(btn_callback);
            },this);
            let label = btn.getComponentInChildren(cc.Label);
            label.string = params.btn[i].name;
        }
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
