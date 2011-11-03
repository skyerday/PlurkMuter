// ==UserScript==
// @name       Auto mute for Plurk
// @version    0.4
// @description  Auto mute Plurk by keyword.
// @include    http://www.plurk.com/*
// @copyright  2011+, Skyer
// @author     Skyer
// Reference : http://userscripts.org/scripts/review/112835
// ver 0.1 (2011/9/16)  * First version.
// ver 0.2 (2011/9/17)  * Add FireFox support.
// ver 0.3 (2011/9/20)  * Support account name for the keyword. Ex: http://www.plurk.com/off60, you can assign off60 for blockList item.
// ver 0.4 (2011/11/01) * Change to Safari extension format. Remove blockList. It will be added outside.
// ==/UserScript==

(function(){
var GM_JQ = document.createElement('script'); 
GM_JQ.type = 'text/javascript';
GM_JQ.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(GM_JQ); 
})();

var unsafeWindow = window;
var blockList = typeof outSideBlockList == 'undefined' ? undefined : outSideBlockList;

(function () { if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(arguments.callee,100); } else {

(function($){

    // No need to set blockList here. It will be set outside.
    //Add custom keywords and user id here!
    //在下面依照格式加入你想過濾的關鍵字或者帳號
    if (blockList == undefined) {
        blockList = [
            'TW_nextmedia', //蘋果日報
            'cwyuni',       //酪梨壽司
            'off60',        //四小折 
            'FuniPhone',    //Fun iPhone
            'wan_wan',      //彎彎~
            'alvin',        //alvin
            'Jojam',        //就醬
            'giddens',      //一直說不客氣不客氣的九把刀
            'jcms',         //吉米丘
        ];
    }

    function do_match(text) {
        for (k=0;k<=blockList.length;k++) {
            var keyword = blockList[ k ];
            var r = text && text.match( keyword ); // XXX: rule here.
            if( r && r[0].length > 0) {
                // console.debug( 'match:' , r);
                return 1;
            }
        }
        return 0;
    }
	
    function set_mute(pid,v) {
        $.ajax({
            type: "POST",
            url: "/TimeLine/setMutePlurk",
            data: "plurk_id=" + pid + "&value=" + v,
            success: function(msg){
                console.log( "muted: " + pid + ", " + msg  );
            }
        });
    }
	
//    console.log('Plurk cnt: ' + $('.plurk').length);
    if ($('.plurk')) {
    $('.plurk').each(function() {
        var me = $(this);
        var plurk = me.get(0).id.match( /p(\d+)/ );
        if (plurk) {
            var plurk_id = plurk[1];
            var nameObj = me.find('.name');
            var urlName = nameObj.attr('href');
            var textName = nameObj.html();
            var muted = me.get(0).className;
//            console.log('Text: ' + text + ", M: " + muted); 
            if ( (do_match( urlName ) || do_match( textName )) && !muted.match('muted')) {
                console.log('Mute ' + plurk_id + ', ' + textName + " (" + urlName + ")");
                set_mute( plurk_id , 2 );
                me.addClass('muted');
                unsafeWindow.PlurkMetaData.muted[plurk_id] = true;
                unsafeWindow.$plurks['p'+plurk_id].obj.is_unread = 2;
            }
        }
    });
    }
		
    window.setTimeout(arguments.callee, 2000, $);
})(unsafeWindow.jQuery.noConflict(true));

}})();