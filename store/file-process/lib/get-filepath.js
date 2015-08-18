function stripFileProtocol(url){
	if( url.indexOf('file:///') === 0 ){
		url = url.slice('file:///'.length);
	}
	return url;
}

function getFilepath(request){
	return stripFileProtocol(String(request.url));
}

export default getFilepath;