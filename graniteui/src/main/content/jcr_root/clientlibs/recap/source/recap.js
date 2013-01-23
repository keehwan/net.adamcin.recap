/*
 *
 */
_g.recap = (function() {
    var recapPath = "/libs/recap/content/recap";
    var contextPath = "";
    if (typeof CQURLInfo != 'undefined') {
        contextPath = CQURLInfo.contextPath || contextPath;
    } else if (_g.HTTP) {
        contextPath = _g.HTTP.getContextPath() || contextPath;
    }

    var contextReq = _g.$.ajax({
        dataType: "json",
        url: contextPath + recapPath + ".context.json",
        async: false,
        data: {
            ":ck": (new Date().getTime())
        }
    });

    var recapContext = contextReq.status == 200 ? _g.$.parseJSON(contextReq.responseText) : {};

    var executeSyncToConsole = function(form) {
        //var data = _g.$(form).serialize();
        //var action = _g.$(form).action;
        //alert(data);

        _g.$(form).submit();

        _g.$.mobile.changePage(_g.$("#g-recap-console"));
        //_g.$.mobile.changePage(_g.$("#g-recap-console"), {transition: "pop", changeHash: false, pageContainer: _g.$("#g-recap-main")});
    };

    var reloadAddressBook = function() {
        var url = contextPath + _g.recap.context.addressBookPath + ".list.json";

        _g.$.getJSON(url, function(data) {
            var listEl = _g.$("#address-list");

            listEl.setTemplateElement("g-recap-address-book-tpl");
            listEl.processTemplate(data);
            _g.$(":jqmData(role='button')", listEl )
                .not( ".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')" )
                .buttonMarkup();
            listEl.listview("refresh");
            listEl.show();
        });
        /*
        _g.$.mobile.changePage(_g.recap.context.addressBookPath + ".html", {
            allowSamePageTransition: true,
            reloadPage: true,
            data: {":ck": (new Date()).getTime()},
            pageContainer: _g.$('div:jqmData(id="menu")'),
            reverse: true,
            transition: "none",
            changeHash: false,
            fromHashChange: true
        });
        */
        //_g.$('#g-recap-address-book').load(_g.recap.context.addressBookPath + ".html");
        //var page = _g.$('#g-recap-address-book').page("enhance");
        //page.enhance();
    };

    var deleteAddress = function(address) {
        var data = {":applyTo": address, ":operation": "delete"};
        _g.$.ajax({url: _g.recap.context.addressBookPath, data: data, type: "POST"}).done(function(respData, status, xhr){
            _g.$.mobile.changePage(_g.$('#g-recap-welcome'));
            _g.recap.reloadAddressBook();
        }).fail(function(resp){
                _g.$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"+ _g.$.mobile.pageLoadErrorMessage +"</h1></div>")
                    .css({ "display": "block", "opacity": 0.96, "top": _g.$(window).scrollTop() + 100 })
                    .appendTo( _g.$.mobile.pageContainer )
                    .delay( 1000 )
                    .fadeOut( 1500, function(){ _g.$(this).remove(); });
            });
    };

    return {
        path: recapPath,
        context: recapContext,
        executeSyncToConsole: executeSyncToConsole,
        reloadAddressBook: reloadAddressBook,
        deleteAddress: deleteAddress
    };
})();
