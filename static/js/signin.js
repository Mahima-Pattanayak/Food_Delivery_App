
grecaptcha.ready(function() {
    grecaptcha.execute('6LeTZb0qAAAAAE2QmSzTeC_BP32B79dIJSAMvHIj', {action: 'signin'}).then(function(token) {
        document.getElementById('g-recaptcha-response').value = token;
    });
});
