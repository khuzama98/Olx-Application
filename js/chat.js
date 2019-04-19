
"use strict";
// Initialize Firebase
let config = {
    apiKey: "AIzaSyD2Qle9cZfrbwVK8Uu_w_YJX5eJa2dgXwI",
    authDomain: "myolxproject98.firebaseapp.com",
    databaseURL: "https://myolxproject98.firebaseio.com",
    projectId: "myolxproject98",
    storageBucket: "myolxproject98.appspot.com",
    messagingSenderId: "301194228853"
};
firebase.initializeApp(config);

let defaultImg = '../images/empty-avatar.png';
let data = localStorage.getItem('UserAuth');
data = JSON.parse(data);
let userUid;
if(data!==null){
    userUid = data.uid;
}
let profilepic = data.photoURL;
if(profilepic===undefined || profilepic==='undefined' || profilepic===null)
profilepic=defaultImg;


window.addEventListener('load', () => {
    setTimeout( () =>{
        const ul = document.getElementById('ulFriend');
        let checkLength = ul.getElementsByTagName('li');
        if(checkLength.length===0){
            document.querySelector('.preloader-wrapper').style.display = 'none';
            ul.innerHTML = `<div class='contact'>
            <div class='wrap'>
            <p>You have no conversations yet.</p>
            </div>
            </div>`;
        }
    },4000);
    
})


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

firebase.database().ref('chats').child(userUid)
.on('child_added', item => {
    show(item.key);
})

const chatOnLoad = async () => {
    let username = localStorage.getItem('username');
    username = JSON.parse(username);
    document.getElementById('ddl').innerHTML = username;
    const id = getParameterByName('id');
    const from = getParameterByName('from');
    console.log(id,from)
    if(from==='detail'){
        document.querySelector('.contentOverlay').style.display = 'none';
        document.querySelector('.contentToShow').style.display = 'block';
        await firebase.database().ref('users').child(id).child('data')
        .once('value', data =>{
            let userdata = data.val();
            showMessages(id,userdata.displayName,userdata.photourl)
        })
    }

}

const createMessage = async (id) => {

    const message = document.querySelector('.message-input input').value;
    if(message !== ''){
        let time = firebase.database.ServerValue.TIMESTAMP
        const messageObj = {
            sender: userUid,
            reciever: id,
            message,
            time
        }
        await firebase.database().ref('chats').child(userUid).child(id).push(messageObj)
        .then(()=>{})
        .catch((error)=>{
            swal({
                title: "Warning!",
                text: `${error.message}!`,
                icon: "warning",
            });
        })
        await firebase.database().ref('chats').child(id).child(userUid).push(messageObj)
        .then(() => {
            document.querySelector('.message-input input').value = '';
        })
        .catch((error)=>{
            swal({
                title: "Warning!",
                text: `${error.message}!`,
                icon: "warning",
            });
        })
        
    }
}

document.querySelector('.submit').addEventListener('click', () => {
    const id = getParameterByName('id');
    let keyToSend= id!==null ? id : keyForMessage
    createMessage(keyToSend);
})

let keyForMessage;
const showMessages = async (key,name,photourl) => {
    keyForMessage = key;
    if(photourl==='undefined' || photourl===undefined)
    photourl=defaultImg;
    document.querySelector('.contentOverlay').style.display = 'none';
    // document.querySelector('.changeProfilePanel').style.display = 'none';
    document.querySelector('.contentToShow').style.display = 'block';
    document.querySelector('#friendImg').src = photourl ;
    const sidepanel = document.querySelector('#sidepanel');
    const content = document.querySelector('.content');
    if(window.innerWidth<735){
        sidepanel.style.width= '0px';
        sidepanel.style.minWidth= '0px';
        content.style.transition = "width 0.3s";
        content.style.width = '100%';
    }
    const toChatWith = document.getElementById('toChatWith');
    const msgList = document.getElementById('msgList');
    toChatWith.innerHTML = name;
    msgList.innerHTML = '';
    const myKey = data.uid;
    let myPhoto = profilepic;
    if(myPhoto===undefined || myPhoto==='undefined' || myPhoto===null){
        myPhoto = defaultImg;
    }
    await firebase.database().ref('chats').child(userUid).child(keyForMessage)
    .on('child_added', data => {
        let userdata = data.val();
        let current = new Date();
        let sdate=new Date(userdata.time);
        let Year=sdate.getFullYear().toString();
        let currentYear=current.getFullYear().toString();
        let month=(sdate.getMonth()+1).toString();
        let currentMonth=(current.getMonth()+1).toString();
        let day=sdate.getDate().toString();
        let currentDay=current.getDate().toString();
        let toShowDate;
        let toShowTime;
        Year===currentYear && month===currentMonth && day===currentDay ? (toShowDate=`display:none`,toShowTime='display:inline-block') : (toShowDate=`display:inline-block`,toShowTime='display:none');
        let hh=Number(sdate.getHours());
        let unit = hh>11 ? 'PM' : 'AM'
        let mm=sdate.getMinutes().toString();
        hh =  hh===24 ?  hh+1 : hh
        hh = hh>12 ? (hh - 12).toString() : hh.toString();
        month.length===1 ? month=`0${month}` : month;
        day.length===1 ? day=`0${day}` : day;
        hh.length===1 ? hh=`0${hh}` : hh;
        mm.length===1 ? mm=`0${mm}` : mm;
        Year = Year.slice(2)
        let liType;
        let divType;
        let picToDisplay;
        if(userdata.sender!==myKey){
            liType = 'sent';
            divType = 'sentDiv';
            picToDisplay = photourl;
        }
        else{
            liType = 'replies';
            divType = 'repliesDiv';
            picToDisplay = myPhoto;
        }
        msgList.innerHTML += `<li class="${liType}">
        <div class="${divType}">
        <img src="${picToDisplay}">
        <p>${userdata.message}</p>
        <div>
        <span style='${toShowDate};padding:5px'>${day}/${month}/${Year}</span>
        <span style='${toShowTime};padding:5px'>${hh}:${mm} ${unit}</span>
        </div>
        </div>
        </li>`
    })
}

