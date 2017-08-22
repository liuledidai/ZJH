var AudioMng = {
    _soundData: undefined,
    _currentBgm: undefined,
    playMusic: function (szKey) {
        szKey = szKey || this._currentBgm;
        if (szKey === undefined || szKey === "" || this._soundData === undefined) {
            return;
        }
        var szPath = "resources/" + this._soundData["base"]["base"]["background_music"][szKey];
        console.log("[AudioMng][playMusic] " + szPath);
        this._currentBgm = szKey;
        cc.audioEngine.playMusic(cc.url.raw(szPath), true);
    },
    pauseMusic: function () {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic: function () {
        cc.audioEngine.resumeMusic();
    },
    stopMusic: function () {
        this._currentBgm = "";
        cc.audioEngine.stopMusic();
    },
    _playSFX: function (clip) {
        cc.audioEngine.playEffect(clip, false);
    },
    playSFX: function (szKey) {
        if (szKey === undefined || szKey === "" || this._soundData === undefined) {
            return;
        }
        var szPath = "resources/" + this._soundData["base"]["base"]["effect"][szKey];
        var clip = cc.url.raw(szPath);
        this._playSFX(clip);
    },
    playButton: function () {
        this.playSFX("sfx_button_click");
    },
    setMusicVolume: function (volume) {
        cc.audioEngine.setMusicVolume(volume);
    },
    setEffectsVolume: function (volume) {
        cc.audioEngine.setEffectsVolume(volume);  
    },
    loadSoundData: function () {
        cc.loader.loadRes("json/sound", function (err, content) {
            console.log(content);
            AudioMng._soundData = content;
            // console.log("[GlobalUserData][init] "+JSON.stringify(GlobalUserData.shopData, null, ' '));
        });
    },

};

module.exports = AudioMng;