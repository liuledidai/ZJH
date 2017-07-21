var AudioMng = {
    playMusic: function () {
        cc.audioEngine.playMusic(cc.url.raw("resources/sounds/bgm//bgm_plaza.mp3"),true);  
    },
    pauseMusic: function () {
        cc.audioEngine.pauseMusic();  
    },
    resumeMusic: function () {
        cc.audioEngine.resumeMusic();
    },  
    _playSFX: function (clip) {
        cc.audioEngine.playEffect(clip, false);
    },

};

module.exports = AudioMng;