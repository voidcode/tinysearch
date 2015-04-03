$(function(){
	function newLinksItem(item){
		return '<div class="item" tabindex="0" data-id="'+item.id+'">
					<div class="title">'+item.title+'</div>
					<div class="url">'+item.url+'</div>
					<div class="short-text">'+item.shorttext+'</div>
				</div>';
	}
});