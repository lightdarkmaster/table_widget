//Subscribe to the EmbeddedApp onPageLoad event before initializing
ZOHO.embeddedApp.on("PageLoad", function(data){
	console.log(data);
})

ZOHO.embeddedApp.init();