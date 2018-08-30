(function(window) {
	//Player类
	function Player($audio) {
		return new Player.prototype.init($audio);
	}
	Player.prototype = {
		constructor: Player,
		musicList:[],
		init: function($audio) {
			this.$audio = $audio;
			this.audio = $audio.get(0);//原生audio
		},
		currentIndex:-1,
		playMusic:function(index,music) {
			//判断是否是同一首音乐
			if(this.currentIndex == index){
				//同一首音乐---暂停
				if(this.audio.paused){
					this.audio.play();
				}else{	//同一首音乐---播放
					this.audio.pause();
				}
			}else{
				//不是同一首音乐
				this.$audio.attr('src',music.link_url);
				this.audio.play();
				this.currentIndex = index;
			}
		},
		//播放一次音乐
		playMusicOnce:function() {
			this.audio.currentTime = 0;
			this.audio.play();
		},
		//暂停音乐
		stopMusic:function() {
			this.audio.pause();
		},
		preIndex:function() {
			var index = this.currentIndex-1;
			if(index<0){
				index = this.musicList.length-1;
			}
			return index;
		},
		nextIndex:function() {
			var index = this.currentIndex + 1;
			if(index > this.musicList.length-1){
				index = 0;
			}
			return index;
		},
		//返回随机序号
		randomIndex:function() {
			//随机生成index（0~8）
			var index = Math.round((Math.random()*(this.musicList.length-1)));
			return index;
		},
		changeMusic:function(index) {
			//删除对应数据
			this.musicList.splice(index,1);
		},
		//播放时间同步
		formatTime:function(time){
			var Min = parseInt(time/60);
			var Sec = parseInt(time%60);
			if(Min<10){
				Min = '0' + Min;
			}
			if(Sec<10){
				Sec = '0' + Sec;
			}
			return (Min + ':' + Sec);
		},
		musicTimeUpDate:function(callBack){
			var $this = this;
			this.$audio.on('timeupdate',function() {
				//格式化时间函数
				var currentTime = $this.audio.currentTime;
				var durationTime = $this.audio.duration;
				var strCurrent = $this.formatTime(currentTime);
				callBack(currentTime,durationTime,strCurrent);
			});
		},
		//音乐跳转方法
		musicSeekTo:function(value) {
			if(isNaN(value)) return;
			this.audio.currentTime = this.audio.duration * value;
		},
		//音量控制方法
		musicVoiceSeekTo:function(value){
			if(isNaN(value)) return;
			if(value>=0 && value<=1){
				this.audio.volume = value;
			}
		}
	}
	Player.prototype.init.prototype = Player.prototype;
	window.Player = Player;
})(window);