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


// window.addEventListener('offline', () =>{
//     console.log('offline')
//     let gotTopPick = localStorage.getItem('topPick')
//             gotTopPick = JSON.parse(gotTopPick);
//             const pickContain = document.getElementById('topPick');
//             document.getElementById('loader').style.display='none';
//             pickContain.innerHTML = ''
//             for(let key in gotTopPick){
//                 let heartColor = gotTopPick[key].status==='like' ? 'color:red' : 'color:black'
//                 let toClick = gotTopPick[key].status==='like' ? '' : `saveAds(this,"${gotTopPick[key].category}","${gotTopPick[key].randomKey}")`
//                 pickContain.innerHTML += `
//                 <div class="col-lg-3 col-md-6 imgMargin card1">
//                 <div class="team-item">
//                 <div class="team-img">
//                 <img src="${gotTopPick[key].imgUrl}" alt="img" style="width:100%;height:100%;">
//                 </div>
//                 <div class="team-body">
//                 <div class='heartContain'><i style='${heartColor}' onclick='${toClick}' class="fas fa-heart"></i></div>
//                 <div class="team-title">
//                 <a href="./pages/detail.html?category=${gotTopPick[key].category}&id=${gotTopPick[key].randomKey}">${gotTopPick[key].product}</a>
//                 </div>
//                 <div class="team-subtitle">Rs.${gotTopPick[key].price}</div>
//                 </div>
//                 </div>
//                 </div>
                
//                 `
//             }
// })


/* ======================== SEND-PUSH-NOTIFICATION-FUNCTION  STARTS ======================== */

// function sendNotification() {
// //     var uid = document.getElementById('uid');
// //     var msg = document.getElementById('msg');

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

/* ======================== SEND-PUSH-NOTIFICATION-FUNCTION  END ======================== */

let data = localStorage.getItem('UserAuth');
data = JSON.parse(data);
let userUid;
let profilepic;
let defaultImg = '../images/empty-avatar.png';
if(data!==null){
    userUid = data.uid;
    profilepic = data.photoURL;
}
if(profilepic===undefined || profilepic==='undefined' || profilepic===null)
profilepic=defaultImg;

//   Login Function

const login = async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if(email !== '' && password !== ''){
        await firebase.auth().signInWithEmailAndPassword(email,password)
        .then((result) => {
            swal({
                title: "SIGNIN SUCCESSFUL!",
                text: "You have successfully signed in!",
                icon: "success",
            })
            .then(() => {
                localStorage.setItem('UserAuth',JSON.stringify(result.user));     
                location='./index.html';
            })
        })
        .catch((error) => {
            swal({
                title: "Warning!",
                text: `${error.message}!`,
                icon: "warning",
            });
        })
    }
    else{
        swal({
            title: "Warning!",
            text: `Please Enter Email And Password!`,
            icon: "warning",
        });
    }
}

// Sign up Function

const signup = async () => {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const displayName = document.getElementById('username').value;
    
    if(displayName !== '' && email !== '' && password !== ''){
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async (result) => {
            const { uid } = result.user;
            let users = {
                uid,
                displayName,
                email,
                photoURL : 'undefined'
            }
            
            await firebase.database().ref('users').child(uid).child('data').set(users)
            .then((success) => {
                swal({
                    title: "SIGNUP SUCCESSFUL!",
                    text: "Please signin to continue!",
                    icon: "success",
                })
                .then(() => {
                    location='./index.html';
                })
                
            })
        })
        .catch((error) => {
            swal({
                title: "Warning!",
                text: `${error.message}!`,
                icon: "warning",
            });
        })
    }
    else{
        swal({
            title: "Warning!",
            text: `Please Enter Email And Password!`,
            icon: "warning",
        });
    }
}



//   Check Auth Function

const checkAuth = () => {
    const logout = document.getElementById('logout');
    const login = document.getElementById('login');
    if(data!==null && data.user !== 'null' ){
        logout.classList.remove('d-none')
        logout.classList.add('d-flex')
        login.classList.remove('d-flex');
        login.classList.add('d-none');
    }
    else{
        logout.classList.remove('d-flex')
        logout.classList.add('d-none')
        login.classList.remove('d-none');
        login.classList.add('d-flex');
    }
}


// Logout function

const logout = () => {
    firebase.auth().signOut()
    .then(()=>{
        localStorage.setItem('UserAuth',JSON.stringify({user:"null"}))
        location="./index.html";
    })
    .catch((error)=>{
        swal({
            icon: 'warning',
            text: `${error.message}`
        })
    })
}

// categories list show hide function

