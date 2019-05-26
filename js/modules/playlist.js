import { songsList } from '../data/songs.js';
import PlayInfo from './play-info.js';
import TrackBar from './track-bar.js';


const Playlist = (_ => {
    //data or state
    let songs = songsList;
    let currentPlayingIndex = 11;
    let currentSong = new Audio(songs[currentPlayingIndex].url);

    currentSong.currentTime = 190;

    //caching the DOM
    const playlistEl = document.querySelector(".playlist");

    const init = _ =>{
        render();
        listeners();
        PlayInfo.setState({
            songsLength: songs.length,
            isPlaying: !currentSong.paused
        });
    }

    const flip = _ => {
        togglePlayPause();
        render();
    }

    const changeAudioSrc = _ => {
        currentSong.src = songs[currentPlayingIndex].url
    }

    const togglePlayPause = _ => {
        return currentSong.paused ? currentSong.play() :currentSong.pause();
    }

    const mainPlay = clickedIndex => {
        if (currentPlayingIndex === clickedIndex){
            //toggle play or pause
            togglePlayPause(); //toggle the functionality
        }
        else{
            currentPlayingIndex = clickedIndex;
            changeAudioSrc();
            togglePlayPause();
        }
        PlayInfo.setState({
            songsLength: songs.length,
            isPlaying: !currentSong.paused
        });
    }

    const playNext = _ => {
        if (songs[currentPlayingIndex+1]){
            currentPlayingIndex++ ;
            currentSong.src = songs[currentPlayingIndex].url;
            togglePlayPause();
            render();
        }
        else{
            currentPlayingIndex = 0;
            currentSong.src = songs[currentPlayingIndex].url;
            togglePlayPause();
            render();
        }
    }

    const listeners = _ =>{
        // 1. get the index of the li tag
        // 2. Change the currentPlayingIndex to index of li tag
        // 3. play or pause
        // 4.If its not the same song,then  change the src to that new song after
        // changing the currentPlayingIndex
        playlistEl.addEventListener('click', event => {
            if(event.target && event.target.matches(".fa")){
                const listElem = event.target.parentNode.parentNode;
                const listElemIndex = [...listElem.parentElement.children].indexOf(listElem);//convert htmlcollection to array
                mainPlay(listElemIndex);
                render();
            }
        })

        currentSong.addEventListener('timeupdate', _ =>{
            TrackBar.setState(currentSong);
        })

        currentSong.addEventListener('ended', _ =>{
            // playnext
            playNext();
        })
    }

    const render = _ => {
        let markup = '';
        const toggleIcon = itemIndex => {
            if(currentPlayingIndex === itemIndex){
                return currentSong.paused ? 'fa-play' : 'fa-pause';
            }
            else{
                return 'fa-play'; //default case
            }
        }
        songs.forEach((songObj,index) =>{
            markup += `
            <li class="playlist__song ${index === currentPlayingIndex ? 'playlist__song--active':''}">
                <div class="play-pause">
                    <i class="fa ${toggleIcon(index)} pp-icon"></i>
                </div>
                <div class="playlist__song-details">
                    <span class="playlist__song-name">${songObj.title}</span><br>
                    <span class="playlist__song-artist">${songObj.artist}</span><br>
                </div>
                <div class="playlist__song-duration">
                    ${songObj.time}
                </div>
            </li>
            `;
        });
        playlistEl.innerHTML = markup ;
    }

    return {
        init,
        flip
    }
})();

export default Playlist;