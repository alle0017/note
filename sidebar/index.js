browser.runtime.onMessage.addListener(  ( request, sender, sendResponse )=>{
    if( !request || !('text' in request) || !('title' in request) )
        return;
    document.getElementById('text').value = request.text;
    document.getElementById('title').value = request.title;
    sendResponse({response: true});
})
document.getElementById('save').addEventListener( 'click', async ()=>{
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;

    console.log( title, text )
    await browser.storage.local.set({ [title]: text });
    try{
        await browser.runtime.sendMessage({ title, text });
    }catch(e){}
});