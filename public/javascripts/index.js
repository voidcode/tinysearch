function newLinksItem(item){
		return '<div class="item" tabindex="0" data-id="'+item.id+'">'+
					'<div class="title">'+item.title+'</div>'+
					'<div class="url">'+item.url+'</div>'+
					'<div class="short-text">'+item.shorttext+'</div>'+
				'</div>';
}
$(document).ready(function(){
	$('select').select2();
	$.ajax({
		url: '/common-languages/lg.json'
	}).done(function(lg){
		var builder='';
		for(var i=0; i<lg.length; i++) builder += '<option value="'+lg[i].code+'">'+lg[i].name+'</option>';
		$('.languages').html(builder);
		$('select').select2();
	});
});