const showCategories = () => {
    let options = document.getElementById('cat_list');
    let check = options.classList.contains('d-none');
    check ? options.classList.remove('d-none') : options.classList.add('d-none')
}

// Post Ad Function

const postAd = async (btn) => {
    const category = document.getElementById('selectCategory').value;
    const product = document.getElementById('product').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const modal = document.getElementById('condition').value;
    const uploader = document.getElementById('uploader');
    const img = uploader.files[0];
    let imgUrl;
    // console.log(img)
    
    if(category!=='' && product!=='' && description!=='' && modal!=='' && img!=='' && price!==''){
        btn.innerHTML = 'Posting...'
        await firebase.storage().ref('products/' + img.name).put(img)
        .then(async (success)=>{
            await firebase.storage().ref('products/' + img.name).getDownloadURL()
            .then(async (url)=>{
                imgUrl = url;
                let userPost = {
                    category,
                    product,
                    price,
                    description,
                    condition:modal,
                    imgUrl,
                    userUid
                }
                await firebase.database().ref('Ads').child(category).push(userPost)
                .then( async (success) => {
                    await firebase.database().ref('Ads').child(category).child(success.key)
                    .once('value', item => {
                        let userdata = item.val();
                        userdata.randomKey = success.key;
                        let myAd = {
                            category,
                            key: success.key
                        }
                        firebase.database().ref('Ads').child(category).child(success.key).set(userdata)
                        firebase.database().ref('users').child(userUid).child('myAds').push(myAd)
                        
                    })
                    .then(()=>{
                        swal({
                            icon: 'success',
                            text: 'Ad Successfully Posted'
                        })
                        .then(()=>{
                            location='../pages/postad.html'
                        })
                    })
                })
                .catch((error) => {
                    swal({
                        icon: 'warning',
                        text: `${error.message}`
                    })
                    .then(()=>{
                        btn.innerHTML='Post'
                    })
                })
            })
            .catch((error) => {
                swal({
                    icon: 'warning',
                    text: `${error.message}`
                })
                .then(()=>{
                    btn.innerHTML='Post'
                })
            })
        })
        .catch((error) => {
            swal({
                icon: 'warning',
                text: `${error.message}`
            })
            .then(()=>{
                btn.innerHTML='Post'
            })
        })
    }
    else{
        swal({
            icon: 'warning',
            text: 'Please Fill all values'
        })
    }
    
}


const loadTopPick = async () => {
    let topPick = [];
    let userLiked = [];
    if(userUid!==undefined){   
        await firebase.database().ref('users').child(userUid).child('data')
        .once('value', data => {
            let userdata = data.val();
            let username = userdata.displayName;
            username = username.slice(0,username.indexOf(' '))
            document.getElementById('dropdownMenuLink').innerHTML = username;
            localStorage.setItem('username',JSON.stringify(username))
        })
    }
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", async function(snap) {
        if (snap.val() === true) {
            alert("connected");
            await firebase.database().ref('Ads').child('Properties').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            await firebase.database().ref('Ads').child('Cars').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            await firebase.database().ref('Ads').child('Furnitures').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            await firebase.database().ref('Ads').child('Jobs').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            await firebase.database().ref('Ads').child('Electronics').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            await firebase.database().ref('Ads').child('Mobiles').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            await firebase.database().ref('Ads').child('Bikes').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            await firebase.database().ref('Ads').child('Books').limitToLast(1)
            .once('value', item => {
                let userdata = item.val();
                for(let key in userdata){
                    topPick.push(userdata[key])
                }
            })
            if(userUid!==undefined){
                await firebase.database().ref('saveAds').child(userUid)
                .once('value', data => {
                    let userdata = data.val();
                    for(let key in userdata){
                        userLiked.push(userdata[key].id)
                    }
                })
                for(let key in userLiked){
                    updateLikeStatus(userLiked[key],topPick)
                }
            }
            localStorage.setItem('topPick',JSON.stringify(topPick))
            console.log(topPick)
            // console.log(gotTopPick)
            const pickContain = document.getElementById('topPick');
            document.getElementById('loader').style.display='none';
            pickContain.innerHTML = ''
            for(let key in topPick){
                let heartColor = topPick[key].status==='like' ? 'color:red' : 'color:black'
                let toClick = topPick[key].status==='like' ? '' : `saveAds(this,"${topPick[key].category}","${topPick[key].randomKey}")`
                pickContain.innerHTML += `
                <div class="col-lg-3 col-md-6 imgMargin card1">
                <div class="team-item">
                <div class="team-img">
                <img src="${topPick[key].imgUrl}" alt="img" style="width:100%;height:100%;">
                </div>
                <div class="team-body">
                <div class='heartContain'><i style='${heartColor}' onclick='${toClick}' class="fas fa-heart"></i></div>
                <div class="team-title">
                <a href="./pages/detail.html?category=${topPick[key].category}&id=${topPick[key].randomKey}">${topPick[key].product}</a>
                </div>
                <div class="team-subtitle">Rs.${topPick[key].price}</div>
                </div>
                </div>
                </div>
                
                `
            }
        } 
    });

    
    
}

