(function(window) {
	function Lyric(path){
		return new Lyric.prototype.init(path);
	}

	Lyric.prototype = {
		constructor:Lyric,
		init:function(path) {
			this.path = path;
		},
		times:[],
		lyrics:[],
		index:-1,
		loadLyric:function(callBack){
			var $this = this;
			$.ajax({
				url:$this.path,
				dataType:"text",
				success:function(data) {
					//解析函数解析歌词
					$this.parseLyric(data);
					callBack();
				}
			});
		},
		parseLyric:function(data) {
			var $this = this;
			this.times = [];
			this.lyrics = [];
			//this.index = -1;
			var array = data.split('\n');
			//时间正则表达式
			var timeReg = /\[(\d+:\d+\.\d+)\]/;
			//遍历取出每一条歌词
			$.each(array,function(index,ele) {
				var lrc = ele.split(']')[1];
				//排除空字符串
				if(lrc.length == 0 || lrc.length==1) return true;
				$this.lyrics.push(lrc);

				var res = timeReg.exec(ele);
				if(res == null) return true;
				var timeStr = res[1]; //00:02.23
				var res2 = timeStr.split(':');
				var Min = parseInt(res2[0])*60;
				var Sec = parseFloat(res2[1]);
				var time = parseFloat(Number(Min + Sec).toFixed(2));
				$this.times.push(time);
			});
		},
		//用来根据歌曲播放进度匹配歌词
		currentIndex:function(currentTime) {
			if(currentTime >= this.times[0]){
				this.index++;
				this.times.shift();
			}
			return this.index;
		}
	}

	Lyric.prototype.init.prototype = Lyric.prototype;
	window.Lyric = Lyric;
})(window);