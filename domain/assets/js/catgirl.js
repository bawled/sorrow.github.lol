API_URL = 'https://api.lanyard.rest/v1';
USERID = '995065647463673909';
async function fetchResponse(userId) {
    try {
        const url = await fetch(`${API_URL}/users/${userId}`);
        const response = await url.json();
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function setAvatar() {
    const response = await fetchResponse(USERID);
    var avatarId = response.data.discord_user.avatar;
    var fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatarId}`;
    document.getElementById('pfp').src = fullUrl;
}

async function setAvatarFrame() {
    const response = await fetchResponse(USERID);
    const activity2 = document.getElementById('status2');
    switch (response.data.discord_status) {
        case 'online':
            document.getElementById('activity-dot').style.background = '#3ba45d';
            document.getElementById('activity-dot').title = 'Online';
            activity2.innerHTML = 'Online';
            activity2.style.cssText = 'color: #3ba45d; opacity: 0.5;';
            break;
        case 'dnd':
            document.getElementById('activity-dot').style.background = '#ed4245';
            document.getElementById('activity-dot').title = 'Do not disturb';
            activity2.innerHTML = 'Do not disturb';
            activity2.style.cssText = 'color: #ed4245; opacity: 0.5;';
            break;
        case 'idle':
            document.getElementById('activity-dot').style.background = '#faa81a';
            document.getElementById('activity-dot').title = 'Idle';
            activity2.innerHTML = 'Idle';
            activity2.style.cssText = 'color: #faa81a; opacity: 0.5;';
            break;
        case 'offline':
            document.getElementById('activity-dot').style.background = '#747e8c';
            document.getElementById('activity-dot').title = 'Offline';
            activity2.innerHTML = 'Offline';
            activity2.style.cssText = 'color: #747e8c; opacity: 0.5;';
            break;
    }
    let presence = response.data.activities.find(r => r.type === 1)
    if (presence) {
        if (presence.url.includes("twitch.tv")) {
            document.getElementById('activity-dot').style.background = '#301934';
            document.getElementById('activity-dot').title = 'Streaming';
            activity2.innerHTML = 'Streaming';
            activity2.style.cssText = 'color: #301934; opacity: 0.5;';
        }
    }

}
async function setUsername() {
    const response = await fetchResponse(USERID);
    var user = response.data.discord_user.username;
    var discriminator = response.data.discord_user.discriminator;
    var fullName = `${user}#${discriminator}`;
    document.getElementById('username').innerHTML = fullName;
    document.getElementById('title-name').innerHTML = fullName;
    document.getElementById('meta-name').content = fullName;
    document.getElementById('connection-username').title = fullName;
}
async function setStatus() {
    const response = await fetchResponse(USERID);
    let status = response.data.activities[0].name;
    if (response.data.discord_status == 'offline') {
        return;
    }
    if (response.data.listening_to_spotify === true) {
        return document.getElementById('status').innerHTML = "Listening to Spotify"
    }
    let rpc1 = response.data.activities.find(r => r.type === 3)
    if (rpc1) return document.getElementById('status').innerHTML = `Watching ${rpc1.name}`
    let rpc2 = response.data.activities.find(r => r.type === 1)
    if (rpc2) return document.getElementById('status').innerHTML = `Streaming ${rpc2.name}`
    let rpc3 = response.data.activities.find(r => r.type === 5)
    if (rpc3) return document.getElementById('status').innerHTML = `Competing ${rpc3.name}`
    if (status === undefined) return document.getElementById('status').innerHTML = `Status unavailable.`;
    document.getElementById('status').innerHTML = `Status unavailable.`;
}
async function setSpotifyBar() {
    const response = await fetchResponse(USERID);
    var bar = document.getElementById('spotify-innerbar');
    var bar2 = document.getElementById('spotify-time-end');
    var bar3 = document.getElementById('spotify-time-start');
    if (response.data.listening_to_spotify == false) {
        bar.style.display = 'none';
        bar2.innerHTML = '00:00';
        bar3.innerHTML = '00:00';
        return;
    }
    const date = new Date().getTime();
    const v1 = response.data.spotify.timestamps.end -
        response.data.spotify.timestamps.start;
    const v2 = date - response.data.spotify.timestamps.start;

    function spotifyTimeSet(date, element) {
        const x = document.getElementById(element);
        const y = new Date(date);
        const minutes = y.getMinutes();
        const seconds = y.getSeconds();
        const formmatedseconds = seconds < 10 ? `0${seconds}` : seconds;
        x.innerHTML = `${minutes}:${formmatedseconds}`;
    }
    spotifyTimeSet(v1, 'spotify-time-end');
    spotifyTimeSet(v2, 'spotify-time-start');
    prcnt = (v2 / v1) * 100;
    precentage = Math.trunc(prcnt);
    prccc = Math.round((prcnt + Number.EPSILON) * 100) / 100;
    i = 1;
    bar.style.display = 'block';
    bar.style.width = prccc + '%';
}
async function setSpotifySongName() {
    const response = await fetchResponse(USERID);
    var par = document.getElementById('spotify-song');
    if (response.data.listening_to_spotify == false) {
        par.innerHTML = 'no spotify playing';
        return;
    }
    var songName = response.data.spotify.song;
    var fullName = songName;
    par.style.display = 'block';
    par.innerHTML = fullName;
}
async function setSpotifyAlbumCover() {
    const response = await fetchResponse(USERID);
    var par = document.getElementById('album-cover');
    if (response.data.listening_to_spotify == false) {
        par.style.display = 'none';
        return;
    }
    var albumcover = response.data.spotify.album_art_url;
    par.style.display = 'block';
    par.src = albumcover;
}
async function setSpotifyArtist() {
    const response = await fetchResponse(USERID);
    var par = document.getElementById('spotify-artist');
    if (response.data.listening_to_spotify == false) {
        par.innerHTML = 'im either offline or bored';
        return;
    }
    var artistName = response.data.spotify.artist;
    par.style.display = 'block';
    par.innerHTML = `by: ${artistName}`;
}

async function setRichPresenceName() {
    const response = await fetchResponse(USERID);
    var par = document.getElementById('richpresence-song');
    let rpc = response.data.activities.find(r => r.type === 0)
    if (!rpc) {
        let rpc1 = response.data.activities.find(r => r.type === 3)
        if (rpc1) return par.innerHTML = `Watching ${rpc1.name}`
        let rpc2 = response.data.activities.find(r => r.type === 1)
        if (rpc2) return par.innerHTML = `Streaming ${rpc2.name}`
        let rpc3 = response.data.activities.find(r => r.type === 5)
        if (rpc3) return par.innerHTML = `Competing ${rpc3.name}`
        par.innerHTML = "There are no games being played.";
        return;
    }
    par.style.display = 'block';
    par.innerHTML = rpc.name;
}
async function setRichPresenceCover() {
    const response = await fetchResponse(USERID);
    var par = document.getElementById('rpc-cover');
    let rpc = response.data.activities.find(r => r.type === 0)
    if (!rpc) {
        par.style.display = 'none';
        return;
    }
    let cover = `https://cdn.discordapp.com/app-assets/` + rpc.application_id + `/` + rpc.assets.large_image + `.png`
    par.style.display = 'block';
    par.src = cover;
}
async function setRichPresenceArtist() {
    const response = await fetchResponse(USERID);
    var par = document.getElementById('richpresence-artist');
    let rpc = response.data.activities.find(r => r.type === 0)
    if (!rpc) {
        par.style.display = 'none';
        return;
    }
    par.style.display = 'block';
    par.innerHTML = rpc.details;
}

async function setRichPresenceAlbum() {
    const response = await fetchResponse(USERID);
    var par = document.getElementById('richpresence-album');
    let rpc = response.data.activities.find(r => r.type === 0)
    if (!rpc) {
        par.style.display = 'none';
        return;
    }
    par.style.display = 'block';
    // par.innerHTML = rpc.details;
}


async function presenceInvoke() {
    setSpotifyAlbumCover();
    setSpotifyArtist();
    setSpotifySongName();
    setSpotifyBar();
}

async function richpresenceInvoke() {
    setRichPresenceCover();
    setRichPresenceArtist();
    setRichPresenceName();
    setRichPresenceAlbum();
}

async function statusInvoke() {
    setStatus();
    setAvatarFrame();
}
async function invoke() {
    setInterval(presenceInvoke, 1000);
    setAvatar();
    setUsername();
    setInterval(statusInvoke, 1000);
    setInterval(richpresenceInvoke, 1000);
}
invoke();