const updateLikeStatus = (key,Arrays) => {
    // console.log(key,Arrays)
    for(let keys in Arrays){
        if(Arrays[keys].randomKey === key){
            Arrays[keys].status = 'like'
            break;
        }
    }
}


var toastHTML = '<span>Ad have been saved!</span><button class="btn-flat toast-action">Undo</button>';


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


const showDetails = async () => {
    let username = localStorage.getItem('username');
    username = JSON.parse(username);
    document.getElementById('ddl').innerHTML = username;
    const category = getParameterByName('category')
    const id = getParameterByName('id')
    // console.log(category,id)
    await firebase.database().ref('Ads').child(category).child(id)
    .once('value',async item => {
        let userdata = item.val();
        await firebase.database().ref('users').child(userdata.userUid).child('data')
        .once('value', data =>{
            let userInfo = data.val();
            document.getElementById('detailImg').setAttribute('src',userdata.imgUrl)
            document.getElementById('details').innerHTML = `
            <h6>Ad Posted By:</h6>
            <p>${userInfo.displayName}<p>
            <h6>Product Category:</h6>
            <p>${userdata.category}<p>
            <h6>Product Name:</h6>
            <p>${userdata.product}<p>
            <h6>Product Price:</h6>
            <p>Rs.${userdata.price}<p>
            <h6>Product Condition:</h6>
            <p>${userdata.condition} out of 10<p>
            <h6>Product Description:</h6>
            <p>${userdata.description}<p>
            <a onclick="chatRedirect('${userdata.userUid}')" href="JavaScript:void(0)" class="waves-effect waves-light btn btn-margin">Send Message</a>
            
            `
            
        })
    })
}

const chatRedirect = (id) => {
    if(data!==null && data.user!=='null'){
        
        if(userUid!==id){
            location=`./chat.html?id=${id}&from=detail`;
        }
        else{
            swal({
                icon: 'warning',
                text: `You can't message on your own Ad!`
            })
        }
    }
    else{
        swal({
            icon: 'warning',
            text: `Please Login to message!`
        })
    }
}

const searchFromIndex = () => {
    const searchValue = document.getElementById('indexSearch').value;
    const searchCategory = document.getElementById('ddl').innerHTML;
    
    if(searchValue!=='' && searchCategory!=='Select Categories'){
        location=`./pages/searchresult.html?category=${searchCategory}&value=${searchValue}`
    }
    else{
        swal({
            icon: 'warning',
            text: 'Please fill input and select catogrey'
        })
    }
}

const searchFromSearch = () => {
    const searchValue = document.getElementById('search').value;
    const searchCategory = document.getElementById('selectCategory').value;
    
    if(searchValue!=='' && searchCategory!=='Select Categories'){
        location=`./searchresult.html?category=${searchCategory}&value=${searchValue}`
    }
    else{
        swal({
            icon: 'warning',
            text: 'Please fill input and select catogrey'
        })
    }
}