const show =async (key) => {
    const ul = document.getElementById('ulFriend');
    checkForLi();
    await firebase.database().ref('users').child(key).child('data')
    .once('value', item => {
        let userData = item.val();
        if(userData.photoURL===undefined || userData.photoURL==='undefined'){
            userData.photoURL=defaultImg;
        }
        ul.innerHTML += `
        <li id='${key}' onclick='showMessages("${key}","${userData.displayName}","${userData.photoURL}")' class="contact friendContact">
        <div class="wrap">
        <img src="${userData.photoURL}" alt="" />
        <div class="pendingMeta friendMeta">
        <p class="name">${userData.displayName}</p>
        <p class='msg'> Say Hello To ${userData.displayName}.</p>
        </div>
        </div>
        </li>
        ` 
    })
    .then(() => {
        const loader = document.querySelector('.preloader-wrapper');
        if(loader!==null){
            loader.style.display = 'none';
        }
        if(ul.classList.contains('center-align')){
            ul.classList.remove('center-align')
        }
    })
}


const checkForLi = () => {
    const ul = document.getElementById('ulFriend');
    const li = ul.getElementsByTagName('li');
    if(li.length===0){
        ul.innerHTML = '';
    }
}

const goBack = () => {
    const sidepanel = document.querySelector('#sidepanel');
    const content = document.querySelector('.content');
    if(window.innerWidth<735){
        sidepanel.style.transition = "width 0.3s";
        sidepanel.style.width = '100%';
        content.style.width= '0px';
        content.style.minWidth= '0px';
    }
}

const logout = () => {
    firebase.auth().signOut()
    .then(()=>{
        localStorage.setItem('UserAuth',JSON.stringify({user:"null"}))
        location="../index.html";
    })
    .catch((error)=>{
        swal({
            icon: 'warning',
            text: `${error.message}`
        })
    })
}

/* ======================== SEND-PUSH-NOTIFICATION-FUNCTION  STARTS ======================== */

// function sendNotification() {
//     var uid = document.getElementById('uid');
//     var msg = document.getElementById('msg');

//     firebase.database().ref("/fcmTokens").once("value", function(snapshot) {
//         snapshot.forEach(function(token) {
//             if (token.val() == uid.value) { //Getting the token of the reciever using  if condition..!   
//                 // console.log(token.key)   
//                 $.ajax({
//                     type: 'POST',
//                     url: "https://fcm.googleapis.com/fcm/send",
//                     headers: { Authorization: 'key=' + 'AIzaSyAcbFnQrAUXbJGmW8X1rk2rhMhI0LgT1jc' },
//                     contentType: 'application/json',
//                     dataType: 'json',
//                     data: JSON.stringify({
//                         "to": token.key,
//                         "notification": {
//                             "title": `New Notification Recieved`,
//                             "body": msg.value,
//                             "icon": `https://freeiconshop.com/wp-content/uploads/edd/notification-flat.png`, //Photo of sender
//                             "click_action": `https://www.google.com` //Notification Click url notification par click honay k bad iss url par redirect hoga
//                         }
//                     }),
//                     success: function(response) {
//                         console.log(response);
//                         //Functions to run when notification is succesfully sent to reciever
//                     },
//                     error: function(xhr, status, error) {
//                         //Functions To Run When There was an error While Sending Notification
//                         console.log(xhr.error);
//                     }
//                 });
//             }
//         });
//     });

// }

// /* ======================== SEND-PUSH-NOTIFICATION-FUNCTION  END ======================== */
