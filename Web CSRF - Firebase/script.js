

// // Đăng ký người dùng mới
// function register() {
//     const username = document.getElementById('register-username').value;
//     const password = document.getElementById('register-password').value;

//     // Kiểm tra xem username đã tồn tại chưa
//     db.collection('users').where('username', '==', username).get()
//         .then(snapshot => {
//             if (!snapshot.empty) {
//                 alert("Username already exists. Please choose another one.");
//             } else {
//                 // Lưu username và password vào Firestore
//                 db.collection('users').add({
//                     username: username,
//                     password: password
//                 }).then(() => {
//                     alert("Registration successful. You can now log in.");
//                     window.location.href = '/';
//                 });
//             }
//         })
//         .catch((error) => alert("Registration error: " + error.message));
// }

// // Đăng nhập người dùng
// function login() {
//     const username = document.getElementById('login-username').value;
//     const password = document.getElementById('login-password').value;

//     // Kiểm tra username và password từ Firestore
//     db.collection('users').where('username', '==', username).where('password', '==', password).get()
//         .then(snapshot => {
//             if (!snapshot.empty) {
//                 window.location.href = '/status.html'; // Chuyển đến giao diện đăng status
//             } else {
//                 alert("Invalid username or password.");
//             }
//         })
//         .catch((error) => alert("Login error: " + error.message));
// }

// // Đăng status
// function postStatus() {
//     const statusText = document.getElementById('status-text').value;
//     const statusImage = document.getElementById('status-image').files[0];
//     const username = document.getElementById('login-username').value; // Lấy username từ đăng nhập

//     if (statusImage) {
//         const storageRef = firebase.storage().ref(`images/${statusImage.name}`);
//         storageRef.put(statusImage).then(() => {
//             storageRef.getDownloadURL().then((url) => {
//                 saveStatusToDB(username, statusText, url);
//             });
//         });
//     } else {
//         saveStatusToDB(username, statusText, null);
//     }
// }

// function saveStatusToDB(username, text, imageUrl) {
//     db.collection('statuses').add({
//         username: username,
//         text: text,
//         imageUrl: imageUrl,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp()
//     }).then(() => {
//         document.getElementById('status-text').value = "";
//         document.getElementById('status-image').value = "";
//     });
// }

// // Đổi mật khẩu
// function changePassword() {
//     const username = document.getElementById('login-username').value; // Lấy username từ đăng nhập
//     const newPassword = document.getElementById('new-password').value;

//     db.collection('users').where('username', '==', username).get()
//         .then(snapshot => {
//             if (!snapshot.empty) {
//                 const userDoc = snapshot.docs[0];
//                 db.collection('users').doc(userDoc.id).update({
//                     password: newPassword
//                 }).then(() => alert("Password changed successfully"))
//                   .catch(error => alert("Error updating password: " + error.message));
//             } else {
//                 alert("User not found.");
//             }
//         })
//         .catch(error => alert("Password change error: " + error.message));
// }

// // Hiển thị status
// function loadStatuses() {
//     db.collection('statuses').orderBy('timestamp', 'desc')
//         .onSnapshot((snapshot) => {
//             const statusesContainer = document.getElementById('statuses');
//             statusesContainer.innerHTML = '';
//             snapshot.forEach((doc) => {
//                 const status = doc.data();
//                 const statusElement = document.createElement('div');
//                 statusElement.innerHTML = `
//                     <p><strong>${status.username}</strong>: ${status.text}</p>
//                     ${status.imageUrl ? `<img src="${status.imageUrl}" width="100">` : ''}
//                 `;
//                 statusesContainer.appendChild(statusElement);
//             });
//         });
// }

// if (document.getElementById('statuses')) loadStatuses();