const searchOnLoad = async () => {
    let dataToShow = [];
    let username = localStorage.getItem('username');
    username = JSON.parse(username);
    document.getElementById('ddl').innerHTML = username;
    const resultContain = document.getElementById('result');
    const category = getParameterByName('category')
    let value = getParameterByName('value')
    await firebase.database().ref('Ads').child(category)
    .once('value', item => {
        let userdata = item.val();
        for(let key in userdata){
            userdata[key].product = userdata[key].product.toLowerCase()
            dataToShow.push(userdata[key])
        }
    })
    if(value!==null){   
        let flag = true;
        value = value.toLowerCase();
        resultContain.innerHTML = ''
        for(let key in dataToShow){
            let myProduct = dataToShow[key].product;
            let checkIndex = myProduct.indexOf(value)
            if(checkIndex >-1){
                
                resultContain.innerHTML += `
                <div class="col l3 m6 imgMargin card1">
                <div class="team-item">
                <div class="team-img">
                <img src="${dataToShow[key].imgUrl}" alt="img" style="width:100%;height:100%;">
                </div>
                <div class="team-body">
                <div class='heartContain'><i onclick='saveAds(this,${dataToShow[key].category},${dataToShow[key].randomKey})' class="fas fa-heart"></i></div>
                <div class="team-title">
                <a href="./detail.html?category=${dataToShow[key].category}&id=${dataToShow[key].randomKey}">${dataToShow[key].product}</a>
                </div>
                <div class="team-subtitle">Rs.${dataToShow[key].price}</div>
                </div>
                </div>
                </div>
                `
                flag=false;
            }
            
        }
        if(flag){
            resultContain.innerHTML = `Cannot find ${value}.`
        }
    }
    else{
        resultContain.innerHTML = `<h5>${category}</h5>`
        for(let key in dataToShow){
            resultContain.innerHTML += `
            <div class="col l3 m6 imgMargin card1">
            <div class="team-item">
            <div class="team-img">
            <img src="${dataToShow[key].imgUrl}" alt="img" style="width:100%;height:100%;">
            </div>
            <div class="team-body">
            <div class='heartContain'><i onclick='saveAds(this,${dataToShow[key].category},${dataToShow[key].randomKey})' class="fas fa-heart"></i></div>
            <div class="team-title">
            <a href="./detail.html?category=${dataToShow[key].category}&id=${dataToShow[key].randomKey}">${dataToShow[key].product}</a>
            </div>
            <div class="team-subtitle">Rs.${dataToShow[key].price}</div>
            </div>
            </div>
            </div>
            `
        }
    }
}


const saveAds = async (icon,category,id) => {
    let saveAd = {
        category,
        id
    }
    if(userUid!==undefined){   
        await firebase.database().ref('saveAds').child(userUid).push(saveAd)
        .then(()=>{
            icon.style.color = 'red';
            icon.setAttribute('onclick','');
        })
        .catch((error)=>{
            swal({
                icon: 'warning',
                text: `${error.message}`
            })
        })
    }
    else{
        swal({
            icon: 'warning',
            text: 'Please Sign in to save Ads!'
        })
    }
}

