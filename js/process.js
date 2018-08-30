(function(window) {
	function Process($processBar,$processLine,$processDot){
		return new Process.prototype.init($processBar,$processLine,$processDot);
	}

	Process.prototype = {
		constructor :Process,
		init:function($processBar,$processLine,$processDot,$voiceBar,$voiceLine,$voicesDot){
			this.$processBar = $processBar;
			this.$processLine = $processLine;
			this.$processDot = $processDot;
			this.$voiceBar = $voiceBar;
			this.$voiceLine = $voiceLine;
			this.$voicesDot = $voicesDot;
		},
		isMove:false,
		//进度条点击事件
		processClick:function(callBack){
			var $this = this;
			var barWidth = this.$processBar.width();
			this.$processBar.click(function(event) {
				var normalLeft = $(this).offset().left;
				var clickLeft = event.pageX;
				var offset = clickLeft - normalLeft;
				if(offset>=0 ||offset<=barWidth){
					$this.$processLine.css('width',clickLeft - normalLeft);
					$this.$processDot.css('left',clickLeft - normalLeft);
				}
					
				//计算点击比例值
				var value = (clickLeft-normalLeft)/$(this).width();
				callBack(value);
			});
			
		},
		//进度条拖拽事件
		processMove:function(callBack) {
			//鼠标按下
			var $this = this;
			//鼠标移动
			var normalLeft = this.$processBar.offset().left;
		    var clickLeft;
			var barWidth = this.$processBar.width();
			this.$processBar.mousedown(function() {
				$this.isMove = true;		
				$(document).mousemove(function(event) {
					clickLeft = event.pageX;
					var offset = clickLeft - normalLeft;
					if(offset>=0 && offset <= barWidth){
						$this.$processLine.css('width',clickLeft - normalLeft);
						$this.$processDot.css('left',clickLeft - normalLeft);
					}
				});
			});
			//鼠标抬起
			$(document).mouseup(function() {
				$(document).off('mousemove');
				$this.isMove = false;
				//计算比例值
				var value = (clickLeft-normalLeft)/$this.$processBar.width();
				callBack(value);
			});
		},
		setProcess:function(value) {
			if (this.isMove) return;
			if (value<0 || value>100) return;
			this.$processLine.css('width',value+'%');
			this.$processDot.css('left',value+'%');
		}
	}
	Process.prototype.init.prototype = Process.prototype;
	window.Process = Process;
})(window);