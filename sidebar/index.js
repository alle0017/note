const saveToast = ()=>{
    const toast = document.createElement('div');

    toast.innerHTML = 'Saved!'
    toast.style.width = '200px';
    toast.style.height = '30px';
    toast.style.fontSize = '20px';
    toast.style.color = '#000';
    toast.style.paddingLeft = '15%';
    toast.style.borderRadius = '2px';
    toast.style.backgroundColor = '#8aff9add';
    toast.style.position = 'absolute';
    toast.style.top = '0';
    toast.style.left = '30%';

    document.body.appendChild(toast);

    setTimeout( ()=> toast.remove(), 3000 );
}
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

    if( !text || !title )
        return;

    await browser.storage.local.set({ [title]: text });
    saveToast();

    try{
        await browser.runtime.sendMessage({ title, text });
    }catch(e){
        console.error(e);
    }
});
document.getElementById('download').addEventListener( 'click', async ()=>{

    const text = document.getElementById('text').value;
    const blob = new Blob( [text], { type: 'text/plain' } );

    await browser.downloads.download({
        url: window.URL.createObjectURL( blob ),
        saveAs: true,
    });
});
