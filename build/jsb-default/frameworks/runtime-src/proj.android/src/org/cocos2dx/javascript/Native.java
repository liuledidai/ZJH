package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxHelper;

import com.jjhgame.zhajinhua.wxapi.WXEntryActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

public class Native extends Cocos2dxHelper
{	
	public static native void WxLoginGetAccessToken(String kUrl);
	public static native void WxLoginGetFailToken(String Error);
	public static native void OpenAppByUrlCallback(String Param);;
	public static native void WxShareResultCallback(int errcode);
	public static native String getValue(String key);
	
	 public static void LoginWX(String APP_ID,String AppSecret)
	  {
		 Log.w("shisanshui","LoginWX");
		 Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
		 intent.putExtra(WXEntryActivity.ReqWxLogin,"wxlogin");
		 Cocos2dxActivity.getContext().startActivity(intent);
	  }
	 public static void ShareImageWX(String ImgPath,int nType)
     {
		 Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
		 intent.putExtra(WXEntryActivity.ReqWxShareImg,"ReqWxShareImg");
		 intent.putExtra("ImgPath",ImgPath);
		 intent.putExtra("ShareType",nType);
		 Cocos2dxActivity.getContext().startActivity(intent);
     } 
	 public static void ShareTextWX(String text,int nType)
     {
		 Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
		 intent.putExtra(WXEntryActivity.ReqWxShareTxt,"ReqWxShareTxt");
		 intent.putExtra("ShareText",text);
		 intent.putExtra("ShareType",nType);
		 Cocos2dxActivity.getContext().startActivity(intent);
     } 
	 
	 public static void ShareUrlWX(String url,String title,String desc,int nType)
     {
		 Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
		 intent.putExtra(WXEntryActivity.ReqWxShareUrl,"ReqWxShareUrl");
		 intent.putExtra("ShareUrl",url);
		 intent.putExtra("ShareTitle",title);
		 intent.putExtra("ShareDesc",desc);
		 intent.putExtra("ShareType",nType);
		 Cocos2dxActivity.getContext().startActivity(intent);
     } 
	 
	 public static void showWebView(String kUrl)
     {
		 Log.d("showWebView",kUrl);
		 Uri uri = Uri.parse(kUrl);
		 Intent it = new Intent(Intent.ACTION_VIEW, uri);    
		 Cocos2dxActivity.getContext().startActivity(it);
     }


	 public static void startSoundRecord()
	 {
		 String SoundFilePath= Environment.getExternalStorageDirectory().getAbsolutePath();  
		 String SoundFileName = "soundRecord.wav";

		 Log.d("startSoundRecord",SoundFilePath);
		 ExtAudioRecorder recorder = ExtAudioRecorder.getInstanse(false);
		 recorder.recordChat(SoundFilePath+"/",SoundFileName);
	 }
	 
	 public static String stopSoundRecord()
	 {
		 return ExtAudioRecorder.stopRecord();
	 }
}
