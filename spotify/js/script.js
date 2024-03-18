


console.log('let write javascript');
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
    
}

async function getsongs(){
    let a = await fetch("http://127.0.0.1:5501/spotify/music/");
    let response = await a.text();
    console.log(response)
    let div =document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs=[]

    for( let index = 0;index<as.length;index++){
        const element =as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/music/")[1])
        }
    }
    return songs

}

const playMusic = (track, pause=false)=>{
   
     currentSong.src = "music/" + track;
     if(!pause){
        currentSong.play()

     }
     
    //  play.src="img/pause.svg"
     document.querySelector(".songinfo").innerHTML = decodeURI(track)
     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){

    

    // get the list of all songs
    songs =  await getsongs()
    // console.log(songs)
    playMusic(songs[0],true)

// show all the song in library
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(const song of songs){
        songUL.innerHTML=songUL.innerHTML + `<li><img src="img/music.svg" alt="" class="invert">
                            <div class="info">
                                <div>${(song.replaceAll("%20"," "))}</div>
                                <div>unknown</div>
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>

             </li>`;
    }
    // attach an eventlistener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
         e.addEventListener("click",()=>  {
             console.log(e.querySelector(".info").firstElementChild.innerHTML);
             playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
         });
        

    }) 
        
//attach an event listener to play ,next and previous

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="img/play.svg"
        }
    })

    // listen for time update
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.
        currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.
        duration) * 100 + "%";
    })

    //add an eventlistener to seek bar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    //add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    //add an event listener for closebutton

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-130%"
    })

    //add an event listener to previous 

    previous.addEventListener("click",()=>{
        console.log("Previous clicked")
        console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        
        if((index-1) >= 0 ){
            playMusic(songs[index-1])

        }
        
    })
 //add an event listener next
    next.addEventListener("click",()=>{
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        
        if((index+1) < songs.length-1 ){
            playMusic(songs[index+1])

        }
        
    })

    //add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e=>{
        console.log(e,e.target,e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })


   
}

main()

