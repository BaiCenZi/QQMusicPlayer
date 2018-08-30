$(function() {
	//自定义滚动条
	$(".list").mCustomScrollbar();

	var $audio = $('audio');
	var player = new Player($audio);
	//播放模式记录
	var list_type = 1;

	//初始化进度条
	var processBar;
	var voiceBar;
	var lyric;
	initProcess();
	//鼠标响应事件
	mouseEvent();
	function mouseEvent(){
		$('.list_option li').hover(function() {
			$(this).css({
				borderColor:'#fff',
				opacity:1,
			});
		},function() {
			$(this).css({
				borderColor:'#7f7f7f',
				opacity:0.5,
			});
		});

		//鼠标移入播放列表
		$('.list').delegate('.musiclist','mouseenter',function() {
			//高亮
			$(this).children('div').css({
				opacity:1,
			});
			//显示隐藏菜单
			$(this).find('.list_menu').css("display","block");
			$(this).find('.list_del').css("display","block");
			$(this).find('.list_length>span').css("display","none");
			$(this).find('.list_title').toggleClass('list_title list_title2');
		});
		//鼠标移出播放列表
		$('.list').delegate('.musiclist','mouseleave',function() {
			$(this).children('div').css({
				opacity:0.5,
			});
			$(this).find('.list_menu').css("display","none");
			$(this).find('.list_del').css("display","none");
			$(this).find('.list_length>span').css("display","block");
			$(this).find('.list_title2').toggleClass('list_title list_title2');
			/*选中的一列不再变暗*/
			if($(this).find('.checkbox i').attr('class')=='checked'){
				$(this).find('.checkbox').css('opacity','1');
			}
			if($(this).find('.list_menu>a:nth-child(1)').attr('class')=='list_stop'){
				$(this).children('div').css('opacity','1');
			}
		});		
		
		$('.list').delegate('.checkbox','click',function() {
			$(this).children('i').toggleClass('checked');
		});
		$('.list').delegate('.list_menu>a','mouseenter',function() {
			$(this).css('opacity','1');
		});
		$('.list').delegate('.list_menu>a','mouseleave',function() {
			$(this).css('opacity','0.5');
		});
		$('.list').delegate('.list_del>a','mouseenter',function() {
			$(this).css('opacity','1');
		});
		$('.list').delegate('.list_del>a','mouseleave',function() {
			$(this).css('opacity','0.5');
		});	

		//播放按钮的同步
		$('.list').delegate('.list_play,.list_stop','click',function() {
			var $item = $(this).parents('.musiclist'); 
			$(this).toggleClass('list_play list_stop');
			player.playMusic($item.get(0).index,$item.get(0).music);
			initMusicInfo($item.get(0).music);
			initMusicLyric($item.get(0).music);
			//将其他处于播放状态的按钮置为暂停
			$item.siblings().find('.list_stop').attr('class','list_play');
			$item.siblings().find('.list_wave').css('display','none');
			$item.siblings().find('.list_number').css('display','block');
			$item.siblings().children('div').css('opacity','0.5');
			if($(this).attr('class')=='list_stop'){
				//歌曲正在播放
				$('.play2').removeClass('playMusic');
				$('.play2').addClass('stop');
				//$(this).parents('.musiclist').children('div').css({opacity:1 !important});
				$item.find('.list_number').css('display','none');
				$item.find('.list_wave').css('display','block');
				$item.children('div').css({
					opacity:1,
				});
			}
			else{
				$('.play2').removeClass('stop');
				$('.play2').addClass('playMusic');
				$item.find('.list_number').css('display','block');
				$item.find('.list_wave').css('display','none');
			}
		});

		//切换按钮
		$('.change').click(function() {
			$(this).toggleClass('change changed');
			if($(this).attr('class')=='changed'){
				$(this).find('p').text('ON');
				$('.content_left').css('display','none');
				$('.content_right').css({
					margin:'auto',
					float:'none'
				});
				$('.singer_img').css('display','none');
				$('.singer_info').css('display','none');
				$('.singer_lyrics').css({
					height:'350px',
					lineHeight:'43px',
					fontSize:'22px',
					marginTop:'90px'
				});
			}
			else{
				$(this).find('p').text('OFF');
				$('.content_left').css('display','block');
				$('.content_right').css({
					margin:'auto',
					float:'right'
				});
				$('.singer_img').css('display','block');
				$('.singer_info').css('display','block');
				$('.singer_lyrics').css({
					height:'75px',
					lineHeight:'25px',
					fontSize:'16px',
					marginTop:'50px'
				});
			}
		});
		//音乐播放按钮
		$('.play2').click(function() {
			$(this).toggleClass('playMusic stop');
			if(player.currentIndex==-1){
				//没有播放过音乐
				$('.musiclist').eq(0).find('.list_menu a:nth-child(1)').trigger('click');
			}else{
				//播放过音乐
				$('.musiclist').eq(player.currentIndex).find('.list_menu a:nth-child(1)').trigger('click');
			}
		});
		//播放模式切换按钮
		$('.model1').click(function() {
			list_type++;
			$(this).removeClass();
			switch(list_type){
				case 1:
					$(this).addClass('opations model1');
					break;
				case 2:
					$(this).addClass('opations model2');
					break;
				case 3:
					$(this).addClass('opations model3');
					break;
				case 4:
					$(this).addClass('opations model4');
					break;
				default:
					list_type = 1;
					$(this).addClass('opations model1');
					break;
			}
		});
		//喜欢按钮
		$('.like').click(function() {
			$(this).toggleClass('like like2');
		});
		//音量按钮
		$('.volume_icon').click(function() {
			//图标切换
			$(this).toggleClass('volume_icon volume_icon2');
			//声音切换
			if($(this).attr('class')=='volume_icon2'){
				//没有声音
				player.musicVoiceSeekTo(0);
			}
			else{
				//有声音
				player.musicVoiceSeekTo(1);
			}
		});

		//底部上一首按钮点击
		$('.play_pre').click(function() {
			if(list_type==4){
				var randomNum = player.randomIndex();
				var $randomBtn = $('.musiclist').eq(randomNum).find('.list_menu a:nth-child(1)');
				//console.log($randomBtn.attr('class'));
				if($randomBtn.attr('class')!='list_stop'){//歌曲正在播放
					$randomBtn.trigger('click');
				}
			}
			else{
				$('.musiclist').eq(player.preIndex()).find('.list_menu a:nth-child(1)').trigger('click');
			}
		});
		//底部下一首按钮点击
		$('.play_next').click(function() {
			switch(list_type){
				case 1:
				case 2:
				case 3:
					$('.musiclist').eq(player.nextIndex()).find('.list_menu a:nth-child(1)').trigger('click');
					break;
				case 4: //随机播放
					var randomNum = player.randomIndex();
					var $randomBtn = $('.musiclist').eq(randomNum).find('.list_menu a:nth-child(1)');
					//console.log($randomBtn.attr('class'));
					if($randomBtn.attr('class')=='list_stop'){
						//歌曲正在播放时重新播放
						player.playMusicOnce();
						initMusicLyric($('.musiclist').eq(player.currentIndex).get(0).music);
					}else{
						$randomBtn.trigger('click');
					}
			}			
		});

		//删除按钮
		$('.list').delegate('.list_del','click',function() {
			var $item = $(this).parents('.musiclist');
			//判断当前播放的歌曲
			if(player.currentIndex == $item.get(0).index){
				//$('.musiclist').eq(player.nextIndex()).find('.list_menu a:nth-child(1)').trigger('click');
				$('.play_next').trigger('click');
			}
			$item.remove();
			player.changeMusic($item.get(0).index);

			//重新排序
			$('.musiclist').each(function(index,ele) {
				ele.index = index;
				$(ele).find('.list_number').text(index + 1);
			});
		});
		//监听播放进度
		player.musicTimeUpDate(function(currentTime,durationTime,strCurrent) {
			//同步时间
			$('.processTime span:nth-child(1)').text(strCurrent);
			//同步进度条
			//计算进度条比例
			var value = currentTime/durationTime*100;
			processBar.setProcess(value);
			//同步歌词
			var index = lyric.currentIndex(currentTime);
			var $item = $('.singer_lyrics>ul>li').eq(index);
			$item.addClass('lyrics_cur');
			$item.siblings().removeClass('lyrics_cur');
			//设置歌词滚动
			if(index<=0) return;
			$('.singer_lyrics>ul').css({
				marginTop:(-index*25)
			});
			//歌曲播放完毕
			if(currentTime == durationTime){
				switch(list_type){
					case 1: 	 //顺序
						if(player.currentIndex != player.musicList.length-1){
							$('.play_next').trigger('click');
						}else{
							$('.musiclist').eq(player.currentIndex).find('.list_menu a:nth-child(1)').trigger('click');
							player.stopMusic();
						}
						break;
					case 2: 	 //单曲
						player.playMusicOnce();
						//初始化歌词信息
						initMusicLyric($('.musiclist').eq(player.currentIndex).get(0).music);
						break;
					case 3:      //全部
					case 4: 	 //随机
						$('.play_next').trigger('click');
						break;
				}
			}
		});
	}

	//歌曲列表加载函数
	getTheList();
	function getTheList(){
		$.ajax({
			url:"./source/musiclist.json",
			dataType:"json",
			success:function(data) {
				player.musicList = data;
				$.each(data,function(index,ele) {
					//创建一条数据
					var $item = createMusicItem(index,ele);
					$('.list ul').append($item);
				});
				//初始化歌曲信息
				initMusicInfo(data[0]);
				//初始化歌词信息
				initMusicLyric(data[0]);
			},
		});
	}
	//一条数据生成函数
	function createMusicItem(index,ele){
		var $item = $("<li class='musiclist'>"+
					"		<div class='checkbox'><i></i></div>"+
					"		<div class='list_number'>"+(index+1)+"</div>"+
					"		<div class='list_wave'></div>"+
					"		<div class='list_title'>"+ele.name+
					"			<div class='list_menu'>"+
					"				<a href='javascript:;' title='播放' class='list_play'></a>"+
					"				<a href='javascript:;' title='添加'></a>"+
					"				<a href='javascript:;' title='下载'></a>"+
					"				<a href='javascript:;' title='分享'></a>"+
					"			</div>"+
					"		</div>"+
					"		<div class='list_singer'>"+ele.singer+"</div>"+
					"		<div class='list_length'>"+
					"			<span>"+ele.time+"</span>"+
					"			<div class='list_del'>"+
					"				<a href='javascript:;' title='删除'></a>"+
					"			</div>"+
					"		</div>"+
					"	</li>");
		$item.get(0).index = index;
		$item.get(0).music = ele;
		return $item;
	}
	//初始化信息函数
	function initMusicInfo(data){
		//初始化右侧信息
		$('.singer_img img').attr('src',data.cover);
		$('.musicName a').text(data.name);
		$('.musicSinger a').text(data.singer);
		$('.musicAlbum a').text(data.album);
		//初始化播放栏信息
		$('.processName').text(data.name +'-'+ data.singer);
		$('.processTime span:nth-child(2)').text(' / '+data.time);
	}
	//初始化进度条函数
	function initProcess(){
		var $processBar = $('.process');
		var $processLine = $('.process_line');
		var $processDot = $('.process_dot');
		processBar = new Process($processBar,$processLine,$processDot);
		processBar.processClick(function(value) {
			player.musicSeekTo(value);
		});
		processBar.processMove(function(value) {
			player.musicSeekTo(value);
		});

		var $voiceBar = $('.volume_process');
		var $voiceLine = $('.volume_line');
		var $voicesDot = $('.volume_dot');
		voiceBar = new Process($voiceBar,$voiceLine,$voicesDot);
		voiceBar.processClick(function(value) {
			//console.log(value);
			player.musicVoiceSeekTo(value);
		});
		voiceBar.processMove(function(value) {
			player.musicVoiceSeekTo(value);
		});
	}
	//初始化歌词函数
	function initMusicLyric(data){
		lyric = new Lyric(data.link_lrc);
		var $lyricContainer = $('.singer_lyrics ul');
		$lyricContainer.html('');
		$lyricContainer.css('marginTop','0');
		lyric.loadLyric(function() {
			//创建歌词列表
			$.each(lyric.lyrics,function(index,ele) {
				var $item = $('<li>'+ele+'</li>');
				$lyricContainer.append($item);
			});		
		});
	}
});