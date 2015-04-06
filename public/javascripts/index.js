function newLinksItem(item){
		return '<div class="item" tabindex="0">'+
					'<div class="title">'+
						'<a href="'+item.link+'">'+item.title+'</a>'+
					'</div>'+
					'<div class="url">'+item.link+'</div>'+
					'<div class="short-text">'+item.description+'</div>'+
					'<div class="actions">'+
						'<div class="btns remove-this-site">Remove</div>'+
						'<div class="btns follow-this-site">Follow this site?</div>'+
						'<div class="btns local-pagerank-up"></div>'+
						'<div class="btns local-pagerank-down"></div>'+
					'</div>'+
				'</div>';
}
function showNoReslutItem(){
	$('.rslist').html('<div class="no-reslut-item" tabindex="0">No entry found :(</div>');
}
function runSearch(){
	if( !$('.popup-panel').hasClass('.hidden') ){
		$('.popup-panel').hide();
	}
	var searchquery = $('.search-query');
	if(searchquery.val().length > 0){
		var ajaxObj = $.ajax({
			url: '/links',
			data: {
				q: String(searchquery.val())
			}, 
			statusCode: {
				200: function (links){
					if(links.length >0){
						$('.rslist').html('');
						for(var i=0; i<links.length; i++){
							if(links[i].link != null) $('.rslist').append( newLinksItem(links[i]) );
						}
					} else showNoReslutItem();
					//if(304 == ajaxObj.status) alert('304');
				}
			}
		});
		ajaxObj;
	} else {
		searchquery.addClass('error-input');
		setTimeout(function(){
			searchquery.removeClass('error-input');
			searchquery.select();
		}, 1000);
	}
}
$(document).ready(function(){
	$('.search-query').focus();
	$('select').select2();
	showNoReslutItem();//show this on init
	//fill common-languages from .json-file to select2
	$.ajax({
		url: '/common-languages/lg.json'
	}).done(function(lg){
		var builder='';
		for(var i=0; i<lg.length; i++) builder += '<option value="'+lg[i].code+'">'+lg[i].name+' (.'+lg[i].code.toLowerCase()+')</option>';
		$('.languages').html(builder);
		$('select').select2();
	});


	/** Handlers------------------------------------------------------ **/


	$('.logo').on('click', function(event){
		$('.popup-panel').toggle();
	});
	$('.search-query').on('keyup', function(event){
		var query = String($(event.currentTarget).val());
		if(query.length > 0){
			$.ajax({
				url: '/suggestion?q='+query
			}).done(function(suggestions){
				$('.search-query').autocomplete({
					source: suggestions
				});
			});
		}
	});
	//on search input enter call 'runSearch()'
	$('.search-query').keypress(function (event){
		if(event.which == 13) runSearch();
	});
	//on search input click call 'runSearch()'
	$('.run-search').on('click', runSearch);
});