const getProfileData = async () => {
    let username = localStorage.getItem('username');
    username = JSON.parse(username);
    document.getElementById('ddl').innerHTML = username;
    document.getElementById('userImg').src = profilepic;
    let infoContain = document.getElementById('profileInfo');
    
    await firebase.database().ref('users').child(userUid).child('data')
    .once('value',data => {
        let userdata = data.val();
        let userProfile = userdata.photoURL;
        if(userProfile===undefined || userProfile==='undefined' || userProfile===null)
        userProfile=defaultImg;
        document.getElementById('userImg').src = userProfile;
        infoContain.innerHTML = `
        <h6>Name:</h6>
        <p>${userdata.displayName}</p>
        <h6>Email:</h6>
        <p>${userdata.email}</p>
        `
    })
    let saveAds = [];
    let saveAdsData = [];
    let myAds = [];
    let myAdsData = [];
    await firebase.database().ref('users').child(userUid).child('myAds')
    .once('value',data => {
        let userdata = data.val();
        for(let key in userdata){
            myAds.push(userdata[key])
        }
    })
    .then(async ()=>{
        await firebase.database().ref('Ads')
        .once('value',data => {
            let userdata = data.val();
            for(let key in myAds){
                for(let key1 in userdata){
                    if(key1===myAds[key].category){
                        for(let key2 in userdata[key1]){
                            if(key2===myAds[key].key){
                                myAdsData.push(userdata[key1][key2])
                            }
                        }
                    }
                }
            }
        })
        .then(()=>{
            document.querySelector('.preloader-wrapper').style.display = 'none';
            let myAdsContain = document.getElementById('myAds');
            console.log(myAdsData.length)
            if(myAdsData.length>0){
                for(let key in myAdsData){
                    
                    myAdsContain.innerHTML += `
                    <div class="col m4 imgMargin card1">
                    <div class="team-item">
                    <div class="team-img">
                    <img src="${myAdsData[key].imgUrl}" alt="img" style="width:100%;height:100%;">
                    </div>
                    <div class="team-body">
                    <div class="team-title">
                    <a href="../pages/detail.html?category=${myAdsData[key].category}&id=${myAdsData[key].randomKey}">${myAdsData[key].product}</a>
                    </div>
                    <div class="team-subtitle">Rs.${myAdsData[key].price}</div>
                    </div>
                    </div>
                    </div>
                    
                    `   }
                }
                else{
                    myAdsContain.innerHTML = `<div class='center-align'>You have posted no ads yet.</div>`
                }
            })
        })
        await firebase.database().ref('saveAds').child(userUid)
        .once('value',data => {
            let userdata = data.val();
            for(let key in userdata){
                saveAds.push(userdata[key])
            }
        })
        .then(async ()=>{
            await firebase.database().ref('Ads')
            .once('value',data => {
                let userdata = data.val();
                for(let key in saveAds){
                    for(let key1 in userdata){
                        if(key1===saveAds[key].category){
                            for(let key2 in userdata[key1]){
                                if(key2===saveAds[key].id){
                                    saveAdsData.push(userdata[key1][key2])
                                }
                            }
                        }
                    }
                }
            })
            .then(()=>{
                document.querySelector('.preloader-wrapper').style.display = 'none';
                let saveAdsContain = document.getElementById('saveAds');
                console.log(saveAdsData.length)
                if(saveAdsData.length>0){
                    console.log(saveAdsData.length)
                    for(let key in saveAdsData){
                        saveAdsContain.innerHTML += `
                        <div class="col m4 imgMargin card1">
                        <div class="team-item">
                        <div class="team-img">
                        <img src="${saveAdsData[key].imgUrl}" alt="img" style="width:100%;height:100%;">
                        </div>
                        <div class="team-body">
                        <div class='heartContain'><i style='color:red' class="fas fa-heart"></i></div>
                        <div class="team-title">
                        <a href="../pages/detail.html?category=${saveAdsData[key].category}&id=${saveAdsData[key].randomKey}">${saveAdsData[key].product}</a>
                        </div>
                        <div class="team-subtitle">Rs.${saveAdsData[key].price}</div>
                        </div>
                        </div>
                        </div>
                        
                        `   
                    }
                }
                else{
                    saveAdsContain.innerHTML = `<div class='center-align'>You have saved no post yet.</div>`
                }
            })
        })
        
    }
    
    const changepic = (e) => {
        let selectedImage = e.files[0];
        document.querySelector('#profilepic').src=window.URL.createObjectURL(selectedImage);
    }
    
    const updateImg = async (btn) => {
        let uploader = document.getElementById('uploader');
        let img = uploader.files[0];
        let imgUrl = "";
        if(img!==undefined){
            btn.innerHTML = 'Uploading..'
            await firebase.storage().ref('profilePics/' + img.name).put(img)
            .then(async (success)=>{
                await firebase.storage().ref('profilePics/' + img.name).getDownloadURL()
                .then(async (url)=>{
                    imgUrl = url;
                    await firebase.database().ref('users').child(userUid).child('data')
                    .once('value',async (datas)=>{
                        let userData = datas.val();
                        userData.photoURL = imgUrl;
                        await firebase.database().ref('users').child(userUid).child('data').set(userData)
                    })
                    .then(()=>{
                        swal({
                            title: "Success!",
                            text: `Image Successfully uploaded!`,
                            icon: "success",
                        })
                        .then(()=>{
                            location='../pages/profile.html';
                        })
                    })
                    .catch((error) => {
                        swal({
                            title: "Warning!",
                            text: `${error.message}!`,
                            icon: "warning",
                        });        
                    })
                })
            })
            .catch((error)=>{
                swal({
                    title: "Warning!",
                    text: `${error.message}!`,
                    icon: "warning",
                });
            })
        }
        else{
            swal({
                title: "Warning!",
                text: `Please Choose an image!`,
                icon: "warning",
            });
        }
    }
    
    const openModalPic = () => {
        let imgSrc = document.querySelector('#userImg').getAttribute('src');
        document.querySelector('#profilepic').src = imgSrc;
    }
    
    const showSaved = () => {
        document.getElementById('myAds').style.display = 'none';
        document.getElementById('myAdsBtn').style.display = 'block';
        document.getElementById('saveAdsBtn').style.display = 'none';
        document.getElementById('saveAds').style.display = 'block';
        document.getElementById('showAdsHeading').innerHTML = 'Saved Ads'
    }
    
    const showMyAds = () => {
        document.getElementById('saveAds').style.display = 'none';
        document.getElementById('saveAdsBtn').style.display = 'block';
        document.getElementById('myAdsBtn').style.display = 'none';
        document.getElementById('myAds').style.display = 'block';
        document.getElementById('showAdsHeading').innerHTML = 'My Ads'
    }
    
    const postRedirect = () => {
        if(userUid!==undefined){
            location='../pages/postad.html'
        }
        else{
            swal({
                icon: 'warning',
                text: 'Please Login to post ad!'
            })
        }
    }
    
    const showName = () => {
        let username = localStorage.getItem('username');
        username = JSON.parse(username);
        document.getElementById('ddl').innerHTML = username;
    }