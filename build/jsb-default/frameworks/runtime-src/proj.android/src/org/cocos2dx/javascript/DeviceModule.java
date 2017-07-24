package org.cocos2dx.javascript;

/**
 * Created by anxijun on 16/5/9.
 */


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Locale;
import java.util.UUID;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.provider.Settings.Secure;
import android.telephony.TelephonyManager;
import android.util.Log;

public class DeviceModule {
    private static Context context;

    private static float batteryLevel = -1;

    public static boolean isFromPushReward = false;

    public static boolean isFromPushVerify = false;
    public static void setContext(Context context)
    {
        DeviceModule.context = context;
    }

    public static void openURL(String addr)
    {
        Uri uri = Uri.parse(addr);
        context.startActivity(new Intent(Intent.ACTION_VIEW,uri));
    }

    public static float getBatteryLevel()
    {
        if(batteryLevel < -0.5f)
        {
            //初始化电池监听
            IntentFilter intentFilter = new IntentFilter();
            intentFilter.addAction(Intent.ACTION_BATTERY_CHANGED);
            batteryLevel = 0;
            context.registerReceiver(new BroadcastReceiver()
            {
                @Override
                public void onReceive(Context context, Intent intent)
                {
                    String action = intent.getAction();
                    if (action.equals(Intent.ACTION_BATTERY_CHANGED))
                    {
                        int level = intent.getIntExtra("level", 0);//电量
                        int scale = intent.getIntExtra("scale", 0);//最大电量
                        Log.d("test", level+" --- " + scale);
                        if(scale != 0)
                        {
                            batteryLevel = ((float)level) / scale;
                            if(batteryLevel < 0 )
                            {
                                batteryLevel = 0;
                            }else if(batteryLevel > 1)
                            {
                                batteryLevel = 1;
                            }
                        }else
                        {
                            batteryLevel = 0;
                        }
                    }
                }
            } , intentFilter);
        }

        return batteryLevel;
    }

    public static String getDeviceName()
    {
        assert(Build.MODEL != null);
        return Build.MODEL;
    }

    public static String getMachineName()
    {
        assert(Build.MODEL != null);
        return Build.MODEL;
    }

    public static int isAppExist(String strPacketName)
    {
        PackageInfo pinfo = null;
        try
        {
            pinfo = context.getPackageManager().getPackageInfo(strPacketName, 0);
            if(pinfo != null)
            {
                Log.d("install", "packet:" + pinfo.packageName + ", versionName:" + pinfo.versionName + ", version:" + pinfo.versionCode);
                return pinfo.versionCode;
            }
        } catch (NameNotFoundException e)
        {
            return 0;
        }
        return 0;
    }

    public static boolean openApp(String strPacketName)
    {
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(strPacketName);
        context.startActivity(intent);
        return true;
    }

    protected static boolean installApp(String strPacketName)
    {
        Intent intent = new Intent();

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(android.content.Intent.ACTION_VIEW);

        Log.d("install", Uri.parse(strPacketName).toString());
        intent.setDataAndType(Uri.parse(strPacketName), "application/vnd.android.package-archive");

        context.startActivity(intent);
        return true;
    }

    public static String getAppVersion()
    {
        try
        {
            PackageInfo info = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            assert(info.versionName != null);
            return info.versionName;
        } catch (NameNotFoundException e)
        {
            e.printStackTrace();
        }
        return null;
    }

    public static String getMacAddress()
    {
        WifiManager wifi = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        WifiInfo info = wifi.getConnectionInfo();
        String macAddr = info.getMacAddress();
        return macAddr;
    }

    public static String getMachineID() 
    {
		TelephonyManager tm = (TelephonyManager) context
				.getSystemService(Context.TELEPHONY_SERVICE);
		final String tmDevice, tmSerial, androidId;
		tmDevice = "" + tm.getDeviceId();
		tmSerial = "" + tm.getSimSerialNumber();
		androidId = ""
				+ android.provider.Settings.Secure.getString(context.getContentResolver(),
						android.provider.Settings.Secure.ANDROID_ID);
		UUID deviceUuid = new UUID(androidId.hashCode(),
				((long) tmDevice.hashCode() << 32) | tmSerial.hashCode());
		
		return md5(deviceUuid.toString());
	}

	private static long getHashCode(String s) {
		long hash = 0;

		for (int i = 0; i < s.length(); ++i) {
			hash = 31 * hash + s.charAt(i);
		}

		return hash;
	}
    
    public static String getUserIP()
    {
        WifiManager wifi = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        WifiInfo info = wifi.getConnectionInfo();
        String macIP = intToIp(info.getIpAddress());
        return macIP;
    }
    
    private static String intToIp(int i) 
    {           
        return (i & 0xFF ) + "." +       
      ((i >> 8 ) & 0xFF) + "." +       
      ((i >> 16 ) & 0xFF) + "." +       
      ( i >> 24 & 0xFF) ;  
   }   
    
    public static String getLocale()
    {
        return Locale.getDefault().getLanguage() + "-" + Locale.getDefault().getCountry();
    }

    public static String md5(String s) {
		try {
			// Create MD5 Hash
			MessageDigest digest = java.security.MessageDigest
					.getInstance("MD5");
			digest.update(s.getBytes());
			byte messageDigest[] = digest.digest();
			// Create HEX String
			StringBuffer hexString = new StringBuffer();
			for (int i = 0; i < messageDigest.length; i++) {
				String sTmp = Integer.toHexString(0xFF & messageDigest[i]);
				switch (sTmp.length()) {
				case 0:
					hexString.append("00");
					break;
				case 1:
					hexString.append("0");
					hexString.append(sTmp);
					break;
				default:
					hexString.append(sTmp);
					break;
				}
			}
			return hexString.toString().toLowerCase();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return "";
	}
    
    /*
    public static void scheduleLocalNotification(long  sec, String strMessage)
    {
        Intent intent = new Intent( context, ReceiverAlarm.class);
        intent.putExtra("type", "push_other");
        intent.putExtra("message", strMessage);
        PendingIntent appIntent = PendingIntent.getBroadcast(context, strMessage.hashCode(), intent, 0);

        AlarmManager am = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        am.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + sec * 1000, appIntent);
    }

    public static void cancelAllLocalNotifications()
    {
        String ns = Context.NOTIFICATION_SERVICE;
        NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(ns);
        mNotificationManager.cancelAll();
    }

    public static void schedulePushReward(long  sec, String strMessage)
    {
        Intent intent = new Intent( context, ReceiverAlarm.class);
        intent.putExtra("type", "push_reward");
        intent.putExtra("message", strMessage);
        PendingIntent appIntent = PendingIntent.getBroadcast(context, strMessage.hashCode(), intent, 0);

        AlarmManager am = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        am.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + sec * 1000, appIntent);
    }

    public static boolean isFromPushReward()
    {
        return isFromPushReward;
    }

    public static void schedulePushVerify(long  sec, String strMessage)
    {
        Intent intent = new Intent( context, ReceiverAlarm.class);
        intent.putExtra("type", "push_verify");
        intent.putExtra("message", strMessage);
        PendingIntent appIntent = PendingIntent.getBroadcast(context, strMessage.hashCode(), intent, 0);

        AlarmManager am = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        am.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + sec * 1000, appIntent);
    }

    public static boolean isFromPushVerify()
    {
        return isFromPushVerify;
    }*/
}
