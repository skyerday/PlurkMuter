// ==UserScript==
// @name       Auto mute for Plurk
// @version    0.6
// @description  Auto mute Plurk by keyword.
// @include    http://www.plurk.com/*
// @copyright  2011+, Skyer
// @author     Skyer
// Reference : http://userscripts.org/scripts/review/112835
// ver 0.1 (2011/9/16)  * First version.
// ver 0.2 (2011/9/17)  * Add FireFox support.
// ver 0.3 (2011/9/20)  * Support account name for the keyword. Ex: http://www.plurk.com/off60, you can assign off60 for blockList item.
// ver 0.4 (2011/11/01) * Change to Safari extension format. Remove blockList. It will be added outside.
// ver 0.5 (2011/11/04) * Fix error in FF && Chrome
// ver 0.6 (2011/11/xx) * Fix error in Safari
// ==/UserScript==

(function(){
var jq = document.createElement('script');
jq.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'; //https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(jq);
})();

var myWindow = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow;

function waitJQ() {
    if(typeof myWindow.jQuery == 'undefined') {
        window.setTimeout(waitJQ,100);
    } else {
        doRTE(myWindow.jQuery.noConflict(true));
    }
}

waitJQ();

function doRTE($) {
    var blockList = typeof outSideBlockList == 'undefined' ? undefined : outSideBlockList;

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
                    myWindow.PlurkMetaData.muted[plurk_id] = true;
                    myWindow.$plurks['p'+plurk_id].obj.is_unread = 2;
                }
            }
        });
        }
            
        window.setTimeout(doRTE, 2000, $);
}