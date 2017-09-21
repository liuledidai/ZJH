package com.jjhgame.zhajinhua.wxapi;

import java.io.File;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;

import com.jjhgame.zhajinhua.R;
import org.cocos2dx.javascript.Native;

import org.cocos2dx.javascript.Util;
import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.sdk.modelmsg.WXImageObject;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.modelmsg.WXTextObject;
import com.tencent.mm.sdk.modelmsg.WXWebpageObject;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;


public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
	
	public static String Tag = "WXEntryActivity";
	private static final int TIMELINE_SUPPORTED_VERSION = 0x21020001;
	private static WXEntryActivity sContext = null;
	public static boolean bLogonWX = false;
	private static final int THUMB_SIZE = 150;

    public static IWXAPI api;
    
	private static final int SceneSession = 0;//閸掑棔闊╅崚棰佺窗鐠囷拷
	private static final int SceneTimeline = 1; //閸掑棔闊╅崚鐗堟箙閸欏婄1�7ￄ1�7
	
	public static String ReqWxLogin = "ReqWxLogin";
	public static String ReqWxShareImg = "ReqWxShareImg";
	public static String ReqWxShareTxt = "ReqWxShareTxt";
	public static String ReqWxShareUrl = "ReqWxShareUrl";
	public static String ReqWXPay = "ReqWXPay";
	
	private static final String GMAE_TAG = "zhajapay";
	  @Override
	 public void onCreate(Bundle savedInstanceState)
	 {
	        super.onCreate(savedInstanceState);
	        sContext = this;
    	    
	        
			Intent intent = getIntent();
			String APP_ID = Native.getValue("WX_APP_ID");
			Log.d(Tag,"onCreate appid:"+APP_ID);
			
	    	api = WXAPIFactory.createWXAPI(this,APP_ID, true);
		    api.registerApp(APP_ID);
	        api.handleIntent(intent, this);
	        
			if (intent.hasExtra(ReqWxLogin)) {
	        	reqLogin();
			}
			else if(intent.hasExtra(ReqWxShareImg)){
				String ImgPath = intent.getStringExtra("ImgPath");
				int nType = intent.getIntExtra("ShareType",0);
				reqShareImg(ImgPath,nType);
			}
			else if(intent.hasExtra(ReqWxShareTxt)){
				String ShareText = intent.getStringExtra("ShareText");
				int nType = intent.getIntExtra("ShareType",0);
				reqShareTxt(ShareText,nType);
			}
			else if(intent.hasExtra(ReqWxShareUrl))
			{
				String ShareUrl = intent.getStringExtra("ShareUrl");
				String ShareTitle = intent.getStringExtra("ShareTitle");
				String ShareDesc = intent.getStringExtra("ShareDesc");
				int nType = intent.getIntExtra("ShareType",0);
				reqShareUrl(ShareUrl,ShareTitle,ShareDesc,nType);
			}
			finish();
	 }
	  
	  @Override
	  protected void onNewIntent(Intent intent) 
	  {
			super.onNewIntent(intent);
			
			setIntent(intent);
			WXEntryActivity.api.handleIntent(intent, this);
	  }
 
    public void reqLogin()
    {
    	SendAuth.Req req = new SendAuth.Req();
    	req.scope = "snsapi_userinfo";
    	req.state = GMAE_TAG;
    	WXEntryActivity.api.sendReq(req);
	    Log.d(Tag,"reqLogin!!!!");
    } 
    public void reqShareImg(String ImgPath,int nType)
    {
		File file = new File(ImgPath);
		if (!file.exists()) 
		{
		    Log.d(Tag,"reqShare file not exists:"+ImgPath);
		    return;
		}

		Bitmap bmp = BitmapFactory.decodeFile(ImgPath);
		WXImageObject imgObj = new WXImageObject(bmp);
		
		WXMediaMessage msg = new WXMediaMessage();
		msg.mediaObject = imgObj;
		
		Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
		bmp.recycle();
		msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
		
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("img");
		req.message = msg;
		if(nType==SceneTimeline )
		{
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
		}
		else if(nType==SceneSession )
		{
			req.scene = SendMessageToWX.Req.WXSceneSession;
		}
		WXEntryActivity.api.sendReq(req);
	    Log.d(Tag,"reqShare Ok:"+ImgPath);
    }
    public void reqShareTxt(String text,int nType)
    {
		// 初始化一个WXTextObject对象
		WXTextObject textObj = new WXTextObject();
		textObj.text = text;

		// 用WXTextObject对象初始化一个WXMediaMessage对象
		WXMediaMessage msg = new WXMediaMessage();
		msg.mediaObject = textObj;
		// 发�1�7�文本类型的消息时，title字段不起作用
		// msg.title = "Will be ignored";
		msg.description = text;
		
		// 构�1�7�一个Req
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("text"); // transaction字段用于唯一标识丄1�7个请汄1�7
		req.message = msg;
		if(nType==SceneTimeline )
		{
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
		}
		else if(nType==SceneSession )
		{
			req.scene = SendMessageToWX.Req.WXSceneSession;
		}
		// 调用api接口发�1�7�数据到微信
		WXEntryActivity.api.sendReq(req);
		

	    Log.d(Tag,"reqShareTxt Ok:"+text);
    }
    
    public void reqShareUrl(String url, String title,String desc,int nType)
    {
    	// 初始化一个WXTextObject对象
		WXWebpageObject textObj = new WXWebpageObject();
		textObj.webpageUrl = url;

		// 用WXTextObject对象初始化一个WXMediaMessage对象
		WXMediaMessage msg = new WXMediaMessage();
		msg.mediaObject = textObj;
		// 发�1�7�文本类型的消息时，title字段不起作用
		msg.title = title;
		msg.description = desc;
		Bitmap bitmap = BitmapFactory.decodeResource(sContext.getResources(),R.drawable.icon);		
		bitmap = Bitmap.createScaledBitmap(bitmap, 100, 100, true);
		msg.thumbData = Util.bmpToByteArray(bitmap, true);
		
		// 构�1�7�一个Req
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("webpage"); // transaction字段用于唯一标识丄1�7个请汄1�7
		req.message = msg;
		if(nType==SceneTimeline )
		{
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
		}
		else if(nType==SceneSession )
		{
			req.scene = SendMessageToWX.Req.WXSceneSession;
		}
		// 调用api接口发�1�7�数据到微信
		WXEntryActivity.api.sendReq(req);
    }

    public void reqShareTxtCB(String text,int nType)
    {
    	 // send appdata with no attachment
    	WXAppExtendObject appdata = new WXAppExtendObject("lallalallallal", "filePath");

    	boolean bValue =  appdata.checkArgs();
    	if (!bValue)
    	{
    	    Log.d(Tag,"reqShareTxtCB Error:"+text);
    	}
    	
    	WXMediaMessage msg = new WXMediaMessage();
    	msg.title ="11";
    	msg.description = "22";
    	msg.mediaObject = appdata;
    	
    	SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("appdata");
		req.message = msg;
		
		if(nType==SceneTimeline )
		{
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
		}
		else if(nType==SceneSession )
		{
			req.scene = SendMessageToWX.Req.WXSceneSession;
		}
		// 调用api接口发�1�7�数据到微信
		WXEntryActivity.api.sendReq(req);

	    Log.d(Tag,"reqShareTxtCB Ok:"+text);
    }
    
	@Override
	public void onReq(BaseReq req) 
	{
		Log.d(Tag,"public void onReq(BaseReq req) !!!!!!!");
		switch (req.getType()) 
		{
		case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX: 
			Log.d(Tag,"onReq:COMMAND_GETMESSAGE_FROM_WX");
			break;
		case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
			Log.d(Tag,"onReq:COMMAND_SHOWMESSAGE_FROM_WX");
			break;
		default:
			break;
		}

	    Log.d(Tag,"onReq:"+req.getType());
	}

	@Override
	public void onResp(BaseResp resp) {
		Log.d(Tag,"onResp(BaseReq resp) !!!!!!!");
		//微信分享
	    if (resp.getType() == ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX){
	    	Native.WxShareResultCallback(resp.errCode);
	    }
	    //微信登录
	    if (resp.getType() == ConstantsAPI.COMMAND_SENDAUTH){
			switch (resp.errCode) {
			case BaseResp.ErrCode.ERR_OK:
				SendAuth.Resp newResp = (SendAuth.Resp) resp;
			    
				if (newResp.state.toString().equals(GMAE_TAG)){
				    Native.WxLoginGetAccessToken(newResp.code);
				}
				break;
			case BaseResp.ErrCode.ERR_USER_CANCEL:
			    Native.WxLoginGetFailToken("用户取消操作");
				break;
			case BaseResp.ErrCode.ERR_AUTH_DENIED:
			    Native.WxLoginGetFailToken("微信认证失败");
				break;
			default:
			    Native.WxLoginGetFailToken("未知错误");
				break;
			}	
	    }
	}
	
	private String buildTransaction(final String type) {
		return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
	}
}
